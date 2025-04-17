import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/subscribeCTA.css";

interface SubscribeBlock {
  title: string;
  description: string;
  buttonText?: string;
  buttonURL?: string;
  mainBackgroundColor?: string;
  textAlignment?: string;
  buttonClass?: string;
}

const SubscribeCTA: React.FC = () => {
  const [subscribeBlocks, setSubscribeBlocks] = useState<SubscribeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribeCTAs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ctaInfo");

        if (response.data && Array.isArray(response.data.ctaInfo)) {
          const subscribeItems = response.data.ctaInfo.filter(
            (item: any) => item.centerTextCtaType === "subscribe"
          );
          setSubscribeBlocks(subscribeItems);
        } else {
          throw new Error("Invalid API format: expected object with ctaInfo array");
        }
      } catch (err) {
        console.error("Error fetching subscribe CTAs:", err);
        setError("Unable to load subscribe content.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribeCTAs();
  }, []);

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error) return <div className="text-center text-danger my-4">{error}</div>;

  return (
    <div className="subscribe-container">
      {subscribeBlocks.map((item, index) => (
        <div
          className="subscribe-box"
          key={index}
          style={{
            backgroundColor: item.mainBackgroundColor || "#435B2C",
            textAlign: item.textAlignment || "center",
          }}
        >
          <h2 className="subscribe-title">{item.title}</h2>
          <p
            className="subscribe-desc"
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your E-mail Address" />
            {item.buttonText && item.buttonURL && (
              <a
                href={item.buttonURL}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${item.buttonClass || "btn-subscribe"}`}
              >
                {item.buttonText}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscribeCTA;
