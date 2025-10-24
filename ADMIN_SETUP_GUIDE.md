# TCoEFS Blog - Admin CMS Setup Guide

Complete guide to set up and use the Admin Content Management System for TCoEFS Blog.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup Verification](#database-setup-verification)
4. [Admin User Setup](#admin-user-setup)
5. [Migrate Existing Articles](#migrate-existing-articles)
6. [Accessing the Admin Panel](#accessing-the-admin-panel)
7. [Using the Admin CMS](#using-the-admin-cms)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up the admin CMS, ensure you have:

- ✅ Supabase project created
- ✅ Authentication enabled (Email OTP and/or Google OAuth)
- ✅ Cloudinary account created
- ✅ Node.js and npm installed
- ✅ Project dependencies installed (`npm install`)

---

## Environment Configuration

### 1. Create `.env` File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Add Your Credentials

Edit `.env` and add your actual credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tcoefs
VITE_CLOUDINARY_UPLOAD_PRESET=tcoefs
```

**Where to find these:**

- **Supabase URL & Anon Key**: Go to your Supabase project → Settings → API
- **Cloudinary Cloud Name**: Your Cloudinary dashboard (top-left)
- **Cloudinary Upload Preset**: Settings → Upload → Upload Presets

---

## Database Setup Verification

### 1. Check Tables Exist

Go to **Supabase Dashboard** → **Table Editor** and verify these tables exist:

- ✅ `articles`
- ✅ `article_images`
- ✅ `likes`
- ✅ `comments`

### 2. If Tables Don't Exist

Run the SQL commands from `SUPABASE_SETUP.md` in **SQL Editor**:

```sql
-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('News', 'Training', 'Research', 'Partnership')),
  card_image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS articles_category_idx ON public.articles(category);
CREATE INDEX IF NOT EXISTS articles_featured_idx ON public.articles(featured);
CREATE INDEX IF NOT EXISTS articles_date_idx ON public.articles(date DESC);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON public.articles(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one featured article
CREATE OR REPLACE FUNCTION ensure_single_featured_article()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.featured = true THEN
    UPDATE public.articles SET featured = false WHERE id != NEW.id AND featured = true;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_single_featured BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION ensure_single_featured_article();
```

### 3. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage articles" ON public.articles
FOR ALL
TO authenticated
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Everyone can read articles
CREATE POLICY "Anyone can read articles" ON public.articles
FOR SELECT
TO anon, authenticated
USING (true);
```

---

## Admin User Setup

### Step 1: Create a User Account

1. Go to your blog homepage: `http://localhost:5173`
2. Click the **user icon** in the navigation
3. Sign up using **Email OTP** or **Google OAuth**
4. Complete the authentication flow

### Step 2: Get Your User ID

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your newly created user in the list
3. Click on the user to see details
4. **Copy the User UID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 3: Set Admin Role

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Paste and run this SQL (replace `YOUR-USER-UID-HERE` with your actual UID):

```sql
-- Replace YOUR-USER-UID-HERE with the UID you copied
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'YOUR-USER-UID-HERE';
```

### Step 4: Verify Admin Status

Run this query to confirm:

```sql
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

You should see your email with `role: admin`.

### Step 5: Refresh Your Browser

1. **Sign out** from your blog
2. **Sign back in** using the same account
3. Your admin status is now active!

---

## Migrate Existing Articles

You have 8 existing articles in `src/data/blogPosts.js` that need to be migrated to the database.

### Option A: Using Browser Console (Recommended)

1. Start your dev server: `npm run dev`
2. Open your blog in the browser
3. Open browser console (F12 → Console tab)
4. Copy and paste this code:

```javascript
// Import the migration function
import('./src/utils/migrateArticles.js').then(async (module) => {
  const { migrateArticlesToDatabase, checkMigrationStatus } = module;
  
  // Check current status
  const status = await checkMigrationStatus();
  console.log('Current articles in database:', status.count);
  
  // Run migration
  console.log('Starting migration...');
  const results = await migrateArticlesToDatabase();
  
  console.log('Migration complete!');
  console.log('Success:', results.success.length);
  console.log('Failed:', results.failed.length);
});
```

5. Press Enter and wait for the migration to complete

### Option B: Using SQL (Manual)

Go to **SQL Editor** and run this for each article:

```sql
INSERT INTO public.articles (id, title, excerpt, content, category, card_image_url, date, read_time, featured)
VALUES (
  '1',
  'Leadership Transition: Prof. Dauda Bawa Appointed as New TCoEFS Director',
  'Outgoing Director, Prof. Amaza, handing over leadership to the newly appointed Director of the TCoEFS, Prof. Dauda Bawa.',
  '<div class="space-y-4"><!-- Your HTML content here --></div>',
  'News',
  '/blog-images/leadership-card.png',
  'March 23, 2025',
  '4 min read',
  true
);

-- Repeat for articles 2-8
```

### Verify Migration

1. Go to **Supabase Dashboard** → **Table Editor** → **articles**
2. You should see all 8 articles listed
3. Check that one article has `featured = true`

---

## Accessing the Admin Panel

### 1. Start Development Server

```bash
npm run dev
```

### 2. Access Admin Routes

Once signed in as an admin, you can access:

- **Dashboard**: `http://localhost:5173/admin`
- **Articles List**: `http://localhost:5173/admin/articles`
- **Create New Article**: `http://localhost:5173/admin/articles/new`
- **Edit Article**: `http://localhost:5173/admin/articles/edit/1`

### 3. Navigation

The admin panel has a sidebar with:
- 📊 **Dashboard** - Overview and statistics
- 📝 **Articles** - Manage all articles
- ⭐ **Featured** - Manage featured article
- 🖼️ **Images** - Image library (coming soon)

---

## Using the Admin CMS

### Create a New Article

1. Go to **Admin → Articles**
2. Click **"New Article"** button
3. Fill in the form:
   - **Title**: Article headline
   - **Excerpt**: Short description (2-3 sentences)
   - **Category**: News, Training, Research, or Partnership
   - **Date**: Publication date (e.g., "March 23, 2025")
   - **Read Time**: Estimated reading time (e.g., "5 min read")
   - **Featured**: Check to make it the homepage hero article
   - **Card Image**: Upload thumbnail (will optimize via Cloudinary)
   - **Content**: Write full HTML content using the editor

4. **Upload Images**:
   - Click "Upload Image" for card thumbnail
   - Drag & drop or click to browse
   - Image will upload to Cloudinary automatically
   - For content images, upload first, then insert URL in HTML

5. **Preview** your article (optional)

6. Click **"Create Article"**

### Edit an Existing Article

1. Go to **Admin → Articles**
2. Find the article in the list
3. Click the **edit icon** (pencil)
4. Update any fields
5. Click **"Update Article"**

### Delete an Article

1. Go to **Admin → Articles**
2. Find the article
3. Click the **trash icon**
4. Confirm deletion

**Note**: You **cannot delete** a featured article. Unfeature it first.

### Manage Featured Article

**Method 1: From Articles List**
- In the articles list, click the **star button** on any article
- It will automatically become featured
- The previous featured article will be unfeatured

**Method 2: When Creating/Editing**
- Check the **"Set as featured article"** checkbox
- Only one article can be featured at a time

### Search and Filter Articles

In the **Articles List** page:
- **Search**: Type in the search box to filter by title or excerpt
- **Filter by Category**: Use the dropdown to show only specific categories
- **Clear Filters**: Click "Clear filters" to reset

---

## Content Guidelines

### Writing HTML Content

The editor supports these HTML tags:

**Headings**:
```html
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>
```

**Paragraphs**:
```html
<p>Your paragraph text here.</p>
```

**Formatting**:
```html
<strong>Bold text</strong>
<em>Italic text</em>
```

**Lists**:
```html
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<ol>
  <li>Numbered item 1</li>
  <li>Numbered item 2</li>
</ol>
```

**Links**:
```html
<a href="https://example.com">Link text</a>
```

**Images**:
```html
<img src="CLOUDINARY_URL" alt="Description" class="w-full rounded-lg my-6" />
```

**Blockquotes**:
```html
<blockquote>Quote text here</blockquote>
```

### Image Best Practices

**Card Images (Thumbnails)**:
- Recommended size: 1200x675px (16:9 ratio)
- Format: JPG or PNG
- Max file size: 10MB (will be auto-optimized)

**Content Images**:
- Upload to Cloudinary first
- Use the returned URL in your HTML
- Add `class="w-full rounded-lg my-6"` for proper styling
- Always include descriptive `alt` text

### Content Structure Example

```html
<div class="space-y-4">
  <p>Your introductory paragraph that hooks the reader...</p>
  
  <h2>First Main Section</h2>
  <p>Content for the first section...</p>
  
  <img src="https://res.cloudinary.com/tcoefs/..." alt="Description" class="w-full rounded-lg my-6" />
  
  <h3>Subsection</h3>
  <p>More detailed content...</p>
  
  <ul>
    <li>Key point 1</li>
    <li>Key point 2</li>
    <li>Key point 3</li>
  </ul>
  
  <h2>Second Main Section</h2>
  <p>Continue your article...</p>
  
  <blockquote>An important quote or callout</blockquote>
  
  <p>Concluding paragraph...</p>
</div>
```

---

## Troubleshooting

### "Access Denied" When Accessing /admin

**Problem**: You're not recognized as an admin.

**Solution**:
1. Verify you ran the SQL to set admin role
2. Sign out and sign back in
3. Clear browser cache/cookies
4. Check the SQL query returned 1 row updated
5. Verify in Supabase dashboard: Authentication → Users → Your user → raw_user_meta_data should show `"role": "admin"`

### Images Not Uploading

**Problem**: Upload fails or shows error.

**Solution**:
1. Check Cloudinary credentials in `.env`
2. Verify upload preset is set to **"Unsigned"** mode in Cloudinary dashboard
3. Check file size (must be under 10MB)
4. Check file type (must be image/*)
5. Check browser console for detailed error message

### Articles Not Saving

**Problem**: Click "Create Article" but nothing happens.

**Solution**:
1. Check browser console for errors
2. Verify all required fields are filled (marked with *)
3. Check Supabase connection
4. Verify RLS policies allow admin to insert
5. Check if article ID already exists (for edits)

### Featured Article Not Showing on Homepage

**Problem**: Set article as featured but doesn't appear in hero.

**Solution**:
1. Verify only ONE article has `featured = true` in database
2. The homepage might still be loading from `blogPosts.js` - you need to update Homepage component to fetch from database instead
3. Check browser console for errors
4. Refresh the homepage

### Migration Failed

**Problem**: Articles didn't migrate properly.

**Solution**:
1. Check browser console for specific error messages
2. Verify database tables exist
3. Verify RLS policies allow inserts
4. Try migrating one article at a time using SQL
5. Check for duplicate IDs

### Can't Delete Article

**Problem**: Delete button is disabled or shows error.

**Solution**:
1. Check if article is currently featured (cannot delete featured articles)
2. Unfeature the article first
3. Try again
4. Check RLS policies allow admin to delete

---

## Next Steps

After setting up the admin panel:

### 1. Update Frontend to Use Database

You'll need to update these files to fetch from Supabase instead of `blogPosts.js`:

**`src/components/Homepage.jsx`**:
```javascript
// Replace this:
import { blogPosts, getFeaturedPost } from '../data/blogPosts';

// With this:
import { admin } from '../lib/supabase';

// Then update the useEffect to:
useEffect(() => {
  const loadArticles = async () => {
    const { data } = await admin.getAllArticles(1, 100);
    setFilteredPosts(data || []);
    
    const { data: featured } = await admin.getFeaturedArticle();
    setFeaturedPost(featured);
  };
  loadArticles();
}, []);
```

**`src/components/ArticleView.jsx`**:
```javascript
// Update to fetch article by ID from database
const loadArticle = async () => {
  const { data } = await admin.getArticleById(id);
  setArticle(data);
};
```

### 2. Remove Static Data (Optional)

Once all articles are in the database and frontend is updated:
- You can remove or archive `src/data/blogPosts.js`
- Keep it as backup for now

### 3. Image Migration to Cloudinary (Optional)

Your existing images in `/public/blog-images/` can stay there, or you can:
1. Upload them to Cloudinary manually
2. Update the `card_image_url` in database to use Cloudinary URLs
3. Benefits: Better performance, automatic optimization, CDN delivery

---

## Security Checklist

Before going to production:

- [ ] Admin role is only assigned to authorized users
- [ ] `.env` file is in `.gitignore` (never commit credentials!)
- [ ] RLS policies are properly configured
- [ ] Cloudinary upload preset is set to "Unsigned" mode
- [ ] Test that non-admin users cannot access `/admin` routes
- [ ] Test that non-admin users cannot create/edit/delete articles

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **React Router Docs**: https://reactrouter.com
- **TCoEFS Project Issues**: [Your GitHub repository]

---

## Summary

You now have a fully functional Admin CMS! 🎉

**What you can do**:
✅ Create new blog articles with rich content
✅ Edit existing articles
✅ Delete articles (with protection for featured)
✅ Upload and manage images via Cloudinary
✅ Set featured articles for homepage hero
✅ Search and filter articles
✅ Manage article categories

**Admin Panel Routes**:
- Dashboard: `/admin`
- Articles: `/admin/articles`
- Create: `/admin/articles/new`
- Edit: `/admin/articles/edit/:id`

Happy blogging! 🌿

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained by:** TCoEFS Development Team