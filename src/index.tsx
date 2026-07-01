/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { ROUTES_DEFINITION } from "src/routes";
import { loopInitialize, loopSetTargetFps } from "src/loop";
import { loopTimerInitialize } from "src/loop/timer";
import { interactionsInitialize } from "src/interactions";
import { i18nInitialize } from "src/i18n";
import { audioInitialize } from "src/audio";
import { testStateSet } from "src/test/helpers/state";
import { RoutesLayout } from "src/routes/components/Layout";

const root = window.document.getElementById("root");

if (root) {
  loopInitialize();
  loopTimerInitialize();
  loopSetTargetFps(30);
  testStateSet("targetFps", 30);
  interactionsInitialize();
  i18nInitialize();
  audioInitialize();
  render(
    () => (
      <Router root={RoutesLayout}>
        {ROUTES_DEFINITION}
      </Router>
    ),
    root,
  );
}
