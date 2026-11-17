import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`no-print fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-brand-fill text-[color:var(--c-on-cta)] shadow-[var(--shadow-pop)] transition-all duration-300 hover:bg-brand-fill-hover ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
