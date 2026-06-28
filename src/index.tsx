/* @refresh reload */
import { render } from "solid-js/web";

import { loopInitialize, loopSetTargetFps } from "src/loop";
import { interactionsInitialize } from "src/interactions";
import { audioInitialize } from "src/audio";
import { setSceneState } from "src/state/test";
import { App } from "src/App";
import "src/index.css";

const root = window.document.getElementById("root");

if (root) {
  loopInitialize();
  loopSetTargetFps(30);
  setSceneState("targetFps", 30);
  interactionsInitialize();
  audioInitialize();
  render(() => <App />, root);
}
