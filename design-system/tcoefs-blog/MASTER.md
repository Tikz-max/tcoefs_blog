# TCoEFS Blog design system (master, v4 Aurora Glass with cinematic photography)

Source of truth for the blog's look. Built with the installed `ui-ux-pro-max` skill
(`.claude/skills/ui-ux-pro-max`) using its `banner-design` workflow: three art directions were shown side by side
(Aurora Glass, Cinematic Photo, Bold Blocks). The owner chose **Aurora Glass as the base, with Cinematic Photo
for the lead story and photo rail.**

Earlier versions (green band and cards, then cream paper with serif type) were rejected. Do not return to cream
backgrounds, serif display type or beige palettes: they read as generic AI output.

| Decision | Skill query | Result used |
| --- | --- | --- |
| Look | `bento grid vibrant modern dark glass aurora` (domain `style`) | Aurora UI (luminous gradients, glass) with Bento Box Grid (modular tiles, 28px radii) |
| Photography | `photography cinematic full bleed immersive minimal` | Lead story and rail as full-bleed photo tiles with dark gradient overlays |
| Type | `modern geometric bold grotesk tech startup` (domain `typography`) | Space Grotesk 700 headlines, DM Sans text and interface |

Re-run: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style`

## Colour (tokens in `src/index.css`; dark is the default theme)

| Role | Dark | Light |
| --- | --- | --- |
| Page | `#03120C` | `#EEF8F2` |
| Card | `#0A2118` | `#FFFFFF` |
| Text / secondary / meta | `#EAFFF3` / `#B6D2C3` / `#86A998` | `#062A1A` / `#3A5748` / `#557264` |
| Accent and call to action (lime) | `#B6F23A`, text on it `#06210F` | same fill, links `#0A7A46` |
| Glow | emerald `#0F9F6E`, lime `#B6F23A`, cyan `#0891B2` | hero stays dark in both themes |

The editorial desk always uses the light scope (`.theme-light`).

## Typography

- Headlines: Space Grotesk 700, tracking -0.03 to -0.045em, hero `clamp(2.5rem, 6.2vw, 6.1rem)`.
- Text and interface: DM Sans. Reading text 18.5px (21px was too large for DM Sans), line height 1.78.
- No serif faces and no italics.

## Components

- Header: floating glass pill, lime active state and lime "TCoEFS site" button, 44px targets.
- Hero: aurora glow, kinetic word-by-word headline with gradient keyword, glass search, topic chips, floating glass story cards (wide screens).
- Latest: bento grid. Lead story is a cinematic photo tile spanning two columns and two rows; lime stat tile; glass text tile; photo tiles.
- More stories: horizontal snap rail of photo tiles. Topics: glass tiles with counts. Closing band and footer reuse the aurora with an outline wordmark.
- Stories without an image fall back to an emerald gradient tile with contour artwork and the topic name.

## Motion and performance

- Scroll reveals (14px, 420ms), kinetic headline, floating cards, slow aurora drift. All off under `prefers-reduced-motion`.
- **Never use `filter: blur()` on large animated shapes.** The aurora uses radial gradients animated with transform only. A blur-filter version made page navigation hang and would be slow on low-end phones.
- Do not add `manualChunks` for react or vendors in `vite.config.js` (breaks the production build).
- Never place `position: fixed` overlays inside an element whose animation fills forwards.
- Test every change with `vite build` plus `vite preview`, not only the dev server.

## Promotional assets (skill: `banner-design`)

- `assets/banners/tcoefs-blog/og-default.html` renders `public/og-default.png` (1200 x 630): link-preview image when a story has no image.
