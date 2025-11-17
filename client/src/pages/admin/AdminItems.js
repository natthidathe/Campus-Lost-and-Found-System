import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout1";

// API URL for the GET /items endpoint
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

  const getItemIdDisplay = (pk) => {
    if (!pk) return 'N/A';
    // Remove 'ITEM#' prefix and show only the first 8 characters
    return pk.replace('ITEM#', '').substring(0, 8);
  };


  // Function to fetch data from the backend
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(ALL_ITEMS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // The GetAllItems Lambda returns the array inside the 'items' key
      // Items are set directly here, filtering happens below.
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
    
    // Search based on actual DynamoDB fields: itemName, category, locationLost
    const matchesSearch =
      (item.itemName && item.itemName.toLowerCase().includes(keyword)) ||
      (item.category && item.category.toLowerCase().includes(keyword)) ||
      (item.locationLost && item.locationLost.toLowerCase().includes(keyword));
      (item.PK && item.PK.toLowerCase().includes(keyword));
    // Filter by Type (Derived from SK: LOST# or FOUND#)
    const matchesType = 
      type === "all" ||
      (type === "lost" && item.SK && item.SK.startsWith("LOST#")) ||
      (type === "found" && item.SK && item.SK.startsWith("FOUND#"));

    // Filter by Category
    const matchesCategory = 
      category === "all" || 
      (item.category && item.category.toLowerCase() === category.toLowerCase());

    // Filter by Status
    const matchesStatus = 
      status === "all" || 
      itemStatus === status.toLowerCase();

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout>
      {/* Search */}
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search.."
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
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="books">Books</option>
          <option value="keys">Keys</option>
          <option value="other">Other</option>
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="lost">LOST</option> 
          <option value="found">FOUND</option>
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
        <p> </p>
      )}
      
      {/* Cards grid */}
      <div className="card-grid">
        {!isLoading && !error && filteredItems.map((item) => (
          <div
            key={item.PK} // Use the PK as the unique key
            className="card"
            // Navigate to the admin detail page using the Partition Key (PK)
            onClick={() => navigate(`/admin/itemdetail/${item.PK}`, { state: item })}
            style={{ cursor: "pointer" }}
          >
            {/* Displaying DynamoDB fields: category, itemName, status */}
            <div className="card-topic">Category: {item.category || 'N/A'}</div>
            <div className="card-title">Item: {item.itemName || 'Untitled'}</div>
            <div className="card-description">ID: {item.PK}</div>
            <div className="card-description">Status: {item.status}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default Home;