import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterPage from "../Components/Filters";
import ArticleCard from "../Components/ArticleCard";
import Pagination from "../Components/Pagination";
import SubscribeCTA from "../Components/SubscribeCTA";
import EditorialCTA from "../Components/EditorialCTA";
import ArticleSlider from "../Components/SliderArticle";
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

const PAGE_SIZE = 18;

const ArticleListing: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<{ category?: string; author?: string; date?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        console.log("API Response:", response.data);

        let articlesData: Article[] = [];

        if (Array.isArray(response.data)) {
          articlesData = response.data;
        } else if (response.data && Array.isArray(response.data.articles)) {
          articlesData = response.data.articles;
        } else {
          console.error("Unexpected API Response Format:", response.data);
          throw new Error("Unexpected API response format");
        }

        setArticles(articlesData);
        setFilteredArticles(articlesData); 
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);


  useEffect(() => {
    let filtered = articles;

    if (filters.category) {
      filtered = filtered.filter(
        (article) => article.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    if (filters.author) {
      filtered = filtered.filter(
        (article) => article.author.toLowerCase() === filters.author?.toLowerCase()
      );
    }
    if (filters.date) {
      filtered = filtered.filter((article) => article.date === filters.date);
    }

    console.log("Filtered Articles:", filtered);
    setFilteredArticles(filtered);
    setCurrentPage(1); 
  }, [filters, articles]);


  const handleFilterChange = (newFilters: { category?: string; author?: string; date?: string }) => {
    console.log("Applying Filters:", newFilters);
    setFilters(newFilters);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const currentArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Article Listing</h2>
      <ArticleSlider />

      {/* Filter Component */}
      <FilterPage onFilterChange={handleFilterChange} />

      <div className="row">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <React.Fragment key={article.id}>
              <div className="col-md-4 mb-4">
                <ArticleCard article={article} />
              </div>
              {(index + 1) % 6 === 0 && index !== 0 && (
                Math.floor((index + 1) / 6) % 2 === 1 ? <SubscribeCTA /> : <EditorialCTA />
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="text-center text-muted">No articles available.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ArticleListing;
