import { createContext, useContext, useState, useEffect } from "react";
import { supabase, auth, db } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user's liked posts and comments when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserLikedPosts([]);
      setUserComments([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    // Load liked posts
    const { data: likedPosts } = await db.getUserLikedPosts(user.id);
    setUserLikedPosts(likedPosts.map((like) => like.post_id));

    // Load comments
    const { data: comments } = await db.getUserComments(user.id);
    setUserComments(comments);
  };

  // Send OTP to email
  const sendOTP = async (email) => {
    try {
      const { data, error } = await auth.signInWithOTP(email);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify OTP code
  const verifyOTP = async (email, token) => {
    try {
      const { data, error } = await auth.verifyOTP(email, token);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await auth.signInWithGoogle();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId) => {
    if (!user)
      return { success: false, error: "Must be signed in to like posts" };

    try {
      const { isLiked, error } = await db.toggleLike(user.id, postId);
      if (error) throw error;

      // Update local state
      if (isLiked) {
        setUserLikedPosts([...userLikedPosts, postId]);
      } else {
        setUserLikedPosts(userLikedPosts.filter((id) => id !== postId));
      }

      return { success: true, isLiked };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add a comment
  const addComment = async (postId, text) => {
    if (!user) return { success: false, error: "Must be signed in to comment" };

    try {
      const userName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Anonymous";
      const { data, error } = await db.addComment(
        user.id,
        postId,
        text,
        userName,
        user.email,
      );
      if (error) throw error;

      // Update local state
      setUserComments([data, ...userComments]);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    if (!user) return { success: false, error: "Must be signed in" };

    try {
      const { error } = await db.deleteComment(commentId, user.id);
      if (error) throw error;

      // Update local state
      setUserComments(userComments.filter((c) => c.id !== commentId));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get comments for a post
  const getPostComments = async (postId) => {
    try {
      const { data, error } = await db.getPostComments(postId);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  };

  // Check if post is liked
  const isPostLiked = (postId) => {
    return userLikedPosts.includes(postId);
  };

  // Get like count for a post
  const getPostLikeCount = async (postId) => {
    try {
      const { count, error } = await db.getPostLikeCount(postId);
      if (error) throw error;
      return { success: true, count };
    } catch (error) {
      return { success: false, error: error.message, count: 0 };
    }
  };

  const value = {
    user,
    session,
    loading,
    userLikedPosts,
    userComments,
    sendOTP,
    verifyOTP,
    signInWithGoogle,
    signOut,
    toggleLike,
    addComment,
    deleteComment,
    getPostComments,
    isPostLiked,
    getPostLikeCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
