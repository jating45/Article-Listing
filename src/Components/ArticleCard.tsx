
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/articleCart.css"

const ArticleCard = ({ article }: { article: any }) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div className="position-relative">
        <img
          src={article.image}
          className="card-img-top img-fluid"
          alt={article.title}
        />
        <span className="position-absolute top-0 start-50 translate-middle badge bg-dark px-3 py-2">
          {article.category.toUpperCase()}
        </span>
      </div>
      <div className="card-body text-center bg-light">
        <h2 className="fw-bold text-dark">{article.title}</h2>
        <a href={article.link} className="text-primary text-decoration-none fw-semibold">
          Read More →
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
