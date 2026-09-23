// frontend/src/components/Landing_Page/FeaturesSection.jsx — Light Premium Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Stack
} from '@mui/material';
import {
  Event as CalendarIcon,
  AccessTime as ClockIcon,
  History as HistoryIcon,
  Build as WrenchIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';

function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const FEATURES = [
  {
    icon: <CalendarIcon sx={{ fontSize: 28, color: '#D32F2F' }} />,
    iconBg: '#FFEBEE',
    title: 'Smart Scheduling',
    description: 'AI-powered booking system that finds the perfect slot for your vehicle service needs.',
  },
  {
    icon: <ClockIcon sx={{ fontSize: 28, color: '#2563EB' }} />,
    iconBg: '#EFF6FF',
    title: 'Real-time Updates',
    description: 'Live notifications and progress tracking throughout your entire service journey.',
  },
  {
    icon: <HistoryIcon sx={{ fontSize: 28, color: '#059669' }} />,
    iconBg: '#ECFDF5',
    title: 'Digital Records',
    description: 'Complete service history digitally accessible anytime, anywhere on any device.',
  },
  {
    icon: <WrenchIcon sx={{ fontSize: 28, color: '#7C3AED' }} />,
    iconBg: '#F5F3FF',
    title: 'Smart Diagnostics',
    description: 'Advanced diagnostic tools ensure accurate issue detection and efficient repairs.',
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 28, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
    title: 'Live Queue Update',
    description: 'Real-time queue tracking so you always know exactly where your vehicle stands.',
  },
];

const FeaturesSection = ({ features, theme }) => {
  const [sectionRef, sectionVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#F8F9FB',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)`,
        backgroundSize: '32px 32px',
        opacity: 0.5,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Section Header */}
        <Box
          ref={sectionRef}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#D32F2F',
              fontFamily: '"Inter", sans-serif',
              mb: 2,
              background: '#FFEBEE',
              px: 2, py: 0.75,
              borderRadius: '100px',
              border: '1px solid rgba(211,47,47,0.2)',
            }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              color: '#111827',
              mb: 2,
            }}
          >
            Everything You Need,{' '}
            <Box component="span" sx={{ color: '#D32F2F' }}>One Platform</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 560,
              mx: 'auto',
              color: '#6B7280',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            Our integrated platform combines cutting-edge technology with premium automotive expertise.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {FEATURES.map((feature, i) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={i < 3 ? 4 : 6}
              key={feature.title}
              sx={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.55s ease ${0.1 + i * 0.08}s, transform 0.55s ease ${0.1 + i * 0.08}s`,
                ...(i === 3 && { ml: { md: 'calc(16.666%)' } }),
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '18px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                    borderColor: 'rgba(211,47,47,0.3)',
                  },
                }}
              >
                {/* Icon box */}
                <Box
                  sx={{
                    width: 56, height: 56,
                    borderRadius: '14px',
                    background: feature.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  {feature.title}
                </Typography>

                {/* Description — use feature data if passed, else fallback */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    lineHeight: 1.75,
                    fontSize: '0.92rem',
                  }}
                >
                  {(features && features[i]?.description) || feature.description}
                </Typography>

                {/* Bottom accent line */}
                <Box sx={{
                  mt: 3, height: 2, width: 40,
                  background: feature.iconBg === '#FFEBEE' ? '#D32F2F' : feature.iconBg.replace('FF', 'D3').slice(0, 7),
                  borderRadius: 1,
                  transition: 'width 0.25s ease',
                  '.MuiBox-root:hover &': { width: '60%' },
                }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;