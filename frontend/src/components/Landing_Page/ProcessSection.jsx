// frontend/src/components/Landing_Page/ProcessSection.jsx — Premium Light Theme
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  DirectionsCar as CarIcon,
  Notifications as NotifIcon,
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

const PROCESS_STEPS = [
  {
    number: '01',
    icon: <CalendarIcon sx={{ fontSize: 26, color: '#D32F2F' }} />,
    title: 'Book Your Service',
    desc: 'Select your service type and preferred time slot through our intelligent online booking system — available 24/7.',
    highlight: 'Takes only 2 minutes',
  },
  {
    number: '02',
    icon: <CarIcon sx={{ fontSize: 26, color: '#D32F2F' }} />,
    title: 'Smart Drop-off',
    desc: 'Quick vehicle inspection and digital check-in at our modern Imaduwa facility. No paperwork, all digital.',
    highlight: 'Zero wait time',
  },
  {
    number: '03',
    icon: <NotifIcon sx={{ fontSize: 26, color: '#D32F2F' }} />,
    title: 'Track & Collect',
    desc: 'Monitor your vehicle\'s service progress with live updates. Get notified when it\'s ready for pickup.',
    highlight: 'Real-time updates',
  },
];

const ProcessSection = ({ processSteps }) => {
  const [imageRef, imageVisible] = useScrollReveal(0.1);
  const [stepsRef, stepsVisible] = useScrollReveal(0.1);

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
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute', top: 0, right: 0,
        width: { xs: '100%', md: '40%' }, height: '100%',
        background: 'linear-gradient(180deg, #F8F9FB 0%, #FFFFFF 100%)',
        clipPath: { md: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' },
        zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 10 }} alignItems="center">

          {/* Left: Mechanic Image */}
          <Grid item xs={12} md={5}>
            <Box
              ref={imageRef}
              sx={{
                position: 'relative',
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* Main image */}
              <Box
                component="img"
                src="/mechanic_service.jpg"
                alt="Certified mechanic performing expert diagnostics"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 460 },
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: '0 24px 70px rgba(0,0,0,0.16)',
                  display: 'block',
                }}
              />

              {/* Red corner accent */}
              <Box sx={{
                position: 'absolute', bottom: -14, left: -14,
                width: 80, height: 80,
                borderBottom: '3px solid #D32F2F',
                borderLeft: '3px solid #D32F2F',
                borderRadius: '0 0 0 16px',
                zIndex: -1,
              }} />

              {/* Floating stat card */}
              <Box sx={{
                position: 'absolute', bottom: 28, right: -20,
                background: 'white',
                borderRadius: '18px',
                p: 2.5,
                boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                border: '1px solid #F3F4F6',
                minWidth: 160,
                animation: 'mc-float 4.5s ease-in-out infinite',
              }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#D32F2F', lineHeight: 1, fontFamily: '"Outfit", sans-serif' }}>
                  10K+
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500, mt: 0.4 }}>Happy Customers</Typography>
                <Box sx={{ mt: 1.5, height: 3, width: '60%', background: '#D32F2F', borderRadius: 1 }} />
              </Box>

              {/* Certified badge */}
              <Box sx={{
                position: 'absolute', top: 24, left: -20,
                background: '#111827',
                borderRadius: '14px',
                p: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                textAlign: 'center',
                animation: 'mc-float 5s ease-in-out infinite 1.2s',
              }}>
                <Typography sx={{ fontWeight: 900, fontSize: '0.78rem', color: 'white', lineHeight: 1.4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ✓ Certified<br />Mechanics
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right: Steps */}
          <Grid item xs={12} md={7}>
            <Box
              ref={stepsRef}
              sx={{
                opacity: stepsVisible ? 1 : 0,
                transform: stepsVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* Section label */}
              <Typography sx={{
                display: 'inline-block',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#D32F2F',
                fontFamily: '"Inter", sans-serif', mb: 2,
                background: '#FFEBEE', px: 2, py: 0.75,
                borderRadius: '100px', border: '1px solid rgba(211,47,47,0.2)',
              }}>
                How It Works
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#111827', mb: 1.5, mt: 1 }}
              >
                Three Easy Steps to{' '}
                <Box component="span" sx={{ color: '#D32F2F' }}>Expert Service</Box>
              </Typography>
              <Typography sx={{ color: '#6B7280', mb: { xs: 5, md: 7 }, lineHeight: 1.8, fontSize: '1rem', maxWidth: 460 }}>
                Getting your car serviced has never been easier. Our streamlined process gets you back on the road fast.
              </Typography>

              {/* Steps */}
              <Stack spacing={0}>
                {PROCESS_STEPS.map((step, i) => (
                  <Box key={step.number}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      {/* Number + connector */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <Box sx={{
                          width: 60, height: 60,
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 6px 20px rgba(211,47,47,0.3)',
                          flexShrink: 0,
                        }}>
                          {step.icon}
                        </Box>
                        {i < PROCESS_STEPS.length - 1 && (
                          <Box sx={{
                            width: 2, flex: 1, minHeight: 40,
                            background: 'linear-gradient(180deg, #D32F2F 0%, #FFEBEE 100%)',
                            borderRadius: 1, my: 0.75,
                          }} />
                        )}
                      </Box>

                      {/* Content */}
                      <Box sx={{ pb: i < PROCESS_STEPS.length - 1 ? 4 : 0, pt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                          <Box sx={{
                            background: '#FFEBEE', px: 1, py: 0.3,
                            borderRadius: '5px', display: 'inline-block',
                          }}>
                            <Typography sx={{
                              fontSize: '0.68rem', fontWeight: 800,
                              letterSpacing: '0.1em', color: '#D32F2F',
                              fontFamily: '"Inter", sans-serif',
                            }}>
                              STEP {step.number}
                            </Typography>
                          </Box>
                          {/* Highlight pill */}
                          <Box sx={{
                            background: '#F0FDF4', px: 1, py: 0.3,
                            borderRadius: '5px', border: '1px solid #BBF7D0',
                          }}>
                            <Typography sx={{
                              fontSize: '0.68rem', fontWeight: 700,
                              color: '#059669', fontFamily: '"Inter", sans-serif',
                            }}>
                              ✓ {step.highlight}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700, color: '#111827',
                            mb: 0.75, fontSize: '1.12rem',
                          }}
                        >
                          {(processSteps && processSteps[i]?.title) || step.title}
                        </Typography>
                        <Typography sx={{ color: '#6B7280', lineHeight: 1.75, fontSize: '0.9rem' }}>
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