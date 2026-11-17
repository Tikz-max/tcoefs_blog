import { useEffect, useRef } from "react";

/**
 * Fades and lifts its content into place once it scrolls into view.
 * Motion is small (14px, 420ms) and staggered through `index`. Content stays
 * visible without JavaScript, and under reduced motion it renders in place.
 */
const Reveal = ({ as: Tag = "div", index = 0, className = "", children, ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--i": index % 6 }} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
