import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout1";

// API endpoint that returns ALL ITEMS
const SUMMARY_API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/GetItem/items"; 

// Helper function to check if a timestamp is "today"
const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

function AdminDashboard() {
  const initialStats = [
    { label: "Lost", value: 0 },
    { label: "Found", value: 0 },
    { label: "Returned", value: 0 },
  ];
  
  const [summaryStats, setSummaryStats] = useState(initialStats);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recencyBreakdown, setRecencyBreakdown] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(SUMMARY_API_URL); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const allItems = data.items || [];
      const totalItemsCount = allItems.length;

      // 1. Calculate Status Summary Counts
      const counts = allItems.reduce((acc, item) => {
        const status = item.status ? item.status.toUpperCase() : null;
        if (status === 'LOST') {
          acc.Lost++;
        } else if (status === 'FOUND') {
          acc.Found++;
        } else if (status === 'RETURNED' || status === 'CLAIMED') { // CLAIMED is treated as Returned for simple dashboard count
          acc.Returned++;
        }
        return acc;
      }, { Lost: 0, Found: 0, Returned: 0 }); // Removed 'Active' from initial accumulator

      setSummaryStats([
        { label: "Total Items", value: totalItemsCount }, 
        { label: "Lost", value: counts.Lost },
        { label: "Found", value: counts.Found },
        { label: "Returned", value: counts.Returned },
      ]);
      
      // 2. Calculate Recency Breakdown
      const recencyCounts = allItems.reduce((acc, item) => {
          if (item.createdAt && isToday(item.createdAt)) {
              acc.today++;
          } else {
              acc.older++;
          }
          return acc;
      }, { today: 0, older: 0 });

      setRecencyBreakdown([
          { label: "Reported Today", value: recencyCounts.today },
          { label: "Older Items", value: recencyCounts.older },
      ]);
      
      // 3. Calculate Category Breakdown
      const categoryCounts = allItems.reduce((acc, item) => {
        const category = item.category ? item.category : 'Unknown';
        const key = category.toLowerCase(); 
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const breakdownArray = Object.keys(categoryCounts)
        .map(key => ({ 
            category: key.charAt(0).toUpperCase() + key.slice(1),
            count: categoryCounts[key] 
        }))
        .sort((a, b) => b.count - a.count);

      setCategoryBreakdown(breakdownArray);
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
      setSummaryStats(initialStats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Calculate the highest category count to normalize bar lengths
  const maxCategoryCount = categoryBreakdown.length > 0
    ? Math.max(...categoryBreakdown.map(item => item.count))
    : 1; 

  return (
    <AdminLayout>
      {/* Loading/Error Block */}
      {isLoading && <p>Loading dashboard data...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {/* Only render content if not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* ===== 1. Status and Totals Summary cards ===== */}
          <section className="admin-summary-section">
            <h2 className="admin-section-title">Operational Summary</h2>
            <div className="admin-summary-grid">
              {summaryStats.map((s) => (
                <div key={s.label} className="admin-summary-card">
                  <div className="admin-summary-label">{s.label}</div>
                  <div className="admin-summary-value">{s.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Item Recency */}
          <section className="admin-summary-section">
            <h2 className="admin-section-title">Item Recency</h2>
            <div className="admin-summary-grid">
                {recencyBreakdown.map((r) => (
                  <div key={r.label} className="admin-summary-card">
                    <div className="admin-summary-label">{r.label}</div>
                    <div className="admin-summary-value">{r.value}</div>
                  </div>
                ))}
            </div>
          </section>


          {/* ===== 3. Category Breakdown (GRAPHICAL VIEW) ===== */}
          <section className="admin-table-section">
            <h2 className="admin-section-title">Item Category Breakdown </h2>

            <div className="admin-chart-wrapper">
              {categoryBreakdown.length === 0 ? (
                <p>No item categories found.</p>
              ) : (
                <div className="category-bar-chart">
                  {categoryBreakdown.map((row) => {
                    // Calculate percentage for bar width
                    const barWidth = (row.count / maxCategoryCount) * 100;

                    return (
                      <div key={row.category} className="chart-bar-row">
                        <div className="chart-label">{row.category}</div>
                        <div className="chart-bar-container">
                          <div 
                            className="chart-bar" 
                            style={{ width: `${barWidth}%` }}
                            title={`${row.count} items`}
                          >
                            <span className="bar-value">{row.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;