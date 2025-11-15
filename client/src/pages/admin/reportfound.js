// src/pages/client/ReportFound.js
import React, { useState } from "react";
import ClientLayout from "./AdminLayout1";
import "../../css/admin.css";

function ReportFound() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [foundDateTime, setFoundDateTime] = useState("");
  const [locationFound, setLocationFound] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      itemName,
      description,
      category,
      foundDateTime,
      locationFound,
    });

    alert("Found item report submitted (connect to backend later).");
  };

  const handleCancel = () => {
    // you can change this to navigate("/") or navigate(-1)
    window.history.back();
  };

  return (
    <ClientLayout>
      <div className="rf-container">
        {/* Header */}
        <div className="rf-header">
          <h1 className="rf-title">Report Found Item</h1>
          <p className="rf-subtitle">
            Help reunite someone with their lost item by reporting what you
            found.
          </p>
        </div>

        {/* Form */}
        <form className="rf-form" onSubmit={handleSubmit}>
          {/* Item Name */}
          <div className="rf-group">
            <label className="rf-label">
              Item Name <span className="rf-required">*</span>
            </label>
            <input
              className="rf-input"
              placeholder="e.g., iPhone 13 Pro"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="rf-group">
            <label className="rf-label">
              Description <span className="rf-required">*</span>
            </label>
            <textarea
              className="rf-textarea"
              placeholder="Provide detailed description including color, brand, condition, distinctive features..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category + Date & Time Found */}
          <div className="rf-row">
            <div className="rf-col">
              <div className="rf-group">
                <label className="rf-label">
                  Category <span className="rf-required">*</span>
                </label>
                <select
                  className="rf-input rf-select"
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
            </div>

            <div className="rf-col">
              <div className="rf-group">
                <label className="rf-label">
                  Date and Time Found <span className="rf-required">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="rf-input"
                  value={foundDateTime}
                  onChange={(e) => setFoundDateTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Found */}
          <div className="rf-group">
            <label className="rf-label">
              Location Found <span className="rf-required">*</span>
            </label>
            <input
              className="rf-input"
              placeholder="e.g., Main Cafeteria, near the coffee station"
              value={locationFound}
              onChange={(e) => setLocationFound(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="rf-actions">
            <button type="submit" className="rf-btn rf-btn-primary">
              Submit Report
            </button>
            <button
              type="button"
              className="rf-btn rf-btn-secondary"
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

export default ReportFound;
