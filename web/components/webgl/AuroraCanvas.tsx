"use client";

import { useEffect, useRef, useState } from "react";
import { AuroraRenderer } from "@/lib/webgl/renderer";
import { supportsWebGL2 } from "@/lib/webgl/detect";
import { useTheme } from "@/lib/hooks/useTheme";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * React lifecycle wrapper around AuroraRenderer.
 *
 * Responsibilities:
 *  - feature-detect WebGL2 and fall back to an animated CSS gradient
 *  - pause the render loop when the hero scrolls off-screen or the tab hides
 *  - feed pointer position to the shader for the trailing glow
 *  - honor prefers-reduced-motion by drawing a single static frame
 *  - react to theme changes without recreating the GPU context
 */
export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<AuroraRenderer | null>(null);
  const [fallback, setFallback] = useState(false);
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  // Create the renderer exactly once on mount.
  useEffect(() => {
    if (!supportsWebGL2()) {
      setFallback(true);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let renderer: AuroraRenderer;
    try {
      renderer = new AuroraRenderer(canvas, {
        theme: theme === "dark" ? 0 : 1,
      });
    } catch {
      setFallback(true);
      return;
    }
    rendererRef.current = renderer;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      renderer.stop();
      setFallback(true);
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        if (entry.isIntersecting && !document.hidden && !mediaReducedMotion()) {
          renderer.start();
        } else {
          renderer.stop();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    const handleVisibility = () => {
      if (document.hidden) {
        renderer.stop();
      } else if (!mediaReducedMotion()) {
        renderer.start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      renderer.setPointer(x, y);
    };
    window.addEventListener("pointermove", handlePointer);

    const handleResize = () => renderer.resize();
    window.addEventListener("resize", handleResize);

    if (mediaReducedMotion()) {
      renderer.renderStatic();
    } else {
      renderer.start();
    }

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      rendererRef.current = null;
    };
    // Renderer lifecycle is mount-once; theme/motion are handled in the effect
    // below so we never rebuild the GPU context on a prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to theme + reduced-motion changes on the live renderer.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) {
      return;
    }
    renderer.setTheme(theme === "dark" ? 0 : 1);
    if (reducedMotion) {
      renderer.renderStatic();
    } else {
      renderer.start();
    }
  }, [theme, reducedMotion]);

  if (fallback) {
    return (
      <div className="aurora-fallback absolute inset-0" aria-hidden="true" />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

/** Read the live media query rather than the React state captured at mount. */
function mediaReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
