// src/pages/client/ReportLost.js
import React, { useState } from "react";
import "../css/client.css";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayout";

function ReportLost() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      itemName,
      category,
      location,
    });

    alert("Lost item reported (hook this up to your backend later)");
  };

  const handleCancel = () => {
    navigate(-1); // go back
  };

  return (
    <ClientLayout>
      <div className="report-container">
        <h1 className="page-title">Report Lost Item</h1>
        <p className="page-subtitle">
          Telling us what you lost.
        </p>

        <form className="report-form" onSubmit={handleSubmit}>
          {/* Item name */}
          <div className="form-group">
            <label className="form-label">
              Item Name <span className="required">*</span>
            </label>
            <input
              className="text-input"
              placeholder="e.g., iPhone 13 Pro"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Category + Date & Time Lost */}
          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                className="select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="books">Books</option>
                <option value="keys">Keys</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group half">
              <label className="form-label">
                Date and Time Lost <span className="required">*</span>
              </label>
              <div className="datetime-wrapper">
                <span className="datetime-icon">
                  <FiCalendar size={18} />
                </span>
                <span className="datetime-caret">▾</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              Location Lost <span className="required">*</span>
            </label>
            <input
              className="text-input"
              placeholder="e.g., Main Cafeteria, near the coffee station"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit Report
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
}

export default ReportLost;
