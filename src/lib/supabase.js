import { createClient } from "@supabase/supabase-js";

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions for authentication
export const auth = {
  // Send OTP to email
  async signInWithOTP(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  // Verify OTP code
  async verifyOTP(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    return { data, error };
  },

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Check if user is admin
  async isAdmin() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return false;
    return data.user.user_metadata?.role === "admin";
  },
};

// Database helper functions
export const db = {
  // Like/Unlike a post
  async toggleLike(userId, postId) {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);
      return { isLiked: false, error };
    } else {
      // Like
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: userId, post_id: postId });
      return { isLiked: true, error };
    }
  },

  // Check if user has liked a post
  async isPostLiked(userId, postId) {
    const { data, error } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();
    return { isLiked: !!data, error };
  },

  // Get like count for a post
  async getPostLikeCount(postId) {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    return { count: count || 0, error };
  },

  // Add a comment
  async addComment(userId, postId, text, userName, userEmail) {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: userId,
        post_id: postId,
        text,
        user_name: userName,
        user_email: userEmail,
      })
      .select()
      .single();
    return { data, error };
  },

  // Get comments for a post
  async getPostComments(postId) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    return { data: data || [], error };
  },

  // Delete a comment
  async deleteComment(commentId, userId) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);
    return { error };
  },

  // Get user's liked posts
  async getUserLikedPosts(userId) {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
    return { data: data || [], error };
  },

  // Get user's comments
  async getUserComments(userId) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data: data || [], error };
  },
};

// Admin helper functions
export const admin = {
  // Check if current user is admin
  async checkAdminStatus() {
    return await auth.isAdmin();
  },

  // Get all articles (with pagination)
  async getAllArticles(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("articles")
      .select("*", { count: "exact" })
      .order("published_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    return { data: data || [], error, count };
  },

  // Get article by ID
  async getArticleById(id) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Create new article
  async createArticle(articleData, userId) {
    const { data, error } = await supabase
      .from("articles")
      .insert({
        ...articleData,
        created_by: userId,
        updated_by: userId,
      })
      .select();

    // Return first result or null
    return { data: data && data.length > 0 ? data[0] : null, error };
  },

  // Update article
  async updateArticle(id, articleData, userId) {
    const { data, error } = await supabase
      .from("articles")
      .update({
        ...articleData,
        updated_by: userId,
      })
      .eq("id", id)
      .select();

    // Return first result or null
    return { data: data && data.length > 0 ? data[0] : null, error };
  },

  // Delete article
  async deleteArticle(id) {
    // First check if article is featured
    const { data: article } = await supabase
      .from("articles")
      .select("featured")
      .eq("id", id)
      .single();

    if (article?.featured) {
      return {
        data: null,
        error: {
          message: "Cannot delete featured article. Unfeature it first.",
        },
      };
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    return { error };
  },

  // Set featured article (only one can be featured)
  async setFeaturedArticle(id) {
    const { data, error } = await supabase
      .from("articles")
      .update({ featured: true })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Unfeature article
  async unfeatureArticle(id) {
    const { data, error } = await supabase
      .from("articles")
      .update({ featured: false })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Get featured article
  async getFeaturedArticle() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("featured", true)
      .limit(1);

    // Return first result or null if no featured article
    return { data: data && data.length > 0 ? data[0] : null, error };
  },

  // Search articles
  async searchArticles(query, category = null) {
    let queryBuilder = supabase
      .from("articles")
      .select("*")
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      queryBuilder = queryBuilder.eq("category", category);
    }

    const { data, error } = await queryBuilder;
    return { data: data || [], error };
  },

  // Generate unique article ID
  async generateArticleId() {
    // Get the latest article to determine next ID
    const { data, error } = await supabase
      .from("articles")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return "news1"; // First article
    }

    // Extract number from last ID (e.g., "news5" -> 5)
    const lastId = data[0].id;
    const match = lastId.match(/\d+$/);
    const lastNum = match ? parseInt(match[0]) : 0;

    return `news${lastNum + 1}`;
  },

  // Save article image record
  async saveArticleImage(articleId, imageUrl, imageType, cloudinaryPublicId) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { data, error } = await supabase
      .from("article_images")
      .insert({
        article_id: articleId,
        image_url: imageUrl,
        image_type: imageType,
        cloudinary_public_id: cloudinaryPublicId,
        uploaded_by: userId,
      })
      .select()
      .single();

    return { data, error };
  },

  // Get article images
  async getArticleImages(articleId) {
    const { data, error } = await supabase
      .from("article_images")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    return { data: data || [], error };
  },

  // Delete article image
  async deleteArticleImage(imageId) {
    const { error } = await supabase
      .from("article_images")
      .delete()
      .eq("id", imageId);

    return { error };
  },
};

// Cloudinary helper functions
export const cloudinary = {
  // Upload image to Cloudinary
  async uploadImage(file, folder = "tcoefs-news") {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return {
        data: null,
        error: { message: "Cloudinary credentials not configured" },
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return {
        data: {
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: error.message || "Failed to upload image" },
      };
    }
  },

  // Get optimized image URL
  getOptimizedUrl(publicId, options = {}) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const { width, height, quality = "auto", format = "auto" } = options;

    let transformations = `f_${format},q_${quality}`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  },

  // Get thumbnail URL
  getThumbnailUrl(publicId, size = 200) {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      quality: "auto",
      format: "auto",
    });
  },
};
