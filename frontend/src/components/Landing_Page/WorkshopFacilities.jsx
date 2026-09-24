// frontend/src/components/Landing_Page/WorkshopFacilities.jsx — Workshop & Equipment Showcase
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack, Button } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Tv as LoungeIcon,
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

const FACILITIES = [
  {
    title: '12 Hydraulic Lift Stations',
    category: 'Heavy Service Bay',
    description: 'Equipped with commercial 2-post and 4-post hydraulic hoists capable of lifting everything from city compacts to heavy luxury SUVs.',
    image: '/workshop_hero.jpg',
    stat: '12 Stations',
    points: ['2-Post & 4-Post Hoists', 'Rapid Undercarriage Inspection', 'Heavy-Duty 5-Ton Rating'],
  },
  {
    title: 'Computerized Diagnostic Bay',
    category: 'Diagnostic Suite',
    description: 'Factory-level computerized scanners communicating directly with European, Japanese, and American vehicle ECUs for pin-point fault isolation.',
    image: '/service_diagnostics.jpg',
    stat: '100% Digital',
    points: ['Bosch & Launch Scanners', 'Live Sensor Telemetry', 'Zero Guesswork Repairs'],
  },
  {
    title: '3D Laser Wheel Alignment Rig',
    category: 'Precision Alignment',
    description: 'Sub-millimeter optical sensors analyze steering angles, camber, and caster to restore razor-sharp factory handling and prevent tire wear.',
    image: '/service_alignment.jpg',
    stat: '0.01mm Precision',
    points: ['High-Definition Camera Rig', 'Road-Force Balancing', 'Full Alignment Certificate'],
  },
  {
    title: 'Dust-Free Detailing & Ceramic Booth',
    category: 'Aesthetic Studio',
    description: 'Sealed, positive-pressure environment with daylight-balanced CRI lighting designed for flawless paint correction and nano-ceramic bonding.',
    image: '/service_detailing.jpg',
    stat: '9H Hardness',
    points: ['Filtered Positive Airflow', 'CRI 98+ Inspection Lights', 'Infrared Curing Lamps'],
  },
];

const WorkshopFacilities = () => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [cardsRef, cardsVisible] = useScrollReveal(0.08);

  return (
    <Box
      id="workshop"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#0B0F19',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF',
      }}
    >
      {/* Background Ambience */}
      <Box sx={{
        position: 'absolute', top: '10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            maxWidth: 760,
            mx: 'auto',
            mb: { xs: 5, md: 8 },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Typography sx={{
            display: 'inline-block',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#F87171',
            fontFamily: '"Inter", sans-serif',
            mb: 1.8,
            background: 'rgba(211,47,47,0.15)',
            border: '1px solid rgba(211,47,47,0.3)',
            px: 2.2, py: 0.75,
            borderRadius: '100px',
          }}>
            World-Class Infrastructure
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '2.2rem', md: '3.4rem' },
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            State-of-the-Art{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #FF7878 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Workshop & Equipment
            </Box>
          </Typography>

          <Typography sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: { xs: '0.98rem', md: '1.08rem' },
            lineHeight: 1.75,
            fontFamily: '"Inter", sans-serif',
          }}>
            Great mechanics require great tools. Our purpose-built Imaduwa facility integrates
            high-tonnage hydraulic bays, digital diagnostic equipment, and customer transparency.
          </Typography>
        </Box>

        {/* 4 Large Facility Showcase Cards */}
        <Box ref={cardsRef}>
          <Grid container spacing={4}>
            {FACILITIES.map((facility, index) => (
              <Grid item xs={12} md={6} key={facility.title}>
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(36px)',
                    transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, border-color 0.3s ease, box-shadow 0.3s ease`,
                    '&:hover': {
                      borderColor: 'rgba(211,47,47,0.45)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(211,47,47,0.12)',
                      '& .facility-img': {
                        transform: 'scale(1.06)',
                      },
                    },
                  }}
                >
                  {/* Photo area */}
                  <Box sx={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={facility.image}
                      alt={facility.title}
                      className="facility-img"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, rgba(11,15,25,0.1) 0%, rgba(11,15,25,0.85) 100%)',
                    }} />

                    {/* Category chip */}
                    <Box sx={{
                      position: 'absolute', top: 16, left: 16,
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '100px',
                      px: 2, py: 0.5,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#F87171',
                      fontFamily: '"Inter", sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}>
                      {facility.category}
                    </Box>

                    {/* Stat callout */}
                    <Box sx={{
                      position: 'absolute', bottom: 16, right: 16,
                      background: 'linear-gradient(135deg, #D32F2F, #B71C1C)',
                      borderRadius: '12px',
                      px: 2, py: 0.7,
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: 'white',
                      fontFamily: '"Outfit", sans-serif',
                      boxShadow: '0 4px 16px rgba(211,47,47,0.4)',
                    }}>
                      {facility.stat}
                    </Box>
                  </Box>

                  {/* Body */}
                  <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 800,
                        fontSize: '1.45rem',
                        color: '#FFFFFF',
                        mb: 1.2,
                      }}>
                        {facility.title}
                      </Typography>

                      <Typography sx={{
                        fontSize: '0.92rem',
                        color: 'rgba(255,255,255,0.68)',
                        lineHeight: 1.7,
                        fontFamily: '"Inter", sans-serif',
                        mb: 2.5,
                      }}>
                        {facility.description}
                      </Typography>

                      {/* Checklist */}
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {facility.points.map((pt) => (
                          <Stack key={pt} direction="row" alignItems="center" spacing={1.2}>
                            <CheckIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                            <Typography sx={{
                              fontSize: '0.86rem',
                              color: 'rgba(255,255,255,0.85)',
                              fontWeight: 500,
                              fontFamily: '"Inter", sans-serif',
                            }}>
                              {pt}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Customer Lounge Strip */}
        <Box sx={{
          mt: 7,
          p: { xs: 3.5, md: 4.5 },
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
        }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'rgba(211,47,47,0.15)',
              border: '1px solid rgba(211,47,47,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <LoungeIcon sx={{ color: '#EF4444', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF' }}>
                Air-Conditioned VIP Customer Lounge with Live Workshop Cameras
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', fontFamily: '"Inter", sans-serif' }}>
                Relax with premium coffee, high-speed Wi-Fi, and live monitors streaming work directly from your service bay.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            onClick={() => (window.location.href = '/booking')}
            id="facility-book-tour-btn"
            sx={{
              px: 3.8, py: 1.5,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
              fontWeight: 700,
              fontSize: '0.92rem',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'none',
              boxShadow: '0 6px 22px rgba(211,47,47,0.4)',
              flexShrink: 0,
              '&:hover': {
                background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Schedule a Visit
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default WorkshopFacilities;
