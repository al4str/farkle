/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { loopInitialize, loopSetTargetFps } from "src/loop";
import { interactionsInitialize } from "src/interactions";
import { audioInitialize } from "src/audio";
import { testStateSet } from "src/test/helpers/state";
import { RoutesLayout } from "src/routes/components/Layout";
import { routesConfig } from "src/routes";

const root = window.document.getElementById("root");

if (root) {
  loopInitialize();
  loopSetTargetFps(30);
  testStateSet("targetFps", 30);
  interactionsInitialize();
  audioInitialize();
  render(
    () => (
      <Router root={RoutesLayout}>
        {routesConfig}
      </Router>
    ),
    root,
  );
}
