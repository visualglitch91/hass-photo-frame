import { render } from "preact";
import App from "./App";

const root = document.getElementById("root")!;

root.style.width = `${window.innerWidth}px`;
root.style.height = `${window.innerHeight}px`;

render(<App />, root);
