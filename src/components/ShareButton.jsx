import { useState } from "react";
import { Share2, Check } from "lucide-react";

const ShareButton = ({ postId, size = "default" }) => {
  const [copied, setCopied] = useState(false);

  // Size variants
  const sizes = {
    small: { icon: 16, button: "w-8 h-8" },
    default: { icon: 20, button: "w-10 h-10" },
    large: { icon: 24, button: "w-12 h-12" },
  };

  const currentSize = sizes[size] || sizes.default;

  const handleShare = async () => {
    const newsUrl = `${window.location.origin}/news/${postId}`;

    try {
      await navigator.clipboard.writeText(newsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`${currentSize.button} flex items-center justify-center rounded-full border-2 transition-all duration-[180ms] ${
        copied
          ? "bg-accent border-accent text-white"
          : "bg-white border-[#d9e8e0] text-primary/60 hover:border-accent hover:text-accent hover:bg-[#f8fbf9]"
      } ${copied ? "" : "hover:-translate-y-0.5 hover:shadow-md"}`}
      aria-label={copied ? "Link copied!" : "Share post"}
    >
      {copied ? (
        <Check size={currentSize.icon} className="animate-in" />
      ) : (
        <Share2 size={currentSize.icon} />
      )}
    </button>
  );
};

export default ShareButton;
