# TCoEFS Blog design system (master, v3 editorial magazine)

Source of truth for the blog's look. Built with the installed `ui-ux-pro-max` skill
(`.claude/skills/ui-ux-pro-max`). Earlier versions used its safe "academic" output; this version
follows the style database's recommendations for news, blogs and long-form publishing.

| Decision | Skill query | Result used |
| --- | --- | --- |
| Layout | `editorial magazine oversized typography photography` (domain `style`) | Editorial Grid / Magazine: asymmetric grid, drop caps, pull quotes, parallax photography, reveal on scroll |
| Scale | same query | Exaggerated Minimalism: hero type to 8.5rem, weight 800, tight tracking, generous space, one accent |
| Hero | same query | Kinetic Typography: words rise out of masks, scroll-triggered reveals |
| Type | `editorial bold display high contrast headline` (domain `typography`) | Playfair Display headlines, Source Serif 4 reading text, Inter UI, JetBrains Mono labels |
| Palette | `agriculture farm organic eco` (domain `color`) | Earth green with harvest gold, applied as deep farmland green on warm ivory with one gold accent |

Re-run: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style`

## Colour (tokens in `src/index.css`)

| Role | Light | Dark |
| --- | --- | --- |
| Paper | `#F6F2E8` | `#07140D` |
| Card | `#FFFDF8` | `#0E2217` |
| Ink | `#0D2518` | `#F2EDE1` |
| Secondary / meta text | `#3F4B44` / `#5C6860` | `#BFC8BD` / `#93A196` |
| Primary (links, emphasis) | `#1B6B3A` | `#6FD699` |
| Accent / CTA (harvest gold) | `#E3A72F` fill, `#8A5A00` text | `#E3A72F` |
| Deep band (hero, footer) | `#0B2417` | `#040D08` |

Text on gold uses ink (`#0D2518`). All text pairs checked at 4.5:1 or better.

## Typography

- Display: Playfair Display 800, `clamp(2.6rem, 8.6vw, 8.5rem)`, line height 0.94, tracking -0.035em.
- Headlines: Playfair Display 700. Pull quotes: Playfair italic 500 with a gold rule.
- Reading text: Source Serif 4, 19px (21px from 768px), line height 1.72, measure about 720px, drop cap on the first real paragraph.
- Labels, dates, captions, navigation: JetBrains Mono, uppercase with 0.12 to 0.16em tracking.
- UI controls: Inter.

## Layout and components

- Front page: full-screen photographic hero (lead story), headline ticker, oversized manifesto with count-up figures, asymmetric Latest grid (one feature tile and a stacked column), full-width topic rows, closing band, footer with outline wordmark.
- Story page: oversized headline, italic standfirst, labelled byline grid (By, Published, Topic, Reading time), wide cover image with reveal, share rail, table of contents.
- Story tiles are borderless and imagery-led. Missing images fall back to a deep green tile with contour artwork and the topic name.
- Header is transparent over the hero and turns solid after scrolling. One gold pill call to action per view.
- Icon buttons and menu targets are at least 44px. Icons are Lucide SVGs.

## Motion (query `scroll reveal stagger`, domain `gsap`; implemented in CSS and small hooks, no GSAP dependency)

- Hero words rise out of masks (1.1s, ease-out-expo), slow image parallax, scroll cue.
- Scroll reveal: 14px lift and fade, 420ms, staggered; image mask reveal 1.1s.
- Row hover fills, tile image zoom and title underline, headline ticker (pauses on hover).
- Everything is switched off or shown in its final state under `prefers-reduced-motion`.
- Never put `position: fixed` overlays inside an element whose animation fills forwards.
- Observe a wrapper, not an element that is fully clipped, or it never reports as visible.

## Promotional assets (skill: `banner-design`)

- `assets/banners/tcoefs-blog/og-default.html` renders `public/og-default.png` (1200 x 630), used for link previews when a story has no image.

## Avoid

More than one primary action per view, text under 12px, colour as the only signal, serif body text under 18px,
vendor chunk splitting in `vite.config.js` (it breaks the production build), unverified dev-server-only testing
(always check `vite build` plus `vite preview`).
