// frontend/src/components/Landing_Page/CtaSection.jsx — Light Premium Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Button, Stack
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Phone as PhoneIcon,
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

const CtaSection = ({ theme }) => {
  const [ctaRef, ctaVisible] = useScrollReveal({ threshold: 0.1 });

  const benefits = [
    'Online booking in under 2 minutes',
    'Real-time service progress tracking',
    'Digital records always available',
    'Expert certified mechanics',
  ];

  return (
    <>
      {/* ── About Section ────────────────────────────────────────── */}
      <Box
        id="about"
        component="section"
        sx={{
          py: { xs: 10, md: 14 },
          background: '#F8F9FB',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Left: Image */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop"
                  alt="Professional car service bay"
                  sx={{
                    width: '100%',
                    height: { xs: 260, md: 400 },
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    display: 'block',
                  }}
                />
                {/* Accent image */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&q=80&auto=format&fit=crop"
                  alt="Modern garage interior"
                  sx={{
                    position: 'absolute',
                    bottom: -24, right: -20,
                    width: { xs: 120, md: 180 },
                    height: { xs: 100, md: 140 },
                    objectFit: 'cover',
                    borderRadius: '14px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                    border: '4px solid white',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
                {/* Red badge */}
                <Box sx={{
                  position: 'absolute', top: 20, left: -16,
                  background: '#D32F2F',
                  borderRadius: '14px',
                  p: 2,
                  boxShadow: '0 8px 24px rgba(211,47,47,0.35)',
                  animation: 'mc-float 4s ease-in-out infinite',
                }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'white', lineHeight: 1 }}>4.9★</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Average Rating</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right: Content */}
            <Grid item xs={12} md={6}>
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
                About Moto-Care
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '1.9rem', md: '2.5rem' },
                  color: '#111827',
                  mb: 2,
                  mt: 1,
                }}
              >
                Imaduwa's Most{' '}
                <Box component="span" sx={{ color: '#D32F2F' }}>Trusted</Box>
                {' '}Auto Service
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  mb: 3,
                  lineHeight: 1.85,
                  fontSize: '1rem',
                }}
              >
                With over 15 years of experience in the Galle District, Moto-Care has built a reputation
                for precision, transparency, and world-class customer service. Our certified team uses
                the latest diagnostic technology to keep your vehicle performing at its best.
              </Typography>

              {/* Benefits */}
              <Stack spacing={1.5} sx={{ mb: 4 }}>
                {benefits.map((item) => (
                  <Stack key={item} direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                      width: 22, height: 22,
                      borderRadius: '50%',
                      background: '#FFEBEE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <CheckIcon sx={{ color: '#D32F2F', fontSize: 14 }} />
                    </Box>
                    <Typography sx={{ color: '#374151', fontWeight: 500, fontSize: '0.95rem' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  href="/booking"
                  startIcon={<CalendarIcon />}
                  sx={{
                    px: 3.5, py: 1.4,
                    background: '#D32F2F',
                    fontWeight: 700,
                    borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(211,47,47,0.28)',
                    '&:hover': { background: '#B71C1C', transform: 'translateY(-2px)' },
                  }}
                >
                  Book a Service
                </Button>
                <Button
                  variant="outlined"
                  href="tel:+94XXXXXXXXX"
                  startIcon={<PhoneIcon />}
                  sx={{
                    px: 3.5, py: 1.4,
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    fontWeight: 600,
                    borderRadius: '10px',
                    '&:hover': { borderColor: '#D32F2F', color: '#D32F2F', background: '#FFF5F5' },
                  }}
                >
                  Call Us Now
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <Box
        id="cta"
        component="section"
        ref={ctaRef}
        sx={{
          py: { xs: 8, md: 10 },
          background: '#D32F2F',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle pattern */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />
        <Box sx={{
          position: 'absolute', top: '-30%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(0,0,0,0.1)',
          filter: 'blur(80px)',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Box
            sx={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: '"Inter", sans-serif',
                mb: 2,
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                color: 'white',
                mb: 2,
                fontWeight: 900,
              }}
            >
              Your Vehicle Deserves the Best
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                mb: 5,
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              Join 5,000+ satisfied customers who trust Moto-Care for all their vehicle service needs.
              Book today and experience the difference.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                href="/booking"
                size="large"
                startIcon={<CalendarIcon />}
                endIcon={<ArrowIcon />}
                sx={{
                  px: 4, py: 1.7,
                  background: 'white',
                  color: '#D32F2F',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: '#F8F9FB',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
                  },
                }}
              >
                Book Your Service
              </Button>
              <Button
                variant="outlined"
                href="/services"
                size="large"
                sx={{
                  px: 4, py: 1.7,
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                View Services
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CtaSection;