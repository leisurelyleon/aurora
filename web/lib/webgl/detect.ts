/**
 * WebGL2 capability detection.
 *
 * Used by the canvas component to decide between the live shader and the
 * animated CSS fallback. Wrapped in try/catch because some locked-down
 * browsers throw rather than returning null.
 */
export function supportsWebGL2(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}
