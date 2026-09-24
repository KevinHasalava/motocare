// frontend/src/pages/Landing.jsx — Ultra Premium Automotive Service Center Home Page
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, CssBaseline, Box, GlobalStyles,
} from '@mui/material';
import {
  Star as StarIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/Landing_Page/HeroSection';
import ServicesShowcase from '../components/Landing_Page/ServicesShowcase';
import EmergencyHotlineStrip from '../components/Landing_Page/EmergencyHotlineStrip';
import WorkshopFacilities from '../components/Landing_Page/WorkshopFacilities';
import FeaturesSection from '../components/Landing_Page/FeaturesSection';
import BeforeAfterSection from '../components/Landing_Page/BeforeAfterSection';
import ProcessSection from '../components/Landing_Page/ProcessSection';
import TestimonialsSection from '../components/Landing_Page/TestimonialsSection';
import CtaSection from '../components/Landing_Page/CtaSection';

// Import theme and data
import { theme, backgroundKeyframes, mockData } from '../utils/theme';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced stats with automotive icons
  const statsWithIcons = [
    { value: '15+', label: 'Years Experience', icon: <StarIcon sx={{ color: '#F59E0B', fontSize: 22 }} /> },
    { value: '50,000+', label: 'Vehicles Serviced', icon: <CarIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 22 }} /> },
    { value: '99.4%', label: 'Satisfaction Rate', icon: <SpeedIcon sx={{ color: '#EF4444', fontSize: 22 }} /> },
    { value: '35+', label: 'Certified Technicians', icon: <EngineeringIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 22 }} /> },
  ];

  const handleBookServiceClick = () => {
    window.location.href = '/booking';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ...backgroundKeyframes,
          body: {
            background: '#FFFFFF',
            overflowX: 'hidden',
          },
        }}
      />

      <Box sx={{
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
        background: '#FFFFFF',
      }}>

        {/* ── Fixed Premium Header ───────────────────────────────────── */}
        <Header
          navItems={['Home', 'Services', 'Workshop', 'Process', 'Reviews', 'Contact']}
          onBookNowClick={handleBookServiceClick}
          theme={theme}
        />

        {/* ── Main Landing Content Flow ──────────────────────────────── */}
        <Box
          component="main"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          {/* 1. Cinematic Service Center Hero + Stats Bar */}
          <HeroSection
            isVisible={isVisible}
            onBookNowClick={handleBookServiceClick}
            stats={statsWithIcons}
            theme={theme}
          />

          {/* 2. Comprehensive Automotive Services Showcase */}
          <ServicesShowcase />

          {/* 3. Emergency Breakdown Assistance & Workshop Details */}
          <EmergencyHotlineStrip />

          {/* 4. Real State-of-the-Art Workshop Bays & Equipment */}
          <WorkshopFacilities />

          {/* 5. Features — Why Moto-Care Stands Apart */}
          <FeaturesSection
            isVisible={isVisible}
            features={mockData.features}
            theme={theme}
          />

          {/* 6. Interactive Visual Proof — Before & After Results */}
          <BeforeAfterSection />

          {/* 7. 4-Step Seamless Service Journey */}
          <ProcessSection
            isVisible={isVisible}
            processSteps={mockData.processSteps}
            theme={theme}
          />

          {/* 8. Verified Google Reviews & Customer Feedback */}
          <TestimonialsSection />

          {/* 9. About Moto-Care + Luxury Dark Closing Banner */}
          <CtaSection
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />
        </Box>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Landing;