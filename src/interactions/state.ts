import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";

import type { InteractionsState } from "src/interactions/types";

const INITIAL_STATE: InteractionsState = {
  actions: {},
  lastDevice: "keyboardMouse",
};

export const [interactionsState, interactionsStateSet] = loadStore();

type InteractionsStore = [
  state: InteractionsState,
  setState: SetStoreFunction<InteractionsState>,
];

function loadStore(): InteractionsStore {
  const data = import.meta.hot?.data;
  if (data && isStore(data.store)) {
    return data.store;
  }
  const created = createStore<InteractionsState>(INITIAL_STATE);
  if (data) {
    data.store = created;
  }
  return created;
}

function isStore(value: unknown): value is InteractionsStore {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "object" && value[0] !== null && typeof value[1] === "function";
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
