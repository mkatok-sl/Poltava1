import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

/** Used by scripts/prerender.mjs at build time */
export function render(base: string): string {
  return renderToString(
    <StrictMode>
      <App base={base} ssrPath={`${base}/`} />
    </StrictMode>,
  );
}
