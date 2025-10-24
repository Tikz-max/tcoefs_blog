import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Eye, Loader2 } from "lucide-react";
import { admin } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "News",
    card_image_url: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    published_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    read_time: "5 min read",
    featured: false,
  });

  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const { data, error } = await admin.getArticleById(id);
      if (error) throw error;
      if (data) {
        setFormData(data);
        setImageData({ url: data.card_image_url });
      }
    } catch (err) {
      console.error("Error loading article:", err);
      setError("Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (uploadResult) => {
    if (uploadResult) {
      setImageData(uploadResult);
      setFormData((prev) => ({
        ...prev,
        card_image_url: uploadResult.url,
      }));
    } else {
      setImageData(null);
      setFormData((prev) => ({ ...prev, card_image_url: "" }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.excerpt.trim()) {
      setError("Excerpt is required");
      return false;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return false;
    }
    if (!formData.card_image_url) {
      setError("Card image is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      if (isEditMode) {
        // Update existing article
        console.log("Attempting to update article:", id);
        console.log("Form data:", formData);
        console.log("User ID:", user.id);

        const { data, error } = await admin.updateArticle(
          id,
          formData,
          user.id,
        );

        console.log("Update response - data:", data);
        console.log("Update response - error:", error);

        if (error) {
          console.error("Update error:", error);
          throw new Error(
            `Database error: ${error.message || error.code || "Unknown error"}. Details: ${JSON.stringify(error)}`,
          );
        }

        if (!data) {
          // Check if user is actually admin
          const isAdmin = await admin.checkAdminStatus();
          console.log("Is user admin?", isAdmin);

          throw new Error(
            `Update failed: No data returned. Admin status: ${isAdmin}. This usually means RLS policy is blocking the update.`,
          );
        }

        alert("Article updated successfully!");
        // Reload the article to show updated data
        await loadArticle();
      } else {
        // Generate new article ID
        const newId = await admin.generateArticleId();
        const articleData = { ...formData, id: newId };

        // Create new article
        const { data, error } = await admin.createArticle(articleData, user.id);

        if (error) {
          console.error("Create error:", error);
          throw new Error(error.message || "Failed to create article");
        }

        if (!data) {
          throw new Error(
            "Create returned no data - you may not have permission",
          );
        }

        // Save image record if we have image data
        if (imageData?.publicId) {
          await admin.saveArticleImage(
            newId,
            imageData.url,
            "card",
            imageData.publicId,
          );
        }

        alert("Article created successfully!");
        navigate("/admin/articles");
      }
    } catch (err) {
      console.error("Error saving article:", err);
      setError(err.message || "Failed to save article");
      alert(`Error: ${err.message || "Failed to save article"}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Store current form data in localStorage for preview
    localStorage.setItem("article_preview", JSON.stringify(formData));
    window.open("/admin/preview", "_blank");
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/articles")}
          className="flex items-center gap-2 text-primary hover:text-accent transition-quick mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Articles</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {isEditMode ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-secondary">
              {isEditMode
                ? "Update article details and content"
                : "Fill in the details to create a new blog article"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 border border-sage-light rounded-lg text-primary hover:bg-sage-light transition-quick"
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-quick disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span className="font-medium">
                    {isEditMode ? "Update Article" : "Create Article"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-sage-light p-6">
          <h2 className="text-xl font-bold text-primary mb-6">
            Basic Information
          </h2>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter article title"
                className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="Short description that appears in article cards"
                rows={3}
                className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick"
              />
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick bg-white"
                >
                  <option value="News">News</option>
                  <option value="Training">Training</option>
                  <option value="Research">Research</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              {/* Published Date (for sorting) */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Published Date (for sorting) *
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) =>
                    handleChange("published_date", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick"
                />
              </div>
            </div>

            {/* Display Date */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Display Date (shown to readers)
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                placeholder="e.g., March 23, 2025"
                className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick"
              />
              <p className="text-xs text-secondary mt-1">
                This is the human-readable date shown on the article
              </p>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => handleChange("read_time", e.target.value)}
                placeholder="e.g., 5 min read"
                className="w-full px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent transition-quick"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="w-5 h-5 text-accent border-sage-light rounded focus:ring-accent"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-primary cursor-pointer"
              >
                Set as featured article (will appear in homepage hero)
              </label>
            </div>
          </div>
        </div>

        {/* Card Image */}
        <div className="bg-white rounded-lg border border-sage-light p-6">
          <h2 className="text-xl font-bold text-primary mb-6">Card Image</h2>
          <ImageUpload
            onUploadComplete={handleImageUpload}
            existingImage={formData.card_image_url}
            label="Thumbnail Image (displayed in article cards) *"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-sage-light p-6">
          <h2 className="text-xl font-bold text-primary mb-6">
            Article Content
          </h2>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleChange("content", value)}
            label="Full Article Content *"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => navigate("/admin/articles")}
            className="px-6 py-3 border border-sage-light rounded-lg text-primary hover:bg-sage-light transition-quick"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent-dark transition-quick disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span className="font-medium">
                  {isEditMode ? "Update Article" : "Create Article"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
