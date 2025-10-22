import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LikeButton = ({ postId, showCount = true, size = "default" }) => {
  const { user, toggleLike, isPostLiked, getPostLikeCount } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Size variants
  const sizes = {
    small: { icon: 16, button: "w-8 h-8", text: "text-xs" },
    default: { icon: 20, button: "w-10 h-10", text: "text-sm" },
    large: { icon: 24, button: "w-12 h-12", text: "text-base" },
  };

  const currentSize = sizes[size] || sizes.default;

  // Load initial state
  useEffect(() => {
    if (user) {
      setLiked(isPostLiked(postId));
    }
    loadLikeCount();
  }, [user, postId]);

  const loadLikeCount = async () => {
    const result = await getPostLikeCount(postId);
    if (result.success) {
      setLikeCount(result.count);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 2000);
      return;
    }

    if (loading) return;

    setLoading(true);

    // Optimistic update
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    const result = await toggleLike(postId);

    if (!result.success) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }

    setLoading(false);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`${currentSize.button} flex items-center justify-center rounded-full border-2 transition-all duration-[180ms] ${
          liked
            ? "bg-accent border-accent text-white hover:bg-accent-dark hover:border-accent-dark"
            : "bg-white border-[#d9e8e0] text-primary/60 hover:border-accent hover:text-accent hover:bg-[#f8fbf9]"
        } ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:-translate-y-0.5 hover:shadow-md"
        }`}
        aria-label={liked ? "Unlike post" : "Like post"}
      >
        <Heart
          size={currentSize.icon}
          className={`transition-all duration-[180ms] ${
            liked ? "fill-current scale-110" : ""
          }`}
        />
      </button>

      {showCount && likeCount > 0 && (
        <span className={`${currentSize.text} font-medium text-secondary`}>
          {likeCount}
        </span>
      )}

      {/* Login Prompt Tooltip */}
      {showLoginPrompt && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-primary text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in">
          Sign in to like posts
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default LikeButton;
