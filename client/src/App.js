import React from "react";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/ClientHome";
import ReportLost from "./pages/reportlost";
import ItemDetail from "./pages/ItemDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportFound from "./pages/admin/reportfound";
import AdminItems from "./pages/admin/AdminItems";
import AdminDetail from "./pages/admin/AdminDetail";
import Identification from "./pages/admin/identification";
import OwnerList from "./pages/admin/OwnerList";
import MatchingList from "./pages/admin/Matching";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / student routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/item/:id" element={<ItemDetail />} />

        {/* 🔐 Admin routes (protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/report-found"
          element={
            <AdminRoute>
              <ReportFound />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <AdminRoute>
              <AdminItems />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/itemdetail/:id"
          element={
            <AdminRoute>
              <AdminDetail />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/identification"
          element={
            <AdminRoute>
              <Identification />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ownerlist"
          element={
            <AdminRoute>
              <OwnerList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/matching"
          element={
            <AdminRoute>
              <MatchingList />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
