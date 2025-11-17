// src/pages/admin/Matching.js

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout1"; 
import "../../css/admin.css"; 

// 🚨 Use the LIVE API URL for fetching all notifications 🚨
const NOTIFICATIONS_API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/GetNoti/admin/notifications"; 

// Helper function to format the ISO date string
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
  const navigate = useNavigate();
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
  
  // Helper to navigate to the detail page of the item that initiated the match (PK)
  const handleItemClick = (pk) => {
      navigate(`/admin/itemdetail/${pk.replace('MATCH#', '')}`);
  };

  // Helper function to extract individual item names and statuses
  const parseItemNames = (itemNames) => {
      const parts = itemNames.split(' vs. ');
      const item1Name = parts[0];
      const item2Name = parts[1] || 'Unknown Item';
      return { item1Name, item2Name };
  }


  return (
    <AdminLayout>
      <div className="admin-content-container">
        <h1 className="text-3xl font-bold mb-4">Potential Match Review</h1>
        <p className="text-gray-600 mb-6 border-b pb-3">
          Displaying {matches.length} pending matches across all categories.
        </p>

        {isLoading && <p>Loading match records...</p>}
        {error && <p className="error-message p-3 bg-red-100 border border-red-400 rounded-lg">{error}</p>}
        
        {!isLoading && !error && matches.length === 0 && (
            <p className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg">No pending potential matches at this time.</p>
        )}

        <div className="match-list space-y-4">
          {!isLoading && !error && matches.map((match) => {
            const { item1Name, item2Name } = parseItemNames(match.itemNames);
            
            // 🚨 FIX: Display the reporterId field directly if available 🚨
            const reporterId = match.reporterId;
            const reporterDisplay = reporterId 
                                  ? `by User ID ${reporterId}` 
                                  : 'by Unknown Reporter';

            return (
                <div 
                    key={match.PK + match.SK}
                    className={`match-item p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer 
                              ${match.status === 'PENDING_REVIEW' ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                    onClick={() => handleItemClick(match.PK)} 
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                                     ${match.status === 'PENDING_REVIEW' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'}`}>
                        {match.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                        Category: {match.category}
                    </span>
                  </div>
                  
                  <div className="match-details">
                    <p className="text-lg font-semibold text-gray-800">
                      Match: {item1Name} & {item2Name}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      Reported {reporterDisplay} on {formatMatchDate(match.matchDate)}.
                    </p>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                      <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={(e) => { 
                              e.stopPropagation(); 
                              handleItemClick(match.PK); 
                          }}
                      >
                          Review Item
                      </button>
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