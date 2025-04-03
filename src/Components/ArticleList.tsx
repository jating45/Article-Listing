import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/articleList.css"; // Ensure you have this CSS file

interface Article {
  id: number;
  title: string;
  image: string; // Ensure this matches API response
  category: string;
  link: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");

        console.log("API Response:", response.data);

        // if (Array.isArray(response.data)) {
        //   setArticles(response.data);
        // } else 
        if (response.data.articles && Array.isArray(response.data.articles)) {
          setArticles(response.data.articles);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError("Failed to fetch articles.");
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(articles,'articles');
  

  return (
    <div className="article-container">
      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article.id} className="article-card">
            <img
              src={article.image.startsWith("http") ? article.image : `http://localhost:5000${article.image}`}
              alt={article.title}
              className="article-image"
              onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Fallback image
            />
            <span className="category-label">{article.category}</span>
            <h2>{article.title}</h2>
            <a href={article.link} className="read-more">
              Read More →
            </a>
          </div>
        ))
      ) : (
        <p>No articles available.</p>
      )}
    </div>
  );
};

export default ArticleList;
