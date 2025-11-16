import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "./AdminLayout1";

// PLACEHOLDER: Define your API URL for updating item status 
const UPDATE_ITEM_STATUS_API_URL = "YOUR_NEW_API_GATEWAY_URL_FOR_STATUS_UPDATE"; 

function Identification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🚨 CRITICAL FIX: Retrieve the item object passed from AdminDetail 🚨
  const itemToUpdate = location.state?.item; 

  // --- Form States ---
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [tel, setTel] = useState("");
  const [files, setFiles] = useState([]);
  
  // 🚨 FIXED: Determine the intended status action silently 🚨
  const statusAction = itemToUpdate?.status === 'FOUND' ? 'CLAIMED' : 'RETURNED'; 
  
  // --- UI States ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Check if item data is missing
  if (!itemToUpdate || !itemToUpdate.PK) {
    return (
      <ClientLayout>
        <div className="id-container">
          <p className="error-message">Error: Item context is missing. Cannot process claim.</p>
          <button className="btn-secondary" onClick={() => navigate('/admin/items')}>
            Go to Item List
          </button>
        </div>
      </ClientLayout>
    );
  }

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      PK: itemToUpdate.PK, // Include the item PK
      name,
      role,
      studentId: role === "student" ? studentId : "",
      tel,
      filesCount: files.length,
      newStatus: statusAction, // Status to update (CLAIMED or RETURNED)
    };

    console.log("Identification payload (before confirm):", payload);
    setShowConfirm(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };


  const handleConfirmYes = async () => {
    setShowConfirm(false);
    setLoading(true);

    const submissionPayload = {
      PK: itemToUpdate.PK, 
      claimantName: name,
      claimantRole: role,
      claimantId: role === "student" ? studentId : null,
      claimantTel: tel,
      newStatus: statusAction,
      // You would include files/upload logic here
    };

    try {
        // 🚨 Placeholder for actual API call 🚨
        const res = await fetch(UPDATE_ITEM_STATUS_API_URL, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionPayload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update item status.");
        }

        console.log("Identification confirmed & submitted successfully.");
        alert(`Item ${itemToUpdate.itemName} successfully marked as ${statusAction}.`);
        navigate("/admin/items");

    } catch (err) {
        console.error("Submission error:", err);
        setSubmitError(err.message || "An unknown error occurred during submission.");
        setLoading(false);
    }
  };


  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  return (
    <ClientLayout>
      <div className="id-container">
        <h1 className="id-page-title">Finalize Claim / Return</h1>

        {/* Item Context Section (NEW) */}
        <section className="id-section">
          <h2 className="id-section-title">Item Details</h2>
          <p className="id-context-info">
            Item: <strong>{itemToUpdate.itemName}</strong> ({itemToUpdate.PK.substring(5, 13)}...)
            <br />
            Reported as: <strong>{itemToUpdate.category}</strong>. Current Status: <strong>{itemToUpdate.status}</strong>
            <br />
           
          </p>
        </section>

        <section className="id-section">
          <h2 className="id-section-title">Owner Information</h2>

          <form className="id-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                className="text-input"
                placeholder="Owner's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* SIIT Student / Other */}
            <div className="id-row id-row-radio">
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => setRole("student")}
                  />
                  <span className="radio-label">SIIT Student</span>
                </label>

                <input
                  className="text-input student-id-input"
                  placeholder="Student ID.."
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={role !== "student"}
                  required={role === "student"}
                />
                <span className="required">*</span>
              </div>

              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="other"
                    checked={role === "other"}
                    onChange={() => setRole("other")}
                  />
                  <span className="radio-label">Other</span>
                </label>
              </div>
            </div>

            {/* Tel + Upload */}
            <div className="id-row">
              <div className="form-group half">
                <label className="form-label">Tel.</label>
                <input
                  className="text-input"
                  placeholder="Phone number"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />
              </div>

              <div className="form-group half">
                <label className="form-label">Upload Images</label>
                <label className="upload-btn">
                  <span className="upload-icon">⬆</span>
                  <span>Choose file</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <div className="upload-info">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
            </div>

            {submitError && <p className="error-message">{submitError}</p>}


            {/* Buttons */}
            <div className="id-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* ========= CONFIRM POPUP ========= */}
      {showConfirm && (
        <>
          <div className="confirm-backdrop" />
          <div className="confirm-modal">
            <button
              className="confirm-close"
              type="button"
              onClick={handleConfirmNo}
            >
              ×
            </button>
            <div className="confirm-body">
              <p className="confirm-text">Confirm marking item **{itemToUpdate.itemName}** as **{statusAction}**?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn-primary small"
                  onClick={handleConfirmYes}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn-secondary small"
                  onClick={handleConfirmNo}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ClientLayout>
  );
}

export default Identification;