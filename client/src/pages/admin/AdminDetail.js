// src/pages/client/ItemDetail.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/admin.css";
import ClientLayout from "./AdminLayout1";

function AdminDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;

  if (!item) {
    return (
      <ClientLayout>
        <div className="detail-page">
          <p>No item data found.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="detail-page">
        <h1 className="detail-title">Item Detail</h1>

        <div className="detail-row">
          <span className="detail-label">Item :</span>
          <span className="detail-value">{item.topic}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Title :</span>
          <span className="detail-value">{item.title}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Item Description :</span>
          <span className="detail-value">{item.description}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Date :</span>
          <span className="detail-value">{item.date || "10 Oct 2025"}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Time :</span>
          <span className="detail-value">{item.time || "14.30"}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Location :</span>
          <span className="detail-value">
            {item.location || "Bangkadi Campus"}
          </span>
        </div>
      </div>

      <div className="id-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                cancel
              </button>
              <button type="submit" className="btn-primary" onClick={() => navigate("/admin/identification")}>
                Report
              </button>
        </div>
    </ClientLayout>
  );
}

export default AdminDetail;
