// frontend/src/pages/ProcessPage.jsx
import React from 'react';
import {
  ThemeProvider, CssBaseline, Box, Container, Grid, Typography,
  Stack, Button,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  DirectionsCar as CarIcon,
  Notifications as NotifIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { theme } from '../utils/theme';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = ['Home', 'Services', 'About', 'Contact'];

const STEPS = [
  {
    number: '01',
    Icon: CalendarIcon,
    title: 'Book Your Service',
    headline: 'Smart Scheduling at Your Fingertips',
    desc: 'Use our intuitive online platform to select your service type, preferred date, and time slot. Our AI-powered system checks real-time mechanic availability so you always get a confirmed slot — no waiting on hold, no callbacks required.',
    bullets: [
      'Choose from all available services in seconds',
      'Real-time slot availability',
      'Instant booking confirmation by email',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&q=80&auto=format&fit=crop',
    imageAlt: 'Online booking interface',
    flip: false,
  },
  {
    number: '02',
    Icon: CarIcon,
    title: 'Smart Drop-off',
    headline: 'Seamless Vehicle Check-In',
    desc: 'Arrive at our Imaduwa facility for a quick vehicle inspection and digital check-in. Our cashier team greets you, confirms your booked service, and creates a digital job card so every team member knows exactly what your vehicle needs.',
    bullets: [
      'Digital job card created at check-in',
      'Thorough pre-service inspection',
      'No paperwork — everything is tracked digitally',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=700&q=80&auto=format&fit=crop',
    imageAlt: 'Modern garage drop-off area',
    flip: true,
  },
  {
    number: '03',
    Icon: NotifIcon,
    title: 'Real-time Tracking',
    headline: 'Stay Informed Every Step of the Way',
    desc: "Track your vehicle's service progress live through our platform. Our mechanics update each job stage in real time, and you receive notifications as work progresses. When your vehicle is ready, you'll be the first to know — then collect and go.",
    bullets: [
      'Live progress updates as mechanics work',
      'Push notifications when service is complete',
      'Digital invoice and service record on pickup',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=700&q=80&auto=format&fit=crop',
    imageAlt: 'Mechanic working on vehicle',
    flip: false,
  },
];

const ProcessPage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <TopBar />
        <Header navItems={NAV_ITEMS} />

        <Box sx={{ pt: { xs: '64px', md: '76px' } }}>
          <PageHeaderBanner
            title="How It Works"
            breadcrumb="Process"
            imageUrl="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80&auto=format&fit=crop"
          />
        </Box>

        {/* ── Intro ─────────────────────────────────────────── */}
        <Box sx={{ py: { xs: 6, md: 8 }, background: '#F8F9FB', textAlign: 'center' }}>
          <Container maxWidth="md">
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 2 }}>
              Simple, Transparent, Digital
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#111827', mb: 2 }}>
              Premium Service Made Easy
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 600, mx: 'auto' }}>
              From booking to pickup, every step is designed to be fast, transparent, and completely hassle-free.
              Here's exactly how it works.
            </Typography>
          </Container>
        </Box>

        {/* ── Step-by-Step ──────────────────────────────────── */}
        {STEPS.map((step, idx) => (
          <Box
            key={step.number}
            sx={{
              py: { xs: 8, md: 12 },
              background: idx % 2 === 0 ? '#FFFFFF' : '#F8F9FB',
            }}
          >
            <Container maxWidth="lg">
              <Grid
                container
                spacing={{ xs: 4, md: 10 }}
                alignItems="center"
                direction={{ xs: 'column', md: step.flip ? 'row-reverse' : 'row' }}
              >
                {/* Image */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: 'relative' }}>
                    {/* Step number watermark */}
                    <Typography
                      aria-hidden="true"
                      sx={{
                        position: 'absolute',
                        top: -30, left: -10,
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 900,
                        fontSize: '8rem',
                        color: '#0F172A',
                        opacity: 0.04,
                        lineHeight: 1,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    >
                      {step.number}
                    </Typography>
                    <Box
                      component="img"
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      sx={{
                        width: '100%',
                        height: { xs: 240, md: 380 },
                        objectFit: 'cover',
                        borderRadius: '20px',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                        display: 'block',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                    {/* Step badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -16, left: step.flip ? 'auto' : -16, right: step.flip ? -16 : 'auto',
                        zIndex: 2,
                        background: '#D32F2F',
                        borderRadius: '16px',
                        p: 1.8,
                        boxShadow: '0 6px 24px rgba(211,47,47,0.35)',
                        display: 'flex', alignItems: 'center', gap: 1,
                      }}
                    >
                      <step.Icon sx={{ color: '#fff', fontSize: 22 }} />
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>
                        Step {step.number}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Content */}
                <Grid item xs={12} md={7}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 1 }}>
                        Step {step.number} — {step.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#111827', lineHeight: 1.2 }}>
                        {step.headline}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', lineHeight: 1.9, fontSize: '1rem' }}>
                      {step.desc}
                    </Typography>
                    <Stack spacing={1.5}>
                      {step.bullets.map((b) => (
                        <Stack key={b} direction="row" spacing={1.5} alignItems="flex-start">
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', background: '#FFEBEE', border: '1.5px solid rgba(211,47,47,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#D32F2F' }} />
                          </Box>
                          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#374151', fontSize: '0.92rem', lineHeight: 1.6 }}>
                            {b}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Container>
          </Box>
        ))}

        {/* ── CTA ───────────────────────────────────────────── */}
        <Box sx={{ py: { xs: 8, md: 10 }, background: '#D32F2F', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#fff', mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.8, mb: 4, maxWidth: 480, mx: 'auto' }}>
              Book your service in under 2 minutes. Certified mechanics, real-time tracking, and zero hassle.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/booking')}
              sx={{
                px: 5, py: 1.8,
                background: '#fff', color: '#D32F2F',
                fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                '&:hover': { background: '#F8F9FB', transform: 'translateY(-3px)', boxShadow: '0 12px 36px rgba(0,0,0,0.25)' },
              }}
            >
              Book Your Service
            </Button>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ProcessPage;
