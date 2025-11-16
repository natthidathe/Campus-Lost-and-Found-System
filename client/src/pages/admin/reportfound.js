// src/pages/client/ReportFound.js
import React, { useState } from "react";
import ClientLayout from "./AdminLayout1";
import "../../css/admin.css";

// --- NOTE: Replace the placeholder below with the Staff/Admin Auth Token logic ---
// This token is required by the API Gateway to grant access to this endpoint.
const getAuthToken = () => {
  // *** PLACEHOLDER: Implementation depends on Cognito setup ***
  // e.g., return localStorage.getItem('idToken'); 
  return "YOUR_STAFF_ADMIN_JWT_TOKEN"; 
};
// --- End Auth Placeholder ---

// Define the live API endpoint URL
const API_URL = "https://ptd263g5s5.execute-api.us-east-1.amazonaws.com/ItemFound"; 


function ReportFound() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dateFound, setDateFound] = useState(""); // Corrected name for backend
  const [location, setLocation] = useState(""); // Corrected name for backend
  const [officeNotes, setOfficeNotes] = useState(""); // Added for comprehensive backend submission
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare data payload
    const submissionData = {
      itemName,
      description,
      category,
      dateFound, 
      location, 
      officeNotes,
      // ImageS3Key is intentionally omitted as per the new requirement.
    };
    
    // 2. Get Auth Token
    const authToken = getAuthToken();
    if (!authToken) {
        alert("Authentication error: Staff token not found.");
        setIsSubmitting(false);
        return;
    }


    try {
      // 3. Send POST request to the deployed API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      // 4. Handle Response
      if (response.ok) {
        alert(`SUCCESS! Item reported with ID: ${result.itemId}`);
        // Clear form after successful submission
        setItemName(''); setDescription(''); setCategory(''); setDateFound(''); setLocation(''); setOfficeNotes('');
      } else {
        alert(`Submission Failed: ${result.message || response.statusText}`);
        console.error("Submission error:", result);
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
                  // Note: The value and setter here must be updated to use the corrected state names (dateFound)
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
              placeholder="e.g., Main Cafeteria, near the coffee station"
              // Note: The value and setter here must be updated to use the corrected state names (location)
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          {/* Office Notes (Optional, for staff documentation) */}
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
              disabled={isSubmitting} // Disable button while submitting
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