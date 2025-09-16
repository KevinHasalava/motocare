// frontend/src/components/CtaSection.jsx
import React from 'react';
import {
  Box, Container, Paper, Typography, Button, Stack, Grid, alpha, Chip
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  AutoAwesome as SparkleIcon,
  Speed as SpeedIcon,
  Engineering as EngineeringIcon,
  DirectionsCar as CarIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';

const CtaSection = ({ onBookNowClick, theme }) => {
  const benefits = [
    { icon: <SpeedIcon />, text: "24/7 Service" },
    { icon: <EngineeringIcon />, text: "Expert Mechanics" },
    { icon: <CheckIcon />, text: "Quality Guarantee" },
  ];

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite 2s',
        }}
      />

      {/* Tire Track Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.05) 20px,
            rgba(255, 255, 255, 0.05) 21px
          )`,
        }}
      />

      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            position: 'relative',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #0B0E14 0%, #1A1F2B 100%)',
            border: '1px solid',
            borderColor: alpha('#FF6B6B', 0.2),
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #FFD43B, #748FFC)',
              animation: 'shimmer 3s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }
          }}
        >
          {/* Special Offer Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Chip
              icon={<OfferIcon />}
              label="LIMITED TIME OFFER"
              sx={{
                background: 'linear-gradient(135deg, #FFD43B 0%, #FD7E14 100%)',
                color: '#0B0E14',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: 1,
                px: 2,
                py: 2.5,
                '& .MuiChip-icon': {
                  color: '#0B0E14',
                },
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </Box>

          {/* Main Content */}
          <Stack spacing={4} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '30%',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                animation: 'engineRev 3s ease-in-out infinite',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '30%',
                  background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                  opacity: 0.5,
                  animation: 'rotate 3s linear infinite',
                  zIndex: -1,
                  filter: 'blur(10px)',
                }
              }}
            >
              <CarIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>

            {/* Heading */}
            <Typography 
              variant="h2" 
              component="h2" 
              align="center"
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                maxWidth: '800px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
              }}
            >
              Your Vehicle Deserves
              <Box 
                component="span" 
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                }}
              >
                Premium Service
                <SparkleIcon 
                  sx={{ 
                    position: 'absolute',
                    top: -10,
                    right: -30,
                    color: '#FFD43B',
                    fontSize: 30,
                    animation: 'sparkle 2s ease-in-out infinite',
                  }} 
                />
              </Box>
            </Typography>

            {/* Description */}
            <Typography 
              variant="h6"
              align="center"
              sx={{ 
                color: alpha('#fff', 0.6),
                maxWidth: '600px',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Experience next-generation automotive care with cutting-edge diagnostics, 
              expert technicians, and transparent pricing.
            </Typography>

            {/* Benefits */}
            <Grid container spacing={3} sx={{ maxWidth: 600, mt: 2 }}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha('#fff', 0.03),
                      border: '1px solid',
                      borderColor: alpha('#4ECDC4', 0.2),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha('#4ECDC4', 0.1),
                        borderColor: alpha('#4ECDC4', 0.4),
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Box sx={{ color: '#4ECDC4' }}>
                      {benefit.icon}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha('#fff', 0.9),
                        fontWeight: 600,
                      }}
                    >
                      {benefit.text}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>

            {/* CTA Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              sx={{ mt: 4 }}
            >
              <Button
                onClick={onBookNowClick}
                variant="contained"
                size="large"
                startIcon={<CalendarIcon />}
                endIcon={<ArrowIcon />}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(255, 107, 107, 0.4)',
                    '&::before': {
                      left: '100%',
                    },
                    '& .MuiButton-endIcon': {
                      transform: 'translateX(5px)',
                    }
                  }
                }}
              >
                Book Service Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<SpeedIcon />}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 3,
                  borderColor: '#4ECDC4',
                  color: '#4ECDC4',
                  background: alpha('#4ECDC4', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#4ECDC4',
                    background: alpha('#4ECDC4', 0.15),
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 30px rgba(78, 205, 196, 0.2)',
                  }
                }}
              >
                Get Free Quote
              </Button>
            </Stack>

            {/* Trust Indicators */}
            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ 
                mt: 6,
                pt: 4,
                borderTop: '1px solid',
                borderColor: alpha('#fff', 0.1),
              }}
            >
              {[
                { number: '10K+', label: 'Happy Customers' },
                { number: '15+', label: 'Years Experience' },
                { number: '4.9★', label: 'Average Rating' },
              ].map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: alpha('#fff', 0.5),
                      fontSize: '0.85rem',
                      mt: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* Add animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes engineRev {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-2deg); }
          75% { transform: scale(1.05) rotate(2deg); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2) rotate(180deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Box>
  );
};

export default CtaSection;