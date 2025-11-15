// src/pages/client/Identification.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "./AdminLayout1";

function Identification() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [tel, setTel] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      role,
      studentId: role === "student" ? studentId : "",
      tel,
      filesCount: files.length,
    };

    console.log("Identification submitted:", payload);
    alert("Identification submitted (connect to backend later).");
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <ClientLayout>
      <div className="id-container">
        <h1 className="id-page-title">Identification</h1>

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
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* TU Student / Other */}
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
                />
              </div>

              <div className="radio-group other-radio">
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

            {/* Buttons */}
            <div className="id-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
              >
                cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </ClientLayout>
  );
}

export default Identification;
