// src/components/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role"); // "admin" or "student"

  // Not logged in / no role
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // ✅ Admin user
  return children;
};

export default AdminRoute;
