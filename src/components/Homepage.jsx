import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  Phone,
  Moon,
  Sun,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoveDown,
  Loader2,
} from "lucide-react";
import { admin } from "../lib/supabase";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";
import CardSocialActions from "./CardSocialActions";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Load articles from database
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Get all articles
      const { data: articles } = await admin.getAllArticles(1, 100);
      setAllPosts(articles || []);

      // Get featured article
      const { data: featured } = await admin.getFeaturedArticle();
      setFeaturedPost(featured);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search term and category (excluding featured post)
  const filteredPosts = allPosts.filter((post) => {
    // Exclude featured post from the grid
    if (featuredPost && post.id === featuredPost.id) {
      return false;
    }

    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Get current page posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const recentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Reset to page 1 when search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Toggle category filter
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if clicking same category
    } else {
      setSelectedCategory(category);
    }
    setCurrentPage(1);
  };

  // Available categories
  const categories = ["News", "Training", "Research", "Partnership"];

  // Clear search text only
  const clearSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm("");
  };

  // Handle scroll for arrow visibility
  const handleScroll = () => {
    const blogsSection = document.getElementById("blogs-section");
    if (blogsSection) {
      const blogsSectionTop = blogsSection.getBoundingClientRect().top;
      setShowScrollArrow(blogsSectionTop > window.innerHeight);
    }
  };

  // Scroll to blogs section
  const scrollToBlogs = () => {
    const blogsSection = document.getElementById("blogs-section");
    if (blogsSection) {
      blogsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Add scroll listener
  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to Blogs section
    const blogsSection = document.getElementById("blogs-section");
    if (blogsSection) {
      blogsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Show loading state while fetching articles
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-primary text-lg">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background hide-scrollbar overflow-y-auto">
      {/* Navigation - Floating Pills */}
      <nav
        className={`sticky z-40 flex flex-col items-center gap-3 px-3 sm:px-6 transition-all duration-300 ${searchTerm || selectedCategory ? "top-8 md:top-12" : "top-4"}`}
      >
        {/* Center Pill - TcoEFS + Search */}
        <div className="bg-white/90 backdrop-blur-md rounded-full px-3 sm:px-6 py-3 shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed]">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                TcoEFS
              </h1>
            </div>

            {/* Search Pill */}
            <div
              className={`flex items-center gap-2 px-4 py-2 bg-[#f8fbf9] rounded-full shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 ${searchFocused ? "w-[9.8rem] md:w-[14.7rem]" : "w-[7rem] md:w-[10.5rem]"}`}
            >
              <Search size={16} className="text-primary/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-sm text-primary placeholder:text-primary/50 w-full"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  onMouseDown={(e) => e.preventDefault()}
                  className="text-primary/60 hover:text-primary transition-colors duration-[180ms] flex-shrink-0"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Tags - Below the pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-[180ms] ${
                selectedCategory === category
                  ? "bg-accent text-white shadow-[0_2px_8px_rgba(49,104,64,0.15)] hover:bg-accent-dark"
                  : "bg-sage-light/60 border border-sage-light text-secondary hover:bg-sage-light hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-2 text-xs text-secondary hover:text-primary transition-colors duration-[180ms]"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Right Pill - Icon Buttons (Desktop) */}
        <div className="hidden md:block absolute top-0 right-3 sm:right-6">
          <div className="relative bg-white/90 backdrop-blur-md rounded-full px-3 py-3 shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed]">
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

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden bg-white/90 backdrop-blur-md rounded-full px-3 py-3 shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed] absolute right-3 sm:right-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Gray Background Overlay */}
            <div
              className="fixed inset-0 bg-black/40 md:hidden z-40 animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Slide-in Menu */}
            <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white md:hidden z-50 shadow-2xl animate-slide-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#d9e8e0]">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-sage-light hover:bg-sage-medium transition-all duration-[180ms]"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-6 space-y-3">
                {user ? (
                  <button
                    onClick={async () => {
                      await signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-primary hover:bg-sage-light rounded-lg transition-all duration-[180ms]"
                  >
                    <User size={18} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-primary hover:bg-sage-light rounded-lg transition-all duration-[180ms]"
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </button>
                )}
                <a
                  href="https://www.tcoefs-unijos.org/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-primary hover:bg-sage-light rounded-lg transition-all duration-[180ms]"
                >
                  <Phone size={18} />
                  <span>Contact Us</span>
                </a>
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-primary hover:bg-sage-light rounded-lg transition-all duration-[180ms]"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className={`max-w-[1200px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-24 transition-all duration-[220ms] ${searchTerm || selectedCategory ? "opacity-0 h-0 overflow-hidden pt-0 pb-0" : "opacity-100"}`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-40 lg:gap-60">
          {/* Left Side - Title */}
          <div className="flex-shrink-0">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-primary leading-[1.05] tracking-tight">
              TcoEFS Blog
            </h1>
          </div>

          {/* Right Side - Description */}
          <div className="flex-1 md:pt-4 lg:pt-6 md:max-w-xl lg:max-w-2xl">
            <p className="text-lg md:text-xl lg:text-2xl text-primary/80 leading-relaxed md:leading-relaxed lg:leading-loose">
              Official news and updates about TcoEFS, stay up-to-date and read
              on TcoEFS impacts and stories.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 pb-16">
        {/* Featured Post - Original Width */}
        <div className="max-w-[1200px] mx-auto">
          <Link
            to={`/news/${featuredPost.id}`}
            className={`block mb-12 bg-white rounded-lg border border-[#d9e8e0] overflow-hidden hover:shadow-lg transition-all duration-[220ms] cursor-pointer group ${searchTerm || selectedCategory ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"}`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Featured Image - Left Side */}
              <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto md:h-auto overflow-hidden bg-sage-light">
                <img
                  src={featuredPost.card_image_url}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[220ms]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              {/* Content - Right Side */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-xs text-secondary uppercase tracking-wider font-medium">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span>Featured</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-[38px] font-bold text-primary mb-4 group-hover:text-accent transition-all duration-[180ms] leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-[15px] md:text-[17px] leading-[26px] md:leading-[28px] text-text mb-5">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3 text-xs text-secondary">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.read_time}</span>
                  </div>
                  <CardSocialActions
                    postId={featuredPost.id}
                    onAuthRequired={() => setAuthModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Section Header */}
        <div
          id="blogs-section"
          className={`mb-8 transition-all duration-[220ms] ${searchTerm || selectedCategory ? "mt-24 md:mt-32" : "mt-48"}`}
        >
          <h2 className="text-[30px] leading-[42px] text-primary font-semibold mb-4 pb-4 border-b border-[#d9e8e0]/50">
            Blogs
          </h2>
        </div>

        {/* Search/Filter Results Info */}
        {(searchTerm || selectedCategory) && filteredPosts.length > 0 && (
          <div className="mb-6 text-sm text-secondary animate-[fadeIn_220ms_ease-out]">
            Found {filteredPosts.length} result
            {filteredPosts.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && !searchTerm && ` in ${selectedCategory}`}
            {searchTerm && selectedCategory && ` in ${selectedCategory}`}
          </div>
        )}

        {/* Recent Posts Grid */}
        {!searchTerm || recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/news/${post.id}`}
                className="block bg-white rounded-lg border border-[#d9e8e0] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-[220ms] cursor-pointer group animate-[fadeIn_220ms_ease-out]"
              >
                {/* Image at top */}
                <div className="w-full h-80 md:h-96 overflow-hidden bg-sage-light">
                  <img
                    src={post.card_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[220ms]"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Text content below */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs text-secondary uppercase tracking-wider font-medium">
                    <span>{post.category}</span>
                  </div>

                  <h3 className="text-[24px] leading-[34px] font-semibold text-primary mb-3 group-hover:text-accent transition-all duration-[180ms]">
                    {post.title}
                  </h3>

                  <p className="text-[17px] leading-[28px] text-text mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.read_time}</span>
                    </div>
                    <CardSocialActions
                      postId={post.id}
                      onAuthRequired={() => setAuthModalOpen(true)}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-[180ms] ${
                currentPage === 1
                  ? "bg-sage-light text-primary/30 cursor-not-allowed"
                  : "bg-sage-light text-primary hover:bg-accent hover:text-white"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-medium text-sm transition-all duration-[180ms] ${
                  currentPage === pageNum
                    ? "bg-primary text-white"
                    : "bg-sage-light text-primary hover:bg-accent hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-[180ms] ${
                currentPage === totalPages
                  ? "bg-sage-light text-primary/30 cursor-not-allowed"
                  : "bg-sage-light text-primary hover:bg-accent hover:text-white"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary mt-16 px-6 py-12 md:px-12 md:py-16">
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
                  href="https://www.facebook.com/share/19vqPg5CmF/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/tetfund-centre-of-excellence-in-food-security-tcoefs-university-of-jos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/tcoefs?igsh=MXQwNjlvN3AwN2JyYw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/TETFundCoEFS?t=LPdrGIpLtPrnXTVia-BPvQ&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all duration-[180ms]"
                  aria-label="Twitter/X"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

      {/* Scroll Down Arrow */}
      {showScrollArrow && !searchTerm && (
        <button
          onClick={scrollToBlogs}
          className="fixed bottom-8 right-8 z-30 text-primary hover:text-accent transition-all duration-[180ms] animate-bounce"
          aria-label="Scroll to blogs"
        >
          <MoveDown size={32} />
        </button>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Homepage;
