import { Elm } from "./src/Main.elm";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const app = Elm.Main.init({ node: rootElement, flags: null });
