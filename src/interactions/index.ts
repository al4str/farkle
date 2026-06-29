import { batch } from "solid-js";
import { produce } from "solid-js/store";

import type { InteractionEvent, InteractionHandler, InteractionsActionDefinition, InteractionsActionId, InteractionsActionView, InteractionsDevice, InteractionsPointerHandlers, InteractionsSourceId } from "src/interactions/types";
import type { InteractionsRecognizerActionRuntime, InteractionsRecognizerDefaults } from "src/interactions/recognizer";
import type { InteractionsPointerCandidate } from "src/interactions/sources/pointer";
import type { InteractionsKeyboardCandidate, InteractionsKeyboardListeners } from "src/interactions/sources/keyboard";
import { loopAddUpdate, loopRemoveUpdate } from "src/loop";
import { interactionsRecognizerActivate, interactionsRecognizerCreateRuntime, interactionsRecognizerDeactivate, interactionsRecognizerKeySourceId, interactionsRecognizerPointerSourceId, interactionsRecognizerResolveDefinition, interactionsRecognizerStep, interactionsRecognizerViewOf } from "src/interactions/recognizer";
import { interactionsKeyboardCreate } from "src/interactions/sources/keyboard";
import { interactionsPointerCreate } from "src/interactions/sources/pointer";
import { interactionsGamepadPoll } from "src/interactions/sources/gamepad";
import { interactionsState, interactionsStateSet } from "src/interactions/state";

export const INTERACTIONS_DEFAULTS: InteractionsRecognizerDefaults = {
  holdThreshold: 0.5,
  clickWindow: 0.2,
  doubleClickWindow: 0.3,
};

const DEFAULT_VIEW: InteractionsActionView = Object.freeze({
  pressed: false,
  holding: false,
  holdProgress: 0,
});

interface InteractionsSubscription {
  actionId: null | InteractionsActionId;
  fn: InteractionHandler;
}

interface State {
  initialized: boolean;
  lastElapsed: number;
  lastDevice: InteractionsDevice;
  deviceDirty: boolean;
  actions: Map<InteractionsActionId, InteractionsRecognizerActionRuntime>;
  sourceOwners: Map<InteractionsSourceId, Set<InteractionsActionId>>;
  keyIndex: Map<string, InteractionsKeyboardCandidate[]>;
  pointerIndex: Map<InteractionsActionId, InteractionsPointerCandidate[]>;
  subscriptions: Set<InteractionsSubscription>;
  dirty: Map<InteractionsActionId, InteractionsActionView>;
  keyboard: null | InteractionsKeyboardListeners;
}

const STATE: State = {
  initialized: false,
  lastElapsed: 0,
  lastDevice: "keyboardMouse",
  deviceDirty: false,
  actions: new Map(),
  sourceOwners: new Map(),
  keyIndex: new Map(),
  pointerIndex: new Map(),
  subscriptions: new Set(),
  dirty: new Map(),
  keyboard: null,
};

const POINTER = interactionsPointerCreate({
  now: interactionsNow,
  pointerBindings: (actionId) => STATE.pointerIndex.get(actionId) ?? [],
  activate: dispatchActivate,
  deactivate: dispatchDeactivate,
});

export function interactionsInitialize(): void {
  if (STATE.initialized) {
    return;
  }
  STATE.initialized = true;
  STATE.keyboard = interactionsKeyboardCreate({
    lookupCode: (code) => STATE.keyIndex.get(code) ?? [],
    allKeySources: () => [...STATE.sourceOwners.keys()].filter((source) => source.startsWith("key:")),
    now: interactionsNow,
    activate: dispatchActivate,
    deactivate: dispatchDeactivate,
  });
  STATE.keyboard.attach();
  loopAddUpdate(interactionsUpdate);
}

export function interactionsDispose(): void {
  if (STATE.keyboard) {
    STATE.keyboard.detach();
    STATE.keyboard = null;
  }
  loopRemoveUpdate(interactionsUpdate);
  STATE.initialized = false;
}

export function interactionsUpdate(_: number, elapsed: number) {
  STATE.lastElapsed = elapsed;
  interactionsGamepadPoll(elapsed, {
    activate: dispatchActivate,
    deactivate: dispatchDeactivate,
  });
  for (const [actionId, runtime] of STATE.actions) {
    if (runtime.pressed) {
      interactionsRecognizerStep(runtime, elapsed, emit);
      markDirty(actionId, runtime);
    }
  }
  if (STATE.dirty.size === 0 && !STATE.deviceDirty) {
    return;
  }
  batch(() => {
    for (const [actionId, view] of STATE.dirty) {
      interactionsStateSet("actions", actionId, view);
    }
    STATE.dirty.clear();
    if (STATE.deviceDirty) {
      interactionsStateSet("lastDevice", STATE.lastDevice);
      STATE.deviceDirty = false;
    }
  });
}

export function interactionsDefineAction(def: InteractionsActionDefinition): void {
  const previous = STATE.actions.get(def.id);
  if (previous) {
    releaseAllSources(previous);
    unindexAction(previous);
  }
  const resolved = interactionsRecognizerResolveDefinition(def, INTERACTIONS_DEFAULTS);
  const runtime = interactionsRecognizerCreateRuntime(resolved);
  STATE.actions.set(def.id, runtime);
  indexAction(runtime);
  STATE.dirty.delete(def.id);
  interactionsStateSet("actions", def.id, interactionsRecognizerViewOf(runtime));
}

