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
    <section aria-label="Comments" className="border-t-2 border-ink pt-5">
      <h2 className="font-serif text-[26px] font-semibold tracking-tight">
        Comments <span className="font-sans text-[15px] font-medium text-ink-3">({comments.length})</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor="comment" className="sr-only">Your comment</label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add to the discussion" : "Sign in to join the discussion"}
          disabled={!user || submitting}
          rows={3}
          className="field disabled:opacity-60"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p role="status" className="text-[13px] text-ink-3">
            {showLoginPrompt ? "Please sign in to comment." : "Be respectful and keep to the topic."}
          </p>
          <button type="submit" disabled={!user || !newComment.trim() || submitting} className="btn btn-primary btn-sm">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Post comment
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-ink-3" /></div>
        ) : comments.length === 0 ? (
          <p className="flex items-center gap-2.5 py-4 text-[14.5px] text-ink-3">
            <MessageSquare size={18} /> No comments yet. Start the conversation.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {comments.map((comment) => (
              <li key={comment.id} className="group flex gap-3.5 py-5 first:pt-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand">
                  {getUserInitial(comment.user_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px]">
                      <span className="font-semibold text-ink">{comment.user_name}</span>
                      <span className="ml-2 text-[12.5px] text-ink-3">{formatDate(comment.created_at)}</span>
                    </p>
                    {user && user.id === comment.user_id && (
                      <button onClick={() => handleDelete(comment.id)} className="icon-btn !h-8 !w-8 opacity-0 transition-opacity hover:!text-danger focus:opacity-100 group-hover:opacity-100" aria-label="Delete comment">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 break-words text-[15.5px] leading-relaxed text-ink-2">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
