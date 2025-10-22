import { Heart, MessageSquare, Share2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const CardSocialActions = ({ postId, onAuthRequired }) => {
  const { user, toggleLike, isPostLiked, getPostLikeCount, getPostComments } =
    useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load initial state
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLiked(isPostLiked(postId));
      }

      // Load like count
      const likeResult = await getPostLikeCount(postId);
      if (likeResult.success) {
        setLikeCount(likeResult.count);
      }

      // Load comment count
      const commentResult = await getPostComments(postId);
      if (commentResult.success) {
        setCommentCount(commentResult.data.length);
      }
    };

    loadData();
  }, [user, postId, isPostLiked, getPostLikeCount, getPostComments]);

  const loadCounts = async () => {
    // Load like count
    const likeResult = await getPostLikeCount(postId);
    if (likeResult.success) {
      setLikeCount(likeResult.count);
    }

    // Load comment count
    const commentResult = await getPostComments(postId);
    if (commentResult.success) {
      setCommentCount(commentResult.data.length);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (onAuthRequired) onAuthRequired();
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
    } else {
      // Reload count to sync with server
      loadCounts();
    }

    setLoading(false);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="flex items-center gap-6">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={loading}
        className="flex items-center gap-2 text-primary/60 hover:text-accent transition-all duration-[180ms] disabled:opacity-50"
        aria-label="Like"
      >
        {likeCount > 0 && (
          <span className="text-sm font-medium min-w-[16px] text-right">
            {likeCount}
          </span>
        )}
        <Heart
          size={22}
          className={`transition-all duration-[180ms] ${
            liked ? "fill-accent text-accent" : ""
          }`}
        />
      </button>

      {/* Comment Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex items-center gap-2 text-primary/60 hover:text-accent transition-all duration-[180ms]"
        aria-label="Comments"
      >
        {commentCount > 0 && (
          <span className="text-sm font-medium min-w-[16px] text-right">
            {commentCount}
          </span>
        )}
        <MessageSquare size={22} />
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 transition-all duration-[180ms] ${
          copied ? "text-accent" : "text-primary/60 hover:text-accent"
        }`}
        aria-label={copied ? "Link copied!" : "Share"}
      >
        {copied ? <Check size={22} /> : <Share2 size={22} />}
      </button>
    </div>
  );
};

export default CardSocialActions;
