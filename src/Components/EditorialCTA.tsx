import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/editorialCTA.css";

interface EditorialBlock {
  title: string;
  description: string;
  buttonText?: string;
  buttonURL?: string;
  mainBackgroundColor?: string;
  textAlignment?: string;
  buttonClass?: string;
}

const EditorialCTA: React.FC = () => {
  const [editorials, setEditorials] = useState<EditorialBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditorials = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ctaInfo");

        if (response.data && Array.isArray(response.data.ctaInfo)) {
          const editorialItems = response.data.ctaInfo.filter(
            (item: any) => item.centerTextCtaType === "editorialCTA"
          );
          setEditorials(editorialItems);
        } else {
          throw new Error("Invalid API format: expected object with ctaInfo array");
        }
      } catch (err) {
        console.error("Error fetching editorials:", err);
        setError("Unable to load editorial content.");
      } finally {
        setLoading(false);
      }
    };

    fetchEditorials();
  }, []);

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error) return <div className="text-center text-danger my-4">{error}</div>;

  return (
    <div className="editorial-container">
      {editorials.map((item, index) => (
        <div
          className="editorial-box"
          key={index}
          style={{
            backgroundColor: item.mainBackgroundColor || "#f9f9f9",
            textAlign: item.textAlignment || "left",
            padding: "2rem",
          }}
        >
          <h2>{item.title}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />
          {item.buttonText && item.buttonURL && (
            <a
              href={item.buttonURL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn ${item.buttonClass || "btn-primary"}`}
            >
              {item.buttonText}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditorialCTA;
