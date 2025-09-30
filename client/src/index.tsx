import { createRoot, Root } from "react-dom/client";
import App from "./App";

const container: HTMLElement | null = document.getElementById("root");
const root: Root = createRoot(container!);
root.render(<App />);