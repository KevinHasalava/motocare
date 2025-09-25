import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Landing from "./pages/Landing";
import VehiclePage from "./pages/VehiclePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import BookingPage from "./pages/BookingPage";
import AdminJobView from "./pages/admin/AdminJobView";
import ServicesPage from "./pages/admin/ServicePage";
import MyBookings from "./pages/MyBooking";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Default route → Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Other routes */}
        <Route path="/home" element={<Landing />} />
        <Route path="/VehiclePage" element={<VehiclePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* admin page walata adala ewa */}
        <Route path="/admin-job-view" element={<AdminJobView />} />
        <Route path="/admin-service" element={< ServicesPage/>} />
        <Route path="/admin-dashboard" element={< AdminDashboard/>} />
        <Route path="/admin-users" element={< UserManagement/>} />
      </Routes>
    </Router>
  );
}
