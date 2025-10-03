import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//inventory
import './App.css';
import InventoryPage from './components/InventoryCom/InventoryPage';
import SupplierPage from './components/InventoryCom/SupplierPage'; // Kept for the route definition
import StockPage from './components/InventoryCom/StockPage'; // Kept for the route definition
// 📦 IMPORT: The Purchase Request View Component
import PurchaseRequestView from './components/InventoryCom/PurchaseRequestView'; 
// 📦 NEW IMPORT: The Purchase Request List Component
import PurchaseRequestListPage from './components/InventoryCom/PurchaseRequestListPage'; 

// Import your pages
import Landing from "./pages/Landing";
import VehiclePage from "./pages/VehiclePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import BookingPage from "./pages/BookingPage";
import AdminJobView from "./pages/admin/AdminJobView";
import ServicesPage from "./pages/admin/ServicePage";
import CustomerServicesPage from "./pages/ServicesPage";
import MyBookings from "./pages/MyBooking";
import AdminRegister from "./pages/AdminRegister";
import UserProfile from "./pages/UserProfile";
import MechanicPortal from "./pages/MechanicPortal";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminBookingManagement from "./pages/admin/AdminBookingManagement";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// --- CURRENT JOB COMPONENT IMPORTS ---
// We keep the two working components: JobDashboard and CreateWalkInJob
import CreateWalkInJob from "./components/adminJob/CreateWalkInJob"; 
import JobDashboard from "./components/adminJob/JobDashboard";
import EditJob from "./components/adminJob/EditJob"; 
// ----------------------------------

// 💰 NEW IMPORT: Cashier Portal Components
import CashierPortal from "./components/Cashier/CashierPortal";
import PaymentHistory from "./components/Cashier/PaymentHistory";
import CashierDashboard from "./pages/CashierDashboard";
import MyPayments from "./pages/MyPayments"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Default route → Landing page */}
        <Route path="/" element={<Landing />} />

        {/* --- Public/Customer Routes --- */}
        <Route path="/home" element={<Landing />} />
        <Route path="/VehiclePage" element={<VehiclePage />} />
        <Route path="/services" element={<CustomerServicesPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* --- Admin/Staff Specific Routes --- */}
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Admin/Staff Views (Existing legacy routes) */}
        <Route path="/admin-job-view" element={<AdminJobView />} />


        
        {/* Mechanic Portal */}
        <Route path="/mechanic-portal" element={<MechanicPortal />} />
        
        {/* NEW ROUTE: Manual Walk-In Job Creation (for Cashier) */}
        <Route path="/admin/walkinjob" element={<CreateWalkInJob />} />

        {/* 💰 NEW ROUTES: Cashier Portal */}
        <Route path="/cashier-dashboard" element={<CashierDashboard />} />
        <Route path="/cashier" element={<CashierPortal />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        
        {/* 💳 User Payment Routes */}
        <Route path="/my-payments" element={<MyPayments />} />

        {/* Inventory Management Routes */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/stock" element={<StockPage />} />

        <Route path="/admin-service" element={< ServicesPage/>} />
        <Route path="/admin-dashboard" element={< AdminDashboard/>} />
        <Route path="/admin-users" element={< UserManagement/>} />
        <Route path="/admin/bookings" element={< AdminBookingManagement/>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
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