import React from "react";
import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/ClientHome";
import ReportLost from "./pages/reportlost";
import ItemDetail from "./pages/ItemDetail";
//import Notifications from "./pages/notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportFound from "./pages/admin/reportfound";
//import AdminItems from "./pages/admin/AdminItems";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        {/* <Route path="/notifications" element={<Notifications />} /> */}
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/report-found" element={<ReportFound />} />
        {/* <Route path="/admin/items" element={<AdminItems />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
