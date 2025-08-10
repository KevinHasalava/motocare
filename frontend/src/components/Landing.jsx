// frontend/src/components/Landing.jsx
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, CssBaseline, Box, GlobalStyles
} from '@mui/material';
import {
  Event as CalendarIcon, AccessTime as ClockIcon, History as HistoryIcon, 
  Build as WrenchIcon, Star as StarIcon, CheckCircle as CheckCircleIcon, 
  FlashOn as ZapIcon
} from '@mui/icons-material';

// Import components
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ProcessSection from './ProcessSection';
import CtaSection from './CtaSection';

// Import theme and data
import { theme, backgroundKeyframes, mockData } from '../utils/theme';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced features data with icons
  const featuresWithIcons = mockData.features.map((feature, index) => {
    const icons = [
      <CalendarIcon sx={{ fontSize: 48 }} />,
      <ClockIcon sx={{ fontSize: 48 }} />,
      <HistoryIcon sx={{ fontSize: 48 }} />,
      <WrenchIcon sx={{ fontSize: 48 }} />
    ];
    return { ...feature, icon: icons[index] };
  });

  // Enhanced stats data with icons
  const statsWithIcons = mockData.stats.map((stat, index) => {
    const icons = [
      <StarIcon sx={{ color: 'primary.light' }} />,
      <CheckCircleIcon sx={{ color: 'primary.light' }} />,
      <StarIcon sx={{ color: 'primary.light' }} />,
      <ZapIcon sx={{ color: 'primary.light' }} />
    ];
    return { ...stat, icon: icons[index] };
  });

  // Handler function for booking
  const handleBookServiceClick = () => {
    console.log("Advanced booking system would be implemented here!");
    // Add your booking logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      {/* Background Animated Blobs */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ 
          position: 'absolute', 
          top: '25%', 
          left: '25%', 
          width: 384, 
          height: 384, 
          bgcolor: 'primary.main', 
          borderRadius: '50%', 
          filter: 'blur(80px)', 
          animation: 'pulse 8s infinite ease-in-out' 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          top: '33%', 
          right: '25%', 
          width: 384, 
          height: 384, 
          bgcolor: 'secondary.main', 
          borderRadius: '50%', 
          filter: 'blur(80px)', 
          animation: 'pulse 8s infinite 2s ease-in-out' 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: '25%', 
          left: '33%', 
          width: 384, 
          height: 384, 
          bgcolor: 'info.main', 
          borderRadius: '50%', 
          filter: 'blur(80px)', 
          animation: 'pulse 8s infinite 4s ease-in-out' 
        }} />
      </Box>

      <Box sx={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
        
        {/* Header */}
        <Header 
          navItems={mockData.navItems} 
          onBookNowClick={handleBookServiceClick} 
          theme={theme}
        />
        
        {/* Main Content */}
        <Box component="main">
          <HeroSection 
            isVisible={isVisible} 
            onBookNowClick={handleBookServiceClick} 
            stats={statsWithIcons} 
            theme={theme}
          />
          
          <FeaturesSection 
            isVisible={isVisible} 
            features={featuresWithIcons} 
            theme={theme}
          />
          
          <ProcessSection 
            isVisible={isVisible} 
            processSteps={mockData.processSteps} 
            theme={theme}
          />
          
          <CtaSection 
            onBookNowClick={handleBookServiceClick} 
            theme={theme}
          />
        </Box>
        
        {/* Footer */}
        <Footer />

      </Box>
    </ThemeProvider>
  );
};

export default Landing;