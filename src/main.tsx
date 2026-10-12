import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./fonts";
import "./index.css";
import { App } from "./App";
import { detectBasePath } from "./lib/base-path";

const base = detectBasePath();
const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App base={base} />
  </StrictMode>
);

// The build prerenders the page for search engines. Hydrate when it was rendered for the
// same base path; otherwise (dev server, a different folder) render fresh on top of it.
if (container.dataset.prerendered === "true" && (container.dataset.base ?? "") === base) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
