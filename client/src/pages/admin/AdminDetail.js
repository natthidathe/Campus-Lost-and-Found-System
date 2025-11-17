// src/pages/client/ItemDetail.js (Admin View)
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/admin.css";
import AdminLayout from "./AdminLayout1"; // Renamed ClientLayout to AdminLayout for clarity

// 🔴 Your real DELETE endpoint (no trailing slash, no {pk} here)
const DELETE_API_URL =
  "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/deleteItem/deleteItem";

// Helper function to format the ISO date string (copied from the client detail fix)
const formatDateTime = (isoString) => {
  if (!isoString) return { date: "N/A", time: "N/A" };

  try {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj)) return { date: "Invalid Date", time: "Invalid Time" };

    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { date, time };
  } catch (e) {
    return { date: "Error", time: "Error" };
  }
};

function AdminDetail() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const itemType = item.SK
    ? item.SK.startsWith("LOST")
      ? "Lost"
      : "Found"
    : item.status || "Item";

  // 🔴 DELETE HANDLER
  const handleDelete = async () => {
  const pk = item.PK || item.pk;

  if (!pk) {
    alert("Cannot delete: item key (PK) is missing.");
    console.error("Item object has no PK:", item);
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this item? This cannot be undone."
  );
  if (!confirmDelete) return;

  // -- DEBUG: PRINT ITEM + PK ------------
  console.log("=======================================");
  console.log("🟦 DELETE REQUEST START");
  console.log("Item object:", item);
  console.log("PK extracted:", pk);
  console.log("API URL:", DELETE_API_URL);
  console.log("=======================================");

  try {
    // Construct request object
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pk }),
    };

    // -- DEBUG: print full request before sending ----
    console.log("🟨 Sending DELETE fetch with:");
    console.log("URL:", DELETE_API_URL);
    console.log("Method:", requestOptions.method);
    console.log("Headers:", requestOptions.headers);
    console.log("Body:", requestOptions.body);
    console.log("=======================================");

    const res = await fetch(DELETE_API_URL, requestOptions);

    // -- DEBUG: Raw response object ---------------
    console.log("🟩 Raw fetch Response:", res);

    // Read the raw response body text
    const rawText = await res.text();

    console.log("🟧 Raw Response Body:", rawText);

    // Try parsing JSON safely
    let json = null;
    try {
      json = JSON.parse(rawText);
      console.log("🟩 Parsed JSON Response:", json);
    } catch (e) {
      console.warn("⚠️ Response is not valid JSON.");
    }

    // ❌ Handle API errors
    if (!res.ok) {
      console.error("❌ API returned HTTP error:", res.status);
      throw new Error(json?.message || `Failed (status ${res.status})`);
    }

    alert("Item deleted successfully.");
    navigate(-1);
  } catch (err) {
    console.error("❌ ERROR deleting item:", err);
    alert("Error deleting item: " + err.message);
  }
  };

  return (
    <AdminLayout>
      <div className="detail-page">
        <h1 className="detail-title">
          {item.itemName || "Untitled Item"} Details
        </h1>

        {/* Item Status Row */}
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span
            className={`detail-value status-indicator status-${(
              item.status || ""
            ).toLowerCase()}`}
          >
            {item.status || "N/A"} ({itemType})
          </span>
        </div>

        {/* Item Name */}
        <div className="detail-row">
          <span className="detail-label">Item Name:</span>
          <span className="detail-value">{item.itemName || "N/A"}</span>
        </div>

        {/* Category */}
        <div className="detail-row">
          <span className="detail-label">Category :</span>
          <span className="detail-value">{item.category || "N/A"}</span>
        </div>

        {/* Reported By ID */}
        <div className="detail-row">
          <span className="detail-label">Reported By ID:</span>
          <span className="detail-value">{item.userId || "Unknown"}</span>
        </div>

        {/* Date Lost/Found */}
        <div className="detail-row">
          <span className="detail-label">Date Lost/Found:</span>
          <span className="detail-value">{date}</span>
        </div>

        {/* Time Lost/Found */}
        <div className="detail-row">
          <span className="detail-label">Time Lost/Found:</span>
          <span className="detail-value">{time}</span>
        </div>

        {/* Location */}
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            {item.locationLost || "N/A"}
          </span>
        </div>
      </div>

      {/* --- Admin Actions --- */}
      <div className="id-actions">
  {/* DELETE BUTTON */}
  <button
    type="button"
    className="btn-secondary"
    style={{
      backgroundColor: "#DC2626",
      borderColor: "#DC2626",
      color: "#ffffff",
    }}
    onClick={handleDelete}
  >
    Delete
  </button>

  {/* BACK BUTTON */}
  <button
    type="button"
    className="btn-secondary"
    onClick={() => navigate(-1)}
  >
    Back
  </button>

  {/* ✔ ONLY SHOW THIS BUTTON IF STATUS IS NOT RETURNED */}
  {item.status !== "RETURNED" && (
    <button
      type="button"
      className="btn-primary"
      onClick={() =>
        navigate(`/admin/identification`, { state: { item } })
      }
    >
      Mark Claimed/Returned
    </button>
  )}
</div>
    </AdminLayout>
  );
}

export default AdminDetail;
