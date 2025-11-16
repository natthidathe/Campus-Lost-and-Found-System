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
  const [locationLost, setLocationLost] = useState("");
  const [dateTimeLost, setDateTimeLost] = useState("");
  const [loading, setLoading] = useState(false);

  // Your API endpoint (no trailing slash)
  const API_URL =
    "https://ptd263g5s5.execute-api.us-east-1.amazonaws.com/reportLostItem";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("======= DEBUG FORM SUBMISSION =======");
console.log("Item Name:", itemName);
console.log("Category:", category);
console.log("Location Lost:", locationLost);
console.log("DateTime Lost:", dateTimeLost);
console.log("Using userId:", "6522771045");

const payload = {
  itemName,
  category,
  locationLost,
  dateTimeLost,
  userId: "6522771045"
};

console.log("Payload object:", payload);
console.log("JSON.stringify(payload):", JSON.stringify(payload));

console.log("Final body being sent:");
console.log(
  JSON.stringify({
    body: JSON.stringify(payload),
  })
);

console.log("API URL:", API_URL);
console.log("=====================================");


    try {
      // Must match Lambda EXACTLY — same as Test Event format
      const payload = {
        itemName,
        category,
        locationLost,
        dateTimeLost,
        userId: "6522771045" // TEMP until you add real login
      };

      console.log("Sending payload:", payload);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify(payload),  // ⭐ EXACTLY like Lambda Test JSON
        }),
      });

      const data = await res.json();
      console.log("Response from API:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit lost item");
      }

      alert("Lost item reported successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ClientLayout>
      <div className="report-container">
        <h1 className="page-title">Report Lost Item</h1>
        <p className="page-subtitle">Telling us what you lost.</p>

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
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Books">Books</option>
                <option value="Keys">Keys</option>
                <option value="Other">Other</option>
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
                <input
                  type="datetime-local"
                  className="datetime-input"
                  value={dateTimeLost}
                  onChange={(e) => setDateTimeLost(e.target.value)}
                  required
                />
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
              value={locationLost}
              onChange={(e) => setLocationLost(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
}

export default ReportLost;
