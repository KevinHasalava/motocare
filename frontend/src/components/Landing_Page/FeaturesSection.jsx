// frontend/src/components/Landing_Page/FeaturesSection.jsx — Ultra Premium Light Theme
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import {
  Event as CalendarIcon,
  AccessTime as ClockIcon,
  History as HistoryIcon,
  Build as WrenchIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const FEATURES = [
  {
    icon: <CalendarIcon sx={{ fontSize: 26 }} />,
    iconColor: '#D32F2F',
    iconBg: 'linear-gradient(135deg, #FFEBEE, #FFF5F5)',
    borderAccent: '#D32F2F',
    title: 'Smart Scheduling',
    description: 'AI-powered booking system that finds the perfect slot for your vehicle service needs — available 24/7.',
    stat: '2 min',
    statLabel: 'avg booking time',
  },
  {
    icon: <ClockIcon sx={{ fontSize: 26 }} />,
    iconColor: '#2563EB',
    iconBg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
    borderAccent: '#2563EB',
    title: 'Real-time Updates',
    description: 'Live notifications and progress tracking throughout your entire service journey — no waiting in the dark.',
    stat: '100%',
    statLabel: 'transparency',
  },
  {
    icon: <HistoryIcon sx={{ fontSize: 26 }} />,
    iconColor: '#059669',
    iconBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    borderAccent: '#059669',
    title: 'Digital Records',
    description: 'Complete service history digitally accessible anytime, anywhere on any device — forever.',
    stat: 'Cloud',
    statLabel: 'stored securely',
  },
  {
    icon: <WrenchIcon sx={{ fontSize: 26 }} />,
    iconColor: '#7C3AED',
    iconBg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
    borderAccent: '#7C3AED',
    title: 'Smart Diagnostics',
    description: 'Advanced diagnostic tools with computerized scanning for accurate issue detection and efficient repairs.',
    stat: '99%',
    statLabel: 'accuracy rate',
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 26 }} />,
    iconColor: '#D97706',
    iconBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    borderAccent: '#D97706',
    title: 'Live Queue Update',
    description: 'Real-time queue tracking so you always know exactly where your vehicle stands in the service line.',
    stat: 'Live',
    statLabel: 'position updates',
  },
];

const FeaturesSection = ({ features }) => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [cardsRef, cardsVisible] = useScrollReveal(0.05);

  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#111827',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
        zIndex: 0,
      }} />
      {/* Red glow top-left */}
      <Box sx={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 9 },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <Typography sx={{
            display: 'inline-block',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#FF6B6B',
            fontFamily: '"Inter", sans-serif', mb: 2,
            background: 'rgba(211,47,47,0.15)',
            px: 2, py: 0.75, borderRadius: '100px',
            border: '1px solid rgba(211,47,47,0.3)',
          }}>
            Why Choose Us
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: '#FFFFFF', mb: 2 }}
          >
            Everything You Need,{' '}
            <Box component="span" sx={{ color: '#EF4444' }}>One Platform</Box>
          </Typography>
          <Typography sx={{ maxWidth: 540, mx: 'auto', color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.8 }}>
            Our integrated platform combines cutting-edge technology with premium automotive expertise for an unmatched experience.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid ref={cardsRef} container spacing={{ xs: 2, md: 2.5 }}>
          {FEATURES.map((feature, i) => (
            <Grid
              item xs={12} sm={6} md={i < 3 ? 4 : 6}
              key={feature.title}
              sx={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(36px)',
                transition: `opacity 0.55s ease ${0.1 + i * 0.08}s, transform 0.55s ease ${0.1 + i * 0.08}s`,
                ...(i === 3 && { ml: { md: 'calc(16.666%)' } }),
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.28s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.07)',
                    borderColor: `${feature.borderAccent}40`,
                    transform: 'translateY(-6px)',
                    boxShadow: `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${feature.borderAccent}30`,
                  },
                  '&:hover .feat-stat': {
                    opacity: 1, transform: 'translateY(0)',
                  },
                  '&:hover .feat-line': {
                    width: '60%',
                  },
                }}
              >
                {/* Subtle corner glow */}
                <Box sx={{
                  position: 'absolute', top: 0, right: 0,
                  width: 80, height: 80,
                  background: `radial-gradient(circle at top right, ${feature.iconColor}15, transparent)`,
                  pointerEvents: 'none',
                }} />

                {/* Icon */}
                <Box sx={{
                  width: 56, height: 56,
                  borderRadius: '16px',
                  background: feature.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 2.5, color: feature.iconColor,
                  boxShadow: `0 4px 16px ${feature.iconColor}20`,
                }}>
                  {feature.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700, color: '#FFFFFF',
                    mb: 1.5, fontSize: '1.08rem',
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontSize: '0.88rem', mb: 3 }}>
                  {(features && features[i]?.description) || feature.description}
                </Typography>

                {/* Stat */}
                <Stack
                  className="feat-stat"
                  direction="row" alignItems="baseline" spacing={1}
                  sx={{
                    opacity: 0,
                    transform: 'translateY(8px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800, fontSize: '1.3rem',
                    color: feature.iconColor,
                  }}>
                    {feature.stat}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                    {feature.statLabel}
                  </Typography>
                </Stack>

                {/* Bottom accent */}
                <Box
                  className="feat-line"
                  sx={{
                    height: 2, width: 36,
                    background: feature.borderAccent,
                    borderRadius: 1,
                    transition: 'width 0.35s ease',
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;