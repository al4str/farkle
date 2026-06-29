import type { InteractionEvent, InteractionsActionDefinition, InteractionsActionId, InteractionsActionView, InteractionsDevice, InteractionsKeyBinding, InteractionsModifierSpec, InteractionsPointerBinding, InteractionsResolvedDefinition, InteractionsSourceId } from "src/interactions/types";
import { clamp } from "src/utils/clamp";

export interface InteractionsRecognizerDefaults {
  holdThreshold: number;
  clickWindow: number;
  doubleClickWindow: number;
}

export interface InteractionsRecognizerActionRuntime {
  def: InteractionsResolvedDefinition;
  activeSources: Set<InteractionsSourceId>;
  pressed: boolean;
  pressElapsed: number;
  holdStarted: boolean;
  holdFired: boolean;
  lastHoldProgress: number;
  lastClickElapsed: number;
}

export type InteractionsRecognizerEmit = (event: InteractionEvent) => void;

export function interactionsRecognizerModifierMask(spec: undefined | InteractionsModifierSpec): string {
  if (!spec) {
    return "";
  }
  return (spec.shift === true ? "s" : "")
    + (spec.ctrl === true ? "c" : "")
    + (spec.alt === true ? "a" : "")
    + (spec.meta === true ? "m" : "");
}

export function interactionsRecognizerKeySourceId(binding: InteractionsKeyBinding): InteractionsSourceId {
  return `key:${binding.code}:${interactionsRecognizerModifierMask(binding.modifiers)}`;
}

export function interactionsRecognizerPointerSourceId(actionId: InteractionsActionId, binding: InteractionsPointerBinding): InteractionsSourceId {
  return `ptr:${actionId}:${binding.button === undefined ? "any" : String(binding.button)}`;
}

export function interactionsRecognizerResolveDefinition(def: InteractionsActionDefinition, defaults: InteractionsRecognizerDefaults): InteractionsResolvedDefinition {
  const holdThreshold = def.holdThreshold ?? defaults.holdThreshold;
  return {
    id: def.id,
    bindings: def.bindings,
    holdThreshold,
    clickWindow: def.clickWindow ?? defaults.clickWindow,
    doubleClickWindow: def.doubleClickWindow ?? defaults.doubleClickWindow,
  };
}

export function interactionsRecognizerCreateRuntime(def: InteractionsResolvedDefinition): InteractionsRecognizerActionRuntime {
  return {
    def,
    activeSources: new Set<InteractionsSourceId>(),
    pressed: false,
    pressElapsed: 0,
    holdStarted: false,
    holdFired: false,
    lastHoldProgress: 0,
    lastClickElapsed: Number.NEGATIVE_INFINITY,
  };
}

export function interactionsRecognizerViewOf(runtime: InteractionsRecognizerActionRuntime): InteractionsActionView {
  return {
    pressed: runtime.pressed,
    holding: runtime.holdFired,
    holdProgress: runtime.lastHoldProgress,
  };
}

export function interactionsRecognizerActivate(runtime: InteractionsRecognizerActionRuntime, source: InteractionsSourceId, device: InteractionsDevice, now: number, emit: InteractionsRecognizerEmit): void {
  if (runtime.activeSources.has(source)) {
    return;
  }
  const wasIdle = runtime.activeSources.size === 0;
  runtime.activeSources.add(source);
  if (!wasIdle) {
    return;
  }
  runtime.pressed = true;
  runtime.pressElapsed = now;
  runtime.holdStarted = false;
  runtime.holdFired = false;
  runtime.lastHoldProgress = 0;
  emit({
    type: "press",
    actionId: runtime.def.id,
    elapsed: now,
    source,
    device,
  });
}

export function interactionsRecognizerDeactivate(runtime: InteractionsRecognizerActionRuntime, source: InteractionsSourceId, device: InteractionsDevice, now: number, emit: InteractionsRecognizerEmit, synthetic: boolean): void {
  if (!runtime.activeSources.has(source)) {
    return;
  }
  runtime.activeSources.delete(source);
  emit({
    type: "release",
    actionId: runtime.def.id,
    elapsed: now,
    source,
    device,
  });
  if (runtime.activeSources.size > 0) {
    return;
  }

  const heldFor = Math.max(0, now - runtime.pressElapsed);
  if (!synthetic && !runtime.holdFired && heldFor <= runtime.def.clickWindow) {
    const sinceLastClick = now - runtime.lastClickElapsed;
    if (sinceLastClick <= runtime.def.doubleClickWindow) {
      emit({
        type: "doubleclick",
        actionId: runtime.def.id,
        elapsed: now,
      });
      runtime.lastClickElapsed = Number.NEGATIVE_INFINITY;
    }
    else {
      emit({
        type: "click",
        actionId: runtime.def.id,
        elapsed: now,
      });
      runtime.lastClickElapsed = now;
    }
  }
  else {
    runtime.lastClickElapsed = Number.NEGATIVE_INFINITY;
  }

  runtime.pressed = false;
  runtime.holdStarted = false;
  runtime.holdFired = false;
  runtime.lastHoldProgress = 0;
}

export function interactionsRecognizerStep(runtime: InteractionsRecognizerActionRuntime, elapsed: number, emit: InteractionsRecognizerEmit): void {
  if (!runtime.pressed) {
    return;
  }
  const heldFor = Math.max(0, elapsed - runtime.pressElapsed);
  if (!runtime.holdStarted) {
    runtime.holdStarted = true;
    emit({
      type: "holdstart",
      actionId: runtime.def.id,
      elapsed,
    });
  }
  const progress = runtime.def.holdThreshold > 0
    ? clamp(heldFor / runtime.def.holdThreshold, 0, 1)
    : 1;
  if (progress !== runtime.lastHoldProgress) {
    runtime.lastHoldProgress = progress;
    emit({
      type: "holdprogress",
      actionId: runtime.def.id,
      elapsed,
      progress,
    });
  }
  if (!runtime.holdFired && heldFor >= runtime.def.holdThreshold) {
    runtime.holdFired = true;
    emit({
      type: "hold",
      actionId: runtime.def.id,
      elapsed,
    });
  }
}

