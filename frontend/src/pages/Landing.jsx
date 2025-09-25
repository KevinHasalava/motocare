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
    console.log("Advanced booking system would be implemented here!");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles 
        styles={{
          ...backgroundKeyframes,
          body: {
            background: '#0B0E14',
            overflowX: 'hidden',
          },
          '::-webkit-scrollbar': {
            width: '12px',
          },
          '::-webkit-scrollbar-track': {
            background: '#0B0E14',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #FF6B6B, #C92A2A)',
            borderRadius: '6px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(180deg, #FF8787, #E03131)',
          },
        }} 
      />

      {/* Professional Automotive Background */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        {/* Base gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, 
              #0B0E14 0%, 
              #141922 25%,
              #1A1F2B 50%,
              #141922 75%,
              #0B0E14 100%
            )`,
          }}
        />

        {/* Moving Road/Highway Effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            perspective: '1000px',
            opacity: 0.3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 80px,
                rgba(255, 107, 107, 0.1) 80px,
                rgba(255, 107, 107, 0.1) 160px
              )`,
              transform: 'rotateX(70deg) translateZ(0)',
              animation: 'road 3s linear infinite',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #0B0E14 0%, transparent 100%)',
              }
            }}
          />
        </Box>

        {/* Technical Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(78, 205, 196, 0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(78, 205, 196, 0.5) 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        {/* Animated Speed Lines */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={`speed-${i}`}
            sx={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              left: '-100%',
              width: `${100 + Math.random() * 200}px`,
              height: '2px',
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${i % 2 === 0 ? 'rgba(255, 107, 107, 0.5)' : 'rgba(78, 205, 196, 0.5)'} 50%, 
                transparent 100%
              )`,
              animation: `speedLine ${5 + i * 0.5}s linear infinite ${i * 0.5}s`,
            }}
          />
        ))}

        {/* Floating Gear/Parts Elements */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={`gear-${i}`}
            sx={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 60,
              height: 60,
              opacity: 0.02,
              animation: `floatRotate ${20 + i * 2}s linear infinite`,
              '&::before': {
                content: '"⚙"',
                position: 'absolute',
                fontSize: '60px',
                color: i % 2 === 0 ? '#FF6B6B' : '#4ECDC4',
              }
            }}
          />
        ))}

        {/* Dashboard-inspired Light Beams */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200%',
            height: '100%',
            opacity: 0.05,
            background: `conic-gradient(
              from 180deg at 50% 0%,
              transparent 0deg,
              rgba(255, 107, 107, 0.3) 45deg,
              transparent 90deg,
              rgba(78, 205, 196, 0.3) 135deg,
              transparent 180deg,
              rgba(116, 143, 252, 0.3) 225deg,
              transparent 270deg,
              rgba(255, 212, 59, 0.3) 315deg,
              transparent 360deg
            )`,
            animation: 'rotate 30s linear infinite',
            filter: 'blur(60px)',
          }}
        />

        {/* Oil Stain Effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 300,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(
              ellipse at center,
              rgba(116, 143, 252, 0.1) 0%,
              rgba(78, 205, 196, 0.1) 25%,
              rgba(255, 107, 107, 0.1) 50%,
              transparent 70%
            )`,
            filter: 'blur(40px)',
            animation: 'oilSheen 8s ease-in-out infinite',
            transform: `translateY(${-scrollY * 0.2}px)`,
          }}
        />

        {/* Tire Track Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '-10%',
            width: '120%',
            height: '100%',
            opacity: 0.02,
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.1) 20px,
              rgba(255, 255, 255, 0.1) 21px,
              transparent 21px,
              transparent 41px,
              rgba(255, 255, 255, 0.1) 41px,
              rgba(255, 255, 255, 0.1) 42px
            )`,
            animation: 'tireTrack 30s linear infinite',
          }}
        />

        {/* Dashboard Warning Lights Effect */}
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          {['#FF6B6B', '#4ECDC4', '#FFD43B'].map((color, i) => (
            <Box
              key={i}
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                margin: '0 8px',
                opacity: 0.3,
                animation: `blink ${2 + i}s ease-in-out infinite ${i * 0.3}s`,
                boxShadow: `0 0 20px ${color}`,
              }}
            />
          ))}
        </Box>

        {/* Exhaust Smoke Effect */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={`smoke-${i}`}
            sx={{
              position: 'absolute',
              bottom: `${10 + i * 10}%`,
              left: `${70 + i * 5}%`,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
              filter: 'blur(30px)',
              animation: `smoke ${10 + i * 2}s ease-out infinite ${i}s`,
            }}
          />
        ))}
      </Box>

      <Box sx={{ 
        minHeight: '100vh', 
        position: 'relative', 
        overflowX: 'hidden',
        background: 'transparent',
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

      {/* Custom Automotive Animations */}
      <style jsx global>{`
        @keyframes road {
          0% { transform: rotateX(70deg) translateZ(0) translateX(0); }
          100% { transform: rotateX(70deg) translateZ(0) translateX(-160px); }
        }
        
        @keyframes speedLine {
          0% { left: -100%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        
        @keyframes floatRotate {
          0% { 
            transform: rotate(0deg) translateY(0px);
            opacity: 0.02;
          }
          50% { 
            transform: rotate(180deg) translateY(-30px);
            opacity: 0.05;
          }
          100% { 
            transform: rotate(360deg) translateY(0px);
            opacity: 0.02;
          }
        }
        
        @keyframes rotate {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }
        
        @keyframes oilSheen {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.1;
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            opacity: 0.15;
          }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes tireTrack {
          0% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(100px) rotate(2deg); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes smoke {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100px) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </ThemeProvider>
  );
};

export default Landing;