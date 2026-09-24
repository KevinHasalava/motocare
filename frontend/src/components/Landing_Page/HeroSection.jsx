// frontend/src/components/Landing_Page/HeroSection.jsx
// Ultra-Premium Automotive Service Center Hero with Visible Workshop & Rich Animations
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import {
  ArrowForward as ArrowRightIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const HeroSection = ({ isVisible, onBookNowClick, stats }) => {
  const [textVisible, setTextVisible] = useState(false);
  const [statsRef, setStatsRef] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!statsRef) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(statsRef);
    return () => obs.disconnect();
  }, [statsRef]);

  const workshopFeatures = [
    {
      title: 'Computer Diagnostics',
      desc: 'Bosch 3D ECU Scanning & Real-time Live Sensor Calibration.',
      stat: '99.8%',
      statLabel: 'Accuracy',
      icon: <SpeedIcon sx={{ color: '#EF4444', fontSize: 20 }} />,
    },
    {
      title: 'Heavy Service Bays',
      desc: '12 dedicated hydraulic lifts for rapid, safe underbody service.',
      stat: '12 Bays',
      statLabel: 'Available',
      icon: <BuildIcon sx={{ color: '#EF4444', fontSize: 20 }} />,
    },
    {
      title: '100% Genuine Guarantee',
      desc: 'Official factory OEM parts backed by a 12-month warranty.',
      stat: '1 Year',
      statLabel: 'Full Warranty',
      icon: <ShieldIcon sx={{ color: '#EF4444', fontSize: 20 }} />,
    },
  ];

  return (
    <Box component="section" sx={{ position: 'relative' }}>

      {/* ═══════════════════ CINEMATIC HERO ═══════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '92vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#070B13',
        }}
      >
        {/* ── Background: Real High-Tech Automotive Service Center Workshop ───────── */}
        <Box
          component="img"
          src="/workshop_hero.jpg"
          alt="Moto-Care Modern Automotive Service Center Workshop"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            opacity: 0.78,
            zIndex: 0,
            transform: textVisible ? 'scale(1)' : 'scale(1.05)',
            transition: 'transform 8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
        />

        {/* ── High-Contrast Workshop Overlay: Dark text shadow on left, bright workshop on right ─ */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `
            linear-gradient(90deg,
              rgba(7, 11, 19, 0.95) 0%,
              rgba(7, 11, 19, 0.86) 38%,
              rgba(7, 11, 19, 0.42) 72%,
              rgba(7, 11, 19, 0.25) 100%
            ),
            linear-gradient(180deg,
              rgba(7, 11, 19, 0.25) 0%,
              transparent 35%,
              transparent 70%,
              rgba(7, 11, 19, 0.95) 100%
            )
          `,
        }} />

        {/* ── Radial Red Glow Accent ──────────────────────────────────── */}
        <Box sx={{
          position: 'absolute', top: '20%', left: '-8%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(211,47,47,0.18) 0%, transparent 70%)',
          filter: 'blur(90px)', zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* ── Subtle Technical Dot Grid ───────────────────────────────── */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* ── Main Content Container ──────────────────────────────────── */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 2,
            pt: { xs: '88px', md: '104px' },
            pb: { xs: 8, md: 10 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 4, lg: 6 } }}>

            {/* ── LEFT: Typography & CTAs ─────────────────────────────── */}
            <Box sx={{ flex: '1 1 auto', maxWidth: { xs: '100%', lg: '62%' } }}>

              {/* Eyebrow badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.2,
                  background: 'rgba(211,47,47,0.14)',
                  border: '1px solid rgba(211,47,47,0.4)',
                  borderRadius: '100px',
                  px: 2.2,
                  py: 0.7,
                  mb: 3,
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(-14px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#EF4444',
                    boxShadow: '0 0 10px #EF4444',
                    animation: 'mc-pulse 2s ease-in-out infinite',
                  }}
                />
                <Typography sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#FCA5A5',
                  fontFamily: '"Inter", sans-serif',
                }}>
                  Sri Lanka's Premier Auto Service Center
                </Typography>
              </Box>

              {/* ── Massive Headline ───────────────────────────────────── */}
              <Box
                sx={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(32px)',
                  transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
                  mb: 3.5,
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: '2.8rem', sm: '4rem', md: '5.2rem', lg: '5.8rem' },
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  Precision Care
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: '2.8rem', sm: '4rem', md: '5.2rem', lg: '5.8rem' },
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #FF7878 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    For Every Drive.
                  </Box>
                </Typography>
              </Box>

              {/* ── Description with Red Accent Bar ────────────────────── */}
              <Stack
                direction="row"
                spacing={2.5}
                alignItems="stretch"
                sx={{
                  mb: 4,
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.65s ease 0.25s, transform 0.65s ease 0.25s',
                }}
              >
                <Box sx={{
                  width: 4,
                  background: 'linear-gradient(180deg, #D32F2F 0%, rgba(211,47,47,0.15) 100%)',
                  borderRadius: 2,
                  flexShrink: 0,
                }} />
                <Typography sx={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: { xs: '0.98rem', md: '1.08rem' },
                  lineHeight: 1.8,
                  fontFamily: '"Inter", sans-serif',
                  maxWidth: 540,
                }}>
                  From state-of-the-art computerized diagnostics to factory-standard repairs,
                  Moto-Care delivers dealer-quality service with total transparency and zero compromise.
                </Typography>
              </Stack>

              {/* ── Real Service Center Trust Badges ───────────────────── */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1.5, sm: 3 }}
                sx={{
                  mb: 5,
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.65s ease 0.35s, transform 0.65s ease 0.35s',
                }}
              >
                {[
                  'Certified Master Technicians',
                  '100% Genuine OEM Parts',
                  'Live Digital Progress Tracking',
                ].map((item) => (
                  <Stack key={item} direction="row" alignItems="center" spacing={1}>
                    <CheckIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      fontFamily: '"Inter", sans-serif',
                    }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* ── CTAs ──────────────────────────────────────────────── */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'opacity 0.65s ease 0.45s, transform 0.65s ease 0.45s',
                }}
              >
                <Button
                  onClick={onBookNowClick}
                  size="large"
                  startIcon={<CalendarIcon />}
                  id="hero-book-appointment-btn"
                  sx={{
                    px: 4.2,
                    py: 1.8,
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    fontFamily: '"Inter", sans-serif',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                    color: 'white',
                    boxShadow: '0 8px 30px rgba(211,47,47,0.45)',
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 40px rgba(211,47,47,0.55)',
                    },
                  }}
                >
                  Book Service Appointment
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowRightIcon />}
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.location.href = '/services';
                  }}
                  id="hero-view-services-btn"
                  sx={{
                    px: 4,
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: '"Inter", sans-serif',
                    borderRadius: '10px',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    textTransform: 'none',
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(255,255,255,0.04)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.7)',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  Explore Services
                </Button>
              </Stack>
            </Box>

            {/* ── RIGHT: Floating Interactive Workshop Feature Cards ──── */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                flexDirection: 'column',
                gap: 2.5,
                flex: '0 0 auto',
                width: '35%',
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
              }}
            >
              {workshopFeatures.map((card, i) => (
                <Box
                  key={card.title}
                  sx={{
                    background: 'rgba(17, 24, 39, 0.72)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    p: 2.8,
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    animation: `mc-float ${5 + i}s ease-in-out infinite ${i * 0.9}s`,
                    '&:hover': {
                      background: 'rgba(23, 32, 51, 0.88)',
                      borderColor: 'rgba(211,47,47,0.5)',
                      transform: 'translateX(-8px) scale(1.02)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 20px rgba(211,47,47,0.15)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        background: 'rgba(211,47,47,0.12)',
                        border: '1px solid rgba(211,47,47,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
                        <Typography sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: '#FFFFFF',
                        }}>
                          {card.title}
                        </Typography>
                        <Typography sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 900,
                          fontSize: '1.25rem',
                          color: '#EF4444',
                        }}>
                          {card.stat}
                        </Typography>
                      </Stack>
                      <Typography sx={{
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.6,
                        fontFamily: '"Inter", sans-serif',
                      }}>
                        {card.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Box>

          </Box>
        </Container>

        {/* ── Bottom Gradient Transition into Stats Bar ───────────── */}
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(180deg, transparent 0%, #0A0F1E 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
      </Box>

      {/* ═════════════════ DARK STATS BAR ══════════════════════════════════ */}
      <Box
        ref={(el) => setStatsRef(el)}
        sx={{
          background: '#0A0F1E',
          py: { xs: 4, md: 4.5 },
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent={{ xs: 'center', md: 'space-around' }}
            alignItems="center"
          >
            {(stats || []).map((stat, i) => (
              <Box
                key={stat.label || i}
                sx={{
                  textAlign: 'center',
                  px: { xs: 3, md: 5 },
                  py: { xs: 2, md: 0 },
                  borderRight: { md: i < (stats.length - 1) ? '1px solid rgba(255,255,255,0.08)' : 'none' },
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                  cursor: 'default',
                  '&:hover .stat-num': { color: '#EF4444' },
                }}
              >
                <Typography
                  className="stat-num"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: '2.1rem', md: '2.6rem' },
                    color: '#FFFFFF',
                    lineHeight: 1,
                    mb: 0.6,
                    transition: 'color 0.25s ease',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: '0.72rem', md: '0.78rem' },
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

    </Box>
  );
};

export default HeroSection;