# Blog Content Migration Documentation

## Overview
This document tracks the migration of TCoEFS blog content from the original Next.js site to the new React blog platform.

## Migration Date
October 20, 2024

## Source
- **Original Location**: `/home/maziki/Desktop/tcoefs_vercel/app/news-events/page.tsx`
- **Image Source**: `/home/maziki/Desktop/tcoefs_vercel/public/news/`

## Destination
- **Data File**: `src/data/blogPosts.js`
- **Images**: `public/blog-images/`

## Migrated Content

### Blog Posts (6 Total)

#### 1. Leadership Transition: Prof. Dauda Bawa Appointed as New TCoEFS Director
- **ID**: 1
- **Category**: News
- **Date**: March 23, 2025
- **Status**: ✅ Migrated
- **Featured**: Yes
- **Images**: 
  - `blog-images/leadership-card.png`
  - `blog-images/leadership-portrait.png`

#### 2. International Lecture: Using Genetics to Meet the Food Demand of 2050
- **ID**: 2
- **Category**: Research
- **Date**: April 4, 2025
- **Status**: ✅ Migrated
- **Featured**: Yes
- **Images**:
  - `blog-images/Genetics 2050/img1.png`
  - `blog-images/Genetics 2050/img2.png`
  - `blog-images/Genetics 2050/img3.png`
  - `blog-images/Genetics 2050/img4.png`
  - `blog-images/Genetics 2050/img5.png`

#### 3. SAA and GIZ Partner with TCoEFS to Drive Institutional Innovation
- **ID**: 3
- **Category**: Partnership
- **Date**: March 15, 2025
- **Status**: ✅ Migrated
- **Featured**: No
- **Images**:
  - `blog-images/saa-giz/images/meeting.png`
  - `blog-images/saa-giz/images/group.png`

#### 4. TCoEFS Participates in Cameroon Study Visit
- **ID**: 4
- **Category**: Research
- **Date**: February 28, 2025
- **Status**: ✅ Migrated
- **Featured**: No
- **Images**:
  - `blog-images/tcoefs-participates-in-cameroon-study-visit-on-sustainable-agricultural-systems/images/img-1.jpeg`
  - `blog-images/tcoefs-participates-in-cameroon-study-visit-on-sustainable-agricultural-systems/images/img-2.jpeg`
  - `blog-images/tcoefs-participates-in-cameroon-study-visit-on-sustainable-agricultural-systems/images/img-3.jpeg`
  - (... img-4 through img-8)

#### 5. TCoEFS Leads Discussion on Agricultural Education Reform
- **ID**: 5
- **Category**: Policy
- **Date**: February 15, 2025
- **Status**: ✅ Migrated
- **Featured**: No
- **Images**:
  - `blog-images/tetfund-centre-of-excellence-in-food-security-tcoefs-leads-discussion-on-agricul/images/img-1.jpeg`
  - `blog-images/tetfund-centre-of-excellence-in-food-security-tcoefs-leads-discussion-on-agricul/images/img-2.jpeg`
  - (... img-3 through img-5)

#### 6. Climate-Smart Agriculture Research Initiative Launched
- **ID**: 6
- **Category**: Research
- **Date**: August 10, 2024
- **Status**: ✅ Migrated
- **Featured**: No
- **Images**:
  - `blog-images/agricultural-research-lab.png`

## Image Organization

All blog images are organized in the `public/blog-images/` directory with the following structure:

```
public/blog-images/
├── leadership-card.png
├── leadership-portrait.png
├── agricultural-research-lab.png
├── Genetics 2050/
│   ├── img1.png
│   ├── img2.png
│   ├── img3.png
│   ├── img4.png
│   └── img5.png
├── saa-giz/
│   └── images/
│       ├── meeting.png
│       └── group.png
├── tcoefs-participates-in-cameroon-study-visit-on-sustainable-agricultural-systems/
│   └── images/
│       ├── img-1.jpeg
│       ├── img-2.jpeg
│       └── ... (img-3 through img-8)
└── tetfund-centre-of-excellence-in-food-security-tcoefs-leads-discussion-on-agricul/
    └── images/
        ├── img-1.jpeg
        ├── img-2.jpeg
        └── ... (img-3 through img-5)
```

## Design Implementation

### Homepage Card Design
- **Featured Post**: Dark background card (`#1e2a1a`) with overlay image, 500-600px height
- **Regular Posts**: Dark cards with image on top (192px height), content below
- **Card Heights**: Variable (not equal), approximately 420px for regular cards
- **No Author Attribution**: Cards do not display author names (as per requirement)

### Card Components
- Category badge with light sage background
- Date display
- Title (responsive sizing)
- Excerpt (truncated with line-clamp-3)
- Read time with clock icon

## Categories Available
- All
- News
- Research
- Partnership
- Training
- Policy

## Data Structure
Each blog post contains:
- `id` (unique identifier)
- `category` (from predefined list)
- `title` (string)
- `excerpt` (brief description)
- `date` (formatted string)
- `readTime` (e.g., "4 min read")
- `image` (path to featured image)
- `featured` (boolean)
- `slug` (URL-friendly identifier)

## Helper Functions Created
- `getFeaturedPosts()` - Returns all featured posts
- `getPostsByCategory(category)` - Filter by category
- `getPostBySlug(slug)` - Get single post by slug
- `getRecentPosts(limit)` - Get most recent posts

## Next Steps
- [ ] Create individual article page template
- [ ] Implement full article content (currently only metadata migrated)
- [ ] Add search functionality
- [ ] Add category filtering
- [ ] Implement pagination
- [ ] Add related posts section

## Notes
- Full article content not yet migrated (only metadata and excerpts)
- Article page needs to be designed and implemented before full content migration
- All images successfully copied and organized
- Placeholder image handling added for missing images