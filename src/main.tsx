import * as React from "npm:react";
import * as reactDomClient from "npm:react-dom/client";
import { App } from "./App.tsx";

document.documentElement.style.height = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";

const entryPoint = document.createElement("div");
entryPoint.style.height = "100%";

document.body.appendChild(entryPoint);

reactDomClient.createRoot(entryPoint).render(<App />);
