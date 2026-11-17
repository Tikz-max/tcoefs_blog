import { useState } from "react";

/**
 * Story image with a fixed aspect ratio and a quiet branded fallback, so a
 * missing or broken image never leaves a hole in the layout.
 */
const Cover = ({
  src,
  alt = "",
  ratio = "3 / 2",
  className = "",
  zoom = true,
  eager = false,
  rounded = "rounded-[4px]",
}) => {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div
      className={`relative overflow-hidden bg-muted ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {show ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${
            zoom
              ? "transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              : ""
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-soft">
          <img
            src="/tcoefs-logo.png"
            alt=""
            className="h-1/3 max-h-20 w-auto opacity-30 grayscale"
          />
        </div>
      )}
    </div>
  );
};

export default Cover;
