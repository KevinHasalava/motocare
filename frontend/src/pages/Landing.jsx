// frontend/src/components/Landing.jsx
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, CssBaseline, Box, GlobalStyles,
} from '@mui/material';
import {
  Event as CalendarIcon, AccessTime as ClockIcon, History as HistoryIcon, 
  Build as WrenchIcon, Star as StarIcon, 
  
  Speed as SpeedIcon,
  DirectionsCar as CarIcon, Engineering as EngineeringIcon
} from '@mui/icons-material';


// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/Landing_Page/HeroSection';
import FeaturesSection from '../components/Landing_Page/FeaturesSection';
import ProcessSection from '../components/Landing_Page/ProcessSection';
import CtaSection from '../components/Landing_Page/CtaSection';

// Import theme and data
import { theme, backgroundKeyframes, mockData } from '../utils/theme';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
 

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced features with automotive icons
  const featuresWithIcons = mockData.features.map((feature, index) => {
    const iconData = [
      { 
        icon: <CalendarIcon sx={{ fontSize: 32, color: '#fff' }} />, 
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
        bgPattern: 'calendar'
      },
      { 
        icon: <ClockIcon sx={{ fontSize: 32, color: '#fff' }} />, 
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #087F5B 100%)',
        bgPattern: 'clock'
      },
      { 
        icon: <HistoryIcon sx={{ fontSize: 32, color: '#fff' }} />, 
        gradient: 'linear-gradient(135deg, #FFD43B 0%, #FD7E14 100%)',
        bgPattern: 'history'
      },
      { 
        icon: <WrenchIcon sx={{ fontSize: 32, color: '#fff' }} />, 
        gradient: 'linear-gradient(135deg, #748FFC 0%, #4C6EF5 100%)',
        bgPattern: 'wrench'
      },
      { 
        icon: <EngineeringIcon sx={{ fontSize: 32, color: '#fff' }} />, 
        gradient: 'linear-gradient(135deg, #FF8CC3 0%, #D658A0 100%)',
        bgPattern: 'gear'
      },
    ];
    return { ...feature, ...iconData[index] };
  });

  // Enhanced stats with automotive theme
  const statsWithIcons = mockData.stats.map((stat, index) => {
    const icons = [
      <StarIcon sx={{ color: '#FFD43B', filter: 'drop-shadow(0 4px 12px rgba(255, 212, 59, 0.4))' }} />,
      <CarIcon sx={{ color: '#4ECDC4', filter: 'drop-shadow(0 4px 12px rgba(78, 205, 196, 0.4))' }} />,
      <SpeedIcon sx={{ color: '#FF6B6B', filter: 'drop-shadow(0 4px 12px rgba(255, 107, 107, 0.4))' }} />,
      <EngineeringIcon sx={{ color: '#748FFC', filter: 'drop-shadow(0 4px 12px rgba(116, 143, 252, 0.4))' }} />
    ];
    return { ...stat, icon: icons[index] };
  });

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
        
        {/* Header */}
        <Header 
          navItems={mockData.navItems} 
          onBookNowClick={handleBookServiceClick} 
          theme={theme}
        />
        
        {/* Main Content */}
        <Box 
          component="main"
          sx={{
            position: 'relative',
            zIndex: 1,
            '& > *': {
              position: 'relative',
              zIndex: 1,
            }
          }}
        >
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