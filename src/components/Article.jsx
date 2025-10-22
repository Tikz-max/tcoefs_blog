import { useState } from "react";
import {
  Menu,
  X,
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Heart,
  Bookmark,
  Search,
  Phone,
  Moon,
  Sun,
} from "lucide-react";

const Article = ({ article, onBack }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Use provided article data or fallback to sample
  const articleData = article || {
    title: "The Art of Organic Minimalism in Digital Design",
    excerpt:
      "Exploring how nature-inspired design principles can create warm, inviting digital spaces that prioritize content and reduce cognitive load",
    date: "October 18, 2024",
    readTime: "8 min read",
    category: "Design Philosophy",
    image: "/blog-images/placeholder.png",
    content: [
      {
        type: "lead",
        text: "In the creation of digital experiences, we often find ourselves caught between two extremes: the cold sterility of pure minimalism and the overwhelming chaos of maximalist design. But what if there was a third way?",
      },
      {
        type: "paragraph",
        text: "A path that embraces simplicity while maintaining warmth, that prioritizes clarity without sacrificing humanity? This is where organic minimalism enters the conversation. It's a design philosophy that draws inspiration from nature itself—where every element has purpose, where complexity emerges from simple rules, and where beauty is found not in decoration but in the essential.",
      },
      {
        type: "heading",
        text: "The Psychology of Natural Design",
      },
      {
        type: "paragraph",
        text: "When we look at a forest, we don't see chaos. We see patterns, rhythms, and a sense of order that emerges organically. Trees space themselves naturally, light filters through leaves in predictable ways, and paths form where they're most needed. This isn't design in the traditional sense—it's the result of countless small optimizations over time.",
      },
      {
        type: "paragraph",
        text: "Digital design can learn from this. Instead of imposing rigid grids and arbitrary rules, organic minimalism asks: what would this interface look like if it grew naturally, responding to the needs of its users and the flow of their attention?",
      },
      {
        type: "pullquote",
        text: "Nature does not hurry, yet everything is accomplished.",
        attribution: "Ancient Wisdom",
      },
      {
        type: "heading",
        text: "Color as Atmosphere",
      },
      {
        type: "paragraph",
        text: "Consider the color palette of a healthy forest. It's predominantly green, yes, but within that constraint exists infinite variation. Deep forest shadows, bright new growth, the sage tones of weathered bark—all working together to create an environment that feels both unified and alive.",
      },
      {
        type: "paragraph",
        text: "When we apply this thinking to digital design, we discover that limiting our palette doesn't limit our expression. Instead, it focuses it. A monochromatic green scheme, ranging from nearly-white to nearly-black, creates visual harmony that lets content breathe while maintaining the warmth that pure grayscale can never achieve.",
      },
      {
        type: "heading",
        text: "Typography and Natural Rhythm",
      },
      {
        type: "paragraph",
        text: "Just as trees grow in proportion to their environment, typography should scale naturally. Large headings announce major ideas like towering oaks marking the landscape. Body text flows like undergrowth—dense enough to create substance, spaced enough to allow movement and breath.",
      },
      {
        type: "paragraph",
        text: "The key is in the spacing. In nature, nothing touches unnecessarily. There's always room for air, for light, for the eye to rest. Generous line-height in body text, substantial margins around headings, whitespace that isn't empty but full of potential—these create the rhythm that makes long-form reading not just possible but pleasurable.",
      },
      {
        type: "heading",
        text: "Embracing Imperfection",
      },
      {
        type: "paragraph",
        text: "Here's where organic minimalism diverges most dramatically from its cold, modernist cousin: it embraces subtle imperfection. Not sloppiness—never that—but the kind of gentle irregularity that makes natural things feel alive.",
      },
      {
        type: "paragraph",
        text: "This might mean slightly softened corners on buttons, or transitions that ease out like leaves settling after a breeze. It's in choosing a font with character over one that's merely geometric, or in allowing hover states to feel responsive rather than mechanical.",
      },
      {
        type: "pullquote",
        text: "The goal isn't to make digital interfaces look natural—it's to make them feel natural.",
        attribution: null,
      },
      {
        type: "heading",
        text: "The Practice of Restraint",
      },
      {
        type: "paragraph",
        text: "Perhaps the hardest lesson nature teaches us is when to stop. A tree doesn't grow leaves in winter. A forest doesn't try to be a meadow. Everything has its season, its place, its purpose.",
      },
      {
        type: "paragraph",
        text: "In design terms, this means having the courage to remove rather than add. Every interface element should justify its existence. Does this button need to be here? Could this information be presented more simply? Is this decoration serving the user or just the designer's ego?",
      },
      {
        type: "paragraph",
        text: "Organic minimalism isn't about achieving some perfect, final state. It's about continuous refinement, always asking what serves the content and the reader, always willing to let go of what doesn't.",
      },
      {
        type: "paragraph",
        text: "When we design with these principles—drawing from nature's wisdom about proportion, rhythm, and restraint—we create digital spaces that don't exhaust their inhabitants but energize them. Spaces where reading is a pleasure, where navigation is intuitive, where the interface disappears and only the ideas remain.",
      },
      {
        type: "paragraph",
        text: "That's the promise of organic minimalism: design that serves humanity by learning from the natural world that shaped us.",
      },
    ],
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Understanding Color Psychology",
      category: "Color Theory",
    },
    {
      id: 3,
      title: "Typography That Speaks",
      category: "Typography",
    },
    {
      id: 4,
      title: "Whitespace as Design Element",
      category: "Layout",
    },
  ];

  const renderContent = (block, index) => {
    switch (block.type) {
      case "lead":
        return (
          <p
            key={index}
            className="text-[22px] leading-[38px] text-primary font-medium mb-8"
          >
            {block.text}
          </p>
        );
      case "paragraph":
        return (
          <p key={index} className="text-[19px] leading-[32px] text-text mb-7">
            {block.text}
          </p>
        );
      case "heading":
        return (
          <h2
            key={index}
            className="text-[32px] leading-[44px] font-bold text-primary mt-16 mb-6"
          >
            {block.text}
          </h2>
        );
      case "pullquote":
        return (
          <div
            key={index}
            className={`my-16 ${isMobile ? "mx-0" : "-mx-16"} py-12 px-12 bg-[#d9e8e0] rounded-lg`}
          >
            <blockquote className="text-[28px] leading-[42px] font-semibold text-primary text-center">
              "{block.text}"
            </blockquote>
            {block.attribution && (
              <p className="text-center text-base text-secondary mt-4">
                — {block.attribution}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen bg-background hide-scrollbar overflow-y-auto ${isMobile ? "max-w-[428px] mx-auto" : ""}`}
    >
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-[#d9e8e0]">
        <button
          onClick={() => setIsMobile(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-[180ms] ${
            !isMobile
              ? "bg-accent text-white"
              : "bg-transparent text-secondary hover:bg-[#d9e8e0]"
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setIsMobile(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-[180ms] ${
            isMobile
              ? "bg-accent text-white"
              : "bg-transparent text-secondary hover:bg-[#d9e8e0]"
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm border-b border-[#d9e8e0]">
        <div
          className={`max-w-[1200px] mx-auto ${isMobile ? "px-6" : "px-12"}`}
        >
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-accent hover:text-[#254a30] transition-all duration-[180ms]"
              >
                <ArrowLeft size={20} />
              </a>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                TcoEFS
              </h1>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
                >
                  Articles
                </a>
                <a
                  href="#"
                  className="px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
                >
                  About
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
              <a
                href="#"
                className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
              >
                Articles
              </a>
              <a
                href="#"
                className="block px-4 py-2.5 text-base font-medium text-primary hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]"
              >
                About
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className={`bg-white border-b border-[#d9e8e0] ${isMobile ? "px-6 py-12" : "px-12 py-20"}`}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Category */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 text-sm font-medium text-accent bg-[#d9e8e0] rounded-md uppercase tracking-wider">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1
            className={`${isMobile ? "text-4xl" : "text-5xl"} leading-tight font-bold text-primary mb-6`}
          >
            {article.title}
          </h1>

          {/* Subtitle */}
          <p
            className={`${isMobile ? "text-lg" : "text-xl"} leading-relaxed text-secondary mb-10`}
          >
            {article.subtitle}
          </p>

          {/* Meta & Actions */}
          <div
            className={`flex ${isMobile ? "flex-col gap-6" : "items-center justify-between"} pt-8 border-t border-[#d9e8e0]`}
          >
            {/* Author & Date */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#d9e8e0] flex items-center justify-center">
                  <User size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-base font-semibold text-primary">
                    {article.author}
                  </p>
                  <p className="text-sm text-secondary">{article.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{article.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                <button className="p-2.5 text-secondary hover:text-accent hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  <Heart size={20} />
                </button>
                <button className="p-2.5 text-secondary hover:text-accent hover:bg-[#d9e8e0] rounded-md transition-all duration-[180ms]">
                  <Bookmark size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image Placeholder */}
      <div
        className={`${isMobile ? "px-6 py-8" : "px-12 py-12"} bg-background`}
      >
        <div className="max-w-[1000px] mx-auto">
          <div className="w-full aspect-[16/9] bg-sage-light rounded-lg flex items-center justify-center border border-[#d9e8e0]">
            <span className="text-secondary text-sm">Featured Image</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main
        className={`max-w-[800px] mx-auto ${isMobile ? "px-6 py-10" : "px-12 py-16"}`}
      >
        <article className="prose prose-lg max-w-none">
          {article.content.map((block, index) => renderContent(block, index))}
        </article>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-[#d9e8e0]">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 text-sm text-secondary bg-white border border-[#d9e8e0] rounded-md hover:border-accent hover:text-accent transition-all duration-[180ms] cursor-pointer">
              Design
            </span>
            <span className="px-4 py-2 text-sm text-secondary bg-white border border-[#d9e8e0] rounded-md hover:border-accent hover:text-accent transition-all duration-[180ms] cursor-pointer">
              Minimalism
            </span>
            <span className="px-4 py-2 text-sm text-secondary bg-white border border-[#d9e8e0] rounded-md hover:border-accent hover:text-accent transition-all duration-[180ms] cursor-pointer">
              UX
            </span>
            <span className="px-4 py-2 text-sm text-secondary bg-white border border-[#d9e8e0] rounded-md hover:border-accent hover:text-accent transition-all duration-[180ms] cursor-pointer">
              Nature
            </span>
          </div>
        </div>

        {/* Author Section */}
        <div className="mt-16 p-8 bg-white rounded-lg border border-[#d9e8e0]">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-[#d9e8e0] flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {article.author}
              </h3>
              <p className="text-sm font-medium text-accent mb-3">
                {article.authorRole}
              </p>
              <p className="text-[15px] leading-[24px] text-secondary mb-4">
                {article.authorBio}
              </p>
              <button className="text-sm font-medium text-accent hover:text-[#254a30] transition-all duration-[180ms]">
                Follow →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <div
        className={`bg-white border-t border-[#d9e8e0] ${isMobile ? "px-6 py-12" : "px-12 py-16"}`}
      >
        <div className="max-w-[1200px] mx-auto">
          <h3 className="text-[30px] font-bold text-primary mb-8">
            Continue Reading
          </h3>
          <div
            className={`grid ${isMobile ? "grid-cols-1 gap-6" : "grid-cols-3 gap-8"}`}
          >
            {relatedArticles.map((related) => (
              <a key={related.id} href="#" className="group">
                <div className="w-full aspect-[4/3] bg-sage-light rounded-lg mb-4 border border-[#d9e8e0] flex items-center justify-center group-hover:border-accent transition-all duration-[220ms]">
                  <span className="text-secondary text-sm">Image</span>
                </div>
                <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2 block">
                  {related.category}
                </span>
                <h4 className="text-xl font-semibold text-primary group-hover:text-accent transition-all duration-[180ms]">
                  {related.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`bg-background border-t border-[#d9e8e0] ${isMobile ? "px-6 py-8" : "px-12 py-12"}`}
      >
        <div className="max-w-[1200px] mx-auto">
          <div
            className={`${isMobile ? "flex-col gap-6" : "flex justify-between items-center"}`}
          >
            <div className={isMobile ? "mb-6" : ""}>
              <h3 className="text-xl font-bold text-primary mb-2">
                TcoEFS Blog
              </h3>
              <p className="text-[15px] leading-[24px] text-secondary">
                Exploring digital design through the lens of nature
              </p>
            </div>

            <div className={`flex ${isMobile ? "flex-col gap-3" : "gap-6"}`}>
              <a
                href="#"
                className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-[15px] text-accent hover:text-[#254a30] transition-all duration-[180ms]"
              >
                RSS Feed
              </a>
            </div>
          </div>

          <div
            className={`${isMobile ? "mt-6" : "mt-8"} pt-6 border-t border-[#d9e8e0] text-center text-xs text-secondary`}
          >
            <p>© 2024 TcoEFS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Article;
