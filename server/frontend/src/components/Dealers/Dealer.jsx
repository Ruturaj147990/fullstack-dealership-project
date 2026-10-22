import React, { useState, useEffect } from "react";
import "./Dealer.css";

const Dealer = ({ id: propId }) => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  // Extract ID from props, URL path (/dealer/1), or URL query parameter
  const getDealerId = () => {
    if (propId) return propId;
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const idFromPath = pathParts[pathParts.length - 1];
    if (idFromPath && !isNaN(idFromPath)) return idFromPath;
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "1";
  };

  const dealerId = getDealerId();

  useEffect(() => {
    const user = sessionStorage.getItem("username");
    if (user && user !== "null" && user !== "undefined") {
      setUsername(user);
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [dealerRes, reviewsRes] = await Promise.all([
          fetch(`/djangoapp/dealer/${dealerId}`),
          fetch(`/djangoapp/reviews/dealer/${dealerId}`)
        ]);

        if (dealerRes.ok) {
          const dData = await dealerRes.json();
          setDealer(dData);
        }

        if (reviewsRes.ok) {
          const rData = await reviewsRes.json();
          setReviews(Array.isArray(rData) ? rData : []);
        }
      } catch (err) {
        console.error("Error loading dealer or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dealerId]);

  return (
    <div className="dealer_page_container">
      {loading ? (
        <div className="loading_state">Loading dealership details and reviews...</div>
      ) : !dealer ? (
        <div className="empty_state">Dealership not found.</div>
      ) : (
        <>
          <div className="dealer_header_card">
            <div className="dealer_info">
              <span className="dealer_id_badge">Dealership ID #{dealer.id}</span>
              <h1 className="dealer_title">{dealer.full_name}</h1>
              <p className="dealer_address_text">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {dealer.address}, {dealer.city}, {dealer.state} ({dealer.st}) — {dealer.zip}
              </p>
            </div>

            <div className="dealer_action_bar">
              {username ? (
                <a href={`/postreview/${dealer.id}`} className="btn_post_review">
                  ✍️ Post a Review
                </a>
              ) : (
                <a href="/login" className="btn_post_review_disabled">
                  Login to Review Dealer
                </a>
              )}
            </div>
          </div>

          <div className="reviews_section">
            <div className="reviews_section_header">
              <h2>Customer Reviews ({reviews.length})</h2>
              <span className="verified_count">Sentiment Analyzed Feedback</span>
            </div>

            {reviews.length === 0 ? (
              <div className="no_reviews_box">
                No reviews posted yet for this dealership. Be the first to write a review!
              </div>
            ) : (
              <div className="reviews_grid">
                {reviews.map((r) => {
                  const sentimentClass = 
                    r.sentiment === "positive" ? "sentiment_positive" :
                    r.sentiment === "negative" ? "sentiment_negative" : "sentiment_neutral";

                  return (
                    <div key={r.id} className="review_card">
                      <div className="review_card_header">
                        <div className="reviewer_profile">
                          <div className="reviewer_avatar">
                            {r.name ? r.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <h3 className="reviewer_name">{r.name}</h3>
                            <span className="reviewer_badge">
                              {r.purchase ? "Verified Buyer" : "Customer Visitor"}
                            </span>
                          </div>
                        </div>

                        <span className={`sentiment_pill ${sentimentClass}`}>
                          {r.sentiment ? r.sentiment.toUpperCase() : "NEUTRAL"}
                        </span>
                      </div>

                      <p className="review_body">{r.review}</p>

                      <div className="review_vehicle_details">
                        {r.car_make && r.car_model && (
                          <span className="vehicle_tag">
                            🚗 {r.car_year ? `${r.car_year} ` : ""}{r.car_make} {r.car_model}
                          </span>
                        )}
                        {r.purchase_date && (
                          <span className="purchase_date_tag">
                            🗓️ Purchased: {r.purchase_date}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dealer;
