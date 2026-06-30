import { batch } from "solid-js";
import { produce } from "solid-js/store";

import type { InteractionEvent, InteractionEventHandler, InteractionsDefinition, InteractionsActionId, InteractionsState, InteractionsBinding, InteractionsDevice, InteractionsDispatch, InteractionsKeyModifiersState, InteractionsPointerHandlers } from "src/interactions/types";
import type { InteractionsRecognizerActionRuntime, InteractionsRecognizerDefaults } from "src/interactions/recognizer";
import type { InteractionsKeyboardListeners } from "src/interactions/sources/keyboard";
import { loopAddUpdate, loopRemoveUpdate } from "src/loop";
import { interactionsRecognizerActivate, interactionsRecognizerCreateRuntime, interactionsRecognizerDeactivate, interactionsRecognizerResolveDefinition, interactionsRecognizerStep, interactionsRecognizerViewOf } from "src/interactions/recognizer";
import { interactionsKeyboardListen, interactionsKeyboardModifiersMatch } from "src/interactions/sources/keyboard";
import { interactionsPointerHandlers } from "src/interactions/sources/pointer";
import { interactionsGamepadPoll } from "src/interactions/sources/gamepad";
import { interactionsState, interactionsStateSet } from "src/interactions/state";
import { noop } from "src/utils/noop";

const RECOGNIZERS_DEFAULTS: InteractionsRecognizerDefaults = {
  holdTime: 0.5,
  clickWindow: 0.2,
};

const STATE_DEFAULTS: InteractionsState = Object.freeze({
  pressed: false,
  holding: false,
  holdingProgress: 0,
});

const DEVICE: InteractionsDevice = "keyboardMouse";

interface Subscription {
  actionId: null | InteractionsActionId;
  fn: InteractionEventHandler;
}

interface State {
  initialized: boolean;
  elapsed: number;
  lastDevice: InteractionsDevice;
  actions: Map<InteractionsActionId, InteractionsRecognizerActionRuntime>;
  subscriptions: Set<Subscription>;
  keyboard: null | InteractionsKeyboardListeners;
}

const STATE: State = {
  initialized: false,
  elapsed: 0,
  lastDevice: DEVICE,
  actions: new Map(),
  subscriptions: new Set(),
  keyboard: null,
};

const DISPATCH: InteractionsDispatch = {
  now: () => STATE.elapsed,
  pressKey,
  releaseKey,
  releaseAllKeys,
  pressPointer,
  releasePointer,
  releaseAllPointers,
};

export function interactionsInitialize(): void {
  if (STATE.initialized) {
    return;
  }
  STATE.initialized = true;
  STATE.keyboard = interactionsKeyboardListen(DISPATCH);
  STATE.keyboard.attach();
  loopAddUpdate(update);
}

export function interactionsDispose(): void {
  if (STATE.keyboard) {
    STATE.keyboard.detach();
    STATE.keyboard = null;
  }
  loopRemoveUpdate(update);
  STATE.initialized = false;
}

export function interactionsDefine(definition: InteractionsDefinition): void {
  const previous = STATE.actions.get(definition.actionId);
  if (previous) {
    deactivateMatching(previous, STATE.elapsed, true, () => true);
  }
  const resolved = interactionsRecognizerResolveDefinition(definition, RECOGNIZERS_DEFAULTS);
  const runtime = interactionsRecognizerCreateRuntime(resolved);
  STATE.actions.set(definition.actionId, runtime);
  interactionsStateSet("actions", definition.actionId, interactionsRecognizerViewOf(runtime));
}

export function interactionsRemove(actionId: InteractionsActionId): void {
  const runtime = STATE.actions.get(actionId);
  if (!runtime) {
    return;
  }
  deactivateMatching(runtime, STATE.elapsed, true, () => true);
  STATE.actions.delete(actionId);
  interactionsStateSet("actions", produce((actions) => {
    delete actions[actionId];
  }));
}

export function interactionsOn(actionId: InteractionsActionId, handler: undefined | null | InteractionEventHandler): () => void {
  const subscription: Subscription = {
    actionId: actionId,
    fn: typeof handler === "function" ? handler : noop,
  };
  STATE.subscriptions.add(subscription);

  return (): void => {
    STATE.subscriptions.delete(subscription);
  };
}

