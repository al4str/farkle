export type InteractionsActionId = string;

export type InteractionsSourceId = string;

export type InteractionsDevice = "keyboardMouse" | "gamepad";

export interface InteractionsModifierSpec {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export interface InteractionsKeyBinding {
  kind: "key";
  code: string;
  modifiers?: InteractionsModifierSpec;
}

export interface InteractionsPointerBinding {
  kind: "pointer";
  button?: number;
}

export type InteractionsBinding = InteractionsKeyBinding | InteractionsPointerBinding;

export interface InteractionsActionDefinition {
  id: InteractionsActionId;
  bindings: readonly InteractionsBinding[];
  holdThreshold?: number;
  clickWindow?: number;
  doubleClickWindow?: number;
}

export interface InteractionsResolvedDefinition {
  id: InteractionsActionId;
  bindings: readonly InteractionsBinding[];
  holdThreshold: number;
  clickWindow: number;
  doubleClickWindow: number;
}

interface InteractionEventBase {
  actionId: InteractionsActionId;
  elapsed: number;
}

interface InteractionEventPress extends InteractionEventBase {
  type: "press";
  source: InteractionsSourceId;
  device: InteractionsDevice;
}

interface InteractionEventRelease extends InteractionEventBase {
  type: "release";
  source: InteractionsSourceId;
  device: InteractionsDevice;
}

interface InteractionEventClick extends InteractionEventBase {
  type: "click";
}

interface InteractionEventDoubleClick extends InteractionEventBase {
  type: "doubleclick";
}

interface InteractionEventHoldStart extends InteractionEventBase {
  type: "holdstart";
}

interface InteractionEventHoldProgress extends InteractionEventBase {
  type: "holdprogress";
  progress: number;
}

interface InteractionEventHold extends InteractionEventBase {
  type: "hold";
}

export type InteractionEvent =
  | InteractionEventPress
  | InteractionEventRelease
  | InteractionEventClick
  | InteractionEventDoubleClick
  | InteractionEventHoldStart
  | InteractionEventHoldProgress
  | InteractionEventHold;

export type InteractionHandler = (event: InteractionEvent) => void;

export interface InteractionsActionView {
  pressed: boolean;
  holding: boolean;
  holdProgress: number;
}

export interface InteractionsState {
  actions: Record<InteractionsActionId, InteractionsActionView>;
  lastDevice: InteractionsDevice;
}

export interface InteractionsPointerHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
}
