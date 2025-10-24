import { useState, useEffect } from "react";
import {
  FileText,
  Star,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { admin } from "../../lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    featuredArticle: null,
    recentArticles: [],
    articlesByCategory: {
      News: 0,
      Training: 0,
      Research: 0,
      Partnership: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get all articles
      const { data: allArticles } = await admin.getAllArticles(1, 100);

      // Get featured article
      const { data: featured } = await admin.getFeaturedArticle();

      // Calculate stats
      const categoryCount = {
        News: 0,
        Training: 0,
        Research: 0,
        Partnership: 0,
      };

      allArticles?.forEach((article) => {
        if (categoryCount[article.category] !== undefined) {
          categoryCount[article.category]++;
        }
      });

      setStats({
        totalArticles: allArticles?.length || 0,
        featuredArticle: featured,
        recentArticles: allArticles?.slice(0, 5) || [],
        articlesByCategory: categoryCount,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: IconComponent, label, value, color }) => (
    <div className="bg-white rounded-lg border border-sage-light p-6 hover:shadow-md transition-quick">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-sage-light rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-sage-light rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-secondary">Welcome to TCoEFS Blog Admin Panel</p>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-quick shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create New Article</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="Total Articles"
          value={stats.totalArticles}
          color="bg-accent"
        />
        <StatCard
          icon={Star}
          label="News Articles"
          value={stats.articlesByCategory.News}
          color="bg-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Training"
          value={stats.articlesByCategory.Training}
          color="bg-accent-light"
        />
        <StatCard
          icon={Calendar}
          label="Research"
          value={stats.articlesByCategory.Research}
          color="bg-secondary"
        />
      </div>

      {/* Featured Article Card */}
      {stats.featuredArticle && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Featured Article
          </h2>
          <div className="bg-white rounded-lg border border-sage-light p-6 hover:shadow-md transition-quick">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    Featured
                  </span>
                  <span className="inline-flex bg-sage-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {stats.featuredArticle.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {stats.featuredArticle.title}
                </h3>
                <p className="text-secondary mb-3">
                  {stats.featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span>{stats.featuredArticle.date}</span>
                  <span>•</span>
                  <span>{stats.featuredArticle.read_time}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/admin/articles/edit/${stats.featuredArticle.id}`}
                className="inline-flex items-center gap-2 bg-sage-light text-primary px-4 py-2 rounded-lg hover:bg-sage-medium transition-quick"
              >
                <Edit className="w-4 h-4" />
                <span className="font-medium">Edit</span>
              </Link>
              <Link
                to={`/news/${stats.featuredArticle.id}`}
                className="inline-flex items-center gap-2 bg-white border border-sage-light text-primary px-4 py-2 rounded-lg hover:bg-sage-light transition-quick"
              >
                <Eye className="w-4 h-4" />
                <span className="font-medium">View</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Recent Articles</h2>
          <Link
            to="/admin/articles"
            className="text-accent hover:text-accent-dark font-medium transition-quick"
          >
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-sage-light overflow-hidden">
          <table className="w-full">
            <thead className="bg-sage-light/50 border-b border-sage-light">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-primary">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-primary">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-primary">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-primary">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentArticles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-sage-light last:border-0 hover:bg-sage-light/30 transition-quick"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary line-clamp-1">
                      {article.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex bg-sage-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary">
                      {article.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {article.featured ? (
                      <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-sm text-secondary">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/articles/edit/${article.id}`}
                        className="p-2 hover:bg-sage-light rounded-lg transition-quick"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Link>
                      <Link
                        to={`/news/${article.id}`}
                        className="p-2 hover:bg-sage-light rounded-lg transition-quick"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stats.recentArticles.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-sage-medium mx-auto mb-4" />
              <p className="text-secondary">No articles yet</p>
              <Link
                to="/admin/articles/new"
                className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent-dark font-medium transition-quick"
              >
                <Plus className="w-4 h-4" />
                Create your first article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
