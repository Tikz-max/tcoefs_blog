/**
 * Splits text into words that each rise out of a mask (kinetic typography).
 * The full text stays available to screen readers via aria-label, and the
 * animation is removed under reduced motion (see index.css).
 */
const SplitWords = ({ text = "", as: Tag = "span", className = "", style, start = 0 }) => {
  const words = String(text).split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-mask" aria-hidden="true">
          <span style={{ "--d": start + i }}>{word}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
};

export default SplitWords;
