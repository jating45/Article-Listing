import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterPage from "../Components/Filters";
import Pagination from "../Components/Pagination";
import SubscribeCTA from "../Components/SubscribeCTA";
import EditorialCTA from "../Components/EditorialCTA";
import ArticleSlider from "../Components/SliderArticle";
import ArticleList from "../Components/ArticleList";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/articleListingPage.css";

interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
}

const ArticleListingPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState(18);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        console.log("API Response:", response.data);
        
        if (Array.isArray(response.data)) {
          setArticles(response.data.slice(0, 36));
        } else if (response.data && Array.isArray(response.data.articles)) {
          setArticles(response.data.articles.slice(0, 36));
        } else {
          console.error("Unexpected API Response Format:", response.data);
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const loadMoreArticles = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleArticles((prev) => Math.min(prev + 18, articles.length));
      setLoadingMore(false);
    }, 2000); // Simulate loading time
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div className="container mt-4">
      <h2 className="mb-4">Article Listing</h2>
      <ArticleSlider />
      <FilterPage />
      <div className="row">
        {articles.slice(0, visibleArticles).map((article, index) => (
          <React.Fragment key={article.id}>
            <div className="col-md-4 mb-4">
              <ArticleList article={article} />
            </div>
            {(index + 1) % 6 === 0 && index !== 0 && (
              (Math.floor((index + 1) / 6) % 2 === 1 ? <SubscribeCTA /> : <EditorialCTA />)
            )}
          </React.Fragment>
        ))}
    </div>
    {visibleArticles < articles.length && (
        <div className="text-center mt-3">
          {loadingMore ? (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={loadMoreArticles}>
              Load More
            </button>
          )}
        </div>
      )}
      <Pagination currentPage={0} totalPages={0} onPageChange={function (): void {
        throw new Error("Function not implemented.");
      } }/>
    </div>
  );
};

export default ArticleListingPage;
