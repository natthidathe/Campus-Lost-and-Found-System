// src/pages/OwnerInfoList.js
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout1";

// API URL for the GET /admin/ownerlist endpoint
const ALL_OWNERS_API_URL =
  "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/OwnerList/admin/ownerlist";

// Helper function to format the ISO date string
const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
        return new Date(isoString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return "Invalid Date";
    }
};

function OwnerInfoList() {
  const [requests, setRequests] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  // Fetch verification requests from backend
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ALL_OWNERS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.requests || []); 
    } catch (err) {
      console.error("Error fetching verification requests:", err);
      setError("Failed to load verification requests. Please check the API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter by search over name, studentId, tel, and Request ID
  const filteredRequests = requests.filter((req) => { 
    const keyword = search.toLowerCase();

    return (
      (req.ClaimantName && req.ClaimantName.toLowerCase().includes(keyword)) ||
      (req.StudentId && req.StudentId.toLowerCase().includes(keyword)) ||
      (req.Tel && req.Tel.toLowerCase().includes(keyword)) ||
      (req.Id && req.Id.toLowerCase().includes(keyword))
    );
  });

  return (
    <AdminLayout>
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search by claimant name, student ID, Tel, or Request ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-icon" aria-label="Search" />
      </div>

      {/* Section title */}
      <div className="section-header">
        <h2>Owner Verification List ({filteredRequests.length} requests)</h2>
      </div>

      {/* Loading / error / empty states */}
      {isLoading && <p>Loading owner information...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!isLoading && !error && filteredRequests.length === 0 && (
        <p>No owner records found matching your search.</p>
      )}

      <div className="card-grid owner-card-grid"> {/* Used custom class for styling */}
        {!isLoading &&
          !error &&
          filteredRequests.map((req, index) => ( 
            <div
              key={req.Id || index} 
              className="card owner-card-style" // Custom card style for this view
            >
                {/* 1. Claimant Name (Primary Focus) */}
                <div className="owner-claimant-name">
                    {req.ClaimantName || "Unknown Claimant"}
                </div>
                
                {/* 2. Request ID (Metadata) */}
                <div className="owner-request-id-meta">
                    Request ID: {req.Id.substring(0, 16)}...
                </div>
                
                {/* 3. Detail Rows (Key/Value pairs) */}
                
                <div className="owner-detail-row">
                  <span className="owner-detail-label">Student ID:</span> 
                    <span className="owner-detail-value">{req.StudentId || "N/A"}</span>
                </div>

                <div className="owner-detail-row">
                  <span className="owner-detail-label">Tel:</span> 
                    <span className="owner-detail-value">{req.Tel || "N/A"}</span>
                </div>
                
                <div className="owner-detail-row">
                  <span className="owner-detail-label">Submitted:</span> 
                    <span className="owner-detail-value">{formatDateTime(req.CreatedAt)}</span>
                </div>

                {/* Photo Proof Status */}
                <div className="owner-proof-status">
                    {req.PhotoKeys && req.PhotoKeys.length > 0 ? (
                        <span className="proof-attached">Photo Proof Attached</span>
                    ) : (
                        <span className="proof-missing">No Photo Proof</span>
                    )}
                </div>

            </div>
          ))}
      </div>
    </AdminLayout>
  );
}

export default OwnerInfoList;