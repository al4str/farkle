/* @refresh reload */
import { render } from "solid-js/web";

import { App } from "src/App";

import "src/index.css";

const root = window.document.getElementById("root");

if (root) {
  render(() => <App />, root);
}
