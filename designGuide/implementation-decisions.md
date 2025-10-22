# Implementation Decisions

## Context for Next Agent

**Current Project Status:**
- We are building TcoEFS Blog - a nature-inspired, organic minimalist blog
- Design philosophy: Warmth, simplicity, clarity with green color palette
- Style guide: See `designGuide/styles-new.md` for complete specifications
- Technology: React + Vite + Tailwind CSS v4 + Gambarino font

**What We've Completed:**
1. ✅ Homepage with floating pill navigation (search, user, phone, theme toggle)
2. ✅ Full blog content migration (8 posts with complete HTML content and images)
3. ✅ Article view page with:
   - Back button navigation
   - Full content display with HTML rendering
   - Photo gallery support
   - Related blogs section
4. ✅ Dynamic pagination (numbered pages with arrows)
5. ✅ Real-time search functionality with smooth animations
6. ✅ Footer with social icons, newsletter subscription, and back-to-top button
7. ✅ Responsive design across all screen sizes
8. ✅ Phone icon redirects to contact page (https://www.tcoefs-unijos.org/contact)

**What's Left to Implement:**
- ⏳ **User Authentication System:**
  - Sign up / Sign in functionality
  - User account management
  - Session handling
  
- ⏳ **Social Features (Requires Authentication):**
  - **Like/Heart button on articles** - Users must be signed in to like posts
  - **Comment system** - Users must have an account to comment on articles
  - **Share functionality** - Social sharing buttons for articles
  
- ⏳ **User Profile:**
  - View liked articles
  - View comment history
  - Profile settings

**Current Status:**
- Blog is fully functional for reading articles
- Navigation and search working perfectly
- All 8 news articles migrated with full content and images
- Ready for authentication and social features implementation

**Technical Stack:**
- React + Vite
- Tailwind CSS v4
- Lucide React (icons)
- Gambarino font (custom webfont)

**File Structure:**
- `src/components/Homepage.jsx` - Main homepage with navigation, search, blog grid
- `src/components/ArticleView.jsx` - Individual article page
- `src/data/blogPosts.js` - All blog data with full HTML content
- `public/blog-images/` - All migrated blog images organized by post
- `designGuide/styles-new.md` - Complete style guide

**Next Steps for Authentication:**
1. Set up backend API or use service like Firebase/Supabase
2. Create authentication components (Login, Signup, UserProfile)
3. Implement protected routes for authenticated features
4. Add like/heart button to ArticleView (only visible when logged in)
5. Add comment section to ArticleView (only accessible when logged in)
6. Add share buttons to ArticleView
7. Store user interactions (likes, comments) in database
8. Display user's liked articles and comments in profile

**Important Design Notes:**
- Maintain organic minimalism with green color palette throughout
- All animations use 180ms (quick) or 220ms (standard) timing
- Floating pill navigation with depth effects (shadows)
- Search expands on focus, nav pill moves down when searching
- Cards have hover effects (lift and shadow)
- Footer uses dark green background (#1e2a1a) with white text
- Related blogs section uses white background with sage cards
- Responsive design is critical - works on mobile, tablet, desktop

**Color Palette:**
- Background: #f2f8f5 (sage)
- Text: #0e1d07 (forest)
- Primary: #1e2a1a (dark green)
- Accent: #316840 (living green)
- Borders: #d9e8e0 (light sage)

---

## Overview

This document outlines the specific design variations chosen for the TcoEFS Blog and how they align with our core design philosophy of organic minimalism, warmth, simplicity, and clarity.

---

## Selected Variations

### Homepage: V1 - Classic Magazine Layout ✓

**Why This Choice:**
- Prioritizes content hierarchy with a clear featured post
- Grid layout creates natural scanning patterns (like clearings in a forest)
- Balances information density with breathing room
- Professional yet approachable
- Easy to scan while maintaining engagement

**Alignment with Style Guide:**
- **Warmth:** Cards with soft borders and gentle hover effects create approachable feel
- **Simplicity:** Clean 3-column grid (responsive to 2-col, 1-col) avoids visual chaos
- **Clarity:** Clear distinction between featured and recent content
- **Organic Spacing:** Consistent 24px gaps between cards, generous padding (48px desktop, 24px mobile)
- **Color Usage:** White cards on sage background with light sage borders maintain ecosystem
- **Typography:** Clear hierarchy with featured post using larger text (38px) vs recent posts (24px)

**Key Characteristics:**
- Featured post receives visual priority (larger card, more excerpt text)
- Grid creates natural rhythm and predictable structure
- Hover states (-translate-y-1, shadow elevation) feel organic, not mechanical
- Desktop: 3-column → Tablet: 2-column → Mobile: 1-column (natural flow)

---

### Article Page: V3 - Immersive Editorial ✓

**Why This Choice:**
- Creates sanctuary for deep reading with hero section establishing context
- Pull quotes as visual "breathing moments" break up long text
- Featured image space honors visual storytelling
- Author card emphasizes human connection
- Related articles with images encourage continued exploration

**Alignment with Style Guide:**
- **Content is Sacred:** Max-width 800px article body for optimal line length
- **Warmth:** Author avatar placeholders, "Follow" button, Heart/Bookmark actions add humanity
- **Typography Hierarchy:** 
  - Hero title: 5xl (desktop) / 4xl (mobile)
  - Lead paragraph: 22px with medium weight (invites reader in)
  - Body: 19px/32px line-height (optimal readability)
  - Pull quotes: 28px centered in sage background boxes (visual pause)
- **Organic Flow:** Hero → Featured Image → Lead → Body → Pull Quotes → Tags → Author → Related
- **Color Harmony:** Pull quotes use sage background (#d9e8e0), tags have white bg with sage borders

**Key Characteristics:**
- **Hero Section:** Full article context before reading (title, subtitle, author, meta, actions)
- **Featured Image:** 16:9 aspect ratio ready for actual images
- **Pull Quotes:** Extended beyond content width (-mx-16) with sage background creates emphasis
- **Lead Paragraph:** 22px larger intro text signals beginning
- **Tags Section:** Interactive tags encourage exploration
- **Author Card:** Prominent author bio with avatar, role, follow action
- **Related Articles:** Grid with image placeholders maintains visual interest

---

## Design Principles Applied

### 1. Organic Minimalism
Both selections remove unnecessary elements while maintaining warmth:
- **Homepage:** No decorative elements, content carries the design
- **Article:** Clean canvas lets writing shine, pull quotes provide natural breaks

### 2. Consistent Green Palette
- Background: `#f2f8f5` (soft sage)
- Text: `#0e1d07` (deep forest)
- Primary: `#1e2a1a` (dark evergreen)
- Accent: `#316840` (living green)
- Borders: Light sage variations maintain ecosystem

### 3. Typography as Voice
- Gambarino font (once loaded) provides personality
- Clear hierarchy through size, not color changes
- Generous line-height (1.6-1.8) for sustained reading

### 4. Natural Spacing System
- 8px base unit throughout
- Common values: 24px (standard), 32px (medium), 48px (major)
- No arbitrary spacing — everything follows system

### 5. Smooth Interactions
- Transitions: 180ms (quick) / 220ms (standard)
- Hover effects: Elevation + color change (organic, not mechanical)
- Focus states: 2px accent outline for accessibility

---

## Why Not the Others?

**Homepage V2 (Minimalist List):** Too sparse for showcasing multiple articles quickly. Better suited for text-focused blogs with less frequent posting.

**Homepage V3 (Editorial Magazine):** More complex with sidebar, newsletter. Good but adds cognitive load compared to straightforward grid.

**Article V1 (Classic Centered):** Good but lacks visual hierarchy of hero section. More traditional blog feel, less editorial.

**Article V2 (Wide with Sidebar):** TOC sidebar excellent for long technical docs, but adds visual complexity. Our content benefits more from immersive reading.

---

## Implementation Notes

- Both variations share navigation, footer components (DRY principle)
- Mobile-first responsive approach (toggle shows both views)
- All spacing uses Tailwind values matching our 8px system
- Color values use exact hex from style guide
- Transitions match 180ms/220ms specifications
- Border radius: 6-8px (subtle, not overly rounded)

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Next Review:** After Category page selection