# Supabase Setup Guide for TcoEFS Blog

This guide will walk you through setting up Supabase authentication and database for the TcoEFS Blog application.

---

## Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Configure Authentication](#2-configure-authentication)
3. [Create Database Tables](#3-create-database-tables)
4. [Set Up Row Level Security (RLS)](#4-set-up-row-level-security-rls)
5. [Configure Storage for Images](#5-configure-storage-for-images)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Test Authentication](#7-test-authentication)
8. [Admin Setup](#8-admin-setup)

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `tcoefs-blog` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select the closest region to your users
4. Click **"Create new project"** and wait for setup to complete (~2 minutes)

---

## 2. Configure Authentication

### Enable Email OTP Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider and ensure it's enabled
3. Under **Email** settings, configure:
   - **Enable Email provider**: ✅ Enabled
   - **Confirm email**: ✅ Enabled (recommended)
   - **Secure email change**: ✅ Enabled (recommended)

### Enable Google OAuth (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Toggle **Enable Sign in with Google** to ON
4. Follow these steps to get Google credentials:

   **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Configure consent screen if prompted
   - Application type: **Web application**
   - Add authorized redirect URIs:
     ```
     https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**

5. Paste the credentials into Supabase:
   - **Client ID (for OAuth)**: Your Google Client ID
   - **Client Secret (for OAuth)**: Your Google Client Secret
6. Click **Save**

### Enable Apple OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Click on **Apple**
3. Toggle **Enable Sign in with Apple** to ON
4. Follow these steps to get Apple credentials:

   **Apple Developer Setup:**
   - Go to [Apple Developer](https://developer.apple.com)
   - Sign in with your Apple Developer account (requires membership)
   - Go to **Certificates, Identifiers & Profiles**
   - Create a **Services ID**
   - Configure Sign in with Apple
   - Add redirect URL:
     ```
     https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Generate and download the required credentials

5. Paste the credentials into Supabase and click **Save**

---

## 3. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL commands:

### Create Likes Table

```sql
-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_post_idx ON public.likes(user_id, post_id);
```

### Create Comments Table

```sql
-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  text TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);
```

### Create Articles Table (For Admin CMS)

```sql
-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY, -- Unique alphanumeric ID (e.g., "news1", "news2")
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML content with embedded images
  category TEXT NOT NULL CHECK (category IN ('News', 'Training', 'Research', 'Partnership')),
  card_image_url TEXT NOT NULL, -- Thumbnail for cards/grid
  date TEXT NOT NULL, -- Publication date (e.g., "March 23, 2025")
  read_time TEXT NOT NULL, -- Reading time (e.g., "4 min read")
  featured BOOLEAN DEFAULT false, -- Only one article can be featured
  slug TEXT UNIQUE, -- URL-friendly slug (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS articles_category_idx ON public.articles(category);
CREATE INDEX IF NOT EXISTS articles_featured_idx ON public.articles(featured);
CREATE INDEX IF NOT EXISTS articles_date_idx ON public.articles(date DESC);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON public.articles(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one featured article at a time
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

### Create Article Images Table (Track uploaded images)

```sql
-- Create article_images table to track images used in articles
CREATE TABLE IF NOT EXISTS public.article_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT REFERENCES public.articles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Supabase Storage URL
  image_type TEXT CHECK (image_type IN ('card', 'content')), -- 'card' for thumbnail, 'content' for inline
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS article_images_article_id_idx ON public.article_images(article_id);
```

---

## 4. Set Up Row Level Security (RLS)

Row Level Security ensures users can only access and modify their own data.

### Enable RLS on Tables

```sql
-- Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies for Likes

```sql
-- Policy: Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
ON public.likes FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own likes
CREATE POLICY "Users can insert their own likes"
ON public.likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
ON public.likes FOR DELETE
USING (auth.uid() = user_id);
```

### Create RLS Policies for Comments

```sql
-- Policy: Anyone can view comments
CREATE POLICY "Comments are viewable by everyone"
ON public.comments FOR SELECT
USING (true);

-- Policy: Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments (optional)
CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);
```

### Create RLS Policies for Articles

```sql
-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published articles
CREATE POLICY "Articles are viewable by everyone"
ON public.articles FOR SELECT
USING (true);

-- Policy: Only admins can insert articles (we'll add admin check later)
CREATE POLICY "Admins can insert articles"
ON public.articles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only admins can update articles
CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only admins can delete articles (but not featured ones)
CREATE POLICY "Admins can delete non-featured articles"
ON public.articles FOR DELETE
USING (
  featured = false AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);
```

### Create RLS Policies for Article Images

```sql
-- Enable RLS on article_images table
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view article images
CREATE POLICY "Article images are viewable by everyone"
ON public.article_images FOR SELECT
USING (true);

-- Policy: Only admins can insert images
CREATE POLICY "Admins can insert images"
ON public.article_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only admins can delete images
CREATE POLICY "Admins can delete images"
ON public.article_images FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);
```

---

## 5. Configure Storage for Images

### Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Configure:
   - **Name**: `article-images`
   - **Public bucket**: ✅ Enabled (so images are publicly accessible)
   - **File size limit**: 10 MB (recommended)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. Click **"Create bucket"**

### Set Storage Policies

Go to **Storage** → **Policies** → **article-images** and create these policies:

```sql
-- Policy: Anyone can view images
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

-- Policy: Only admins can upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-images' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only admins can update images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'article-images' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only admins can delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-images' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);
```

---

## 6. Configure Environment Variables

### Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL**: `https://[YOUR-PROJECT-ID].supabase.co`
   - **anon public** key (under Project API keys)

### Create .env File

1. In your project root (`TcoEFS_Blog/`), copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```bash
   VITE_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Make sure `.env` is in your `.gitignore` file (it should be by default)

---

## 7. Test Authentication

### Start Your Development Server

```bash
npm run dev
```

### Test Email OTP Flow

1. Click the **User icon** in the top navigation
2. Enter an email address
3. Click **"Continue with Email"**
4. Check your email for the 6-digit verification code
5. Enter the code and verify
6. You should now be signed in!

### Test Social Login

1. Click the **User icon** in the top navigation
2. Click **"Sign in with Google"** or **"Sign in with Apple"**
3. Complete the OAuth flow
4. You should be redirected back and signed in!

### Test Like Functionality

1. Sign in with any method
2. Navigate to an article
3. Click the **Heart icon** to like the article
4. The heart should turn green and show a count
5. Click again to unlike

### Test Comment Functionality

1. While signed in, scroll to the comments section
2. Type a comment in the textarea
3. Click the **Send icon** to post
4. Your comment should appear in the list
5. Hover over your comment to see the delete button

### Test Share Functionality

1. On any article, click the **Share icon**
2. Choose a platform to share or copy the link
3. The share menu should work as expected

---

## Troubleshooting

### Email OTP Not Sending

1. Check **Authentication** → **Email Templates** in Supabase
2. Ensure email provider is properly configured
3. Check your spam folder
4. For development, check Supabase logs in **Database** → **Logs**

### Google/Apple OAuth Not Working

1. Verify redirect URLs match exactly (including https://)
2. Check that credentials are correctly entered in Supabase
3. Ensure OAuth consent screen is configured properly
4. Check browser console for error messages

### Database Errors

1. Verify all SQL commands ran successfully
2. Check **Table Editor** to ensure tables exist
3. Verify RLS policies are enabled in **Authentication** → **Policies**
4. Check Supabase logs for detailed error messages

### Environment Variables Not Loading

1. Ensure `.env` file is in the correct directory (`TcoEFS_Blog/`)
2. Restart your development server after changing `.env`
3. Verify variable names start with `VITE_` (required for Vite)

---

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use RLS policies** to protect user data
3. **Validate user input** on both client and server side
4. **Rate limit** authentication attempts (configure in Supabase)
5. **Enable email confirmation** for production
6. **Use HTTPS** in production (automatic with Vercel, Netlify, etc.)

---

## Database Schema Reference

### Likes Table

| Column     | Type      | Description                           |
|------------|-----------|---------------------------------------|
| id         | UUID      | Primary key (auto-generated)          |
| user_id    | UUID      | Foreign key to auth.users             |
| post_id    | TEXT      | Blog post identifier                  |
| created_at | TIMESTAMP | When the like was created             |

### Comments Table

| Column     | Type      | Description                           |
|------------|-----------|---------------------------------------|
| id         | UUID      | Primary key (auto-generated)          |
| user_id    | UUID      | Foreign key to auth.users             |
| post_id    | TEXT      | Blog post identifier                  |
| text       | TEXT      | Comment content                       |
| user_name  | TEXT      | Display name of commenter             |
| user_email | TEXT      | Email of commenter                    |
| created_at | TIMESTAMP | When the comment was created          |

---

## Next Steps

✅ Authentication is set up with OTP + Social logins  
✅ Database tables created with proper RLS policies  
✅ Like, Comment, and Share features are functional  

**Optional Enhancements:**
- Add email notifications for new comments
- Implement comment replies (nested comments)
- Add comment editing functionality
- Create user profile page showing liked posts and comments
- Add moderation tools for admin users
- Implement real-time updates using Supabase Realtime

---

## 8. Admin Setup

### Create Admin User

**Important**: Only ONE admin user should exist for the TcoEFS Blog CMS.

#### Option 1: Set Admin via SQL (Recommended)

1. First, create an account using the normal sign-in flow (email OTP or Google)
2. Go to **Authentication** → **Users** in Supabase dashboard
3. Find your user and copy the **User UID**
4. Go to **SQL Editor** and run:

```sql
-- Set user as admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'YOUR-USER-UID-HERE';
```

#### Option 2: Set Admin via Dashboard

1. Go to **Authentication** → **Users**
2. Click on your user
3. Under **User Metadata** → **raw_user_meta_data**, add:
   ```json
   {
     "role": "admin"
   }
   ```
4. Click **Save**

### Verify Admin Access

Run this SQL to verify admin status:

```sql
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

### Migrate Existing Articles to Database

Once the `articles` table is created, migrate your existing 8 articles from `blogPosts.js`:

```sql
-- Example migration for first article
INSERT INTO public.articles (id, title, excerpt, content, category, card_image_url, date, read_time, featured)
VALUES (
  '1',
  'Leadership Transition: Prof. Dauda Bawa Appointed as New TCoEFS Director',
  'Outgoing Director, Prof. Amaza, handing over leadership to the newly appointed Director of the TCoEFS, Prof. Dauda Bawa.',
  '<div class="space-y-4"><p>In a significant leadership development...</p></div>',
  'News',
  '/blog-images/leadership-card.png',
  'March 23, 2025',
  '4 min read',
  true
);

-- Repeat for articles 2-8 with their respective data
```

**Note**: After migration, update your frontend code to fetch articles from Supabase instead of the static `blogPosts.js` file.

---

## Database Schema Reference (Complete)

### Articles Table

| Column          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | TEXT      | Primary key (unique alphanumeric)     |
| title           | TEXT      | Article title                         |
| excerpt         | TEXT      | Short description                     |
| content         | TEXT      | Full HTML content                     |
| category        | TEXT      | News/Training/Research/Partnership    |
| card_image_url  | TEXT      | Thumbnail image URL                   |
| date            | TEXT      | Publication date                      |
| read_time       | TEXT      | Reading time estimate                 |
| featured        | BOOLEAN   | Is this the featured article?         |
| slug            | TEXT      | URL-friendly slug (optional)          |
| created_at      | TIMESTAMP | Creation timestamp                    |
| updated_at      | TIMESTAMP | Last update timestamp                 |
| created_by      | UUID      | Admin who created (nullable)          |
| updated_by      | UUID      | Admin who last updated (nullable)     |

### Article Images Table

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key (auto-generated)          |
| article_id  | TEXT      | Foreign key to articles               |
| image_url   | TEXT      | Supabase Storage URL                  |
| image_type  | TEXT      | 'card' or 'content'                   |
| alt_text    | TEXT      | Image alt text (optional)             |
| created_at  | TIMESTAMP | Upload timestamp                      |
| uploaded_by | UUID      | Admin who uploaded (nullable)         |

---

## Admin CMS Next Steps

After setting up the database and admin user:

1. **Create Admin Routes**:
   - `/admin` - Admin dashboard
   - `/admin/articles` - Article list view
   - `/admin/articles/new` - Create new article
   - `/admin/articles/:id/edit` - Edit article

2. **Implement Admin Components**:
   - Admin layout with navigation
   - Article list with search/filter
   - Rich text editor for content creation
   - Image upload component
   - Featured article toggle

3. **Update Frontend**:
   - Fetch articles from Supabase instead of `blogPosts.js`
   - Update `getPostById()`, `getFeaturedPosts()`, `getRecentPosts()`
   - Handle dynamic article IDs from database

4. **ID Generation Strategy**:
   - Auto-increment: `news1`, `news2`, `news3`, etc.
   - Or use slug-based: `leadership-transition-2025`
   - Ensure uniqueness constraint is enforced

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **TcoEFS Blog GitHub**: [Your repository URL]

---

**Document Version:** 2.0  
**Last Updated:** October 23, 2024  
**Maintained by:** TcoEFS Development Team

---

## TODO: Admin CMS Implementation Checklist

- [ ] Create `articles` table in Supabase
- [ ] Create `article_images` table in Supabase
- [ ] Set up Storage bucket for images
- [ ] Configure RLS policies for admin-only access
- [ ] Set up admin user with proper role
- [ ] Migrate existing 8 articles from `blogPosts.js` to database
- [ ] Create admin authentication check middleware
- [ ] Build admin dashboard layout
- [ ] Implement article list view with search/filter
- [ ] Build article creation form with rich text editor
- [ ] Add image upload functionality
- [ ] Implement article update/edit functionality
- [ ] Add article delete functionality (with featured check)
- [ ] Build featured article toggle UI
- [ ] Update frontend to fetch from database
- [ ] Test all CRUD operations
- [ ] Deploy and verify production functionality