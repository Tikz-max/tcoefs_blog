import { useCallback, useEffect, useState } from "react";

const KEY = "tcoefs-theme";

const current = () =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

/** Light and dark theme, saved on the device. */
export function useTheme() {
  const [theme, setTheme] = useState(current);

  useEffect(() => {
    const onChange = () => setTheme(current());
    window.addEventListener("tcoefs-theme", onChange);
    return () => window.removeEventListener("tcoefs-theme", onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = current() === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event("tcoefs-theme"));
  }, []);

  return { theme, toggle };
}
