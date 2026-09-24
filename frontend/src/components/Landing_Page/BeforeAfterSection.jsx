import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Grid, Typography, Stack, Button } from '@mui/material';
import {
  CheckCircle as CheckIcon,
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

const TRANSFORMATIONS = [
  {
    title: 'Engine Bay Detailing & De-greasing',
    service: 'Periodic Engine Care',
    beforeLabel: 'Heavy Sludge & Grime',
    afterLabel: 'Factory Showroom Clean',
    desc: 'Deep steam decontamination, electrical connection sealing, and UV protective polymer dress for engine plastics and rubber hoses.',
    beforeImage: '/oil_change.jpg',
    afterImage: '/service_diagnostics.jpg',
    benefit: 'Prevents rubber hose rot & fire hazards',
  },
  {
    title: 'Brake Disc Resurfacing & Caliper Overhaul',
    service: 'Brake Systems',
    beforeLabel: 'Grooved & Corroded Discs',
    afterLabel: 'Sub-Micron Mirrored Finish',
    desc: 'On-car precision lathe resurfacing eliminates brake pulsation, removes rust lips, and guarantees optimal pad contact area.',
    beforeImage: '/service_brakes.jpg',
    afterImage: '/service_alignment.jpg',
    benefit: '30% shorter stopping distance',
  },
  {
    title: 'Multi-Stage Paint Correction & Ceramic Shield',
    service: 'Exterior Detailing',
    beforeLabel: 'Swirl Marks & Dull Clearcoat',
    afterLabel: '9H Glass-Like Hydrophobic Gloss',
    desc: 'Rotary compounding removes 95% of micro-scratches, followed by dual-action jewel polish and baked 9H nano-ceramic coating.',
    beforeImage: '/hero_car.jpg',
    afterImage: '/service_detailing.jpg',
    benefit: '3-year ceramic hydrophobic warranty',
  },
];

const TransformationCard = ({ item, index, visible }) => {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, box-shadow 0.3s ease`,
        '&:hover': {
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          borderColor: 'rgba(211,47,47,0.3)',
        }
      }}
    >
      {/* Interactive Toggle Photo Area */}
      <Box sx={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <Box
          component="img"
          src={showAfter ? item.afterImage : item.beforeImage}
          alt={item.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'filter 0.4s ease, transform 0.4s ease',
            filter: showAfter ? 'none' : 'grayscale(30%) contrast(90%)',
          }}
        />

        {/* Toggle switch badge */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 14, right: 14,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            p: 0.5,
          }}
        >
          <Button
            size="small"
            onClick={() => setShowAfter(false)}
            sx={{
              py: 0.3, px: 1.4,
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '100px',
              color: !showAfter ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              background: !showAfter ? '#4B5563' : 'transparent',
              textTransform: 'none',
              minWidth: 0,
            }}
          >
            Before
          </Button>
          <Button
            size="small"
            onClick={() => setShowAfter(true)}
            sx={{
              py: 0.3, px: 1.4,
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '100px',
              color: showAfter ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              background: showAfter ? '#D32F2F' : 'transparent',
              textTransform: 'none',
              minWidth: 0,
            }}
          >
            After ✨
          </Button>
        </Stack>

        {/* State description banner */}
        <Box sx={{
          position: 'absolute',
          bottom: 12, left: 14,
          background: showAfter ? 'rgba(5, 150, 105, 0.85)' : 'rgba(220, 38, 38, 0.85)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          px: 1.5, py: 0.4,
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
        }}>
          {showAfter ? `RESULT: ${item.afterLabel}` : `INITIAL: ${item.beforeLabel}`}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#D32F2F',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
            mb: 0.8,
          }}>
            {item.service}
          </Typography>

          <Typography sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#111827',
            mb: 1.2,
            lineHeight: 1.3,
          }}>
            {item.title}
          </Typography>

          <Typography sx={{
            fontSize: '0.88rem',
            color: '#6B7280',
            lineHeight: 1.65,
            fontFamily: '"Inter", sans-serif',
            mb: 2.5,
          }}>
            {item.desc}
          </Typography>
        </Box>

        {/* Benefit pill */}
        <Box sx={{
          p: 1.5,
          borderRadius: '10px',
          background: '#F0FDF4',
          border: '1px solid #DCFCE7',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <CheckIcon sx={{ color: '#16A34A', fontSize: 18, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
            {item.benefit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const BeforeAfterSection = () => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [cardsRef, cardsVisible] = useScrollReveal(0.08);

  return (
    <Box
      id="transformations"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            maxWidth: 720,
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
            color: '#D32F2F',
            fontFamily: '"Inter", sans-serif',
            mb: 1.8,
            background: '#FFEBEE',
            px: 2.2, py: 0.75,
            borderRadius: '100px',
            border: '1px solid rgba(211,47,47,0.2)',
          }}>
            Proven Craftsmanship
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              color: '#111827',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Real Results.{' '}
            <Box component="span" sx={{ color: '#D32F2F' }}>Before & After</Box>
          </Typography>

          <Typography sx={{
            color: '#6B7280',
            fontSize: { xs: '0.98rem', md: '1.08rem' },
            lineHeight: 1.75,
            fontFamily: '"Inter", sans-serif',
          }}>
            Toggle between before and after to inspect the uncompromising standard
            our technicians deliver on every single vehicle that enters our bays.
          </Typography>
        </Box>

        {/* 3 Interactive Cards */}
        <Box ref={cardsRef}>
          <Grid container spacing={4}>
            {TRANSFORMATIONS.map((item, index) => (
              <Grid item xs={12} md={4} key={item.title}>
                <TransformationCard item={item} index={index} visible={cardsVisible} />
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default BeforeAfterSection;
