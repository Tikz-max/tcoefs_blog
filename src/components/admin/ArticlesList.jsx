import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { admin } from "../../lib/supabase";
import Logo from "../common/Logo";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ["All", "News", "Training", "Research", "Partnership"];

  useEffect(() => {
    loadArticles();

    // Reload articles when tab/window regains focus
    const handleFocus = () => {
      loadArticles();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    filterArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, articles]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await admin.getAllArticles(1, 100);
      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query),
      );
    }

    setFilteredArticles(filtered);
  };

  const handleDelete = async (articleId) => {
    setDeleting(true);
    try {
      const { error } = await admin.deleteArticle(articleId);
      if (error) {
        alert(error.message || "Failed to delete article");
        return;
      }
      // Remove from local state
      setArticles(articles.filter((a) => a.id !== articleId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (articleId, currentFeaturedStatus) => {
    try {
      if (currentFeaturedStatus) {
        await admin.unfeatureArticle(articleId);
      } else {
        await admin.setFeaturedArticle(articleId);
      }
      // Reload articles
      await loadArticles();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Failed to update featured status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {/* TCoEFS Logo with fade animation */}
          <div className="mb-6 animate-fade-pulse">
            <Logo size="xl" className="mx-auto" />
          </div>
          <p className="text-primary text-lg font-medium animate-fade-pulse">
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              Articles
            </h1>
            <p className="text-base text-secondary">
              Manage all blog articles ({filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "article" : "articles"})
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadArticles}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 border border-sage-light text-primary px-4 py-3 rounded-lg hover:bg-sage-light transition-quick font-medium whitespace-nowrap disabled:opacity-50"
              title="Refresh articles"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-quick shadow-sm hover:shadow-md font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>New Article</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-sage-light p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles by title or excerpt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-quick text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-sage-light rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-quick bg-white text-base min-w-[140px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== "All") && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-secondary">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                Category: {selectedCategory}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Articles Table/Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-lg border border-sage-light p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            {searchQuery || selectedCategory !== "All" ? (
              <>
                <Search className="w-16 h-16 text-sage-medium mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">
                  No articles found
                </h3>
                <p className="text-base text-secondary mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="text-accent hover:text-accent-dark font-medium transition-quick"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <Plus className="w-16 h-16 text-sage-medium mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">
                  No articles yet
                </h3>
                <p className="text-base text-secondary mb-6">
                  Create your first article to get started
                </p>
                <Link
                  to="/admin/articles/new"
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-quick font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Article
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg border border-sage-light p-4 shadow-sm hover:shadow-md transition-smooth"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-primary mb-1 line-clamp-2 text-base">
                      {article.title}
                    </h3>
                    <p className="text-sm text-secondary line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFeatured(article.id, article.featured)}
                    className={`flex-shrink-0 p-2.5 rounded-lg transition-quick ${
                      article.featured
                        ? "bg-accent/10 text-accent"
                        : "bg-sage-light text-secondary hover:bg-sage-medium"
                    }`}
                    title={
                      article.featured ? "Unfeature article" : "Set as featured"
                    }
                  >
                    <Star
                      className={`w-5 h-5 ${article.featured ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="inline-flex bg-sage-light text-primary px-3 py-1.5 rounded-full font-medium">
                    {article.category}
                  </span>
                  <span className="text-secondary">{article.date}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/news/${article.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-sage-light rounded-lg text-primary hover:bg-sage-light transition-quick font-medium"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View</span>
                  </Link>
                  <Link
                    to={`/admin/articles/edit/${article.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-accent text-white rounded-lg hover:bg-accent-dark transition-quick font-medium"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(article.id)}
                    disabled={article.featured}
                    className="p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-quick disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      article.featured
                        ? "Cannot delete featured article"
                        : "Delete article"
                    }
                  >
                    <Trash2
                      className={`w-5 h-5 ${article.featured ? "text-sage-medium" : "text-red-600"}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border border-sage-light overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-sage-light/50 border-b border-sage-light">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-sage-light last:border-0 hover:bg-sage-light/30 transition-quick"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold text-primary mb-1 line-clamp-1">
                            {article.title}
                          </p>
                          <p className="text-sm text-secondary line-clamp-1">
                            {article.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex bg-sage-light text-primary px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-secondary whitespace-nowrap">
                          {article.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            toggleFeatured(article.id, article.featured)
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-quick whitespace-nowrap ${
                            article.featured
                              ? "bg-accent/10 text-accent"
                              : "bg-sage-light text-secondary hover:bg-sage-medium"
                          }`}
                          title={
                            article.featured
                              ? "Unfeature article"
                              : "Set as featured"
                          }
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${article.featured ? "fill-current" : ""}`}
                          />
                          {article.featured ? "Featured" : "Feature"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/news/${article.id}`}
                            className="p-2 hover:bg-sage-light rounded-lg transition-quick"
                            title="View article"
                          >
                            <Eye className="w-5 h-5 text-primary" />
                          </Link>
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="p-2 hover:bg-sage-light rounded-lg transition-quick"
                            title="Edit article"
                          >
                            <Edit className="w-5 h-5 text-primary" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(article.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-quick disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              article.featured
                                ? "Cannot delete featured article"
                                : "Delete article"
                            }
                            disabled={article.featured}
                          >
                            <Trash2
                              className={`w-5 h-5 ${article.featured ? "text-sage-medium" : "text-red-600"}`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl mx-4">
            <h3 className="text-xl font-bold text-primary mb-3">
              Delete Article?
            </h3>
            <p className="text-sm sm:text-base text-secondary mb-6 leading-relaxed">
              Are you sure you want to delete this article? This action cannot
              be undone and will also delete all associated likes and comments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="w-full sm:w-auto px-5 py-2.5 border border-sage-light rounded-lg text-primary hover:bg-sage-light transition-quick disabled:opacity-50 font-medium order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-quick disabled:opacity-50 flex items-center justify-center gap-2 font-medium order-1 sm:order-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
