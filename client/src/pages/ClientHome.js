// src/pages/client/Home.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayout";

const ALL_ITEMS_API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/GetItem/items"; 

function Home() {
  const navigate = useNavigate();

  // State for the actual items fetched from the API
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // search + filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // Function to fetch data from the backend
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch data using the live GET /items endpoint
      const response = await fetch(ALL_ITEMS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // The GetAllItems Lambda returns the array inside the 'items' key
      setItems(data.items || []); 
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Check the network and API endpoint.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Apply filtering logic to the fetched items (using DynamoDB field names)
  const filteredItems = items.filter((item) => {
    const keyword = search.toLowerCase();
    
    const itemStatus = item.status ? item.status.toLowerCase() : '';

    // 🚨 SYNC FIX: Exclude any item explicitly marked as 'DELETED' or 'ARCHIVED' 🚨
    if (itemStatus === 'deleted' || itemStatus === 'archived') {
        return false;
    }
    
    const matchesSearch =
      (item.itemName && item.itemName.toLowerCase().includes(keyword)) ||
      (item.category && item.category.toLowerCase().includes(keyword)) ||
      (item.locationLost && item.locationLost.toLowerCase().includes(keyword));

    const matchesType = 
      type === "all" ||
      (type === "lost" && item.SK && item.SK.startsWith("LOST#")) ||
      (type === "found" && item.SK && item.SK.startsWith("FOUND#"));

    const matchesCategory = 
      category === "all" || 
      (item.category && item.category.toLowerCase() === category.toLowerCase());

    const matchesStatus = 
      status === "all" || 
      (item.status && item.status.toLowerCase() === status.toLowerCase());

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });


  // --- Render Logic ---
  return (
    <ClientLayout>
      {/* Search */}
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search from Item Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-icon" aria-label="Search" />
      </div>

      {/* Filter row */}
      <div className="filter-row">
        <select
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Books">Books</option>
          <option value="Keys">Keys</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="lost">LOST</option> 
          <option value="found">FOUND</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Section title */}
      <div className="section-header">
        <h2>All Item List</h2>
      </div>

      {/* Loading, Error, or Cards grid */}
      {isLoading && <p>Loading items...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!isLoading && !error && filteredItems.length === 0 && (
        <p>No items found matching your criteria.</p>
      )}

      <div className="card-grid">
        {!isLoading && !error && filteredItems.map((item) => (
          <div
            key={item.PK} // Use the Partition Key (PK) as the unique key
            className="card"
            // Navigate to the detail page using the PK
            onClick={() => navigate(`/item/${item.PK}`, { state: item })} 
            style={{ cursor: "pointer" }}
          >
            {/* Displaying DynamoDB fields: category, itemName, status */}
            <div className="card-topic">Category: {item.category || 'N/A'}</div>
            <div className="card-title">Item: {item.itemName || 'Untitled'}</div>
            <div className="card-description">Status: {item.status}</div>
          </div>
        ))}
      </div>
    </ClientLayout>
  );
}

export default Home;