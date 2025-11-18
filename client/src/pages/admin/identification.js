import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "./AdminLayout1";

// ✅ Your deployed API base
const API_BASE = process.env.REACT_APP_API_BASE_PROD_URL;
const GET_UPLOAD_URL_API = `${API_BASE}/getVerificationUploadUrl`;
const SAVE_DATA_API = `${API_BASE}/saveVerificationData`;

function Identification() {
  const navigate = useNavigate();
  const location = useLocation();

  // item passed from AdminDetail
  const itemToUpdate = location.state?.item;

  // --- Form States ---
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [tel, setTel] = useState("");
  const [files, setFiles] = useState([]);

  // For wording only (backend always sets RETURNED right now)
  const statusAction = itemToUpdate?.status === "FOUND" ? "CLAIMED" : "RETURNED";

  // --- UI States ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // If item not passed correctly
  if (!itemToUpdate || !itemToUpdate.PK) {
    return (
      <ClientLayout>
        <div className="id-container">
          <p className="error-message">
            Error: Item context is missing. Cannot process claim.
          </p>
          <button
            className="btn-secondary"
            onClick={() => navigate("/admin/items")}
          >
            Go to Item List
          </button>
        </div>
      </ClientLayout>
    );
  }

  // ---------- Helpers for the 3-step flow ----------

  // 1) Ask backend for a presigned URL
  const getUploadUrlForFile = async (file) => {
    const fileName = file.name;
    const mimeType = file.type || "application/octet-stream";

    const res = await fetch(GET_UPLOAD_URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, mimeType }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to get upload URL");
    }

    return res.json(); // { uploadUrl, key }
  };

  // 2) Upload file directly to S3
  const uploadFileToS3 = async (file, uploadUrl) => {
    const mimeType = file.type || "application/octet-stream";

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: file,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to upload file to S3");
    }
  };

  // 3) Save verification data + mark item as RETURNED in DynamoDB via Lambda
  const saveVerificationData = async (photoKeys) => {
    const payload = {
      itemPK: itemToUpdate.PK, // PK from CampusLostAndFound_Items
      itemSK: itemToUpdate.SK, // SK from CampusLostAndFound_Items
      name,
      role,
      studentId: role === "student" ? studentId : "",
      tel,
      photoKeys, // array of S3 keys
    };

    const res = await fetch(SAVE_DATA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save verification data");
    }

    return res.json();
  };

  // ---------- Event Handlers ----------

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      PK: itemToUpdate.PK,
      SK: itemToUpdate.SK,
      name,
      role,
      studentId: role === "student" ? studentId : "",
      tel,
      filesCount: files.length,
      newStatus: statusAction,
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
    setSubmitError(null);

    try {
      const uploadedKeys = [];

      // Step 1 & 2: for each selected file, get presigned URL and upload to S3
      for (const file of files) {
        const { uploadUrl, key } = await getUploadUrlForFile(file);
        await uploadFileToS3(file, uploadUrl);
        uploadedKeys.push(key);
      }

      // Step 3: save verification data and mark item as RETURNED/CLAIMED
      await saveVerificationData(uploadedKeys);

      console.log("Identification confirmed & submitted successfully.");
      alert(
        `Item ${itemToUpdate.itemName} successfully marked as ${statusAction}.`
      );
      navigate("/admin/items");
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        err.message || "An unknown error occurred during submission."
      );
      setLoading(false);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  // ---------- JSX ----------

  return (
    <ClientLayout>
      <div className="id-container">
        <h1 className="id-page-title">Finalize Claim / Return</h1>

        {/* Item Context Section */}
        <section className="id-section">
          <h2 className="id-section-title">Item Details</h2>
          <p className="id-context-info">
            Item: <strong>{itemToUpdate.itemName}</strong> (
            {itemToUpdate.PK.substring(5, 13)}...)
            <br />
            Reported as: <strong>{itemToUpdate.category}</strong>. Current
            Status: <strong>{itemToUpdate.status}</strong>
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
                  <input type="file" multiple onChange={handleFileChange} />
                </label>
                {files.length > 0 && (
                  <div className="upload-info">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <p className="error-message">{submitError}</p>
            )}

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
              <p className="confirm-text">
                Confirm marking item <strong>{itemToUpdate.itemName}</strong> as{" "}
                <strong>{statusAction}</strong>?
              </p>
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
