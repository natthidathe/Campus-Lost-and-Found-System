// src/pages/client/ItemDetail.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/client.css";
import ClientLayout from "./ClientLayout";

// Helper function to format the ISO date string (e.g., "2025-11-16T13:30:00Z")
const formatDateTime = (isoString) => {
  if (!isoString) return { date: "N/A", time: "N/A" };
  
  try {
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


function ItemDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  // The item object is passed directly via the 'state' property during navigation
  const item = location.state;

  if (!item) {
    // If navigation state is empty, try to get PK from URL to fetch the item
    // For simplicity here, we just show the "No item data" message.
    return (
      <ClientLayout>
        <div className="detail-page">
          <p>No item data found. Please navigate from the home page.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </ClientLayout>
    );
  }

  // Determine if it was lost or found from the SK or status
  const itemType = item.SK ? (item.SK.startsWith("LOST") ? "Lost" : "Found") : (item.status || "Item");
  
  // Format the date/time fields
  const { date, time } = formatDateTime(item.dateTimeLost);

  return (
    <ClientLayout>
      <div className="detail-page">
        <h1 className="detail-title">{item.itemName || 'Untitled Item'} Details</h1>

        {/* Item Type (Derived from SK/Status) */}
        <div className="detail-row">
          <span className="detail-label">Item Status:</span>
          <span className="detail-value status-indicator status-{item.status.toLowerCase()}">
            {item.status || 'N/A'} ({itemType})
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Item Name:</span>
          {/* Mapped item.title to item.itemName */}
          <span className="detail-value">{item.itemName || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Category:</span>
          {/* Mapped item.topic to item.category */}
          <span className="detail-value">{item.category || 'N/A'}</span>
        </div>

        {/* Note: Your DynamoDB items don't have a generic 'description' field. You might need to add one. */}
        {/* We'll skip the Item Description field unless you add it to your DB schema. */}

        <div className="detail-row">
          <span className="detail-label">Date Lost/Found:</span>
          {/* Using the formatted date from dateTimeLost */}
          <span className="detail-value">{date}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Time Lost/Found:</span>
          {/* Using the formatted time from dateTimeLost */}
          <span className="detail-value">{time}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Location:</span>
          {/* Mapped item.location to item.locationLost */}
          <span className="detail-value">
            {item.locationLost || "N/A"}
          </span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Reported By ID:</span>
          <span className="detail-value">{item.userId || 'Unknown'}</span>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </ClientLayout>
  );
}

export default ItemDetail;