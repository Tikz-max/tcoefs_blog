# Integration Guide - Authentication & Social Features

This guide shows you how to integrate the authentication and social features (Like, Comment, Share) into your TcoEFS Blog components.

---

## Table of Contents

1. [Homepage Integration](#homepage-integration)
2. [ArticleView Integration](#articleview-integration)
3. [Component Usage Examples](#component-usage-examples)
4. [Testing the Features](#testing-the-features)

---

## Homepage Integration

### Update the User Icon to Use UserMenu Component

In `src/components/Homepage.jsx`, import and use the `UserMenu` component:

```jsx
// Add to imports at the top
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";
import { useState } from "react"; // if not already imported

// Add state for auth modal
const [authModalOpen, setAuthModalOpen] = useState(false);

// Replace the existing User button in the navigation with:
<UserMenu onOpenAuth={() => setAuthModalOpen(true)} />

// Add the AuthModal before the closing div of your component
<AuthModal 
  isOpen={authModalOpen} 
  onClose={() => setAuthModalOpen(false)} 
/>
```

### Full Example for Navigation Section

```jsx
{/* Right Pill - Icon Buttons (Desktop) */}
<div className="hidden md:flex bg-white/90 backdrop-blur-md rounded-full px-3 py-3 shadow-[0_-1px_6px_rgba(49,104,64,0.12),0_4px_6px_rgba(255,255,255,0.6)] border border-[#e8f2ed] absolute right-3 sm:right-6">
  <div className="flex items-center gap-2">
    {/* Replace the old User button with UserMenu */}
    <UserMenu onOpenAuth={() => setAuthModalOpen(true)} />
    
    <a
      href="https://www.tcoefs-unijos.org/contact"
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms]"
      aria-label="Contact"
    >
      <Phone size={16} />
    </a>
    
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms]"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  </div>
</div>

{/* Add AuthModal at the end of your return statement */}
<AuthModal 
  isOpen={authModalOpen} 
  onClose={() => setAuthModalOpen(false)} 
/>
```

---

## ArticleView Integration

### Add Social Features to Article Page

In `src/components/ArticleView.jsx`, import the social components:

```jsx
// Add to imports at the top
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
```

### Add Action Buttons After Article Hero

Add this section after the hero section (title, excerpt) and before the featured image:

```jsx
{/* Social Actions */}
<div className="max-w-[900px] mx-auto px-6 md:px-12 pb-4">
  <div className="flex items-center gap-3">
    <LikeButton postId={article.id} showCount={true} size="default" />
    <ShareButton 
      postId={article.id} 
      title={article.title} 
      excerpt={article.excerpt}
      size="default"
    />
  </div>
</div>
```

### Add Comment Section After Article Content

Add this section after the article content and before the Related Blogs section:

```jsx
{/* Comments Section */}
<div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
  <CommentSection postId={article.id} />
</div>
```

### Full ArticleView Structure Example

```jsx
const ArticleView = ({ article, onBack }) => {
  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-4 z-40 px-6 md:px-12 pt-4">
        <button onClick={onBack} className="...">
          <ArrowLeft size={20} className="text-primary" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-8">
        {/* Category and Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider font-medium text-secondary">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-primary mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg md:text-xl leading-relaxed text-secondary mb-8">
          {article.excerpt}
        </p>
      </div>

      {/* 🆕 Social Actions (Like & Share) */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12 pb-4">
        <div className="flex items-center gap-3">
          <LikeButton postId={article.id} showCount={true} size="default" />
          <ShareButton 
            postId={article.id} 
            title={article.title} 
            excerpt={article.excerpt}
            size="default"
          />
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Article Content */}
      <main className="max-w-[800px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <article className="prose prose-lg max-w-none">
          <div
            className="article-content text-[19px] leading-[32px] text-text space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      {/* 🆕 Comments Section */}
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
        <CommentSection postId={article.id} />
      </div>

      {/* Related Blogs Section */}
      <section className="bg-white py-24 md:py-32 mt-16">
        {/* ... existing related blogs code ... */}
      </section>

      {/* Footer */}
      <footer className="bg-primary px-6 py-12 md:px-12 md:py-16">
        {/* ... existing footer code ... */}
      </footer>
    </div>
  );
};
```

---

## Component Usage Examples

### LikeButton Component

```jsx
import LikeButton from "./LikeButton";

// Basic usage
<LikeButton postId="blog-post-1" />

// With like count displayed
<LikeButton postId="blog-post-1" showCount={true} />

// Small size (for compact layouts)
<LikeButton postId="blog-post-1" showCount={true} size="small" />

// Large size (for prominent placement)
<LikeButton postId="blog-post-1" showCount={true} size="large" />

// Without count (just the heart)
<LikeButton postId="blog-post-1" showCount={false} />
```

**Props:**
- `postId` (required): Unique identifier for the blog post
- `showCount` (optional, default: `true`): Whether to show like count
- `size` (optional, default: `"default"`): Button size - `"small"` | `"default"` | `"large"`

### ShareButton Component

```jsx
import ShareButton from "./ShareButton";

// Basic usage
<ShareButton 
  postId="blog-post-1" 
  title="Amazing Article Title" 
  excerpt="This is a brief description..." 
/>

// Small size
<ShareButton 
  postId="blog-post-1" 
  title="Amazing Article Title" 
  excerpt="This is a brief description..." 
  size="small"
/>

// Large size
<ShareButton 
  postId="blog-post-1" 
  title="Amazing Article Title" 
  excerpt="This is a brief description..." 
  size="large"
/>
```

**Props:**
- `postId` (required): Unique identifier for the blog post
- `title` (required): Title of the article to share
- `excerpt` (required): Brief description for social share
- `size` (optional, default: `"default"`): Button size - `"small"` | `"default"` | `"large"`

**Features:**
- Facebook sharing
- Twitter sharing
- LinkedIn sharing
- Copy link to clipboard
- Native mobile share API support

### CommentSection Component

```jsx
import CommentSection from "./CommentSection";

// Basic usage (all you need!)
<CommentSection postId="blog-post-1" />
```

**Props:**
- `postId` (required): Unique identifier for the blog post

**Features:**
- Add new comments (authenticated users only)
- View all comments with timestamps
- Delete own comments
- Real-time comment display
- Auto-loads comments from Supabase
- Shows "Sign in to comment" prompt for unauthenticated users

### UserMenu Component

```jsx
import UserMenu from "./auth/UserMenu";
import { useState } from "react";

const [authModalOpen, setAuthModalOpen] = useState(false);

// Basic usage
<UserMenu onOpenAuth={() => setAuthModalOpen(true)} />
```

**Props:**
- `onOpenAuth` (required): Callback function to open authentication modal

**Features:**
- Shows user avatar with initial when signed in
- Dropdown menu with:
  - User name and email
  - Liked articles count
  - Comments count
  - Settings option
  - Sign out button
- Opens authentication modal when clicked while signed out

### AuthModal Component

```jsx
import AuthModal from "./auth/AuthModal";
import { useState } from "react";

const [authModalOpen, setAuthModalOpen] = useState(false);

// Basic usage
<AuthModal 
  isOpen={authModalOpen} 
  onClose={() => setAuthModalOpen(false)} 
/>
```

**Props:**
- `isOpen` (required): Boolean to control modal visibility
- `onClose` (required): Callback function to close the modal

**Features:**
- Email OTP authentication flow
- Google OAuth sign-in
- Apple OAuth sign-in
- Two-step process: Enter email → Verify code
- Back button to return to email step
- Resend OTP code option
- Terms of Service and Privacy Policy links

---

## Testing the Features

### 1. Test Authentication Flow

**Email OTP:**
1. Start your dev server: `npm run dev`
2. Click the User icon in navigation
3. Enter your email address
4. Click "Continue with Email"
5. Check your email for the 6-digit code
6. Enter the code and verify
7. ✅ You should be signed in with UserMenu showing your avatar

**Google Sign-In:**
1. Click the User icon
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. ✅ You should be redirected back and signed in

### 2. Test Like Feature

1. Make sure you're signed in
2. Navigate to an article
3. Click the heart icon
4. ✅ Heart should turn green/filled and count should increment
5. Click again to unlike
6. ✅ Heart should turn white/outlined and count should decrement

**When Not Signed In:**
1. Sign out from UserMenu
2. Try to click the heart icon
3. ✅ Should show tooltip: "Sign in to like posts"

### 3. Test Comment Feature

1. Make sure you're signed in
2. Scroll to the comments section
3. Type a comment in the textarea
4. Click the send icon (paper plane)
5. ✅ Comment should appear immediately in the list
6. Hover over your comment
7. ✅ Delete button should appear
8. Click delete and confirm
9. ✅ Comment should be removed

**When Not Signed In:**
1. Sign out from UserMenu
2. Try to type in the comment box
3. ✅ Box should show "Sign in to leave a comment"
4. Try to submit anyway
5. ✅ Should show prompt: "Please sign in to leave a comment"

### 4. Test Share Feature

1. On any article, click the share icon
2. ✅ Dropdown menu should appear with:
   - Share on Facebook
   - Share on Twitter
   - Share on LinkedIn
   - Copy link
3. Click "Copy link"
4. ✅ Button should change to "Link copied!" with checkmark
5. Click any social platform
6. ✅ Should open share dialog in new window

**On Mobile:**
1. Open on mobile device or Chrome DevTools mobile view
2. Click share icon
3. ✅ Native mobile share sheet should appear (if supported)

### 5. Test User Menu

**When Signed In:**
1. Click the User icon
2. ✅ Dropdown should show:
   - Your avatar with initial
   - Your name and email
   - Liked Articles count
   - My Comments count
   - Settings option
   - Sign out button
3. Like a few articles
4. ✅ Liked Articles count should update
5. Post some comments
6. ✅ My Comments count should update
7. Click "Sign Out"
8. ✅ Should be signed out and menu closes

**When Not Signed In:**
1. Click the User icon
2. ✅ Should open authentication modal

---

## Troubleshooting

### "Must be signed in" errors
- Verify you're logged in (check UserMenu shows your avatar)
- Check browser console for authentication errors
- Verify Supabase credentials in `.env` are correct

### Likes/Comments not persisting
- Check Supabase dashboard → Table Editor
- Verify RLS policies are enabled
- Check browser console for database errors

### Social login not working
- Verify OAuth providers are configured in Supabase
- Check redirect URLs match exactly
- Clear browser cache and cookies

### Components not showing
- Verify imports are correct
- Check that AuthProvider wraps your app in `App.jsx`
- Verify all dependencies are installed: `npm install`

---

## Advanced Customization

### Custom Button Colors

You can modify button colors by updating the Tailwind classes:

```jsx
// Change accent color in LikeButton
className="bg-accent" // Change to bg-blue-500, bg-red-500, etc.

// Change hover color
className="hover:bg-accent-dark" // Change to hover:bg-blue-600, etc.
```

### Custom Comment Styling

Modify the comment cards in `CommentSection.jsx`:

```jsx
// Make comments more rounded
className="rounded-lg" // Change to rounded-xl or rounded-2xl

// Change comment background
className="bg-white" // Change to bg-gray-50, bg-sage-light, etc.
```

### Add Comment Reactions

Extend the comment schema to include reactions:

```sql
ALTER TABLE public.comments 
ADD COLUMN reactions JSONB DEFAULT '{}'::jsonb;
```

---

## Next Features to Build

- [ ] User profile page showing all liked posts and comments
- [ ] Comment editing (add updated_at timestamp)
- [ ] Comment replies (nested comments)
- [ ] Email notifications for new comments
- [ ] Admin moderation panel
- [ ] Real-time comment updates using Supabase Realtime
- [ ] Bookmark feature (similar to likes)
- [ ] Comment reactions (👍, ❤️, 🎉, etc.)

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** TcoEFS Development Team