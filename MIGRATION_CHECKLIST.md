# Migration Checklist - Adding Auth & Social Features

> **Step-by-step guide to integrate authentication and social features into your existing TcoEFS Blog**

---

## 📋 Prerequisites

- [ ] Node.js installed (v16 or higher)
- [ ] Existing TcoEFS Blog project
- [ ] Supabase account (free tier is fine)
- [ ] Email for testing

---

## Part 1: Installation & Setup (15 minutes)

### Step 1: Install Supabase
```bash
npm install @supabase/supabase-js
```
- [ ] Run the command
- [ ] Verify in `package.json` that `@supabase/supabase-js` is listed

### Step 2: Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Click "New Project"
- [ ] Name: `tcoefs-blog`
- [ ] Choose database password (save it!)
- [ ] Select region (closest to users)
- [ ] Wait for project to finish setting up (~2 min)

### Step 3: Get Supabase Credentials
- [ ] Go to Settings → API in Supabase dashboard
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key

### Step 4: Create Environment File
```bash
cp .env.example .env
```
- [ ] Run the command
- [ ] Open `.env` file
- [ ] Paste your Supabase URL: `VITE_SUPABASE_URL=https://xxxxx.supabase.co`
- [ ] Paste your anon key: `VITE_SUPABASE_ANON_KEY=your-key-here`
- [ ] Save the file
- [ ] Verify `.env` is in `.gitignore` (should already be there)

---

## Part 2: Database Setup (10 minutes)

### Step 5: Create Database Tables
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Click "New query"
- [ ] Copy and paste this SQL:

```sql
-- Create likes table
CREATE TABLE public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  text TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX likes_user_id_idx ON public.likes(user_id);
CREATE INDEX likes_post_id_idx ON public.likes(post_id);
CREATE INDEX comments_user_id_idx ON public.comments(user_id);
CREATE INDEX comments_post_id_idx ON public.comments(post_id);
CREATE INDEX comments_created_at_idx ON public.comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
```

- [ ] Click "Run" (or press Ctrl+Enter)
- [ ] Verify success message appears
- [ ] Go to Table Editor → Verify `likes` and `comments` tables exist

---

## Part 3: Authentication Setup (10 minutes)

### Step 6: Enable Email OTP
- [ ] Go to Authentication → Providers in Supabase
- [ ] Find "Email" provider
- [ ] Ensure it's enabled (toggle should be ON)
- [ ] Click on Email to expand settings
- [ ] Check "Confirm email" is enabled
- [ ] Click "Save"

