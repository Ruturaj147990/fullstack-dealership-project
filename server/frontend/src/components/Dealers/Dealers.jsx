import React, { useState, useEffect } from "react";
import "./Dealers.css";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedState, setSelectedState] = useState("all");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("username");
    if (user && user !== "null" && user !== "undefined") {
      setUsername(user);
    }

    // Check if URL has state parameter or query
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("state");
    if (stateParam) {
      setSelectedState(stateParam);
      fetchDealers(stateParam);
    } else {
      fetchDealers("all");
    }
  }, []);

  const fetchDealers = async (state) => {
    setLoading(true);
    try {
      const url = state && state !== "all" 
        ? `/djangoapp/get_dealers/${state}` 
        : `/djangoapp/get_dealers`;
      const res = await fetch(url);
      const data = await res.json();
      setDealers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch dealerships:", err);
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    
    // Update browser URL query/hash for transparent endpoint verification
    if (state !== "all") {
      const newUrl = `${window.location.pathname}?state=${encodeURIComponent(state)}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    } else {
      window.history.pushState({ path: window.location.pathname }, "", window.location.pathname);
    }
    fetchDealers(state);
  };

  return (
    <div className="dealers_container">
      <div className="dealers_hero">
        <h1 className="dealers_hero_title">Explore Certified Dealerships</h1>
        <p className="dealers_hero_subtitle">
          Browse verified dealerships, read authentic customer reviews, and share your own experience.
        </p>

        <div className="filter_bar">
          <label htmlFor="state_select" className="filter_label">Filter by State:</label>
          <select
            id="state_select"
            className="state_select"
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="all">All States</option>
            <option value="Kansas">Kansas (KS)</option>
            <option value="Texas">Texas (TX)</option>
            <option value="California">California (CA)</option>
            <option value="New York">New York (NY)</option>
            <option value="Florida">Florida (FL)</option>
          </select>

          {username && (
            <div className="logged_in_notice">
              <span>Logged in as <strong>{username}</strong></span>
              <a href="/postreview/1" className="review_dealer_action_btn">
                ✍️ Review Dealer
              </a>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading_state">Loading dealerships...</div>
      ) : dealers.length === 0 ? (
        <div className="empty_state">No dealerships found for the selected filter.</div>
      ) : (
        <div className="dealers_table_wrapper">
          <table className="dealers_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dealer Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Zip</th>
                <th>State</th>
                {username && <th>Review Dealer</th>}
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer) => (
                <tr key={dealer.id}>
                  <td className="col_id">#{dealer.id}</td>
                  <td className="col_name">
                    <a href={`/dealer/${dealer.id}`} className="dealer_link">
                      {dealer.full_name}
                    </a>
                  </td>
                  <td>{dealer.city}</td>
                  <td>{dealer.address}</td>
                  <td>{dealer.zip}</td>
                  <td>
                    <span className="state_badge">{dealer.state} ({dealer.st})</span>
                  </td>
                  {username && (
                    <td className="col_review">
                      <a href={`/postreview/${dealer.id}`} className="table_review_btn">
                        Review Dealer
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dealers;
