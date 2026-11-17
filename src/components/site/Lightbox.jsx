import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Full-screen image viewer: Esc closes, arrow keys browse, focus is returned. */
const Lightbox = ({ items, index, onClose, onIndex }) => {
  const closeRef = useRef(null);
  const item = items[index];

  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && index < items.length - 1) onIndex(index + 1);
      else if (e.key === "ArrowLeft" && index > 0) onIndex(index - 1);
      else if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndex]);

  if (!item) return null;
  const nav =
    "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-25";

  return (
    <div
      className="animate-fade fixed inset-0 z-[130] flex flex-col bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white/80">
        <p className="text-[14px] tabular-nums" aria-live="polite">
          {index + 1} / {items.length}
        </p>
        <button ref={closeRef} onClick={onClose} className="icon-btn !text-white hover:!bg-white/15" aria-label="Close image viewer">
          <X size={22} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => e.stopPropagation()}>
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          className="animate-fade max-h-full max-w-full rounded object-contain"
        />
        {items.length > 1 && (
          <>
            <button className={`${nav} left-3 md:left-6`} onClick={() => onIndex(index - 1)} disabled={index === 0} aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
            <button className={`${nav} right-3 md:right-6`} onClick={() => onIndex(index + 1)} disabled={index === items.length - 1} aria-label="Next image">
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      <p className="min-h-[56px] px-6 py-4 text-center text-[15px] leading-snug text-white/80" onClick={(e) => e.stopPropagation()}>
        {item.caption}
      </p>
    </div>
  );
};

export default Lightbox;