### Step 7: Enable Google Sign-In (Optional)
- [ ] Go to Authentication → Providers → Google
- [ ] Toggle "Enable Sign in with Google" to ON
- [ ] Get Google OAuth credentials:
  - [ ] Go to https://console.cloud.google.com
  - [ ] Create new project or select existing
  - [ ] Go to APIs & Services → Credentials
  - [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
  - [ ] Application type: Web application
  - [ ] Authorized redirect URIs: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
  - [ ] Copy Client ID and Client Secret
- [ ] Paste credentials in Supabase
- [ ] Click "Save"

### Step 8: Enable Apple Sign-In (Optional)
- [ ] Go to Authentication → Providers → Apple
- [ ] Toggle "Enable Sign in with Apple" to ON
- [ ] Follow Apple Developer setup (requires paid account)
- [ ] Add credentials to Supabase
- [ ] Click "Save"

---

## Part 4: Code Integration (20 minutes)

### Step 9: Update App.jsx
- [ ] Open `src/App.jsx`
- [ ] Add import at top: `import { AuthProvider } from "./context/AuthContext";`
- [ ] Wrap `<Homepage />` with `<AuthProvider>`

**Before:**
```jsx
function App() {
  return <Homepage />;
}
```

**After:**
```jsx
function App() {
  return (
    <AuthProvider>
      <Homepage />
    </AuthProvider>
  );
}
```
- [ ] Save file

### Step 10: Update Homepage.jsx
- [ ] Open `src/components/Homepage.jsx`
- [ ] Add these imports at the top:
```jsx
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";
```
- [ ] Add state at the top of the component:
```jsx
const [authModalOpen, setAuthModalOpen] = useState(false);
```
- [ ] Find the User icon button (around line 180)
- [ ] Replace the entire button with:
```jsx
<UserMenu onOpenAuth={() => setAuthModalOpen(true)} />
```
- [ ] At the very end of the return statement (before closing `</div>`), add:
```jsx
<AuthModal 
  isOpen={authModalOpen} 
  onClose={() => setAuthModalOpen(false)} 
/>
```
- [ ] Save file

### Step 11: Update ArticleView.jsx
- [ ] Open `src/components/ArticleView.jsx`
- [ ] Add these imports at the top:
```jsx
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
```

- [ ] Find the Hero section (around line 30-50)
- [ ] After the excerpt (closing `</p>`), add this section:
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

- [ ] Find the closing `</main>` tag (after article content, around line 130)
- [ ] After `</main>`, add this section:
```jsx
{/* Comments Section */}
<div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
  <CommentSection postId={article.id} />
</div>
```
- [ ] Save file

### Step 12: Add CSS Animation
- [ ] Open `src/index.css`
- [ ] Find the `@layer utilities` section
- [ ] After the `@keyframes fadeIn` definition, add:
```css
.animate-fade-in {
  animation: fadeIn 220ms ease-out;
}
```
- [ ] Save file

---

## Part 5: Testing (15 minutes)

### Step 13: Start Development Server
```bash
npm run dev
```
- [ ] Run the command
- [ ] Server starts successfully
- [ ] No errors in terminal
- [ ] Open browser to http://localhost:5173

### Step 14: Test User Icon & Auth Modal
- [ ] Click the User icon in top navigation
- [ ] Auth modal opens
- [ ] Modal shows "Welcome to TcoEFS" title
- [ ] Email input field is visible
- [ ] Google sign-in button is visible
- [ ] Apple sign-in button is visible (if enabled)
- [ ] Click X to close modal
- [ ] Modal closes

### Step 15: Test Email OTP Authentication
- [ ] Click User icon again
- [ ] Enter your email address
- [ ] Click "Continue with Email"
- [ ] Check that modal changes to "Verify Your Email"
- [ ] Check your email inbox
- [ ] Find 6-digit code
- [ ] Enter code in modal
- [ ] Click "Verify & Sign In"
- [ ] ✅ You should be signed in
- [ ] ✅ User icon should show green dot
- [ ] Click User icon
- [ ] ✅ Dropdown menu shows your name and email

### Step 16: Test Google Sign-In (if enabled)
- [ ] Sign out from User menu
- [ ] Click User icon
- [ ] Click "Sign in with Google"
- [ ] Google OAuth popup opens
- [ ] Select Google account
- [ ] ✅ Redirected back and signed in
- [ ] ✅ User menu shows Google account info

### Step 17: Test Like Feature
- [ ] Navigate to any article
- [ ] Find the heart icon below the title
- [ ] Click the heart icon
- [ ] ✅ Heart turns green/filled
- [ ] ✅ Like count shows (1)
- [ ] Click heart again
- [ ] ✅ Heart turns white/outlined
- [ ] ✅ Like count decreases (0)
- [ ] Sign out
- [ ] Click heart
- [ ] ✅ Tooltip shows "Sign in to like posts"

### Step 18: Test Comment Feature
- [ ] Sign back in
- [ ] Scroll to Comments section at bottom
- [ ] Type a test comment: "Testing comments feature!"
- [ ] Click send button (paper plane icon)
- [ ] ✅ Comment appears immediately
- [ ] ✅ Your avatar initial shows
- [ ] ✅ Your name appears
- [ ] ✅ Timestamp shows "Just now"
- [ ] Hover over your comment
- [ ] ✅ Delete button appears (trash icon)
- [ ] Click delete, confirm
- [ ] ✅ Comment removed

### Step 19: Test Share Feature
- [ ] Find share icon (next to heart)
- [ ] Click share icon
- [ ] ✅ Dropdown menu appears
- [ ] ✅ Facebook, Twitter, LinkedIn options visible
- [ ] Click "Copy link"
- [ ] ✅ Text changes to "Link copied!"
- [ ] Click Facebook
- [ ] ✅ Facebook share dialog opens in new window
- [ ] Close the popup

### Step 20: Check Supabase Data
- [ ] Go to Supabase dashboard
- [ ] Go to Table Editor
- [ ] Click on `likes` table
- [ ] ✅ Your likes are saved
- [ ] Click on `comments` table
- [ ] ✅ Your test comment was saved (then deleted)
- [ ] Go to Authentication → Users
- [ ] ✅ Your user account exists

---

## Part 6: Final Verification (5 minutes)

### Step 21: Test on Different Browsers
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] All features work in each browser

