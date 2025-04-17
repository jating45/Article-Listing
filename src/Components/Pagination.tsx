
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

