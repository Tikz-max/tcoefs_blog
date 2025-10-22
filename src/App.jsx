import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./components/Homepage";
import ArticleView from "./components/ArticleView";
import { getPostById } from "./data/blogPosts";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={<Homepage />} />

          {/* Individual News Article Route - matches /news/1, /news/2, etc. */}
          <Route path="/news/:id" element={<ArticleViewWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Wrapper component to handle article loading from URL
function ArticleViewWrapper() {
  const { id } = useParams();
  const article = getPostById(parseInt(id));

  if (!article) {
    // Redirect to homepage if article not found
    return <Navigate to="/" replace />;
  }

  return <ArticleView article={article} />;
}

export default App;