export function interactionsRemoveAction(id: InteractionsActionId): void {
  const runtime = STATE.actions.get(id);
  if (!runtime) {
    return;
  }
  releaseAllSources(runtime);
  unindexAction(runtime);
  STATE.actions.delete(id);
  STATE.dirty.delete(id);
  interactionsStateSet("actions", produce((actions) => { delete actions[id]; }));
}

export function interactionsOn(actionIdOrHandler: InteractionsActionId | InteractionHandler, maybeHandler?: InteractionHandler): () => void {
  const subscription: InteractionsSubscription = typeof actionIdOrHandler === "function"
    ? { actionId: null, fn: actionIdOrHandler }
    : { actionId: actionIdOrHandler, fn: maybeHandler ?? (() => {}) };
  STATE.subscriptions.add(subscription);

  return (): void => {
    STATE.subscriptions.delete(subscription);
  };
}

export function interactionsActionHandlers(id: InteractionsActionId): InteractionsPointerHandlers {
  return POINTER.handlersFor(id);
}

export function interactionsView(id: InteractionsActionId): InteractionsActionView {
  return interactionsState.actions[id] ?? DEFAULT_VIEW;
}

function interactionsNow(): number {
  return STATE.lastElapsed;
}

function emit(event: InteractionEvent): void {
  for (const sub of STATE.subscriptions) {
    if (sub.actionId === null || sub.actionId === event.actionId) {
      sub.fn(event);
    }
  }
}

function markDirty(actionId: InteractionsActionId, runtime: InteractionsRecognizerActionRuntime): void {
  STATE.dirty.set(actionId, interactionsRecognizerViewOf(runtime));
}

function noteDevice(device: InteractionsDevice): void {
  if (STATE.lastDevice !== device) {
    STATE.lastDevice = device;
    STATE.deviceDirty = true;
  }
}

function dispatchActivate(source: InteractionsSourceId, device: InteractionsDevice, now: number): void {
  const owners = STATE.sourceOwners.get(source);
  if (!owners) {
    return;
  }
  noteDevice(device);
  for (const actionId of owners) {
    const runtime = STATE.actions.get(actionId);
    if (runtime) {
      interactionsRecognizerActivate(runtime, source, device, now, emit);
      markDirty(actionId, runtime);
    }
  }
}

function dispatchDeactivate(source: InteractionsSourceId, device: InteractionsDevice, now: number, synthetic: boolean): void {
  const owners = STATE.sourceOwners.get(source);
  if (!owners) {
    return;
  }
  for (const actionId of owners) {
    const runtime = STATE.actions.get(actionId);
    if (runtime) {
      interactionsRecognizerDeactivate(runtime, source, device, now, emit, synthetic);
      markDirty(actionId, runtime);
    }
  }
}

function addOwner(source: InteractionsSourceId, actionId: InteractionsActionId): void {
  const existing = STATE.sourceOwners.get(source);
  if (existing) {
    existing.add(actionId);
  }
  else {
    STATE.sourceOwners.set(source, new Set([actionId]));
  }
}

function removeOwner(source: InteractionsSourceId, actionId: InteractionsActionId): void {
  const existing = STATE.sourceOwners.get(source);
  if (!existing) {
    return;
  }
  existing.delete(actionId);
  if (existing.size === 0) {
    STATE.sourceOwners.delete(source);
  }
}

function indexAction(runtime: InteractionsRecognizerActionRuntime): void {
  const actionId = runtime.def.id;
  const pointerCandidates: InteractionsPointerCandidate[] = [];
  for (const binding of runtime.def.bindings) {
    if (binding.kind === "key") {
      const sourceId = interactionsRecognizerKeySourceId(binding);
      addOwner(sourceId, actionId);
      const candidate: InteractionsKeyboardCandidate = binding.modifiers === undefined
        ? { sourceId }
        : { sourceId, modifiers: binding.modifiers };
      const list = STATE.keyIndex.get(binding.code);
      if (list) {
        list.push(candidate);
      }
      else {
        STATE.keyIndex.set(binding.code, [candidate]);
      }
    }
    else {
      const sourceId = interactionsRecognizerPointerSourceId(actionId, binding);
      addOwner(sourceId, actionId);
      if (binding.button === undefined) {
        pointerCandidates.push({ sourceId });
      }
      else {
        pointerCandidates.push({ sourceId, button: binding.button });
      }
    }
  }
  if (pointerCandidates.length > 0) {
    STATE.pointerIndex.set(actionId, pointerCandidates);
  }
}

function unindexAction(runtime: InteractionsRecognizerActionRuntime): void {
  const actionId = runtime.def.id;
  for (const binding of runtime.def.bindings) {
    if (binding.kind === "key") {
      const sourceId = interactionsRecognizerKeySourceId(binding);
      removeOwner(sourceId, actionId);
      const list = STATE.keyIndex.get(binding.code);
      if (list) {
        const filtered = list.filter((candidate) => candidate.sourceId !== sourceId);
        if (filtered.length > 0) {
          STATE.keyIndex.set(binding.code, filtered);
        }
        else {
          STATE.keyIndex.delete(binding.code);
        }
      }
    }
    else {
      removeOwner(interactionsRecognizerPointerSourceId(actionId, binding), actionId);
    }
  }
  STATE.pointerIndex.delete(actionId);
}

function releaseAllSources(runtime: InteractionsRecognizerActionRuntime): void {
  const now = interactionsNow();
  for (const source of Array.from(runtime.activeSources)) {
    interactionsRecognizerDeactivate(runtime, source, STATE.lastDevice, now, emit, true);
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    interactionsDispose();
  });
}
