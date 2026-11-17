import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LikeButton = ({ postId, showCount = true }) => {
  const { user, toggleLike, isPostLiked, getPostLikeCount } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors disabled:opacity-60 ${
          liked
            ? "border-brand-fill bg-brand-fill text-white"
            : "border-line-strong bg-surface text-ink-2 hover:border-ink hover:text-ink"
        }`}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this story"}
      >
        <Heart size={17} className={liked ? "fill-current" : ""} />
        {liked ? "Liked" : "Like"}
        {showCount && likeCount > 0 && <span className="tabular-nums opacity-80">{likeCount}</span>}
      </button>

      {showLoginPrompt && (
        <div role="status" className="animate-fade absolute -top-11 left-0 whitespace-nowrap rounded-md bg-ink px-3 py-2 text-[12.5px] font-medium text-paper shadow-pop">
          Sign in to like stories
        </div>
      )}
    </div>
  );
};

export default LikeButton;
