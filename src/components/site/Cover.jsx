import { useState } from "react";
import ContourArt from "./ContourArt";

/**
 * Story image at a fixed ratio. When an image is missing or broken the tile
 * falls back to deep green with contour artwork and the topic name, so the
 * layout never shows an empty hole.
 */
const Cover = ({
  src,
  alt = "",
  ratio = "3 / 2",
  className = "",
  zoom = true,
  eager = false,
  rounded = "rounded-[2px]",
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
        <div className="absolute inset-0 flex items-end bg-band-2 p-5">
          <ContourArt className="absolute inset-0 h-full w-full text-white/[0.12]" />
          {label && (
            <span className="relative font-serif text-[clamp(22px,2.6vw,34px)] font-bold italic leading-none text-white/85">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Cover;
