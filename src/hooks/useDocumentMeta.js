import { useEffect } from "react";

const DEFAULT_TITLE =
  "TCoEFS Blog | TETFund Centre of Excellence in Food Security, University of Jos";

/** Keep the browser tab title and description in step with the page. */
export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | TCoEFS Blog` : DEFAULT_TITLE;
    const tag = document.querySelector('meta[name="description"]');
    const previous = tag?.getAttribute("content");
    if (tag && description) tag.setAttribute("content", description);
    return () => {
      document.title = DEFAULT_TITLE;
      if (tag && previous) tag.setAttribute("content", previous);
    };
  }, [title, description]);
}