### Step 22: Test Responsive Design
- [ ] Open Chrome DevTools (F12)
- [ ] Click device toolbar (Ctrl+Shift+M)
- [ ] Test on Mobile (375px)
- [ ] ✅ Auth modal fits screen
- [ ] ✅ Buttons are clickable
- [ ] ✅ Comments section works
- [ ] Test on Tablet (768px)
- [ ] ✅ Everything works properly
- [ ] Test on Desktop (1024px+)
- [ ] ✅ All features working

### Step 23: Test User Flow End-to-End
- [ ] Start fresh (clear browser data or incognito mode)
- [ ] Visit homepage
- [ ] Click an article
- [ ] Try to like (should prompt to sign in)
- [ ] Sign in with email OTP
- [ ] Like the article
- [ ] Add a comment
- [ ] Share the article
- [ ] Go back to homepage
- [ ] User icon shows signed-in state
- [ ] ✅ Complete flow works

---

## Part 7: Cleanup & Documentation (5 minutes)

### Step 24: Clean Up
- [ ] Remove any test comments from database
- [ ] Remove test accounts if needed
- [ ] Verify `.env` is not committed to git
- [ ] Run `git status` to check

### Step 25: Document Your Setup
- [ ] Note your Supabase project URL
- [ ] Save database password somewhere secure
- [ ] Document any customizations made
- [ ] Update your project README if needed

---

## 🎉 Success Criteria

You've successfully integrated all features when:

✅ User can sign in with Email OTP  
✅ User can sign in with Google (if enabled)  
✅ User can sign in with Apple (if enabled)  
✅ User menu shows profile info when signed in  
✅ Users can like articles (authenticated only)  
✅ Users can comment on articles (authenticated only)  
✅ Users can delete their own comments  
✅ Anyone can share articles  
✅ Like counts update in real-time  
✅ Comments display properly with avatars  
✅ All data persists in Supabase  
✅ RLS policies protect user data  
✅ Works on mobile, tablet, desktop  
✅ Design matches organic minimalism style  

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid Supabase URL or key"
**Solution:** 
- Check `.env` file has correct values
- Restart dev server: `npm run dev`
- Verify no extra spaces in `.env`

### Issue: Email OTP not received
**Solution:**
- Check spam/junk folder
- Verify email provider is enabled in Supabase
- Check Supabase logs: Database → Logs

### Issue: "Cannot read property 'id' of undefined"
**Solution:**
- Ensure `article.id` exists in your blog posts data
- Check `src/data/blogPosts.js` has `id` field for each post

### Issue: Likes/Comments not saving
**Solution:**
- Verify database tables exist in Table Editor
- Check RLS policies are enabled
- Look for errors in browser console
- Check Supabase logs for errors

### Issue: Components not showing
**Solution:**
- Verify all files in `src/components/`, `src/context/`, `src/lib/` exist
- Check imports are correct (case-sensitive)
- Verify AuthProvider wraps app in `App.jsx`
- Clear browser cache and hard reload

---

## 📚 Next Steps

Now that everything is working:

1. **Read the documentation:**
   - `SUPABASE_SETUP.md` - Detailed Supabase guide
   - `INTEGRATION_GUIDE.md` - Component usage examples
   - `README_AUTH.md` - Quick reference

2. **Customize the design:**
   - Colors: Edit `src/index.css`
   - Button sizes: Adjust component props
   - Text: Update modal copy in components

3. **Add more features:**
   - User profile page
   - Bookmark feature
   - Comment replies
   - Admin panel
   - Email notifications

4. **Deploy to production:**
   - Set up production Supabase project
   - Configure environment variables on host
   - Test all flows in production
   - Enable email confirmation

---

## ✅ Completion

- [ ] All steps completed
- [ ] All tests passing
- [ ] Documentation read
- [ ] Ready for production

**Congratulations!** 🎉 You've successfully integrated authentication and social features into TcoEFS Blog!

---

**Checklist Version:** 1.0  
**Last Updated:** January 2025  
**Estimated Time:** ~90 minutes