import type { InteractionEvent, InteractionsDefinition, InteractionsState, InteractionsBinding, InteractionsDevice, InteractionsDefinitionResolved, InteractionsSource } from "src/interactions/types";
import { clamp } from "src/utils/clamp";

export interface InteractionsRecognizerDefaults {
  holdTime: number;
  clickWindow: number;
}

export interface InteractionsRecognizerActionRuntime {
  definition: InteractionsDefinitionResolved;
  active: Map<InteractionsBinding, InteractionsSource>;
  trigger: null | InteractionsSource;
  pressed: boolean;
  pressElapsed: number;
  holdStarted: boolean;
  holdFired: boolean;
  lastHoldProgress: number;
}

export type InteractionsRecognizerEmit = (event: InteractionEvent) => void;

export function interactionsRecognizerResolveDefinition(definition: InteractionsDefinition, defaults: InteractionsRecognizerDefaults): InteractionsDefinitionResolved {
  return {
    actionId: definition.actionId,
    bindings: definition.bindings,
    holdTime: definition.holdTime ?? defaults.holdTime,
    clickWindow: definition.clickWindow ?? defaults.clickWindow,
  };
}

export function interactionsRecognizerCreateRuntime(definitionResolved: InteractionsDefinitionResolved): InteractionsRecognizerActionRuntime {
  return {
    definition: definitionResolved,
    active: new Map<InteractionsBinding, InteractionsSource>(),
    trigger: null,
    pressed: false,
    pressElapsed: 0,
    holdStarted: false,
    holdFired: false,
    lastHoldProgress: 0,
  };
}

export function interactionsRecognizerViewOf(runtime: InteractionsRecognizerActionRuntime): InteractionsState {
  return {
    pressed: runtime.pressed,
    holding: runtime.holdFired,
    holdingProgress: runtime.lastHoldProgress,
  };
}

export function interactionsRecognizerActivate(runtime: InteractionsRecognizerActionRuntime, binding: InteractionsBinding, source: InteractionsSource, device: InteractionsDevice, now: number, emit: InteractionsRecognizerEmit): void {
  if (runtime.active.has(binding)) {
    return;
  }
  const wasIdle = runtime.active.size === 0;
  runtime.active.set(binding, source);
  if (!wasIdle) {
    return;
  }
  runtime.trigger = source;
  runtime.pressed = true;
  runtime.pressElapsed = now;
  runtime.holdStarted = false;
  runtime.holdFired = false;
  runtime.lastHoldProgress = 0;
  emit({
    type: "press",
    actionId: runtime.definition.actionId,
    elapsed: now,
    source,
    device,
  });
}

export function interactionsRecognizerDeactivate(runtime: InteractionsRecognizerActionRuntime, binding: InteractionsBinding, releaseSource: null | InteractionsSource, device: InteractionsDevice, now: number, emit: InteractionsRecognizerEmit, synthetic: boolean): void {
  const stored = runtime.active.get(binding);
  if (!stored) {
    return;
  }
  runtime.active.delete(binding);
  const source = releaseSource ?? stored;
  emit({
    type: "release",
    actionId: runtime.definition.actionId,
    elapsed: now,
    source,
    device,
  });
  if (runtime.active.size > 0) {
    return;
  }

  const heldFor = Math.max(0, now - runtime.pressElapsed);
  if (!synthetic && !runtime.holdFired && heldFor <= runtime.definition.clickWindow) {
    emit({
      type: "click",
      actionId: runtime.definition.actionId,
      elapsed: now,
      source,
    });
  }

  runtime.pressed = false;
  runtime.trigger = null;
  runtime.holdStarted = false;
  runtime.holdFired = false;
  runtime.lastHoldProgress = 0;
}

export function interactionsRecognizerStep(runtime: InteractionsRecognizerActionRuntime, elapsed: number, emit: InteractionsRecognizerEmit): void {
  if (!runtime.pressed) {
    return;
  }
  const source = runtime.trigger;
  if (!source) {
    return;
  }
  const heldFor = Math.max(0, elapsed - runtime.pressElapsed);
  if (!runtime.holdStarted) {
    runtime.holdStarted = true;
    emit({
      type: "holdstart",
      actionId: runtime.definition.actionId,
      elapsed,
      source,
    });
  }
  const progress = runtime.definition.holdTime > 0
    ? clamp(heldFor / runtime.definition.holdTime, 0, 1)
    : 1;
  if (progress !== runtime.lastHoldProgress) {
    runtime.lastHoldProgress = progress;
    emit({
      type: "holdprogress",
      actionId: runtime.definition.actionId,
      elapsed,
      source,
      progress,
    });
  }
  if (!runtime.holdFired && heldFor >= runtime.definition.holdTime) {
    runtime.holdFired = true;
    emit({
      type: "hold",
      actionId: runtime.definition.actionId,
      elapsed,
      source,
    });
  }
}
