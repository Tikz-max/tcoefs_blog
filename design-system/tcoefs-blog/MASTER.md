# TCoEFS Blog design system (master)

Source of truth for the blog's look. Built from searches run with the installed
`ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max`), then combined:

| Decision | Skill query | Result used |
| --- | --- | --- |
| Pattern and style | `news publication blog long-form articles research think tank` | Swiss Modernism 2.0 (12-column grid, rational spacing, hairline rules) |
| Palette | `agriculture farm organic eco` (domain `color`) | Agriculture / Farm Tech: earth green with harvest gold |
| Typography | `research policy institute publication serif readable` (domain `typography`) | Academic / Research: Crimson Pro + Atkinson Hyperlegible |
| Reading | `article reading long-form typography line length` (domain `ux`) | 65 to 75 characters per line, line height 1.5 to 1.75, balanced headings |

Re-run any query with
`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "TCoEFS Blog"`.

## Colour (tokens live in `src/index.css`)

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#F0FDF4` | `#08170F` |
| Card | `#FFFFFF` | `#0F2417` |
| Foreground | `#14532D` | `#E8F5EC` |
| Secondary text | `#3F4F5F` | `#B4C6BA` |
| Meta text | `#566474` | `#8AA093` |
| Primary (links, active) | `#15803D` | `#4ADE80` |
| CTA and accent (harvest gold) | `#A16207` | `#FBBF24` |
| Footer band | `#14532D` | `#040D08` |
| Border | `#CFE9D9` | `#1F3D2B` |

Topic colours: News green, Research blue `#1E40AF`, Training gold, Partnership `#9A3412`.
All text pairs were checked at 4.5:1 or better in both themes.

## Typography

- Headlines, standfirsts, pull quotes: Crimson Pro (400 to 600).
- Body, interface, long-form text: Atkinson Hyperlegible (400, 700), chosen for legibility on low-end screens.
- Article body 18px (19.5px from 768px up), line height 1.75, measure about 720px.
- Headings use `text-wrap: balance`.

## Layout and components

- 12-column grid, 1200px container, 8px base spacing, 6px radii, 1px hairline borders.
- Front page: dark green masthead (headline, search, topic counts) with the lead story overlapping it.
- One filled gold button per view; secondary actions are outlined or text.
- Icon buttons and menu targets are at least 44px.
- Motion is subtle (150 to 300ms) and removed under `prefers-reduced-motion`.
- Icons are Lucide SVGs, never emoji.

## Avoid

Low hierarchy, cluttered visuals, more than one primary action per view, placeholder-only
labels, colour as the only signal, text below 14px except uppercase labels.
