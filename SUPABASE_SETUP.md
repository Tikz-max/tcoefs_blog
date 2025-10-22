# Supabase Setup Guide for TcoEFS Blog

This guide will walk you through setting up Supabase authentication and database for the TcoEFS Blog application.

---

## Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Configure Authentication](#2-configure-authentication)
3. [Create Database Tables](#3-create-database-tables)
4. [Set Up Row Level Security (RLS)](#4-set-up-row-level-security-rls)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Test Authentication](#6-test-authentication)

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

---

## 5. Configure Environment Variables

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

## 6. Test Authentication

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

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **TcoEFS Blog GitHub**: [Your repository URL]

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** TcoEFS Development Team