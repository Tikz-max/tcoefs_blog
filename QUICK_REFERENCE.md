# Quick Reference - TcoEFS Blog Auth & Social Features

> **Fast lookup guide for developers**

---

## 🚀 30-Second Start

```bash
# 1. Install Supabase
npm install @supabase/supabase-js

# 2. Set up environment
cp .env.example .env
# Add your Supabase URL and key to .env

# 3. Run SQL in Supabase dashboard
# (See SUPABASE_SETUP.md for SQL code)

# 4. Start dev server
npm run dev
```

---

## 📦 Import Statements

```jsx
// Authentication
import { useAuth } from "../context/AuthContext";
import AuthModal from "./auth/AuthModal";
import UserMenu from "./auth/UserMenu";

// Social Features
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
```

---

## 🔑 useAuth() Hook

```jsx
const {
  // User State
  user,              // Current user object or null
  session,           // Current session
  loading,           // Boolean: auth loading state
  
  // User Data
  userLikedPosts,    // Array of liked post IDs
  userComments,      // Array of user's comments
  
  // Auth Methods
  sendOTP,           // (email) => Promise
  verifyOTP,         // (email, token) => Promise
  signInWithGoogle,  // () => Promise
  signInWithApple,   // () => Promise
  signOut,           // () => Promise
  
  // Social Actions
  toggleLike,        // (postId) => Promise
  addComment,        // (postId, text) => Promise
  deleteComment,     // (commentId) => Promise
  getPostComments,   // (postId) => Promise
  isPostLiked,       // (postId) => Boolean
  getPostLikeCount,  // (postId) => Promise
} = useAuth();
```

---

## 🎯 Component Props

### AuthModal
```jsx
<AuthModal 
  isOpen={boolean}
  onClose={() => void}
/>
```

### UserMenu
```jsx
<UserMenu 
  onOpenAuth={() => void}
/>
```

### LikeButton
```jsx
<LikeButton 
  postId="post-1"              // required
  showCount={true}             // optional, default: true
  size="default"               // optional: "small" | "default" | "large"
/>
```

### ShareButton
```jsx
<ShareButton 
  postId="post-1"              // required
  title="Article Title"        // required
  excerpt="Description..."     // required
  size="default"               // optional: "small" | "default" | "large"
/>
```

### CommentSection
```jsx
<CommentSection 
  postId="post-1"              // required
/>
```

---

## 🗄️ Database Schema

### Likes Table
```sql
CREATE TABLE public.likes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  post_id TEXT,
  created_at TIMESTAMP,
  UNIQUE(user_id, post_id)
);
```

### Comments Table
```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  post_id TEXT,
  text TEXT,
  user_name TEXT,
  user_email TEXT,
  created_at TIMESTAMP
);
```

---

## 🔐 Environment Variables

```bash
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get from:** Supabase Dashboard → Settings → API

---

## 📝 Common Code Patterns

### Check if user is signed in
```jsx
const { user } = useAuth();

if (user) {
  // User is signed in
  console.log(user.email);
} else {
  // User is not signed in
}
```

### Sign in flow
```jsx
const [authOpen, setAuthOpen] = useState(false);
const { user } = useAuth();

// Open modal if not signed in
if (!user) {
  setAuthOpen(true);
}

// Render
<AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
```

### Like a post
```jsx
const { toggleLike, isPostLiked } = useAuth();

const handleLike = async () => {
  const result = await toggleLike("post-1");
  if (result.success) {
    console.log("Liked:", result.isLiked);
  }
};

const liked = isPostLiked("post-1");
```

### Add a comment
```jsx
const { addComment } = useAuth();

const handleSubmit = async (text) => {
  const result = await addComment("post-1", text);
  if (result.success) {
    console.log("Comment added:", result.data);
  }
};
```

### Get comments
```jsx
const { getPostComments } = useAuth();
const [comments, setComments] = useState([]);

useEffect(() => {
  const loadComments = async () => {
    const result = await getPostComments("post-1");
    if (result.success) {
      setComments(result.data);
    }
  };
  loadComments();
}, []);
```

---

## 🎨 CSS Classes

### Animations
```css
.animate-fade-in       /* Fade in animation (220ms) */
```

### Transitions
```css
transition-all duration-[180ms]   /* Quick transition */
transition-all duration-[220ms]   /* Standard transition */
```

### Colors
```jsx
bg-background      // #f2f8f5 - Sage background
text-text          // #0e1d07 - Forest text
text-primary       // #1e2a1a - Dark green
text-secondary     // #132315 - Secondary dark
bg-accent          // #316840 - Living green
bg-accent-dark     // #254a30 - Dark accent
bg-sage-light      // #d9e8e0 - Light sage
bg-sage-medium     // #b3d1c2 - Medium sage
```

---

## 🧪 Testing Checklist

- [ ] User can sign in with email OTP
- [ ] User can sign in with Google
- [ ] User menu shows when signed in
- [ ] Can like/unlike articles
- [ ] Can add comments
- [ ] Can delete own comments
- [ ] Can share articles
- [ ] "Sign in" prompts work for guests
- [ ] Data persists in Supabase
- [ ] Works on mobile/tablet/desktop

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid credentials" | Check `.env` file, restart dev server |
| Email OTP not received | Check spam, verify Email provider enabled |
| Components not showing | Verify imports, check AuthProvider in App.jsx |
| Likes not saving | Check database tables exist, verify RLS policies |
| TypeScript errors | We're using JSX, not TypeScript |

---

## 📂 File Locations

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthModal.jsx
│   │   └── UserMenu.jsx
│   ├── LikeButton.jsx
│   ├── CommentSection.jsx
│   └── ShareButton.jsx
├── context/
│   └── AuthContext.jsx
└── lib/
    └── supabase.js
```

---

## 🔗 Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Supabase Docs:** https://supabase.com/docs
- **Lucide Icons:** https://lucide.dev
- **Tailwind CSS:** https://tailwindcss.com

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README_AUTH.md` | Quick start guide |
| `SUPABASE_SETUP.md` | Database setup |
| `INTEGRATION_GUIDE.md` | Component usage |
| `MIGRATION_CHECKLIST.md` | Step-by-step integration |
| `FILES_CREATED.md` | All files overview |
| `QUICK_REFERENCE.md` | This file |

---

## ⚡ Performance Tips

1. **Optimistic Updates:** LikeButton updates UI immediately
2. **Caching:** User data cached in AuthContext
3. **Lazy Loading:** Components only load when needed
4. **Debouncing:** Comment submissions are debounced

---

## 🔒 Security Notes

- ✅ RLS enabled on all tables
- ✅ Users can only modify their own data
- ✅ Environment variables never committed
- ✅ OAuth handled by Supabase
- ✅ Input validation on client & server

---

**Version:** 1.0  
**Last Updated:** January 2025