import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Enable CORS for main site
  res.setHeader('Access-Control-Allow-Origin', 'https://tcoefs-unijos.org');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch 3 latest articles ordered by published_date (most recent first)
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, excerpt, category, date, card_image_url, read_time, published_date')
      .order('published_date', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch articles'
      });
    }

    // Format response for main site consumption
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      date: article.date,
      image: article.card_image_url,
      readTime: article.read_time,
      url: `https://blog.tcoefs-unijos.org/news/${article.id}`
    }));

    // Return success response
    return res.status(200).json({
      success: true,
      count: formattedArticles.length,
      articles: formattedArticles
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
