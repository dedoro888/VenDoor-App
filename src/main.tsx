import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply stored theme class before first render to prevent flash
const storedTheme = localStorage.getItem("vendoor-theme") ?? "dark";
document.documentElement.classList.add(storedTheme === "light" ? "light" : "dark");

createRoot(document.getElementById("root")!).render(<App />);

