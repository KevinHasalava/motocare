// frontend/src/components/Landing_Page/HeroSection.jsx — Light Premium Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Typography, Button, Stack, Grid, Chip
} from '@mui/material';
import {
  ArrowForward as ArrowRightIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// ── Scroll-reveal hook ───────────────────────────────────────
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const HeroSection = ({ isVisible, onBookNowClick, stats, theme }) => {
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.05 });
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#FFFFFF',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Light background decorations */}
      <Box sx={{
        position: 'absolute', top: 0, right: 0,
        width: { xs: '60%', md: '50%' }, height: '100%',
        background: 'linear-gradient(135deg, #F8F9FB 0%, #FFF5F5 100%)',
        zIndex: 0,
        clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }} />
      <Box sx={{
        position: 'absolute', top: '10%', right: '5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* ── Left: Text Content ─────────────────────────────── */}
          <Grid item xs={12} md={6}>
            <Box
              ref={heroRef}
              sx={{
                opacity: heroVisible || isVisible ? 1 : 0,
                transform: heroVisible || isVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              {/* Eyebrow tag */}
              <Chip
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#D32F2F', ml: 1 }} />}
                label="Next Generation Auto Care"
                sx={{
                  mb: 3,
                  background: '#FFEBEE',
                  color: '#D32F2F',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(211,47,47,0.2)',
                  borderRadius: '100px',
                  height: 32,
                  '& .MuiChip-icon': { color: '#D32F2F' },
                }}
              />

              {/* Watermark word — decorative depth effect */}
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: { xs: -20, md: -32 },
                  left: { xs: -10, md: -20 },
                  fontSize: { xs: '7rem', sm: '9rem', md: '12rem', lg: '15rem' },
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  color: '#0F172A',
                  opacity: 0.04,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  zIndex: 0,
                }}
              >
                AUTOCARE
              </Box>

              {/* Main headline */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem', lg: '5.8rem' },
                  mb: 3,
                  color: '#111827',
                  letterSpacing: '-0.04em',
                  lineHeight: { xs: 1.1, md: 1.05 },
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Premium{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#D32F2F',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px', left: 0, right: 0,
                      height: '3px',
                      background: '#D32F2F',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Auto Care
                </Box>
                <br />
                You Can Trust
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 4, md: 5 },
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: '#6B7280',
                  maxWidth: 480,
                }}
              >
                Transform your vehicle maintenance experience with our digital platform.
                Smart scheduling, real-time updates, and premium service quality — all in one place.
              </Typography>

              {/* Trust indicators */}
              <Stack direction="row" spacing={2} sx={{ mb: 4 }} flexWrap="wrap" gap={1}>
                {['Certified Mechanics', 'Same-day Service', 'Digital Records'].map((item) => (
                  <Stack key={item} direction="row" alignItems="center" spacing={0.5}>
                    <CheckIcon sx={{ color: '#D32F2F', fontSize: 18 }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                {/* Primary CTA */}
                <Button
                  onClick={onBookNowClick}
                  size="large"
                  startIcon={<CalendarIcon />}
                  endIcon={<ArrowRightIcon />}
                  sx={{
                    px: 4,
                    py: 1.7,
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: '"Inter", sans-serif',
                    borderRadius: '12px',
                    background: '#D32F2F',
                    color: 'white',
                    boxShadow: '0 6px 24px rgba(211,47,47,0.3)',
                    border: 'none',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      background: '#B71C1C',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 32px rgba(211,47,47,0.4)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                  }}
                >
                  Book Your Service
                </Button>

                {/* Secondary CTA */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.location.href = '/services'}
                  sx={{
                    px: 4,
                    py: 1.7,
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: '"Inter", sans-serif',
                    borderRadius: '12px',
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    background: 'transparent',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      borderColor: '#D32F2F',
                      color: '#D32F2F',
                      background: '#FFF5F5',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View Services
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* ── Right: Hero Image ───────────────────────────────── */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                opacity: heroVisible || isVisible ? 1 : 0,
                transform: heroVisible || isVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
              }}
            >
              {/* Main image */}
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1632823470024-fd99de7c2c27?w=800&q=80&auto=format&fit=crop"
                alt="Professional mechanic servicing a vehicle"
                sx={{
                  width: '100%',
                  height: { xs: 280, md: 460 },
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
                  display: 'block',
                }}
              />
              {/* Rating badge */}
              <Box sx={{
                position: 'absolute', bottom: 24, left: -16,
                background: 'white',
                borderRadius: '16px',
                p: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', gap: 1.5,
                animation: 'mc-float 4s ease-in-out infinite',
              }}>
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 18 }} />
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1 }}>4.9/5</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 500 }}>5,000+ Reviews</Typography>
                </Box>
              </Box>
              {/* Experience badge */}
              <Box sx={{
                position: 'absolute', top: 20, right: -16,
                background: '#D32F2F',
                borderRadius: '16px',
                p: 2,
                boxShadow: '0 8px 24px rgba(211,47,47,0.35)',
                textAlign: 'center',
                animation: 'mc-float 5s ease-in-out infinite 1s',
              }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'white', lineHeight: 1 }}>15+</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Years Exp.</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ── Stats Row ──────────────────────────────────────── */}
        <Box ref={statsRef} sx={{ mt: { xs: 8, md: 10 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center" alignItems="stretch">
            {stats.map((stat, i) => (
              <Grid
                item
                xs={6}
                md={3}
                key={stat.label}
                sx={{
                  opacity: statsVisible || isVisible ? 1 : 0,
                  transform: statsVisible || isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    p: { xs: 2.5, md: 3 },
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'rgba(211,47,47,0.3)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ mb: 1.5, '& svg': { fontSize: 28 } }}>
                    {stat.icon}
                  </Box>

                  {/* Value */}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '1.6rem', md: '2rem' },
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      mb: 0.75,
                      color: '#D32F2F',
                    }}
                  >
                    {stat.value}
                  </Typography>

                  {/* Label */}
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: { xs: '0.75rem', md: '0.82rem' },
                      fontWeight: 500,
                      color: '#6B7280',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;