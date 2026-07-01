import { createSignal } from "solid-js";

import { UiAssetsLoading } from "src/ui/AssetsLoading";
import { UiButton } from "src/ui/Button";

type LoaderState = "idle" | "loading" | "30" | "60" | "90" | "loaded";

export function TestAssetsLoading() {
  const [getVisible, setVisible] = createSignal(false);
  const [getProgress, setProgress] = createSignal(0);
  const [getLoaderState, setLoaderState] = createSignal<LoaderState>("idle");

  const onProgress = () => {
    setLoaderState((prevState) => {
      switch (prevState) {
        case "idle":
          setVisible(true);
          setProgress(0);
          return "loading";
        case "loading":
          setProgress(0.3);
          return "30";
        case "30":
          setProgress(0.5);
          return "60";
        case "60":
          setProgress(0.9);
          return "90";
        case "90":
          setProgress(1);
          return "loaded";
        case "loaded":
        default:
          setVisible(false);
          setProgress(0);
          return "idle";
      }
    });
  };

  return (
    <>
      <div>
        <UiButton
          label="Next state"
          actionId="test.assetsLoading"
          code="KeyE"
          onClick={onProgress}
        />
        <p>Current state: {getLoaderState()}</p>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          "pointer-events": "none",
        }}
      >
        <UiAssetsLoading
          visible={getVisible()}
          progress={getProgress()}
        />
      </div>
    </>
  );
}
