// frontend/src/components/Landing_Page/ProcessSection.jsx — Light Premium Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Stack
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  DirectionsCar as CarIcon,
  Notifications as NotifIcon,
  ArrowForward as ArrowIcon,
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

const PROCESS_STEPS = [
  {
    number: '01',
    icon: <CalendarIcon sx={{ fontSize: 28, color: '#D32F2F' }} />,
    title: 'Book Your Service',
    desc: 'Select your service type and preferred time slot through our intelligent booking system.',
  },
  {
    number: '02',
    icon: <CarIcon sx={{ fontSize: 28, color: '#D32F2F' }} />,
    title: 'Smart Drop-off',
    desc: 'Quick vehicle inspection and digital check-in at our modern Imaduwa facility.',
  },
  {
    number: '03',
    icon: <NotifIcon sx={{ fontSize: 28, color: '#D32F2F' }} />,
    title: 'Real-time Tracking',
    desc: 'Monitor your vehicle\'s service progress with live updates and collect when ready.',
  },
];

const ProcessSection = ({ processSteps, theme }) => {
  const [sectionRef, sectionVisible] = useScrollReveal({ threshold: 0.1 });
  const [imageRef, imageVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Box
      id="process"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* ── Left: Image ─────────────────────────────────── */}
          <Grid item xs={12} md={5}>
            <Box
              ref={imageRef}
              sx={{
                position: 'relative',
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1625047509252-ab38fb5c7343?w=700&q=80&auto=format&fit=crop"
                alt="Mechanic working on car diagnostic"
                sx={{
                  width: '100%',
                  height: { xs: 280, md: 420 },
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  display: 'block',
                }}
              />
              {/* Floating info card */}
              <Box sx={{
                position: 'absolute', bottom: 20, right: -20,
                background: 'white',
                borderRadius: '14px',
                p: 2.5,
                boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                border: '1px solid #E5E7EB',
                minWidth: 160,
              }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#D32F2F', lineHeight: 1 }}>10K+</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, mt: 0.5 }}>Happy Customers</Typography>
                <Box sx={{ mt: 1.5, height: 3, width: '60%', background: '#D32F2F', borderRadius: 1 }} />
              </Box>
            </Box>
          </Grid>

          {/* ── Right: Steps ────────────────────────────────── */}
          <Grid item xs={12} md={7}>
            <Box
              ref={sectionRef}
              sx={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              {/* Section Header */}
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
                How It Works
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.6rem' },
                  color: '#111827',
                  mb: 2,
                  mt: 1,
                }}
              >
                Three Easy Steps to{' '}
                <Box component="span" sx={{ color: '#D32F2F' }}>Expert Service</Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  mb: { xs: 4, md: 6 },
                  lineHeight: 1.8,
                  fontSize: '1rem',
                  maxWidth: 480,
                }}
              >
                Getting your car serviced has never been easier. Our streamlined process gets you back on the road fast.
              </Typography>

              {/* Steps */}
              <Stack spacing={0}>
                {PROCESS_STEPS.map((step, i) => (
                  <Box key={step.number}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      {/* Step number + connector */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <Box sx={{
                          width: 56, height: 56,
                          borderRadius: '14px',
                          background: '#D32F2F',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 16px rgba(211,47,47,0.3)',
                          flexShrink: 0,
                        }}>
                          {step.icon}
                        </Box>
                        {i < PROCESS_STEPS.length - 1 && (
                          <Box sx={{
                            width: 2, flex: 1, minHeight: 32,
                            background: 'linear-gradient(180deg, #D32F2F, #FFEBEE)',
                            borderRadius: 1,
                            my: 0.5,
                          }} />
                        )}
                      </Box>

                      {/* Content */}
                      <Box sx={{ pb: i < PROCESS_STEPS.length - 1 ? 3 : 0, pt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                          <Typography sx={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            color: '#D32F2F',
                            fontFamily: '"Inter", sans-serif',
                            background: '#FFEBEE',
                            px: 1, py: 0.25,
                            borderRadius: '4px',
                          }}>
                            STEP {step.number}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            color: '#111827',
                            mb: 0.75,
                            fontSize: '1.1rem',
                          }}
                        >
                          {(processSteps && processSteps[i]?.title) || step.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6B7280', lineHeight: 1.75, fontSize: '0.92rem' }}
                        >
                          {(processSteps && processSteps[i]?.desc) || step.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProcessSection;