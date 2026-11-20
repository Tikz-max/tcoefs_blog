import { useState } from "react";
import ContourArt from "./ContourArt";

/**
 * Story image at a fixed ratio with soft rounded corners. When an image is
 * missing or broken the tile falls back to an emerald gradient with contour
 * artwork and the topic name, so the layout never shows an empty hole.
 */
const Cover = ({
  src,
  alt = "",
  ratio = "3 / 2",
  className = "",
  zoom = true,
  eager = false,
  rounded = "rounded-[20px]",
  label = "",
  imgClass = "",
}) => {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div
      className={`relative overflow-hidden bg-band-2 ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {show ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${zoom ? "tile-img" : ""} ${imgClass}`}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-end p-5"
          style={{ background: "linear-gradient(135deg, #0f9f6e 0%, #0a5c43 45%, #082016 100%)" }}
        >
          <ContourArt className="absolute inset-0 h-full w-full text-white/[0.16]" />
          {label && (
            <span className="relative font-serif text-[clamp(20px,2.4vw,30px)] font-bold leading-none tracking-[-0.03em] text-white/90">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Cover;
