export type InteractionsActionId = string;

export type InteractionsDevice = "keyboardMouse" | "gamepad";

export interface InteractionsState {
  pressed: boolean;
  holding: boolean;
  holdingProgress: number;
}

export interface InteractionsDefinition {
  actionId: InteractionsActionId;
  bindings: readonly InteractionsBinding[];
  holdTime?: undefined | number;
  clickWindow?: undefined | number;
}

export type InteractionsDefinitionResolved = {
  [Key in keyof InteractionsDefinition]-?: Exclude<InteractionsDefinition[Key], undefined>;
};

export interface InteractionsKeyModifiers {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export type InteractionsKeyModifiersState = Required<InteractionsKeyModifiers>;

export interface InteractionsKeyBinding {
  kind: "key";
  code: string;
  modifiers?: InteractionsKeyModifiers;
}

export interface InteractionsPointerBinding {
  kind: "pointer";
  button?: number;
}

export type InteractionsBinding = InteractionsKeyBinding | InteractionsPointerBinding;

interface InteractionEventBase {
  actionId: InteractionsActionId;
  elapsed: number;
}

interface InteractionEventPress extends InteractionEventBase {
  type: "press";
  device: InteractionsDevice;
}

interface InteractionEventRelease extends InteractionEventBase {
  type: "release";
  device: InteractionsDevice;
}

interface InteractionEventClick extends InteractionEventBase {
  type: "click";
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
  | InteractionEventHoldStart
  | InteractionEventHoldProgress
  | InteractionEventHold;

export type InteractionEventHandler = (event: InteractionEvent) => void;

export interface InteractionsPointerHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
}

export interface InteractionsDispatch {
  now: () => number;
  pressKey: (code: string, modifiers: InteractionsKeyModifiersState, now: number) => void;
  releaseKey: (code: string, now: number) => void;
  releaseAllKeys: (now: number) => void;
  pressPointer: (actionId: InteractionsActionId, button: number, now: number) => void;
  releasePointer: (actionId: InteractionsActionId, button: number, now: number) => void;
  releaseAllPointers: (actionId: InteractionsActionId, now: number) => void;
}
