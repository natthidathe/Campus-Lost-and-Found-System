// src/pages/OwnerInfoList.js
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout1";

// TODO: replace this with your real Owner Identification API endpoint
const ALL_OWNERS_API_URL =
  "https://your-owner-identification-api-url.example.com/owners";

function OwnerInfoList() {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  // Fetch owner records from backend
  const fetchOwners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ALL_OWNERS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Adjust this based on your real API later
      // e.g. if your Lambda returns { owners: [...] }
      setOwners(data.owners || []);
    } catch (err) {
      console.error("Error fetching owner info:", err);
      setError("Failed to load owner information. Please check the API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // Filter by search over name, studentId, tel, itemName
  const filteredOwners = owners.filter((owner) => {
    const keyword = search.toLowerCase();

    return (
      (owner.name && owner.name.toLowerCase().includes(keyword)) ||
      (owner.studentId &&
        owner.studentId.toLowerCase().includes(keyword)) ||
      (owner.tel && owner.tel.toLowerCase().includes(keyword)) ||
      (owner.itemName &&
        owner.itemName.toLowerCase().includes(keyword))
    );
  });

  return (
    <AdminLayout>
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search by owner name, student ID, or item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-icon" aria-label="Search" />
      </div>

      {/* Section title */}
      <div className="section-header">
        <h2>Owner Information List</h2>
      </div>

      {/* Loading / error / empty states */}
      {isLoading && <p>Loading owner information...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!isLoading && !error && filteredOwners.length === 0 && (
        <p>No owner records found matching your search.</p>
      )}

      <div className="card-grid">
        {!isLoading &&
          !error &&
          filteredOwners.map((owner, index) => (
            <div
              key={owner.id || owner.ownerId || index}
              className="card"
            >
              {/* Adjust these fields to match your DB keys */}
              <div className="card-topic">
                Name: {owner.name || "Unknown"}
              </div>

              <div className="card-title">
                Role:{" "}
                {owner.role === "student"
                  ? "SIIT Student"
                  : owner.role === "other"
                  ? "Other"
                  : "N/A"}
              </div>

              <div className="card-description">
                Student ID: {owner.studentId || "N/A"}
              </div>

              <div className="card-description">
                Tel: {owner.tel || "N/A"}
              </div>

              {owner.itemName && (
                <div className="card-description">
                  Item: {owner.itemName}
                </div>
              )}
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}

export default OwnerInfoList;
