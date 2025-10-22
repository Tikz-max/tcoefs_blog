# TcoEFS Blog - Comprehensive Style Guide

> **Welcome to the TcoEFS Blog Design System**
> 
> This document is your complete guide to understanding and implementing our design philosophy. Whether you're a developer implementing components or a designer creating new features, this guide will help you make decisions that align with our core principles of warmth, simplicity, and clarity.

---

## Table of Contents

1. [Design Philosophy & Principles](#design-philosophy--principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Component Library](#component-library)
6. [Interaction & Animation](#interaction--animation)
7. [Responsive Design](#responsive-design)

---

# Design Philosophy & Principles

## Philosophy: Organic Minimalism

At TcoEFS Blog, we practice **organic minimalism** — a design approach where simplicity meets warmth, where clarity is achieved not through cold reduction but through natural harmony. Every element exists for a reason, and the overall aesthetic draws inspiration from nature itself: calm, balanced, and inviting.

Our design embodies these core beliefs:

### The Content is Sacred

The written word is our primary medium. Every design decision serves to elevate the reading experience, never to compete with it. We believe that good design is invisible — readers should be so immersed in the content that they forget they're looking at a designed interface. They should feel like they're reading in a peaceful natural setting, not staring at a screen.

### Warmth is a Feature, Not a Compromise

Warmth and professionalism are not opposites. Through our nature-inspired green palette, thoughtful typography, and generous spacing, we create an environment that is both serious and approachable. When users visit our blog, they should feel welcomed, not intimidated. They should sense both the gravity of thoughtful content and the invitation to engage with it.

### Consistency Builds Trust

We use a cohesive color family (greens ranging from nearly-white to nearly-black) and consistent spacing not out of limitation, but out of respect for our readers' cognitive energy. When visual patterns are predictable and harmonious, readers can focus entirely on the ideas being presented.

### Hierarchy Guides Without Shouting

Our typographic hierarchy is clear but never aggressive. Headers establish structure, body text invites sustained reading, and metadata provides context without distraction. Every size, weight, and color choice is deliberate, creating a natural flow like a well-marked forest path.

### Professionalism Through Natural Polish

We achieve a professional aesthetic not through corporate coldness, but through organic refinement. Subtle border radius (6-8px), precise spacing that mirrors natural proportions, and careful alignment create polish that feels human, not mechanical.

---

# Color Palette

## Philosophy: The Green Spectrum of Digital Nature

Our color palette is inspired by nature itself — specifically, the range of greens found in a healthy forest from the lightest sage to the deepest evergreen. This isn't arbitrary aesthetics; it's psychology in action. Green promotes calmness, reduces eye strain, and creates an environment conducive to sustained reading and deep thought.

### Why This Green Palette?

**Warmth Without Sacrifice:** Unlike blues (which skew cold) or blacks/grays (which feel institutional), greens carry inherent warmth while maintaining professionalism.

**Visual Harmony:** When all colors share the same hue family, coherence happens automatically. There are no jarring transitions.

**Reduced Eye Strain:** The soft sage background is gentler on eyes than pure white, especially during extended reading sessions.

**Psychological Association:** Green is associated with growth, renewal, knowledge, and balance — exactly the qualities we want readers to associate with our content.

## Color Specifications

### Primary Colors (HSL Preferred)

#### Background Color
```css
/* HSL */
--background: hsl(150, 30%, 96%);

/* HEX (for compatibility) */
--background: #f2f8f5;

/* RGB */
--background: rgb(242, 248, 245);
```
**Usage:** Main canvas, primary background for all pages  
**Feel:** Soft sage, nearly white with gentle green whisper  
**Note:** This is a core color — do not change significantly

#### Text Color (Deep Forest)
```css
/* HSL */
--text: hsl(101, 61%, 7%);

/* HEX */
--text: #0e1d07;

/* RGB */
--text: rgb(14, 29, 7);
```
**Usage:** Primary body text, main article content  
**Contrast Ratio:** 15.8:1 on background (exceeds WCAG AAA)  
**Note:** This is a core color — do not change significantly

### Secondary Colors

#### Primary Dark Green
```css
/* HSL */
--primary: hsl(105, 24%, 13%);

/* HEX */
--primary: #1e2a1a;

/* RGB */
--primary: rgb(30, 42, 26);
```
**Usage:** Headings, navigation items, important UI elements  
**Contrast Ratio:** 13.2:1 on background (exceeds WCAG AAA)

#### Secondary Dark Green
```css
/* HSL */
--secondary: hsl(128, 30%, 11%);

/* HEX */
--secondary: #132315;

/* RGB */
--secondary: rgb(19, 35, 21);
```
**Usage:** Secondary headings, metadata, supporting text  
**Contrast Ratio:** 14.5:1 on background (exceeds WCAG AAA)

### Accent Color

#### Accent Medium Green
```css
/* HSL */
--accent: hsl(136, 36%, 30%);

/* HEX */
--accent: #316840;

/* RGB */
--accent: rgb(49, 104, 64);
```
**Usage:** Links, buttons, interactive elements, calls-to-action  
**Contrast Ratio:** 6.1:1 on background (meets WCAG AA)  
**Hover State:** `hsl(136, 36%, 25%)` or `#254a30` (darken)

### Supporting Colors

#### Light Sage (Borders, Dividers)
```css
--sage-light: #d9e8e0;
--sage-medium: #b3d1c2;
--border-light: hsl(150, 20%, 85%);
--border-medium: hsl(150, 20%, 70%);
```

#### Functional Colors
```css
--accent-light: #3d8250;
--accent-dark: #254a30;
--forest-dark: #0a1505;
```

### Tailwind CSS Configuration
```javascript
colors: {
  'text': '#0e1d07',
  'background': '#f2f8f5',
  'primary': '#1e2a1a',
  'secondary': '#132315',
  'accent': '#316840',
  'sage-light': '#d9e8e0',
  'sage-medium': '#b3d1c2',
  'forest-dark': '#0a1505',
  'accent-light': '#3d8250',
  'accent-dark': '#254a30',
}
```

---

# Typography

## Philosophy: Voice Through Gambarino

Typography is voice made visible, and our choice of Gambarino-Regular as the primary font is a deliberate statement: this blog has personality. Gambarino brings warmth and character while maintaining the readability essential for sustained reading.

### Why Gambarino?

**Personality Within Professionalism:** Gambarino strikes the balance of being distinctive without being distracting.

**Readability First:** Despite its personality, Gambarino remains highly readable at body text sizes.

**Warmth Through Form:** The letterforms carry a subtle organic quality that pairs beautifully with our green palette.

## Font Implementation

### Font Face Declaration
```css
@font-face {
    font-family: "Gambarino-Regular";
    src:
        url("../Fonts/WEB/fonts/Gambarino-Regular.woff2") format("woff2"),
        url("../Fonts/WEB/fonts/Gambarino-Regular.woff") format("woff"),
        url("../Fonts/WEB/fonts/Gambarino-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

### Font Stack
```css
font-family: 'Gambarino-Regular', Georgia, Cambria, serif;
```

## Typography Scale

### Headings

#### H1 - Article Title
```css
font-size: 38px; /* 48px on desktop */
line-height: 50px;
font-weight: 700;
letter-spacing: -0.5px;
color: #1e2a1a; /* Primary Dark */
```

#### H2 - Section Headers
```css
font-size: 30px;
line-height: 42px;
font-weight: 600;
letter-spacing: -0.3px;
color: #1e2a1a; /* Primary Dark */
```

#### H3 - Subsection Headers
```css
font-size: 24px;
line-height: 34px;
font-weight: 600;
letter-spacing: -0.2px;
color: #132315; /* Secondary Dark */
```

### Body Text

#### Article Body (Primary Reading)
```css
font-size: 19px;
line-height: 32px;
font-weight: 400;
color: #0e1d07; /* Deep Forest text */
max-width: 680px; /* Critical for readability */
```

#### Body Text (UI)
```css
font-size: 17px;
line-height: 28px;
font-weight: 400;
color: #0e1d07;
```

#### Small Text
```css
font-size: 15px;
line-height: 24px;
font-weight: 400;
color: #132315; /* Secondary Dark */
```

### Special Text

#### Metadata
```css
font-size: 13px;
line-height: 20px;
font-weight: 500;
letter-spacing: 0.2px;
color: #132315; /* Secondary Dark */
text-transform: uppercase;
```

#### Links
```css
color: #316840; /* Accent Green */
font-weight: 500;
text-decoration: none;
transition: all 180ms ease-out;
```

#### Pull Quotes
```css
font-size: 22px;
line-height: 38px;
font-weight: 400;
font-style: italic;
color: #1e2a1a; /* Primary Dark */
border-left: 4px solid #316840; /* Accent Green */
padding-left: 24px;
```

---

# Layout & Spacing

## Philosophy: Natural Rhythm and Breathing Room

At TcoEFS Blog, whitespace isn't empty space — it's an active design element inspired by the way nature creates space between elements. Our spacing system creates natural rhythm, giving content room to breathe.

## Spacing System (8px Base Unit)

```css
--space-4: 4px;    /* Micro */
--space-8: 8px;    /* Tight */
--space-12: 12px;  /* Close */
--space-16: 16px;  /* Small */
--space-20: 20px;  /* Small-medium */
--space-24: 24px;  /* Standard ⭐ Most common */
--space-28: 28px;  /* Medium */
--space-32: 32px;  /* Medium-large */
--space-40: 40px;  /* Large */
--space-48: 48px;  /* Major */
--space-64: 64px;  /* Extra large */
```

## Container Widths

```css
/* Article Content */
.article-body {
  max-width: 680px;  /* Optimal line length */
  margin: 0 auto;
}

/* Overall Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

/* Mobile */
@media (max-width: 768px) {
  .container {
    padding: 0 24px;
  }
}
```

## Common Spacing Patterns

### Article Header
```css
margin-top: 64px;
margin-bottom: 48px;
```

### Headings
```css
h2 {
  margin-top: 40px;
  margin-bottom: 20px;
}

h3 {
  margin-top: 32px;
  margin-bottom: 16px;
}
```

### Paragraphs
```css
p {
  margin-bottom: 28px;
}
```

### Cards
```css
padding: 24px;
margin-bottom: 24px;
gap: 24px; /* between cards in grid */
```

---

# Component Library

## Navigation

### Navigation Bar
```css
height: 72px;
background: rgba(242, 248, 245, 0.95); /* Sage with transparency */
backdrop-filter: blur(12px);
border-bottom: 1px solid #d9e8e0;
position: sticky;
top: 0;
z-index: 40;
```

### Navigation Items
```css
padding: 10px 16px;
border-radius: 6px;
font-size: 16px;
font-weight: 500;
color: #1e2a1a; /* Primary Dark */
transition: all 180ms ease-out;
```

**Hover State:**
```css
background: #d9e8e0; /* Sage light */
```

## Cards

### Article Preview Card
```css
background: #ffffff;
border: 1px solid #d9e8e0;
border-radius: 8px;
padding: 24px;
box-shadow: 0 2px 8px rgba(49, 104, 64, 0.06);
transition: all 220ms ease-out;
```

**Hover State:**
```css
box-shadow: 0 4px 16px rgba(49, 104, 64, 0.12);
transform: translateY(-2px);
```

## Buttons

### Primary Button
```css
background: #316840; /* Accent Green */
color: #ffffff;
font-size: 15px;
font-weight: 500;
height: 48px;
padding: 0 28px;
border-radius: 8px;
transition: all 180ms ease-out;
```

**Hover State:**
```css
background: #254a30; /* Accent Dark */
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(49, 104, 64, 0.25);
```

### Ghost Button
```css
background: transparent;
color: #1e2a1a;
border: 2px solid #d9e8e0;
border-radius: 8px;
padding: 0 28px;
height: 48px;
```

**Hover State:**
```css
border-color: #316840;
color: #316840;
background: rgba(242, 248, 245, 1);
```

## Input Fields

```css
width: 100%;
height: 56px;
padding: 0 16px;
font-size: 17px;
background: #ffffff;
border: 2px solid #d9e8e0;
border-radius: 8px;
color: #0e1d07;
transition: all 180ms ease-out;
```

**Focus State:**
```css
border-color: #316840;
background: rgba(242, 248, 245, 0.5);
box-shadow: 0 0 0 3px rgba(49, 104, 64, 0.1);
outline: none;
```

---

# Interaction & Animation

## Philosophy: Natural Motion

Animation and interaction serve a purpose: they provide feedback, guide attention, and create delight without distraction. We believe in subtle, smooth transitions that enhance the experience.

## Timing

```css
--duration-quick: 180ms;
--duration-standard: 220ms;
```

## Standard Transitions

```css
/* Links, small elements */
transition: all 180ms ease-out;

/* Cards, larger elements */
transition: all 220ms ease-out;
```

## Hover Effects

### Cards
```css
transform: translateY(-2px);
box-shadow: 0 4px 16px rgba(49, 104, 64, 0.12);
```

### Buttons
```css
transform: translateY(-1px);
```

### Links
```css
color: #254a30; /* Darken */
border-bottom: 1px solid #316840;
```

## Focus States (Accessibility)

```css
*:focus-visible {
  outline: 2px solid #316840;
  outline-offset: 2px;
}
```

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# Responsive Design

## Breakpoints

```css
/* Mobile First - Base Styles */
/* < 768px - default */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

## Responsive Patterns

### Grid Layouts

```css
/* Mobile: 1 column */
grid-template-columns: 1fr;
gap: 16px;

/* Tablet: 2 columns */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

### Typography Scaling

```css
/* Mobile */
h1 { font-size: 32px; }
h2 { font-size: 26px; }

/* Desktop */
@media (min-width: 1024px) {
  h1 { font-size: 38px; }
  h2 { font-size: 30px; }
}
```

### Padding/Spacing

```css
/* Mobile */
padding: 24px;

/* Desktop */
@media (min-width: 768px) {
  padding: 48px;
}
```

---

# Design Principles Summary

1. **Minimalism with Purpose:** Every element serves the content
2. **Generous Whitespace:** Let content breathe, create calm
3. **Consistent Color Usage:** Limited green palette for visual harmony
4. **Text Hierarchy:** Clear, unambiguous content structure
5. **Readability First:** Typography optimized for sustained reading
6. **Subtle Interactions:** Smooth, understated feedback (180-220ms)
7. **Professional Polish:** Clean, refined, never cluttered
8. **Content-Focused:** Design recedes, content shines
9. **Natural Motion:** Organic feeling transitions and hover states
10. **Accessibility:** WCAG AA minimum, keyboard navigation, focus states

---

**Document Version:** 1.0  
**Last Updated:** October 2024  
**Maintained by:** TcoEFS Design Team