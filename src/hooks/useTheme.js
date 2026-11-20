import { useCallback, useEffect, useState } from "react";

const KEY = "tcoefs-theme";

// The site is dark by default (aurora look); light is the alternative.
const current = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

/** Dark and light theme, saved on the device. */
export function useTheme() {
  const [theme, setTheme] = useState(current);

  useEffect(() => {
    const onChange = () => setTheme(current());
    window.addEventListener("tcoefs-theme", onChange);
    return () => window.removeEventListener("tcoefs-theme", onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = current() === "light" ? "dark" : "light";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
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
