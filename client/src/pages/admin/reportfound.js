// src/pages/client/ReportFound.js
import React, { useState } from "react";
import ClientLayout from "./AdminLayout1";
import "../../css/admin.css";

// The API URL 
const API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/ReportFound/items/found"; 


function ReportFound() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [location, setLocation] = useState("");
  const [officeNotes, setOfficeNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- REMOVED TOKEN LOGIC AND CHECK FOR PUBLIC ACCESS ---
    
    // ⭐ FIX: Add the hardcoded userId to the submissionData payload
    const submissionData = {
      itemName,
      description,
      category,
      officeNotes,
      dateTimeLost: dateFound,
      locationLost: location,
      
      // CRITICAL FIX: Providing the required field in the body
      userId: "admin" 
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization header is removed for public access
        },
        body: JSON.stringify(submissionData), 
      });

      const result = await response.json();

      if (response.ok) {
        const uniqueId = result.item ? result.item.PK : 'Unknown ID';
        alert(`SUCCESS! Item reported with ID: ${uniqueId}`);   
        // Clear form after successful submission
        setItemName(""); setDescription(""); setCategory(""); setDateFound(""); setLocation(""); setOfficeNotes("");
      } else {
        alert(`Submission Failed: ${result.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      alert("Failed to connect to the backend server. Check network or URL.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel = () => {
    window.history.back();
  };


  return (
    <ClientLayout>
      <div className="rf-container">
        {/* Header content... */}
        <h1 className="page-title">Report Found Item</h1>
        <p className="page-subtitle">Tell us what you found.</p>

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
              placeholder="Provide detailed description..."
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
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Books">Books</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other</option>
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
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)} 
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
              placeholder="e.g., Main Cafeteria..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          {/* Office Notes (for staff documentation) */}
          <div className="rf-group">
            <label className="rf-label">Office Notes (Optional)</label>
            <textarea
              className="rf-textarea"
              placeholder="Internal notes on item condition or storage location."
              rows={2}
              value={officeNotes}
              onChange={(e) => setOfficeNotes(e.target.value)}
            />
          </div>


          {/* Buttons */}
          <div className="rf-actions">
            <button 
              type="submit" 
              className="rf-btn rf-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
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