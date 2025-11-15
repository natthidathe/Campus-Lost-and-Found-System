import React from "react";
import AdminLayout from "./AdminLayout1";

function AdminDashboard() {
  // later you can pull these from the backend
  const summaryStats = [
    { label: "Lost", value: 4 },
    { label: "Found", value: 5 },
    { label: "Matched", value: 3 },
    { label: "Verified", value: 2 },
  ];

  // example structure for recent activities (currently empty)
  const recentActivities = [
    // {
    //   id: "L-001",
    //   item: "Wallet",
    //   user: "Mind K.",
    //   status: "Matched",
    //   date: "10 Oct 2025",
    //   time: "14:30",
    // },
  ];

  return (
    <AdminLayout>
      {/* ===== Summary cards ===== */}
      <section className="admin-summary-section">
        <h2 className="admin-section-title">Summary</h2>

        <div className="admin-summary-grid">
          {summaryStats.map((s) => (
            <div key={s.label} className="admin-summary-card">
              <div className="admin-summary-label">{s.label}</div>
              <div className="admin-summary-value">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Recent activities table ===== */}
      <section className="admin-table-section">
        <h2 className="admin-section-title">Recent Activities Table</h2>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>User</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length === 0 ? (
                <tr className="admin-table-empty-row">
                  <td colSpan={6}>No activities yet.</td>
                </tr>
              ) : (
                recentActivities.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.item}</td>
                    <td>{row.user}</td>
                    <td>{row.status}</td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
