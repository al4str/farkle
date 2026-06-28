import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";

export interface StateTest {
  rotationSpeed: number;
  color: string;
  wireframe: boolean;
  autoRotate: boolean;
  rotationY: number;
  targetFps: number;
  fps: number;
  inspectorEnabled: boolean;
  started: boolean;
  loaded: boolean;
}

const INITIAL_STATE: StateTest = {
  rotationSpeed: 1,
  color: "#aa3bff",
  wireframe: false,
  autoRotate: true,
  rotationY: 0,
  targetFps: 60,
  fps: 0,
  inspectorEnabled: false,
  started: false,
  loaded: false,
};

export const [sceneState, setSceneState] = loadStore();

type Store = [state: StateTest, setState: SetStoreFunction<StateTest>];

function loadStore(): Store {
  const data = import.meta.hot?.data;
  if (data && isStore(data.store)) {
    return data.store;
  }
  const created = createStore<StateTest>(INITIAL_STATE);
  if (data) {
    data.store = created;
  }
  return created;
}

function isStore(value: unknown): value is Store {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "object" && value[0] !== null && typeof value[1] === "function";
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
