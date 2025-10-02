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

// --- CURRENT JOB COMPONENT IMPORTS ---
// We keep the two working components: JobDashboard and CreateWalkInJob
import CreateWalkInJob from "./components/adminJob/CreateWalkInJob"; 
import JobDashboard from "./components/adminJob/JobDashboard";
import EditJob from "./components/adminJob/EditJob"; 
// ----------------------------------

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Default route → Landing page */}
        <Route path="/" element={<Landing />} />

        {/* --- Public/Customer Routes --- */}
        <Route path="/home" element={<Landing />} />
        <Route path="/VehiclePage" element={<VehiclePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        
        {/* --- Admin/Staff Specific Routes --- */}
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Admin/Staff Views (Existing legacy routes) */}
        <Route path="/admin-job-view" element={<AdminJobView />} />
        <Route path="/admin-service" element={<ServicesPage />} />
        
        {/* --- JOB MANAGEMENT ROUTES (WORKING ONLY) --- */}
        
        {/* 1. Job List - Displays the DataGrid with all jobs */}
        <Route path="/admin/jobs" element={<JobDashboard />} />

        {/* 2. Create Job - Manual Walk-In Job Creation (for Cashier) */}
        <Route path="/admin/walkinjob" element={<CreateWalkInJob />} />

        {/* 3. View/Edit Routes - TEMPORARILY REMOVED to avoid build errors.         */}
        <Route path="/admin/jobs/view/:id" element={<EditJob isViewMode={true} />} />
        <Route path="/admin/jobs/edit/:id" element={<EditJob />} />

      </Routes>
    </Router>
  );
}