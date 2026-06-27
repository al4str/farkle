import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";

export type SceneState = {
  rotationSpeed: number;
  color: string;
  wireframe: boolean;
  autoRotate: boolean;
  rotationY: number;
  fps: number;
};

type SceneStore = [state: SceneState, setState: SetStoreFunction<SceneState>];

const initialState: SceneState = {
  rotationSpeed: 1,
  color: "#aa3bff",
  wireframe: false,
  autoRotate: true,
  rotationY: 0,
  fps: 0,
};

function isSceneStore(value: unknown): value is SceneStore {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "object" &&
    value[0] !== null &&
    typeof value[1] === "function"
  );
}

function loadStore(): SceneStore {
  const data = import.meta.hot?.data;
  if (data && isSceneStore(data.store)) {
    return data.store;
  }
  const created = createStore<SceneState>(initialState);
  if (data) {
    data.store = created;
  }
  return created;
}

export const [sceneState, setSceneState] = loadStore();

if (import.meta.hot) {
  import.meta.hot.accept();
}
