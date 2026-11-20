const DEFAULT_MIN_PX = 64;

function hasSize(element: HTMLElement, minPx: number) {
  return element.clientWidth >= minPx && element.clientHeight >= minPx;
}

/**
 * Cesium/WebGL need a non-zero canvas; `max texture size (0)` errors come from a 0×0 container.
 * Resolves once sized. Polls as well as observing, because ResizeObserver and rAF are paused in
 * background tabs. Rejects only when aborted.
 */
export function waitForNonZeroSize(
  element: HTMLElement,
  signal: AbortSignal,
  minPx = DEFAULT_MIN_PX,
): Promise<void> {
  if (hasSize(element, minPx)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      ro.disconnect();
      window.clearInterval(poll);
      signal.removeEventListener("abort", onAbort);
    };
    const check = () => {
      if (hasSize(element, minPx)) {
        cleanup();
        resolve();
      }
    };
    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    const ro = new ResizeObserver(check);
    ro.observe(element);
    const poll = window.setInterval(check, 250);
    signal.addEventListener("abort", onAbort);
  });
}

export function attachViewerResize(
  viewer: import("cesium").Viewer,
  element: HTMLElement,
): () => void {
  const resize = () => {
    if (viewer.isDestroyed()) return;
    if (element.clientWidth < 1 || element.clientHeight < 1) return;
    viewer.resize();
    viewer.scene.requestRender();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(element);
  window.addEventListener("orientationchange", resize);
  resize();

  return () => {
    ro.disconnect();
    window.removeEventListener("orientationchange", resize);
  };
}