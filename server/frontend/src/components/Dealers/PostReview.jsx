import React, { useState, useEffect } from "react";
import "./PostReview.css";

const PostReview = ({ id: propId }) => {
  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [carMakes, setCarMakes] = useState([]);
  
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [carYear, setCarYear] = useState("2024");
  const [reviewerName, setReviewerName] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    const user = sessionStorage.getItem("username") || "Customer Reviewer";
    setReviewerName(user);

    // Fetch Dealer details
    fetch(`/djangoapp/dealer/${dealerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDealer(data);
      })
      .catch((err) => console.error("Error fetching dealer:", err));

    // Fetch Car makes and models from get_cars
    fetch("/djangoapp/get_cars")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.CarModels) {
          setCars(data.CarModels);
          const makes = Array.from(new Set(data.CarModels.map((c) => c.CarMake)));
          setCarMakes(makes);
          if (makes.length > 0) {
            setSelectedMake(makes[0]);
          }
        }
      })
      .catch((err) => console.error("Error fetching cars:", err));
  }, [dealerId]);

  // Update models available when selected make changes
  const availableModels = cars
    .filter((c) => c.CarMake === selectedMake)
    .map((c) => c.CarModel);

  useEffect(() => {
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0]);
    } else {
      setSelectedModel("");
    }
  }, [selectedMake, cars]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) {
      setMessage("Please enter review text.");
      setIsSuccess(false);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        name: reviewerName || "Verified Buyer",
        dealership: parseInt(dealerId),
        dealer_id: parseInt(dealerId),
        review: review,
        purchase: Boolean(purchase),
        purchase_date: purchase ? purchaseDate : "",
        car_make: purchase ? selectedMake : "",
        car_model: purchase ? selectedModel : "",
        car_year: purchase ? parseInt(carYear) : 2024,
      };

      const res = await fetch("/djangoapp/add_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && (json.status === 200 || json.message)) {
        setIsSuccess(true);
        setMessage("Review successfully submitted! Redirecting to dealership reviews...");
        setTimeout(() => {
          window.location.href = `/dealer/${dealerId}`;
        }, 1500);
      } else {
        setIsSuccess(false);
        setMessage(json.error || "Failed to submit review.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("An error occurred while submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post_review_container">
      <div className="post_review_card">
        <div className="post_review_header">
          <span className="post_review_dealer_tag">
            {dealer ? dealer.full_name : `Dealership #${dealerId}`}
          </span>
          <h1 className="post_review_title">Post a Dealership Review</h1>
          <p className="post_review_subtitle">
            Share your authentic purchase or service experience with future car buyers.
          </p>
        </div>

        {message && (
          <div className={`post_review_alert ${isSuccess ? "alert_success" : "alert_error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="post_review_form">
          <div className="form_group">
            <label htmlFor="reviewer_name">Your Name</label>
            <input
              id="reviewer_name"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="review_content">Review Content</label>
            <textarea
              id="review_content"
              rows="5"
              placeholder="Write your detailed review about customer service, vehicle quality, and overall dealership experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>

          <div className="form_checkbox_group">
            <input
              id="purchase_check"
              type="checkbox"
              checked={purchase}
              onChange={(e) => setPurchase(e.target.checked)}
            />
            <label htmlFor="purchase_check">
              I purchased a vehicle from this dealership
            </label>
          </div>

          {purchase && (
            <div className="vehicle_info_fieldset">
              <div className="form_group">
                <label htmlFor="purchase_date">Purchase Date</label>
                <input
                  id="purchase_date"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="form_row_grid">
                <div className="form_group">
                  <label htmlFor="car_make">Car Make</label>
                  <select
                    id="car_make"
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                  >
                    {carMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="car_model">Car Model</label>
                  <select
                    id="car_model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="car_year">Year</label>
                  <input
                    id="car_year"
                    type="number"
                    min="2010"
                    max="2026"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="post_review_actions">
            <button
              id="submit_review_btn"
              type="submit"
              className="submit_review_btn"
              disabled={submitting}
            >
              {submitting ? "Submitting Review..." : "Submit Review"}
            </button>
            <a href={`/dealer/${dealerId}`} className="cancel_review_btn">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostReview;
