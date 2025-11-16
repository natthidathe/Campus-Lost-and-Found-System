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
  const [studentId, setStudentId] = useState("");   // ⭐ NEW state
  const [loading, setLoading] = useState(false);

  // API endpoint
  const API_URL =
    "https://ptd263g5s5.execute-api.us-east-1.amazonaws.com/reportLostItem";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Make payload identical to Lambda test event
    const payload = {
      itemName,
      category,
      locationLost,
      dateTimeLost,
      userId: studentId,     // ⭐ use studentId here
    };

    console.log("Sending to API:", payload);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ⭐ IMPORTANT: Must wrap "body" like Lambda test format
        body: JSON.stringify({
          body: JSON.stringify(payload),
        }),
      });

      const data = await res.json();
      console.log("API Response:", data);

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

  return (
    <ClientLayout>
      <div className="report-container">
        <h1 className="page-title">Report Lost Item</h1>
        <p className="page-subtitle">Tell us what you lost.</p>

        <form className="report-form" onSubmit={handleSubmit}>
          
          {/* Student ID (new input) */}
          <div className="form-group">
            <label className="form-label">
              Student ID <span className="required">*</span>
            </label>
            <input
              className="text-input"
              placeholder="e.g., 6522771045"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          {/* Item Name */}
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

          {/* Category + Date */}
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
              placeholder="e.g., SIIT Main Building Lobby"
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
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </ClientLayout>
  );
}

export default ReportLost;
