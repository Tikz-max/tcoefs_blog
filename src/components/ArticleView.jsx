import {
  ArrowLeft,
  Clock,
  User,
  Phone,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { admin } from "../lib/supabase";
import { useState, useEffect } from "react";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  // Toggle dark mode and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Load article from database
  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      // Get article by ID
      const { data: articleData } = await admin.getArticleById(id);

      if (!articleData) {
        // Article not found, redirect to homepage
        navigate("/");
        return;
      }

      setArticle(articleData);

      // Get related articles (excluding current)
      const { data: allArticles } = await admin.getAllArticles(1, 100);
      const related = (allArticles || [])
        .filter((post) => post.id !== id)
        .slice(0, 4);
      setRelatedBlogs(related);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error loading article:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-primary text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-0 right-0 z-40 px-6 md:px-12 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed] hover:bg-sage-light transition-all duration-[180ms]"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>

        {/* Right Pill - Icon Buttons */}
        <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-3 shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed]">
          <div className="flex items-center gap-2">
            <UserMenu onOpenAuth={() => setAuthModalOpen(true)} />
            <a
              href="https://www.tcoefs-unijos.org/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms]"
              aria-label="Contact"
            >
              <Phone size={16} />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms]"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12 pt-[9.2rem] md:pt-24 pb-8">
        {/* Category and Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider font-medium text-secondary">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.read_time}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-primary mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg md:text-xl leading-relaxed text-secondary mb-8">
          {article.excerpt}
        </p>
      </div>

      {/* Featured Image */}
      {article.card_image_url && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={article.card_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <main className="max-w-[800px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <article className="prose prose-lg max-w-none">
          {article.content ? (
            <div
              className="article-content text-[19px] leading-[32px] text-text space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="space-y-6">
              <p className="text-[19px] leading-[32px] text-text">
                {article.excerpt}
              </p>
              <p className="text-[19px] leading-[32px] text-text">
                This is a placeholder for the full article content. The complete
                article will be displayed here once the content is fully
                migrated.
              </p>
            </div>
          )}
        </article>

        {/* Additional Images */}
        {article.images && article.images.length > 1 && (
          <div className="mt-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.images.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="w-full aspect-[4/3] overflow-hidden rounded-lg"
                >
                  <img
                    src={img}
                    alt={`${article.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-[220ms]"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Actions - Like, Comment, Share */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-8 border-t border-[#d9e8e0]">
          <LikeButton postId={article.id} showCount={true} size="default" />
          <ShareButton
            postId={article.id}
            title={article.title}
            excerpt={article.excerpt}
            size="default"
          />
        </div>
      </main>

      {/* Comments Section */}
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
        <CommentSection postId={article.id} />
      </div>

      {/* Related Blogs Section */}
      <section className="bg-white py-24 md:py-32 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl md:text-5xl font-normal text-primary">
              Related Blogs.
            </h2>
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const blogsSection = document.getElementById("blogs-section");
                  if (blogsSection) {
                    blogsSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }, 100);
              }}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-all duration-[180ms] text-sm font-medium"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/news/${blog.id}`}
                className="block group cursor-pointer bg-background rounded-lg overflow-hidden border border-[#d9e8e0] hover:shadow-lg hover:-translate-y-1 transition-all duration-[220ms]"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] overflow-hidden bg-sage-light">
                  <img
                    src={blog.card_image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[220ms]"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider font-medium text-secondary">
                      {blog.category}
                    </span>
                    <span className="text-xs text-secondary">—</span>
                    <span className="text-xs text-secondary">{blog.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-primary mb-3 group-hover:text-accent transition-colors duration-[180ms] line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Read Time */}
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Clock size={14} />
                    <span>{blog.read_time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Left - Brand & Description */}
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-bold text-white mb-4">TCoEFS</h3>
              <p className="text-[15px] leading-[24px] text-white/80 mb-6">
                Advancing food security through innovative research, strategic
                partnerships, and sustainable agricultural solutions for a
                resilient Africa.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Twitter"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>

              {/* Back to Top Button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-8 flex items-center gap-2 text-white/80 hover:text-white transition-all duration-[180ms] text-sm"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                BACK TO TOP
              </button>
            </div>

            {/* Spacer for 3-column layout */}
            <div className="hidden lg:block"></div>

            {/* Right - Newsletter */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-3">
                  Subscribe to Our Newsletter
                </h4>
                <p className="text-sm text-white/80 mb-6">
                  Stay updated with the latest research findings, training
                  opportunities, and agricultural innovations from TCoEFS.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-all duration-[180ms]"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-white text-primary font-medium rounded-lg hover:bg-white/90 transition-all duration-[180ms]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © 2025 TETFund Centre of Excellence in Food Security. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-all duration-[180ms]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-all duration-[180ms]"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default ArticleView;
