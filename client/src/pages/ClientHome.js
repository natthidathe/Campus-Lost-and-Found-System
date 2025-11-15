// src/pages/client/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayout";

// ---- mock data ----
const mockItems = [
  { id: 1, topic: "Topic", title: "Title", description: "Description" },
  { id: 2, topic: "Topic", title: "Title", description: "Description" },
  { id: 3, topic: "Topic", title: "Title", description: "Description" },
  { id: 4, topic: "Topic", title: "Title", description: "Description" },
  { id: 5, topic: "Topic", title: "Title", description: "Description" },
  { id: 6, topic: "Topic", title: "Title", description: "Description" },
];

function Home() {
  const navigate = useNavigate();

  // search + filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredItems = mockItems.filter((item) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      item.topic.toLowerCase().includes(keyword) ||
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    // later you can also use type/category/status once your data has those fields
    return matchesSearch;
  });

  return (
    <ClientLayout>
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
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Section title */}
      <div className="section-header">
        <h2>All Item List</h2>
      </div>

      {/* Cards grid */}
      <div className="card-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card"
            onClick={() => navigate(`/item/${item.id}`, { state: item })}
            style={{ cursor: "pointer" }}
          >
            <div className="card-topic">{item.topic}</div>
            <div className="card-title">{item.title}</div>
            <div className="card-description">{item.description}</div>
          </div>
        ))}
      </div>
    </ClientLayout>
  );
}

export default Home;
