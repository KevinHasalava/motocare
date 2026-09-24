import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// Inventory
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
// --- NEW PUBLIC PAGES ---
import AboutPage from "./pages/AboutPage";
import ProcessPage from "./pages/ProcessPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";


// --- CURRENT JOB COMPONENT IMPORTS ---
// We keep the two working components: JobDashboard and CreateWalkInJob
import CreateWalkInJob from "./components/adminJob/CreateWalkInJob"; 
import JobDashboard from "./components/adminJob/JobDashboard";
import EditJob from "./components/adminJob/EditJob"; 
// ----------------------------------

// 💰 NEW IMPORT: Cashier Portal Components
import CashierPortal from "./components/Cashier/CashierPortal";
import PaymentHistory from "./components/Cashier/PaymentHistory";
import CashierSlipVerification from "./components/Cashier/CashierSlipVerification";
import CashierDashboard from "./pages/CashierDashboard";
import MyPayments from "./pages/MyPayments"; 

import AdminVehicleManagement from "./pages/admin/AdminVehicleManagement";
import AdminPaymentManagement from "./pages/admin/AdminPaymentManagement";
import Logo from "./components/Landing_Page/Logo";
// ------------------------------------

// ── Branded Loading Splash Screen ────────────────────────────
const LoadingScreen = () => {
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => setLoaded(true), 1600);
    const onLoad = () => clearTimeout(minTimer) || setLoaded(true);
    if (document.readyState === 'complete') {
      setTimeout(() => setLoaded(true), 1400);
    } else {
      window.addEventListener('load', onLoad);
    }
    return () => {
      clearTimeout(minTimer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setHidden(true), 700);
      return () => clearTimeout(t);
    }
  }, [loaded]);

  if (hidden) return null;

  return (
    <div
      id="mc-loading-screen"
      className={loaded ? 'mc-loaded' : ''}
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: '#070B13',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Ambient Red Glow */}
      <div style={{
        position: 'absolute', top: '35%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.18) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />

      {/* Official Luxury Logo mark */}
      <div style={{
        position: 'relative',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'mc-pulse 2s ease-in-out infinite',
      }}>
        <Logo size="large" variant="white" clickable={false} />
      </div>

      {/* Progress bar */}
      <div style={{
        width: 220, height: 3, borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #D32F2F, #EF4444)',
          animation: 'mc-loader-progress 1.5s ease-out forwards',
        }} />
      </div>

      {/* Status text */}
      <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.45)',
        fontFamily: "'Inter', sans-serif",
      }}>
        Starting Engine...
      </div>
    </div>
  );
};



// Component to handle default route based on user type
const DefaultRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // If user is logged in, redirect based on their role
  if (token && user.userType) {
    if (user.userType === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.userType === 'cashier') {
      return <Navigate to="/cashier-dashboard" replace />;
    } else if (user.userType === 'mechanic') {
      return <Navigate to="/mechanic-portal" replace />;
    }
  }
  
  // Default to landing page for customers or non-logged-in users
  return <Landing />;
};

export default function App() {
  return (
    <>
      <LoadingScreen />
    <Router>
      <Routes>
        {/* 🏠 Default route → Redirects admin/cashier to dashboard, customers to landing */}
        <Route path="/" element={<DefaultRoute />} />

        {/* --- New Public Pages --- */}
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq"     element={<FAQPage />} />

        {/* --- Public/Customer Routes --- */}
        <Route path="/home" element={<DefaultRoute />} />
        <Route path="/VehiclePage" element={<VehiclePage />} />
        <Route path="/vehiclepage" element={<VehiclePage />} />
        <Route path="/services" element={<CustomerServicesPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/cashier/slip-verification" element={<CashierSlipVerification />} />
        
        {/* 💳 User Payment Routes */}
        <Route path="/my-payments" element={<MyPayments />} />

        {/* Inventory Management Routes */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/purchase-requests" element={<PurchaseRequestListPage />} />

        <Route path="/admin-service" element={< ServicesPage/>} />
        <Route path="/admin-dashboard" element={< AdminDashboard/>} />
        <Route path="/admin-users" element={< UserManagement/>} />
        <Route path="/admin/bookings" element={< AdminBookingManagement/>} />
        <Route path="/admin/vehicles" element={<AdminVehicleManagement />} />
        <Route path="/admin/payments" element={<AdminPaymentManagement />} />

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
    </>
  );
}