export function interactionsOnAny(handler: InteractionEventHandler): () => void {
  const subscription: Subscription = {
    actionId: null,
    fn: handler,
  };
  STATE.subscriptions.add(subscription);

  return (): void => {
    STATE.subscriptions.delete(subscription);
  };
}

export function interactionsGetState(actionId: InteractionsActionId): InteractionsState {
  return interactionsState.actions[actionId] ?? STATE_DEFAULTS;
}

export function interactionsGetHandlers(actionId: InteractionsActionId): InteractionsPointerHandlers {
  return interactionsPointerHandlers(DISPATCH, actionId);
}

function update(_delta: number, elapsed: number): void {
  STATE.elapsed = elapsed;
  interactionsGamepadPoll(elapsed, DISPATCH);
  batch(() => {
    for (const [actionId, runtime] of STATE.actions) {
      interactionsRecognizerStep(runtime, elapsed, emit);
      interactionsStateSet("actions", actionId, interactionsRecognizerViewOf(runtime));
    }
    interactionsStateSet("lastDevice", STATE.lastDevice);
  });
}

function emit(event: InteractionEvent): void {
  if (event.type === "press") {
    STATE.lastDevice = event.device;
  }
  for (const subscription of STATE.subscriptions) {
    if (subscription.actionId === null || subscription.actionId === event.actionId) {
      subscription.fn(event);
    }
  }
}

function pressKey(code: string, modifiers: InteractionsKeyModifiersState, now: number): void {
  for (const runtime of STATE.actions.values()) {
    activateMatching(
      runtime,
      now,
      (binding) => {
        return binding.kind === "key"
          && binding.code === code
          && interactionsKeyboardModifiersMatch(binding.modifiers, modifiers);
      },
    );
  }
}

function releaseKey(code: string, now: number): void {
  for (const runtime of STATE.actions.values()) {
    deactivateMatching(
      runtime,
      now,
      false,
      (binding) => {
        return binding.kind === "key" && binding.code === code;
      },
    );
  }
}

function releaseAllKeys(now: number): void {
  for (const runtime of STATE.actions.values()) {
    deactivateMatching(
      runtime,
      now,
      true,
      (binding) => {
        return binding.kind === "key";
      },
    );
  }
}

function pressPointer(actionId: InteractionsActionId, button: number, now: number): void {
  const runtime = STATE.actions.get(actionId);
  if (runtime) {
    activateMatching(
      runtime,
      now,
      (binding) => {
        return binding.kind === "pointer"
          && (binding.button === undefined || binding.button === button);
      },
    );
  }
}

function releasePointer(actionId: InteractionsActionId, button: number, now: number): void {
  const runtime = STATE.actions.get(actionId);
  if (runtime) {
    deactivateMatching(
      runtime,
      now,
      false,
      (binding) => {
        return binding.kind === "pointer"
          && (binding.button === undefined || binding.button === button);
      },
    );
  }
}

function releaseAllPointers(actionId: InteractionsActionId, now: number): void {
  const runtime = STATE.actions.get(actionId);
  if (runtime) {
    deactivateMatching(
      runtime,
      now,
      true,
      (binding) => {
        return binding.kind === "pointer";
      },
    );
  }
}

function activateMatching(runtime: InteractionsRecognizerActionRuntime, now: number, match: (binding: InteractionsBinding) => boolean): void {
  for (const binding of runtime.definition.bindings) {
    if (match(binding)) {
      interactionsRecognizerActivate(
        runtime,
        binding,
        DEVICE,
        now,
        emit,
      );
    }
  }
}

function deactivateMatching(runtime: InteractionsRecognizerActionRuntime, now: number, synthetic: boolean, match: (binding: InteractionsBinding) => boolean): void {
  for (const binding of runtime.definition.bindings) {
    if (match(binding)) {
      interactionsRecognizerDeactivate(
        runtime,
        binding,
        DEVICE,
        now,
        emit,
        synthetic,
      );
    }
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    interactionsDispose();
  });
}
