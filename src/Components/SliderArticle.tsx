import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import "../style/sliderArticle.css";

interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  publishedDate: string;
  tags: string[];
}

const ArticleSlider: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        console.log(response.data, "API Response Data");

        if (Array.isArray(response.data)) {
          setArticles(response.data.slice(0, 6)); 
        } else if (response.data && Array.isArray(response.data.articles)) {
          setArticles(response.data.articles.slice(0, 6));
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="article-slider-container">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators
        emulateTouch
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button className="arrow prev" onClick={onClickHandler}>
              ❮
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button className="arrow next" onClick={onClickHandler}>
              ❯
            </button>
          )
        }
      >
        {articles.map((article: Article, index) => (
          <div key={article.id || index} className="slide-item">
            <img src={article.image} alt={article.title} className="background-image" />
            <div className="overlay">
              <span className="category">{article.category}</span>
              <h3 className="title">{article.title}</h3>
              <p className="description">{article.description}</p>
              <div className="article-meta">
                <p><strong>Author:</strong> {article.author}</p>
                <p><strong>Published:</strong> {new Date(article.publishedDate).toLocaleDateString()}</p>
                
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ArticleSlider;
