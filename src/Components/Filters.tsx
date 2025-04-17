import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/filterPage.css";

interface FilterProps {
  onFilterChange: (filters: { category?: string; author?: string; date?: string }) => void;
}

const FilterPage: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories] = useState<string[]>(["All", "Business", "People", "Responsibility", "Rural Stories", "Rooted In Tomorrow"]);
  const [authors, setAuthors] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("All");
  const [dateSortOrder, setDateSortOrder] = useState<string>("ALL");

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/authors");
        const authorNames = response.data?.authors?.map((a: { author: string }) => a.author);
        if (authorNames) {
          setAuthors(["All", ...authorNames]);
        }
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    onFilterChange({
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      author: selectedAuthor !== "All" ? selectedAuthor : undefined,
      date: dateSortOrder !== "ALL" ? dateSortOrder : undefined,
    });
  }, [selectedCategory, selectedAuthor, dateSortOrder]);

  return (
    <div className="filter-container container p-4 bg-light shadow rounded">
      <div className="btn-group d-flex flex-wrap mb-4" role="group">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"} fw-bold`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">By Author:</label>
          <select
            className="form-select border-dark"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            {authors.map((author, index) => (
              <option key={index} value={author}>{author}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Sort By Date:</label>
          <select
            className="form-select border-dark"
            value={dateSortOrder}
            onChange={(e) => setDateSortOrder(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="Descending">Descending</option>
            <option value="Ascending">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
