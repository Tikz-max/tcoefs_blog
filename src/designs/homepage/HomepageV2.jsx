import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const HomepageV2 = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample blog data
  const allPosts = [
    {
      id: 1,
      title: "The Art of Organic Minimalism in Digital Design",
      excerpt: "Exploring how nature-inspired design principles can create warm, inviting digital spaces that prioritize content and reduce cognitive load. This approach embraces simplicity while maintaining warmth.",
      author: "Sarah Chen",
      date: "Oct 18, 2024",
      readTime: "8 min read",
      category: "Design Philosophy"
    },
    {
      id: 2,
      title: "Understanding Color Psychology in Web Design",
      excerpt: "How green hues create calming environments perfect for sustained reading and deep engagement with content. The psychology behind nature-inspired palettes.",
      author: "Michael Torres",
      date: "Oct 15, 2024",
      readTime: "6 min read",
      category: "Color Theory"
    },
    {
      id: 3,
      title: "Typography That Speaks: Choosing Fonts with Personality",
      excerpt: "The delicate balance between distinctive character and professional readability in modern web typography. Why font choice matters more than you think.",
      author: "Emma Williams",
      date: "Oct 12, 2024",
      readTime: "7 min read",
      category: "Typography"
    },
    {
      id: 4,
      title: "Whitespace: The Unsung Hero of Great Design",
      excerpt: "Why generous spacing isn't empty space—it's an active design element that gives content room to breathe and creates natural rhythm in reading.",
      author: "David Kim",
      date: "Oct 10, 2024",
      readTime: "5 min read",
      category: "Layout"
    },
    {
      id: 5,
      title: "Creating Accessible Reading Experiences",
      excerpt: "Designing for everyone: how contrast ratios and keyboard navigation improve usability for all users. Accessibility as a fundamental design principle.",
      author: "Rachel Green",
      date: "Oct 8, 2024",
      readTime: "9 min read",
      category: "Accessibility"
    },
    {
      id: 6,
      title: "The Philosophy of Content-First Design",
      excerpt: "When design becomes invisible, content shines. Exploring minimalism that serves the written word without competing for attention.",
      author: "James Wilson",
      date: "Oct 5, 2024",
      readTime: "6 min read",
      category: "Philosophy"
    },
    {
      id: 7,
      title: "Natural Motion: Animation in Organic Design",
      excerpt: "How subtle, physics-based transitions create smooth experiences that feel alive rather than mechanical. Motion as a design language.",
      author: "Lisa Park",
      date: "Oct 3, 2024",
      readTime: "7 min read",
      category: "Animation"
    },
    {
      id: 8,
      title: "Building Trust Through Consistent Design Systems",
      excerpt: "Why visual patterns and predictable interactions reduce cognitive load and allow readers to focus on what truly matters: the ideas.",
      author: "Alex Martinez",
      date: "Oct 1, 2024",
      readTime: "8 min read",
      category: "Design Systems"
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
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className={`max-w-article mx-auto ${isMobile ? 'px-24' : 'px-48'} py-0`}>
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
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
                  Home
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
                  Articles
                </a>
                <a href="#" className="px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
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
            <div className="pb-16 space-y-2 border-t border-border-light pt-8">
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
                Home
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
                Articles
              </a>
              <a href="#" className="block px-16 py-10 text-base font-medium text-primary hover:text-accent transition-quick">
                About
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-article mx-auto ${isMobile ? 'px-24 py-40' : 'px-48 py-64'}`}>
        {/* Header */}
        <div className="mb-64">
          <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-primary mb-20 leading-tight`}>
            Latest Thoughts
          </h2>
          <p className="text-body-text text-secondary leading-relaxed max-w-2xl">
            Essays on design, typography, and the intersection of nature with digital spaces
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-48">
          {allPosts.map((post, index) => (
            <article
              key={post.id}
              className="group cursor-pointer"
            >
              {/* Divider for all but first */}
              {index > 0 && (
                <div className="h-px bg-border-light mb-48" />
              )}

              {/* Category */}
              <div className="mb-16">
                <span className="text-metadata text-accent uppercase tracking-wider font-medium">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3 className={`${isMobile ? 'text-3xl' : 'text-article-h2'} font-bold text-primary mb-20 group-hover:text-accent transition-quick leading-tight`}>
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-body-text text-text mb-24 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className={`flex ${isMobile ? 'flex-col gap-8' : 'items-center gap-12'} text-small-text text-secondary`}>
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
        </div>

        {/* Load More */}
        <div className="mt-64 pt-48 border-t border-border-light">
          <button className="w-full py-16 bg-transparent border-2 border-border-medium text-primary font-medium rounded-card hover:border-accent hover:text-accent transition-smooth">
            Load More Articles
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t border-border-light mt-64 ${isMobile ? 'px-24 py-40' : 'px-48 py-48'}`}>
        <div className="max-w-article mx-auto">
          <div className={`${isMobile ? 'text-center' : 'flex justify-between items-center'}`}>
            <div className={isMobile ? 'mb-24' : ''}>
              <p className="text-small-text text-secondary">
                © 2024 TcoEFS. Crafted with intention.
              </p>
            </div>

            <div className={`flex ${isMobile ? 'justify-center gap-16' : 'gap-24'}`}>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                Twitter
              </a>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                RSS
              </a>
              <a href="#" className="text-small-text text-accent hover:text-accent-dark transition-quick">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageV2;
