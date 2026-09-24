// frontend/src/components/Landing_Page/EmergencyHotlineStrip.jsx — Quick Contact & Emergency Strip
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import {
  PhoneInTalk as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as ClockIcon,
  WarningAmber as WarningIcon,
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

const EmergencyHotlineStrip = () => {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <Box
      ref={ref}
      sx={{
        background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
        py: { xs: 4, md: 4.5 },
        borderTop: '2px solid #D32F2F',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left: Emergency Alert Box */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{
              width: 50, height: 50, borderRadius: '50%',
              background: 'rgba(211,47,47,0.2)',
              border: '1px solid rgba(211,47,47,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              animation: 'mc-pulse 2s ease-in-out infinite',
            }}>
              <WarningIcon sx={{ color: '#EF4444', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}>
                Vehicle Breakdown or Emergency Towing in Galle District?
              </Typography>
              <Typography sx={{
                fontSize: '0.84rem',
                color: 'rgba(255,255,255,0.65)',
                fontFamily: '"Inter", sans-serif',
                mt: 0.3,
              }}>
                Our rapid-response breakdown team is on standby 24/7 across Imaduwa and Southern Province.
              </Typography>
            </Box>
          </Stack>

          {/* Right: Hotline Button & Operating Hours */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ClockIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Inter", sans-serif' }}>
                  Mon–Sat: 8:00 AM – 6:00 PM
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Inter", sans-serif' }}>
                  Galle-Akuressa Rd, Imaduwa
                </Typography>
              </Stack>
            </Stack>

            <Button
              component="a"
              href="tel:+94912283456"
              variant="contained"
              startIcon={<PhoneIcon />}
              id="emergency-call-btn"
              sx={{
                px: 3.5, py: 1.3,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                fontWeight: 700,
                fontSize: '0.94rem',
                fontFamily: '"Inter", sans-serif',
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(211,47,47,0.4)',
                letterSpacing: '0.02em',
                flexShrink: 0,
                '&:hover': {
                  background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
                  transform: 'scale(1.03)',
                  boxShadow: '0 10px 28px rgba(211,47,47,0.5)',
                }
              }}
            >
              Call Hotline: 091 228 3456
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default EmergencyHotlineStrip;
