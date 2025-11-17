// src/pages/admin/OwnerList.js

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout1"; 
import "../../css/admin.css"; 


const S3_BASE_URL = "https://campuslostandfoundsystem-verification-ids.s3.amazonaws.com";
const VERIFICATION_API_URL = "https://jko38gd3c5.execute-api.us-east-1.amazonaws.com/OwnerList/admin/ownerlist"; 

// Helper function to format the ISO date string (full date/time)
const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
        return new Date(isoString).toLocaleString('en-US');
    } catch (e) {
        return "Invalid Date";
    }
};

// Helper to shorten the Item PK/SK for display
const getItemIdDisplay = (id) => {
    if (!id) return 'N/A';
    const prefixRemoved = id.split('#').pop();
    return prefixRemoved.substring(0, 8) + '...';
}

/* --- Review Modal Component --- */
const ReviewModal = ({ request, onClose }) => {
    if (!request) return null;

    const photoKeys = request.PhotoKeys || [];
    const primaryPhotoKey = photoKeys.length > 0 ? photoKeys[0] : null;

const imageUrl = primaryPhotoKey ? S3_BASE_URL.replace(/\/$/, '') + '/' + primaryPhotoKey.replace(/^\/+/, '') : null;    return (
        <div className="review-modal-backdrop" onClick={onClose}>
            <div className="review-modal-content" onClick={e => e.stopPropagation()}>
                <button className="review-modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Review Verification Request</h2>
                <div className="modal-request-id">Request ID: {request.Id}</div>

                <div className="modal-detail-grid">
                    {/* Claimant Info */}
                    <div className="modal-detail-label">Claimant Name</div>
                    <div className="modal-detail-value font-bold">{request.ClaimantName || 'N/A'}</div>

                    <div className="modal-detail-label">Student ID</div>
                    <div className="modal-detail-value">{request.StudentId || 'N/A'}</div>
                    
                    <div className="modal-detail-label">Role</div>
                    <div className="modal-detail-value">{request.Role || 'N/A'}</div>

                    <div className="modal-detail-label">Telephone</div>
                    <div className="modal-detail-value">{request.Tel || 'N/A'}</div>

                    {/* Item Info */}
                    <div className="modal-divider"></div>
                    <div className="modal-divider"></div>

                    <div className="modal-detail-label">Item ID</div>
                    <div className="modal-detail-value">{request.ItemPK || 'N/A'}</div>

                  

                    {/* Submission Info */}
                    <div className="modal-detail-label">Submitted On</div>
                    <div className="modal-detail-value">{formatDateTime(request.CreatedAt)}</div>

                    {/* --- PHOTO PROOF DISPLAY --- */}
                    <div className="modal-detail-label">Photo Proof</div>
                    <div className="modal-detail-value">
                        {imageUrl ? (
                            <>
                                <p className="text-sm text-gray-500 mb-2">Key: {primaryPhotoKey}</p>
                                <img 
                                    src={imageUrl} 
                                    alt={`Proof for ${request.ClaimantName}`} 
                                    className="verification-proof-image" 
                                    // Fallback if image fails to load (e.g., private bucket)
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/ffaaaa/000000?text=Image+Load+Failed"; }} 
                                />
                            </>
                        ) : (
                            'No photo attached'
                        )}
                    </div>
                    {/* --- END PHOTO PROOF DISPLAY --- */}
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary small" onClick={onClose}>Close Review</button>
                    {/* Add action buttons here (e.g., Approve, Deny) */}
                </div>
            </div>
        </div>
    );
};
/* --- End Review Modal Component --- */


function OwnerList() {
    const [requests, setRequests] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null); 

    // ... (fetchRequests and useEffect logic remains the same)
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(VERIFICATION_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setRequests(data.requests || []);
        } catch (err) {
            console.error("Error fetching verification requests:", err);
            setError("Failed to load verification requests. Check API URL and deployment.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleOpenReview = (request) => {
        setSelectedRequest(request);
    };


    return (
        <AdminLayout>
            <div className="admin-content-container">
                <h1 className="admin-section-title">Owner Verification Lists ({requests.length})</h1>
                <p className="text-gray-600 mb-6 border-b pb-3">
                    Review pending claims to verify the identity of the user attempting to claim a lost item.
                </p>

                {isLoading && <p>Loading requests...</p>}
                {error && <p className="error-message p-3 bg-red-100 border border-red-400 rounded-lg">{error}</p>}
                
                {!isLoading && !error && requests.length === 0 && (
                    <p className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-sm">No pending verification requests at this time.</p>
                )}

                <div className="card-grid owner-card-grid">
                {!isLoading &&
                    !error &&
                    requests.map((req, index) => ( 
                        <div
                            key={req.Id || index} 
                            className="card owner-card-style"
                        >
                            {/* Card content structure (truncated for brevity) */}
                            <div className="owner-claimant-name">{req.ClaimantName || "Unknown Claimant"}</div>
                            <div className="owner-request-id-meta">Request ID: {req.Id.substring(0, 16)}...</div>
                            
                            <div className="owner-detail-list">
                                <div className="owner-detail-row"><span className="owner-detail-label">Student ID:</span> <span className="owner-detail-value">{req.StudentId || "N/A"}</span></div>
                                <div className="owner-detail-row"><span className="owner-detail-label">Tel:</span> <span className="owner-detail-value">{req.Tel || "N/A"}</span></div>
                                <div className="owner-detail-row"><span className="owner-detail-label">Item Id:</span> <span className="owner-detail-value">{(req.ItemPK)}</span></div>
                                <div className="owner-detail-row"><span className="owner-detail-label">Submitted:</span> <span className="owner-detail-value">{formatDateTime(req.CreatedAt)}</span></div>
                            </div>
                            
                            <div className="owner-proof-status">
                                {req.PhotoKeys && req.PhotoKeys.length > 0 ? (
                                    <span className="proof-attached">Photo Proof Attached</span>
                                ) : (
                                    <span className="proof-missing">No Photo Proof</span>
                                )}
                            </div>
                            
                            <div className="owner-action-row">
                                <button className="review-btn" onClick={() => handleOpenReview(req)}>
                                    Open Review
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            
            <ReviewModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
        </AdminLayout>
    );
}

export default OwnerList;