# TcoEFS Blog - Authentication & Social Features

> **Complete authentication system with OTP, Google/Apple sign-in, and social features (Like, Comment, Share)**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

All required packages are already in `package.json`:
- `@supabase/supabase-js` - Supabase client
- `lucide-react` - Icons
- `react` & `react-dom` - React framework

### 2. Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Copy credentials** from Settings → API
3. **Create `.env` file** in project root:

```bash
cp .env.example .env
```

4. **Add your credentials** to `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Tables

Go to **SQL Editor** in Supabase and run:

```sql
-- Likes table
CREATE TABLE public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  text TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

### 4. Configure Authentication Providers

**Enable Email OTP:**
- Go to **Authentication → Providers** in Supabase
- Enable **Email** provider
- Email OTP is now ready!

**Enable Google (Optional):**
- Get credentials from [Google Cloud Console](https://console.cloud.google.com)
- Add to Supabase in **Authentication → Providers → Google**
- Add redirect URL: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`

**Enable Apple (Optional):**
- Get credentials from [Apple Developer](https://developer.apple.com)
- Add to Supabase in **Authentication → Providers → Apple**
- Add redirect URL: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`

### 5. Start Development Server

```bash
npm run dev
```

---

## ✨ Features

### 🔐 Authentication
- **Email OTP** - Passwordless authentication with 6-digit code
- **Google Sign-In** - One-click OAuth authentication
- **Apple Sign-In** - Seamless Apple ID integration
- **Persistent Sessions** - Stay signed in across page reloads
- **User Menu** - Avatar, profile info, sign out

### ❤️ Like System
- Like/unlike articles with heart button
- Real-time like count updates
- Optimistic UI updates for instant feedback
- "Sign in to like" prompt for unauthenticated users
- Data persists in Supabase

### 💬 Comment System
- Add comments to any article
- Delete your own comments
- Real-time comment display
- User avatars with initials
- Relative timestamps (e.g., "2h ago", "Just now")
- "Sign in to comment" prompt for unauthenticated users

### 🔗 Share Feature
- Share on Facebook, Twitter, LinkedIn
- Copy link to clipboard
- Native mobile share API support
- Share dropdown with platform icons
- Works on all articles

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthModal.jsx       # OTP & social login modal
│   │   └── UserMenu.jsx        # User dropdown menu
│   ├── LikeButton.jsx          # Heart/like button
│   ├── CommentSection.jsx      # Comment list & form
│   ├── ShareButton.jsx         # Social share dropdown
│   ├── Homepage.jsx            # Main blog list page
│   └── ArticleView.jsx         # Individual article page
├── context/
│   └── AuthContext.jsx         # Auth state management
├── lib/
│   └── supabase.js            # Supabase client & helpers
└── App.jsx                     # Root component with AuthProvider
```

---

## 🎯 Component Usage

### In Homepage (Navigation)

```jsx
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";

const [authModalOpen, setAuthModalOpen] = useState(false);

// Replace User icon button with:
<UserMenu onOpenAuth={() => setAuthModalOpen(true)} />

// Add modal at end of component:
<AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
```

### In ArticleView

```jsx
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";

// After article hero section:
<div className="flex items-center gap-3">
  <LikeButton postId={article.id} showCount={true} />
  <ShareButton postId={article.id} title={article.title} excerpt={article.excerpt} />
</div>

// After article content:
<CommentSection postId={article.id} />
```

---

## 🧪 Testing

### Test Email OTP
1. Click User icon → Enter email → Click "Continue with Email"
2. Check email for 6-digit code
3. Enter code and verify
4. ✅ Should be signed in with avatar showing

### Test Social Login
1. Click User icon → Click "Sign in with Google/Apple"
2. Complete OAuth flow
3. ✅ Should be signed in

### Test Like Feature
1. Sign in → Go to article → Click heart icon
2. ✅ Heart turns green, count increments
3. Click again → ✅ Heart turns white, count decrements

### Test Comments
1. Sign in → Scroll to comments → Type comment → Click send
2. ✅ Comment appears immediately
3. Hover over comment → Click delete
4. ✅ Comment removed

### Test Share
1. On article → Click share icon
2. ✅ Dropdown shows Facebook, Twitter, LinkedIn, Copy link
3. Click "Copy link" → ✅ Shows "Link copied!"

---

## 🎨 Design Philosophy

All components follow the **Organic Minimalism** design system:

- **Color Palette**: Green spectrum (#f2f8f5 to #0e1d07)
- **Typography**: Gambarino font, clear hierarchy
- **Spacing**: 8px base unit, generous whitespace
- **Animations**: 180ms (quick) / 220ms (standard)
- **Accessibility**: WCAG AA compliant, keyboard navigation
- **Responsiveness**: Mobile-first, works on all devices

---

## 🔒 Security

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **User data isolation** - users can only modify their own data
- ✅ **Secure authentication** - handled by Supabase
- ✅ **Environment variables** - credentials never committed to git
- ✅ **Input validation** - both client and server side

---

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase configuration
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Component integration examples
- **[styles-new.md](./designGuide/styles-new.md)** - Complete design system

---

## 🐛 Troubleshooting

### "Invalid credentials" error
- Check `.env` file has correct Supabase URL and key
- Restart dev server after changing `.env`

### Email OTP not sending
- Verify Email provider is enabled in Supabase
- Check spam folder
- Check Supabase logs in Database → Logs

### Social login not working
- Verify OAuth provider is configured in Supabase
- Check redirect URLs match exactly
- Clear browser cache

### Likes/Comments not saving
- Check database tables exist in Supabase
- Verify RLS policies are enabled
- Check browser console for errors

---

## 🚢 Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables on hosting platform
- [ ] Enable email confirmation for production
- [ ] Set up email templates in Supabase
- [ ] Configure custom domain (if using)
- [ ] Test all auth flows in production
- [ ] Enable rate limiting in Supabase
- [ ] Set up monitoring and error tracking

---

## 🎉 What's Next?

**Implemented ✅**
- Email OTP authentication
- Google & Apple sign-in
- Like/unlike articles
- Comment on articles
- Share articles
- User menu with profile info

**Coming Soon 🚀**
- User profile page
- View all liked articles
- View all comments
- Edit comments
- Comment replies
- Email notifications
- Admin moderation panel
- Real-time updates

---

## 💡 Tips

1. **Development**: Use a test email for OTP during development
2. **Testing**: Create multiple accounts to test interactions
3. **Customization**: All colors are in `index.css` using CSS variables
4. **Icons**: Using Lucide React - add more from [lucide.dev](https://lucide.dev)
5. **Database**: View data in Supabase Table Editor for debugging

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Author:** TcoEFS Development Team