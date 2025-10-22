import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId }) => {
  const { user, addComment, deleteComment, getPostComments } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const result = await getPostComments(postId);
    if (result.success) {
      setComments(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 2000);
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);

    const result = await addComment(postId, newComment.trim());

    if (result.success) {
      setComments([result.data, ...comments]);
      setNewComment("");
    }

    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const result = await deleteComment(commentId);

    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getUserInitial = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="bg-white rounded-2xl border border-[#d9e8e0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d9e8e0] flex items-center gap-2">
        <MessageSquare size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-primary">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="px-6 py-5 border-b border-[#d9e8e0] bg-[#f8fbf9]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              user
                ? "Share your thoughts on this article..."
                : "Sign in to leave a comment"
            }
            disabled={!user || submitting}
            rows={3}
            className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#d9e8e0] rounded-lg text-[17px] text-text placeholder:text-primary/40 focus:border-accent focus:bg-white focus:outline-none focus:ring-3 focus:ring-accent/10 transition-all duration-[180ms] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!user || !newComment.trim() || submitting}
            className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-accent-dark text-white transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent"
            aria-label="Post comment"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="mt-3 px-4 py-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-accent-dark">
              Please sign in to leave a comment
            </p>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary/40" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto mb-3 text-primary/20" />
            <p className="text-sm text-secondary">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="group p-4 rounded-lg border border-[#d9e8e0] hover:border-accent/30 hover:bg-[#f8fbf9] transition-all duration-[180ms]"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                    {getUserInitial(comment.user_name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          {comment.user_name}
                        </span>
                        <span className="text-xs text-secondary">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      {/* Delete Button (only for comment owner) */}
                      {user && user.id === comment.user_id && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-600 transition-all duration-[180ms]"
                          aria-label="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <p className="text-[15px] text-text leading-relaxed break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
