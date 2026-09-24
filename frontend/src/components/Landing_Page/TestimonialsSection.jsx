// frontend/src/components/Landing_Page/TestimonialsSection.jsx — Premium Testimonials
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import { FormatQuote as QuoteIcon, Star as StarIcon } from '@mui/icons-material';

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

const TESTIMONIALS = [
  {
    name: 'Dinesh Perera',
    role: 'Regular Customer',
    initials: 'DP',
    color: '#D32F2F',
    rating: 5,
    text: 'The digital booking system is a game changer. I booked online, got real-time updates throughout, and my car was ready exactly when they said. Absolutely premium service!',
    vehicle: 'Toyota Aqua',
    service: 'Full Service',
  },
  {
    name: 'Chamari Jayasinghe',
    role: 'Loyal Customer — 3 Years',
    initials: 'CJ',
    color: '#2563EB',
    rating: 5,
    text: 'I\'ve been coming to Moto-Care for 3 years. The quality is consistently excellent, staff are professional, and the new digital tracking feature is incredibly convenient.',
    vehicle: 'Honda Fit',
    service: 'Oil Change & Brake Service',
  },
  {
    name: 'Ruwan Bandara',
    role: 'Business Fleet Owner',
    initials: 'RB',
    color: '#059669',
    rating: 5,
    text: 'Managing 8 company vehicles used to be a nightmare. Moto-Care\'s digital records and scheduled maintenance system keeps all our vehicles in top shape effortlessly.',
    vehicle: 'Multiple Fleet Vehicles',
    service: 'Fleet Maintenance',
  },
  {
    name: 'Priya Siriwardena',
    role: 'New Customer',
    initials: 'PS',
    color: '#7C3AED',
    rating: 5,
    text: 'First time here and I was blown away. Clean facility, friendly mechanics who explain everything clearly, and fair pricing. This is now my go-to place for sure!',
    vehicle: 'Suzuki Alto',
    service: 'AC Service',
  },
];

const TestimonialsSection = () => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [cardsRef, cardsVisible] = useScrollReveal(0.05);

  return (
    <Box
      id="reviews"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: '-5%', left: '-5%',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.04) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontSize: '0.7rem',
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
            Customer Reviews
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: '#111827', mb: 2 }}
          >
            Trusted by{' '}
            <Box component="span" sx={{ color: '#D32F2F' }}>5,000+ Customers</Box>
          </Typography>
          <Typography
            sx={{ color: '#6B7280', lineHeight: 1.7, maxWidth: 520, mx: 'auto', fontSize: '1rem' }}
          >
            Don't just take our word for it. Here's what our customers say about their Moto-Care experience.
          </Typography>

          {/* Overall rating bar */}
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={0.4}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 22 }} />
              ))}
            </Stack>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>4.9</Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '0.9rem' }}>/ 5.0 average from 5,000+ reviews</Typography>
          </Stack>
        </Box>

        {/* Testimonial Cards */}
        <Grid ref={cardsRef} container spacing={{ xs: 2.5, md: 3 }}>
          {TESTIMONIALS.map((t, i) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={t.name}
              sx={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(36px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  borderRadius: '20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    borderColor: 'rgba(211,47,47,0.2)',
                  },
                }}
              >
                {/* Quote icon */}
                <Box sx={{
                  position: 'absolute', top: 24, right: 24,
                  color: '#F3F4F6',
                }}>
                  <QuoteIcon sx={{ fontSize: 48 }} />
                </Box>

                {/* Stars */}
                <Stack direction="row" spacing={0.3} sx={{ mb: 2.5 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 18 }} />
                  ))}
                </Stack>

                {/* Review text */}
                <Typography
                  sx={{
                    color: '#374151',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    fontFamily: '"Inter", sans-serif',
                    mb: 3.5,
                    fontStyle: 'italic',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  "{t.text}"
                </Typography>

                {/* Service info chip */}
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#F8F9FB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  px: 1.5, py: 0.5,
                  mb: 3,
                }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                    {t.service} · {t.vehicle}
                  </Typography>
                </Box>

                {/* Author */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    background: t.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', fontFamily: '"Outfit", sans-serif' }}>
                      {t.initials}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', lineHeight: 1.3 }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '0.78rem', fontFamily: '"Inter", sans-serif' }}>
                      {t.role}
                    </Typography>
                  </Box>
                </Stack>

                {/* Left accent border */}
                <Box sx={{
                  position: 'absolute',
                  left: 0, top: '20%', bottom: '20%',
                  width: 3,
                  background: t.color,
                  borderRadius: '0 3px 3px 0',
                }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
