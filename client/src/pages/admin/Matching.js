// src/pages/admin/Matching.js

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout1"; 
import "../../css/admin.css"; 

// 🚨 Use the LIVE API URL for fetching all notifications 🚨
const NOTIFICATIONS_API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/GetNoti/admin/notifications"; 

// Helper function to format the ISO date string (Kept for optional use, though not displayed)
const formatMatchDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
        const dateObj = new Date(isoString);
        return dateObj.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        return "Invalid Date";
    }
};

function Matching() {
  const [matches, setMatches] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(NOTIFICATIONS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMatches(data.notifications || []);
    } catch (err) {
      console.error("Error fetching match data:", err);
      setError("Failed to load match records. Check API configuration.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  
  // Helper function to extract individual item names
  const parseItemNames = (itemNames) => {
      const parts = itemNames.split(' vs. ');
      const item1Name = parts[0];
      const item2Name = parts[1] || 'Unknown Item';
      return { item1Name, item2Name };
  }


  return (
    <AdminLayout>
      <div className="admin-content-container">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Potential Match Review</h1>
        <p className="text-gray-600 mb-6 border-b pb-3">
          Pending matches across all categories.
        </p>

        {isLoading && <p>Loading match records...</p>}
        {error && <p className="error-message p-3 bg-red-100 border border-red-400 rounded-lg">{error}</p>}
        
        {!isLoading && !error && matches.length === 0 && (
            <p className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-sm">No pending potential matches at this time. All items are clear.</p>
        )}

        <div className="match-list space-y-4">
          {!isLoading && !error && matches.map((match) => {
            const { item1Name, item2Name } = parseItemNames(match.itemNames);
            
            // Logic to display reporter ID
            const reporterId = match.reporterId;
            const reporterDisplay = reporterId 
                                  ? `User ID: ${reporterId}` 
                                  : 'Unknown Reporter';

            return (
                <div 
                    key={match.PK + match.SK}
                    className={`match-item p-4 border rounded-lg shadow-md bg-white border-blue-200`}
                >
            
                  
                  <div className="match-details space-y-2">
                    {/* 1. LOST ITEM REPORTER USER */}
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Lost Item Reported by</span> {reporterDisplay}
                    </p>

                    <div className="match-header flex justify-between items-start mb-2 border-b pb-2">
                    {/* Display Category - Bolding is implied via Tailwind font-bold */}
                    <span className="text-base font-semibold text-indigo-700">
                        Category: {match.category}
                    </span>
                  </div>
                    

                    {/* 3. ITEM IDs (Unformatted, simple display) */}
                    <div className="text-xs text-gray-500 space-y-1 pt-1 border-t mt-3">
                        <p>
                            Item ID: {match.PK.replace('MATCH#', '')}
                        </p>
                        <p>
                            Matched Item ID: {match.SK.replace('MATCH#', '')}
                        </p>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </AdminLayout>
  );
}

export default Matching;