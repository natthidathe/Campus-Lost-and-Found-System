// src/pages/client/ItemDetail.js (Admin View)
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/admin.css";
import AdminLayout from "./AdminLayout1"; // Renamed ClientLayout to AdminLayout for clarity

// Helper function to format the ISO date string (copied from the client detail fix)
const formatDateTime = (isoString) => {
  if (!isoString) return { date: "N/A", time: "N/A" };
  
  try {
    // Attempt to handle date format from the database
    const dateObj = new Date(isoString);
    if (isNaN(dateObj)) return { date: "Invalid Date", time: "Invalid Time" };
    
    const date = dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const time = dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false // Use 24-hour format
    });
    return { date, time };
  } catch (e) {
    return { date: "Error", time: "Error" };
  }
};


function AdminDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const getItemIdDisplay = (pk) => {
  if (!pk) return 'N/A';
  // Remove 'ITEM#' prefix and show only the first 8 characters
  return pk.replace('ITEM#', '').substring(0, 8);
};
  // The item object is passed directly via the 'state' property during navigation
  const item = location.state;

  if (!item) {
    return (
      <AdminLayout>
        <div className="detail-page">
          <p>No item data found.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Format the date/time fields
  const { date, time } = formatDateTime(item.dateTimeLost);
  
  // Determine item type (Lost or Found) for display
  const itemType = item.SK ? (item.SK.startsWith("LOST") ? "Lost" : "Found") : (item.status || "Item");

  return (
    <AdminLayout>
      <div className="detail-page">
        <h1 className="detail-title">{item.itemName || 'Untitled Item'} Details</h1>
        
        <div className="detail-row">Item ID: {item.PK}</div>

        {/* Item Status Row */}
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value status-indicator status-{item.status.toLowerCase()}">
            {item.status || 'N/A'} ({itemType})
          </span>
        </div>

        {/* Item Name (Mapped from 'title' to 'itemName') */}
        <div className="detail-row">
          <span className="detail-label">Item Name:</span>
          <span className="detail-value">{item.itemName || 'N/A'}</span>
        </div>

        {/* Category (Mapped from 'topic' to 'category') */}
        <div className="detail-row">
          <span className="detail-label">Category :</span>
          <span className="detail-value">{item.category || 'N/A'}</span>
        </div>

        {/* Reported By ID */}
        <div className="detail-row">
          <span className="detail-label">Reported By ID:</span>
          <span className="detail-value">{item.userId || 'Unknown'}</span>
        </div>

        {/* Date Lost/Found (Formatted) */}
        <div className="detail-row">
          <span className="detail-label">Date Lost/Found:</span>
          <span className="detail-value">{date}</span>
        </div>

        {/* Time Lost/Found (Formatted) */}
        <div className="detail-row">
          <span className="detail-label">Time Lost/Found:</span>
          <span className="detail-value">{time}</span>
        </div>

        {/* Location (Mapped from 'location' to 'locationLost') */}
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            {item.locationLost || "N/A"}
          </span>
        </div>
        
        {/* --- Admin Actions --- */}
      </div>

      <div className="id-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        
        {/* The "Report" button is changed to reflect the action: Mark as Claimed/Returned */}
        <button 
          type="button" 
          className="btn-primary" 
          // Navigate to the identification page and pass the current item's data
          onClick={() => navigate(`/admin/identification`, { state: { item } })}
        >
          Mark Claimed/Returned
        </button>
      </div>
    </AdminLayout>
  );
}

export default AdminDetail;