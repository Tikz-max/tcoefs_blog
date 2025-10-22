import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const HomepageV3 = () => {
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

  const editorsPicks = [
    {
      id: 2,
      title: "Understanding Color Psychology in Web Design",
      excerpt: "How green hues create calming environments perfect for sustained reading.",
      author: "Michael Torres",
      date: "Oct 15, 2024",
      readTime: "6 min read",
      category: "Color Theory"
    },
    {
      id: 3,
      title: "Typography That Speaks: Choosing Fonts with Personality",
      excerpt: "The delicate balance between distinctive character and professional readability.",
      author: "Emma Williams",
      date: "Oct 12, 2024",
      readTime: "7 min read",
      category: "Typography"
    }
  ];

  const recentArticles = [
    {
      id: 4,
      title: "Whitespace: The Unsung Hero of Great Design",
      author: "David Kim",
      date: "Oct 10, 2024",
      readTime: "5 min read"
    },
    {
      id: 5,
      title: "Creating Accessible Reading Experiences",
      author: "Rachel Green",
      date: "Oct 8, 2024",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "The Philosophy of Content-First Design",
      author: "James Wilson",
      date: "Oct 5, 2024",
      readTime: "6 min read"
    },
    {
      id: 7,
      title: "Natural Motion: Animation in Organic Design",
      author: "Lisa Park",
      date: "Oct 3, 2024",
      readTime: "7 min read"
    },
    {
      id: 8,
      title: "Building Trust Through Consistent Design",
      author: "Alex Martinez",
      date: "Oct 1, 2024",
      readTime: "8 min read"
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
                  Featured
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  Categories
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                  About
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
                Featured
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                Categories
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:bg-sage-light rounded-subtle transition-quick">
                About
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-container mx-auto ${isMobile ? 'px-24 py-32' : 'px-48 py-64'}`}>
        {/* Hero Section */}
        <div className={`${isMobile ? 'flex-col' : 'grid grid-cols-2 gap-48'} mb-64`}>
          {/* Featured Post */}
          <article className={`${isMobile ? 'mb-32' : ''} cursor-pointer group`}>
            {/* Image Placeholder */}
            <div className="w-full aspect-[4/3] bg-sage-light rounded-card mb-24 flex items-center justify-center border border-border-light group-hover:border-accent transition-smooth">
              <span className="text-secondary text-sm">Featured Image</span>
            </div>

            <div className="flex items-center gap-8 mb-16 text-metadata text-accent uppercase">
              <span>{featuredPost.category}</span>
              <span>•</span>
              <span>Featured</span>
            </div>

            <h2 className={`${isMobile ? 'text-3xl' : 'text-article-h1'} font-bold text-primary mb-20 group-hover:text-accent transition-quick leading-tight`}>
              {featuredPost.title}
            </h2>

            <p className="text-body-text text-text mb-20 leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className="flex items-center gap-12 text-small-text text-secondary">
              <span className="font-medium">{featuredPost.author}</span>
              <span>•</span>
              <span>{featuredPost.date}</span>
              <span>•</span>
              <span>{featuredPost.readTime}</span>
            </div>
          </article>

          {/* Editor's Picks Sidebar */}
          <aside className="space-y-32">
            <div>
              <h3 className="text-xl font-bold text-primary mb-24 pb-12 border-b border-border-light">
                Editor's Picks
              </h3>
            </div>

            {editorsPicks.map((post) => (
              <article
                key={post.id}
                className="cursor-pointer group"
              >
                <div className="flex items-start gap-8 mb-12 text-metadata text-secondary uppercase">
                  <span>{post.category}</span>
                </div>

                <h4 className="text-xl font-semibold text-primary mb-12 group-hover:text-accent transition-quick leading-tight">
                  {post.title}
                </h4>

                <p className="text-small-text text-text mb-12 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-8 text-metadata text-secondary">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </aside>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-light mb-64" />

        {/* Recent Articles Section */}
        <div className={`${isMobile ? 'flex-col' : 'grid grid-cols-3 gap-48'}`}>
          {/* Left Column - Section Title */}
          <div className={isMobile ? 'mb-32' : ''}>
            <h3 className="text-article-h2 font-bold text-primary mb-16 sticky top-24">
              Recent
            </h3>
            <p className="text-small-text text-secondary leading-relaxed">
              Latest essays and explorations in design thinking
            </p>
          </div>

          {/* Right Columns - Article List */}
          <div className={`${isMobile ? '' : 'col-span-2'} space-y-28`}>
            {recentArticles.map((post, index) => (
              <article
                key={post.id}
                className="cursor-pointer group pb-28 border-b border-border-light last:border-0"
              >
                <h4 className="text-xl font-semibold text-primary mb-12 group-hover:text-accent transition-quick leading-tight">
                  {post.title}
                </h4>

                <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center gap-12'} text-small-text text-secondary`}>
                  <span className="font-medium">{post.author}</span>
                  {!isMobile && <span>•</span>}
                  <div className="flex items-center gap-8">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}

            {/* View All Button */}
            <div className="pt-20">
              <button className="w-full py-14 bg-transparent border border-border-medium text-primary font-medium rounded-card hover:border-accent hover:text-accent transition-smooth">
                View All Articles
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={`mt-64 bg-white border border-border-light rounded-card ${isMobile ? 'p-24' : 'p-48'}`}>
          <div className={`${isMobile ? 'text-center' : 'flex items-center justify-between gap-48'}`}>
            <div className={isMobile ? 'mb-24' : 'flex-1'}>
              <h3 className="text-article-h3 font-bold text-primary mb-12">
                Stay Updated
              </h3>
              <p className="text-body-text text-secondary leading-relaxed">
                Receive our latest essays on design and digital craft directly in your inbox
              </p>
            </div>

            <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
              <form className="flex gap-12">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-16 py-12 bg-background border border-border-medium rounded-card text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-smooth"
                />
                <button
                  type="submit"
                  className="px-24 py-12 bg-accent text-white font-medium rounded-card hover:bg-accent-dark transition-smooth whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-white border-t border-border-light mt-64 ${isMobile ? 'px-24 py-32' : 'px-48 py-48'}`}>
        <div className="max-w-container mx-auto">
          <div className={`${isMobile ? 'flex-col gap-32' : 'grid grid-cols-3 gap-48'} mb-32`}>
            <div>
              <h4 className="text-xl font-bold text-primary mb-16">TcoEFS</h4>
              <p className="text-small-text text-secondary leading-relaxed">
                Exploring the intersection of nature and digital design
              </p>
            </div>

            <div>
              <h5 className="text-base font-semibold text-primary mb-16">Navigate</h5>
              <div className="space-y-8">
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  Home
                </a>
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  Articles
                </a>
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  About
                </a>
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-base font-semibold text-primary mb-16">Connect</h5>
              <div className="space-y-8">
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  Twitter
                </a>
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  RSS Feed
                </a>
                <a href="#" className="block text-small-text text-secondary hover:text-accent transition-quick">
                  Email Newsletter
                </a>
              </div>
            </div>
          </div>

          <div className={`pt-24 border-t border-border-light ${isMobile ? 'text-center' : 'flex justify-between items-center'}`}>
            <p className={`text-metadata text-secondary ${isMobile ? 'mb-12' : ''}`}>
              © 2024 TcoEFS. All rights reserved.
            </p>
            <div className={`flex ${isMobile ? 'justify-center' : ''} gap-16`}>
              <a href="#" className="text-metadata text-secondary hover:text-accent transition-quick">
                Privacy
              </a>
              <a href="#" className="text-metadata text-secondary hover:text-accent transition-quick">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageV3;
