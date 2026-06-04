import React from "react";
import { Link } from "react-router-dom";

const WISHLIST_KEY = "packgo_wishlist";
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const Wishlist = () => {
  const [wishlist, setWishlist] = React.useState(loadWishlist);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((d) => (d._id || d.name) !== id);
    setWishlist(updated);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <Link to="/" className="wishlist-back">← Back to Home</Link>
          <h1 className="wishlist-title">❤️ My Wishlist</h1>
          <p className="wishlist-subtitle">
            {wishlist.length > 0
              ? `${wishlist.length} destination${wishlist.length > 1 ? "s" : ""} saved`
              : "No destinations saved yet"}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">🌍</div>
            <h2>Your wishlist is empty</h2>
            <p>Browse destinations on the homepage and click the heart icon to save them here.</p>
            <Link to="/" className="wishlist-browse-btn">Browse Destinations</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((dest) => {
              const id = dest._id || dest.name;
              return (
                <div key={id} className="wishlist-card">
                  {dest.images?.[0] && (
                    <div className="wishlist-card-img">
                      <img
                        src={dest.images[0]}
                        alt={dest.name}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                  <div className="wishlist-card-body">
                    <h3 className="wishlist-card-name">{dest.name}</h3>
                    <p className="wishlist-card-loc">
                      📍 {[dest.city, dest.state, dest.country].filter(Boolean).join(", ")}
                    </p>
                    {dest.entrance_fee_inr !== undefined && (
                      <p className="wishlist-card-fee">
                        {dest.entrance_fee_inr === 0 ? "Free Entry" : `₹${dest.entrance_fee_inr}`}
                      </p>
                    )}
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;