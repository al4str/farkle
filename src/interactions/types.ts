import type { InteractionsKeyCode } from "src/interactions/keys";

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
  code: InteractionsKeyCode;
  modifiers?: InteractionsKeyModifiers;
}

export interface InteractionsPointerBinding {
  kind: "pointer";
  button?: number;
}

export type InteractionsBinding = InteractionsKeyBinding | InteractionsPointerBinding;

export interface InteractionsKeySource {
  kind: "key";
  code: InteractionsKeyCode;
  event: KeyboardEvent;
}

export interface InteractionsPointerSource {
  kind: "pointer";
  button: number;
  event: PointerEvent;
}

export type InteractionsSource = InteractionsKeySource | InteractionsPointerSource;

interface InteractionEventBase {
  actionId: InteractionsActionId;
  elapsed: number;
  source: InteractionsSource;
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

export type InteractionEventOfType<Type extends InteractionEvent["type"]> = Extract<InteractionEvent, { type: Type }>;

export type InteractionEventOfSource<Event extends InteractionEvent, Kind extends InteractionsSource["kind"]> = Event & { source: Extract<InteractionsSource, { kind: Kind }> };

export type InteractionsSourceListeners<Event extends InteractionEvent> = {
  [Kind in InteractionsSource["kind"]]?: (event: InteractionEventOfSource<Event, Kind>) => void;
};

export type InteractionsListener<Event extends InteractionEvent> =
  | ((event: Event) => void)
  | InteractionsSourceListeners<Event>;

export type InteractionsListeners = {
  [Type in InteractionEvent["type"]]?: InteractionsListener<InteractionEventOfType<Type>>;
};

export interface InteractionsPointerHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
}

export interface InteractionsDispatch {
  now: () => number;
  pressKey: (code: string, modifiers: InteractionsKeyModifiersState, now: number, event: KeyboardEvent) => void;
  releaseKey: (code: string, now: number, event: KeyboardEvent) => void;
  releaseAllKeys: (now: number) => void;
  pressPointer: (actionId: InteractionsActionId, button: number, now: number, event: PointerEvent) => void;
  releasePointer: (actionId: InteractionsActionId, button: number, now: number, event: PointerEvent) => void;
  releaseAllPointers: (actionId: InteractionsActionId, now: number) => void;
}
