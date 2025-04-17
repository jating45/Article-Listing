import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import FilterPage from "../Components/Filters";
import Pagination from "../Components/Pagination";
import ArticleSlider from "../Components/SliderArticle";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/articleListingPage.css";

const SubscribeCTA = lazy(() => import("../Components/SubscribeCTA"));
const EditorialCTA = lazy(() => import("../Components/EditorialCTA"));
const ArticleCard = lazy(() => import("../Components/ArticleCard"));

interface Article {
  id?: number;
  title: string;
  description?: string;
  image: string;
  category: string;
  author: string;
  publishedDate: string;
}

const PAGE_SIZE = 18;

const ArticleListing: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<{ category?: string; author?: string; date?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");

        let articlesData: Article[] = [];

        if (Array.isArray(response.data)) {
          articlesData = response.data;
        } else if (response.data && Array.isArray(response.data.articles)) {
          articlesData = response.data.articles;
        } else {
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
    let filtered = [...articles];

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

    if (filters.date === "Ascending") {
      filtered.sort(
        (a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
      );
    } else if (filters.date === "Descending") {
      filtered.sort(
        (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [filters, articles]);

  const handleFilterChange = (newFilters: {
    category?: string;
    author?: string;
    date?: string;
  }) => {
    setFilters(newFilters);
  };

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Article Listing</h2>
      <ArticleSlider />

      <FilterPage onFilterChange={handleFilterChange} />

      <div className="row">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <React.Fragment key={index}>
              <div className="col-md-4 mb-4">
                <Suspense fallback={<div>Loading article...</div>}>
                  <ArticleCard article={article} />
                </Suspense>
              </div>

              {(index + 1) % 6 === 0 && index !== 0 && (
                <div className="col-12 my-4">
                  <Suspense fallback={<div>Loading section...</div>}>
                    {Math.floor((index + 1) / 6) % 2 === 1 ? <SubscribeCTA /> : <EditorialCTA />}
                  </Suspense>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <>
            <p className="text-center text-muted">No articles available.</p>
            <div className="col-12 my-4">
              <Suspense fallback={<div>Loading SubscribeCTA...</div>}>
                <SubscribeCTA />
              </Suspense>
            </div>
            <div className="col-12 my-4">
              <Suspense fallback={<div>Loading EditorialCTA...</div>}>
                <EditorialCTA />
              </Suspense>
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default ArticleListing;
