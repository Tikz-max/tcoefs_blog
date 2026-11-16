# TCoEFS Blog

The editorial site for the TETFund Centre of Excellence in Food Security, University of Jos.
React 19, Vite, Tailwind CSS 4, Supabase (data and auth), Cloudinary (images), Vercel (hosting).

## Development

```bash
npm install
npm run dev
```

Without Supabase credentials in `.env.local`, `npm run dev` runs in a local preview mode with the
sample stories from `public/blog-images/news.generated.json` and a signed-in demo editor. This mode
never runs in a production build. To use real data, set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
`VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.

## Database update (one-off)

Drafts, authors, tags and image captions need the columns in
`supabase/migrations/001_editorial_fields.sql`. Run it in the Supabase SQL editor. The site works
before and after it: until it is applied, the editor hides those fields and every save publishes.
Read the policy note at the bottom of the file so that drafts are also hidden at the database level.

## Structure

- `src/pages` public pages (front page and topic or search archive, story reader)
- `src/components/site` header, footer, cards, article layout
- `src/components/admin` editorial desk: overview, story list, editor (Tiptap)
- `src/lib/content.js` dates, reading time, sanitising and table of contents for story HTML
- `src/index.css` design tokens, light and dark themes, article typography (`.prose-article`)
- `api/` serverless functions: story pages with social tags, sitemap, latest-news feed for the main site
