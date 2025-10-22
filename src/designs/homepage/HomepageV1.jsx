import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const HomepageV1 = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample blog data
  const featuredPost = {
    id: 1,
    title: "The Art of Organic Minimalism in Digital Design",
    excerpt: "Exploring how nature-inspired design principles can create warm, inviting digital spaces that prioritize content and reduce cognitive load.",
    author: "Sarah Chen",
    date: "Oct 18, 2024",
    readTime: "8 min read",
    category: "Design Philosophy"
  };

  const recentPosts = [
    {
      id: 2,
      title: "Understanding Color Psychology in Web Design",
      excerpt: "How green hues create calming environments perfect for sustained reading and deep engagement with content.",
      author: "Michael Torres",
      date: "Oct 15, 2024",
      readTime: "6 min read",
      category: "Color Theory"
    },
    {
      id: 3,
      title: "Typography That Speaks: Choosing Fonts with Personality",
      excerpt: "The delicate balance between distinctive character and professional readability in modern web typography.",
      author: "Emma Williams",
      date: "Oct 12, 2024",
      readTime: "7 min read",
      category: "Typography"
    },
    {
      id: 4,
      title: "Whitespace: The Unsung Hero of Great Design",
      excerpt: "Why generous spacing isn't empty space—it's an active design element that gives content room to breathe.",
      author: "David Kim",
      date: "Oct 10, 2024",
      readTime: "5 min read",
      category: "Layout"
    },
    {
      id: 5,
      title: "Creating Accessible Reading Experiences",
      excerpt: "Designing for everyone: how contrast ratios and keyboard navigation improve usability for all users.",
      author: "Rachel Green",
      date: "Oct 8, 2024",
      readTime: "9 min read",
      category: "Accessibility"
    },
    {
      id: 6,
      title: "The Philosophy of Content-First Design",
      excerpt: "When design becomes invisible, content shines. Exploring minimalism that serves the written word.",
      author: "James Wilson",
      date: "Oct 5, 2024",
      readTime: "6 min read",
      category: "Philosophy"
    },
    {
      id: 7,
      title: "Natural Motion: Animation in Organic Design",
      excerpt: "How subtle, physics-based transitions create smooth experiences that feel alive rather than mechanical.",
      author: "Lisa Park",
      date: "Oct 3, 2024",
      readTime: "7 min read",
      category: "Animation"
    }
  ];

  return (
    <div className={`min-h-screen bg-background hide-scrollbar overflow-y-auto ${isMobile ? 'max-w-[428px] mx-auto' : ''}`}>
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-card px-4 py-2 shadow-lg border border-border-light">
        <button
          onClick={() => setIsMobile(false)}
          className={`px-3 py-1 rounded transition-quick text-sm font-medium ${
            !isMobile
              ? 'bg-accent text-white'
              : 'bg-transparent text-secondary hover:bg-sage-light'
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setIsMobile(true)}
          className={`px-3 py-1 rounded transition-quick text-sm font-medium ${
            isMobile
              ? 'bg-accent text-white'
              : 'bg-transparent text-secondary hover:bg-sage-light'
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background shadow-sm">
        <div className={`max-w-container mx-auto ${isMobile ? 'px-24' : 'px-48'} py-0`}>
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
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  Home
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  Articles
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  About
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  Contact
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-primary hover:bg-sage-light rounded-subtle transition-quick"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobile && mobileMenuOpen && (
            <div className="pb-16 space-y-2">
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                Home
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                Articles
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                About
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-container mx-auto ${isMobile ? 'px-24 py-32' : 'px-48 py-64'}`}>
        {/* Featured Post */}
        <article className="mb-48 bg-white rounded-card border border-border-light p-32 hover:shadow-lg transition-smooth cursor-pointer group">
          <div className="flex items-center gap-8 mb-16 text-metadata text-secondary uppercase">
            <span>{featuredPost.category}</span>
            <span>•</span>
            <span>Featured</span>
          </div>

          <h2 className={`${isMobile ? 'text-3xl' : 'text-article-h1'} font-bold text-primary mb-20 group-hover:text-accent transition-quick leading-tight`}>
            {featuredPost.title}
          </h2>

          <p className="text-body-text text-text mb-24 leading-relaxed">
            {featuredPost.excerpt}
          </p>

          <div className="flex items-center gap-12 text-metadata text-secondary">
            <span className="font-medium">{featuredPost.author}</span>
            <span>•</span>
            <span>{featuredPost.date}</span>
            <span>•</span>
            <span>{featuredPost.readTime}</span>
          </div>
        </article>

        {/* Section Header */}
        <div className="mb-32">
          <h2 className="text-article-h2 text-primary font-semibold">Recent Articles</h2>
        </div>

        {/* Recent Posts Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-16' : 'md:grid-cols-2 lg:grid-cols-3 gap-24'}`}>
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-card border border-border-light p-24 hover:shadow-lg hover:-translate-y-1 transition-smooth cursor-pointer group"
            >
              <div className="flex items-center gap-8 mb-12 text-metadata text-secondary uppercase">
                <span>{post.category}</span>
              </div>

              <h3 className="text-article-h3 font-semibold text-primary mb-12 group-hover:text-accent transition-quick leading-tight">
                {post.title}
              </h3>

              <p className="text-body-text text-text mb-16 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-col gap-4 text-metadata text-secondary">
                <span className="font-medium">{post.author}</span>
                <div className="flex items-center gap-8">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-48 flex justify-center">
          <button className="px-28 py-12 bg-accent text-white font-medium rounded-card hover:bg-accent-dark hover:-translate-y-1 transition-smooth shadow-sm hover:shadow-md">
            Load More Articles
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-white border-t border-border-light mt-64 ${isMobile ? 'px-24 py-32' : 'px-48 py-48'}`}>
        <div className="max-w-container mx-auto">
          <div className={`${isMobile ? 'flex-col gap-24' : 'flex justify-between items-center'}`}>
            <div className={isMobile ? 'mb-24' : ''}>
              <h3 className="text-xl font-bold text-primary mb-8">TcoEFS Blog</h3>
              <p className="text-small-text text-secondary">
                Exploring digital design through the lens of nature
              </p>
            </div>

            <div className={`flex ${isMobile ? 'flex-col gap-12' : 'gap-24'}`}>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                Privacy Policy
              </a>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                Terms of Service
              </a>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                RSS Feed
              </a>
            </div>
          </div>

          <div className={`${isMobile ? 'mt-24' : 'mt-32'} pt-24 border-t border-border-light text-center text-metadata text-secondary`}>
            <p>© 2024 TcoEFS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageV1;
