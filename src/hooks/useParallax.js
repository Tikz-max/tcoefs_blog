import { useEffect } from "react";

/**
 * Writes --py (pixels) and --ps (0 to 1) onto the element as the page scrolls,
 * for a slow parallax. Does nothing under reduced motion.
 */
export function useParallax(ref, { speed = 0.28 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y > h * 1.2) return;
      el.style.setProperty("--py", String(Math.round(y * speed)));
      el.style.setProperty("--ps", String(Math.min(1, y / h)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, speed]);
}
