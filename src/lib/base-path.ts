const trimTrailingSlash = (path: string) => path.replace(/\/+$/, "");

/**
 * Finds the folder the site is served from, at runtime, so the same build works on
 * https://user.github.io/, https://user.github.io/repository/ and a custom domain.
 *
 * Vite emits the entry bundle into "<base>/assets/", so the bundle's own URL reveals
 * the base no matter which page (/, /vorskla, 404 fallback) the visitor opened.
 */
export function detectBasePath(): string {
  if (typeof window === "undefined" || import.meta.env.DEV) return "";

  try {
    const { pathname } = new URL(import.meta.url);
    const assetsIndex = pathname.lastIndexOf("/assets/");
    if (assetsIndex >= 0) return trimTrailingSlash(decodeURI(pathname.slice(0, assetsIndex)));
  } catch {
    // import.meta.url is unavailable when the bundle is inlined; fall through
  }

  // Inlined builds: project pages on github.io always live one folder deep
  if (window.location.hostname.endsWith(".github.io")) {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return first ? `/${first}` : "";
  }
  return "";
}
