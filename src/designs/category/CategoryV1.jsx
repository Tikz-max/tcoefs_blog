import { useState } from 'react';
import { Menu, X, Search, Filter } from 'lucide-react';

const CategoryV1 = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Articles');

  const categories = [
    { name: 'All Articles', count: 24 },
    { name: 'Design Philosophy', count: 8 },
    { name: 'Color Theory', count: 5 },
    { name: 'Typography', count: 6 },
    { name: 'Layout', count: 3 },
    { name: 'Accessibility', count: 2 }
  ];

  const articles = [
    {
      id: 1,
      title: "The Art of Organic Minimalism in Digital Design",
      excerpt: "Exploring how nature-inspired design principles can create warm, inviting digital spaces that prioritize content and reduce cognitive load.",
      author: "Sarah Chen",
      date: "October 18, 2024",
      readTime: "8 min read",
      category: "Design Philosophy"
    },
    {
      id: 2,
      title: "Understanding Color Psychology in Web Design",
      excerpt: "How green hues create calming environments perfect for sustained reading and deep engagement with content.",
      author: "Michael Torres",
      date: "October 15, 2024",
      readTime: "6 min read",
      category: "Color Theory"
    },
    {
      id: 3,
      title: "Typography That Speaks: Choosing Fonts with Personality",
      excerpt: "The delicate balance between distinctive character and professional readability in modern web typography.",
      author: "Emma Williams",
      date: "October 12, 2024",
      readTime: "7 min read",
      category: "Typography"
    },
    {
      id: 4,
      title: "Whitespace: The Unsung Hero of Great Design",
      excerpt: "Why generous spacing isn't empty space—it's an active design element that gives content room to breathe.",
      author: "David Kim",
      date: "October 10, 2024",
      readTime: "5 min read",
      category: "Layout"
    },
    {
      id: 5,
      title: "Creating Accessible Reading Experiences",
      excerpt: "Designing for everyone: how contrast ratios and keyboard navigation improve usability for all users.",
      author: "Rachel Green",
      date: "October 8, 2024",
      readTime: "9 min read",
      category: "Accessibility"
    },
    {
      id: 6,
      title: "The Philosophy of Content-First Design",
      excerpt: "When design becomes invisible, content shines. Exploring minimalism that serves the written word.",
      author: "James Wilson",
      date: "October 5, 2024",
      readTime: "6 min read",
      category: "Design Philosophy"
    },
    {
      id: 7,
      title: "Natural Motion: Animation in Organic Design",
      excerpt: "How subtle, physics-based transitions create smooth experiences that feel alive rather than mechanical.",
      author: "Lisa Park",
      date: "October 3, 2024",
      readTime: "7 min read",
      category: "Design Philosophy"
    },
    {
      id: 8,
      title: "Building Trust Through Consistent Design Systems",
      excerpt: "Why visual patterns and predictable interactions reduce cognitive load and allow readers to focus on what truly matters.",
      author: "Alex Martinez",
      date: "October 1, 2024",
      readTime: "8 min read",
      category: "Design Philosophy"
    },
    {
      id: 9,
      title: "The Science of Readable Typography",
      excerpt: "Exploring line length, font size, and spacing decisions that make digital reading effortless.",
      author: "Emma Williams",
      date: "September 28, 2024",
      readTime: "6 min read",
      category: "Typography"
    }
  ];

  return (
    <div className={`min-h-screen bg-background hide-scrollbar overflow-y-auto ${isMobile ? 'max-w-[428px] mx-auto' : ''}`}>
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-[#d9e8e0]">
        <button
          onClick={() => setIsMobile(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-[180ms] ${
            !isMobile
              ? 'bg-accent text-white'
              : 'bg-transparent text-secondary hover:bg-[#d9e8e0]'
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setIsMobile(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-[180ms] ${
            isMobile
              ? 'bg-accent text-white'
              : 'bg-transparent text-secondary hover:bg-[#d9e8e0]'
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm border-b border-[#d9e8e0]">
        <div className={`max-w-[1200px] mx-auto ${isMobile ? 'px-6' : 'px-12'}`}>
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                TcoEFS
              </h1>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <a href="#" className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  Home
                </a>
                <a href="#" className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  Articles
                </a>
                <a href="#" className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  About
                </a>
                <a href="#" className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  Contact
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div className="pb-4 space-y-2">
              <a href="#" className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                Home
              </a>
              <a href="#" className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                Articles
              </a>
              <a href="#" className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                About
              </a>
              <a href="#" className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Header Section */}
      <div className={`bg-white border-b border-[#d9e8e0] ${isMobile ? 'px-6 py-10' : 'px-12 py-16'}`}>
        <div className="max-w-[1200px] mx-auto">
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-primary mb-4`}>
            All Articles
          </h1>
          <p className="text-xl text-secondary">
            Exploring design, typography, and the art of digital craft
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-[1200px] mx-auto ${isMobile ? 'px-6 py-8' : 'px-12 py-12'}`}>
        <div className={`${isMobile ? '' : 'grid grid-cols-[280px_1fr] gap-12'}`}>
          {/* Sidebar - Filters */}
          <aside className={isMobile ? 'mb-8' : ''}>
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#d9e8e0] rounded-lg text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-[180ms]"
                />
              </div>
            </div>

            {/* Categories */}
            <div className={`bg-white rounded-lg border border-[#d9e8e0] p-6 ${isMobile ? 'mb-8' : 'sticky top-24'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Filter size={18} className="text-accent" />
                <h3 className="text-base font-semibold text-primary">Categories</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-[180ms] ${
                      activeCategory === category.name
                        ? 'bg-[#d9e8e0] text-accent font-medium'
                        : 'text-secondary hover:bg-[#d9e8e0] hover:text-primary'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Articles Grid */}
          <main>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-secondary">
                Showing {articles.length} articles
              </p>
              <select className="px-4 py-2 bg-white border border-[#d9e8e0] rounded-md text-sm text-secondary focus:outline-none focus:border-accent transition-all duration-[180ms]">
                <option>Latest First</option>
                <option>Oldest First</option>
                <option>Most Popular</option>
              </select>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg border border-[#d9e8e0] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-[220ms] cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-3 text-xs text-secondary uppercase tracking-wider font-medium">
                    <span>{article.category}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-all duration-[180ms] leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-[15px] leading-[24px] text-text mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-col gap-1 text-xs text-secondary">
                    <span className="font-medium">{article.author}</span>
                    <div className="flex items-center gap-2">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white border border-[#d9e8e0] rounded-md text-sm text-secondary hover:border-accent hover:text-accent transition-all duration-[180ms]">
                  Previous
                </button>
                <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium">
                  1
                </button>
                <button className="px-4 py-2 bg-white border border-[#d9e8e0] rounded-md text-sm text-secondary hover:border-accent hover:text-accent transition-all duration-[180ms]">
                  2
                </button>
                <button className="px-4 py-2 bg-white border border-[#d9e8e0] rounded-md text-sm text-secondary hover:border-accent hover:text-accent transition-all duration-[180ms]">
                  3
                </button>
                <button className="px-4 py-2 bg-white border border-[#d9e8e0] rounded-md text-sm text-secondary hover:border-accent hover:text-accent transition-all duration-[180ms]">
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className={`bg-white border-t border-[#d9e8e0] mt-16 ${isMobile ? 'px-6 py-8' : 'px-12 py-12'}`}>
        <div className="max-w-[1200px] mx-auto">
          <div className={`${isMobile ? 'flex-col gap-6' : 'flex justify-between items-center'}`}>
            <div className={isMobile ? 'mb-6' : ''}>
              <h3 className="text-xl font-bold text-primary mb-2">TcoEFS Blog</h3>
              <p className="text-[15px] leading-[24px] text-secondary">
                Exploring digital design through the lens of nature
              </p>
            </div>

            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-6'}`}>
              <a href="#" className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]">
                Privacy Policy
              </a>
              <a href="#" className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]">
                Terms of Service
              </a>
              <a href="#" className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]">
                RSS Feed
              </a>
            </div>
          </div>

          <div className={`${isMobile ? 'mt-6' : 'mt-8'} pt-6 border-t border-[#d9e8e0] text-center text-xs text-secondary`}>
            <p>© 2024 TcoEFS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryV1;
