import React, { useState } from "react";
import "../style/subscribeCTA.css"; // Ensure you create and style this CSS file

const SubscribeCTA: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("Subscribed with:", email);
    alert("Thank you for subscribing!");
    setEmail(""); // Clear input after submission
  };

  return (
    <div className="subscribe-container">
      <h2>FARMING COMMUNITIES ARE GROWING THE FUTURE</h2>
      <p>
        Explore unexpected dimensions of rural living, from innovation and
        diversity to resilience and sustainability.
      </p>
      <div className="subscribe-form">
        <input
          type="email"
          placeholder="Enter your E-mail Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Read More</button>
      </div>
    </div>
  );
};

export default SubscribeCTA;
