// frontend/src/components/Landing_Page/ServicesShowcase.jsx — Ultra Premium Services Showcase
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Button, Stack, Chip } from '@mui/material';
import {
  Build as WrenchIcon,
  LocalGasStation as OilIcon,
  CarRepair as BrakeIcon,
  AcUnit as AcIcon,
  Speed as SpeedIcon,
  ElectricCar as ElecIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  AutoAwesome as DetailingIcon,
} from '@mui/icons-material';

function useScrollReveal(threshold = 0.08) {
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

const SERVICES = [
  {
    id: 'oil-fluid',
    category: 'periodic',
    title: 'Periodic Maintenance & Oil',
    description: 'Full synthetic engine oil replacement, OEM filter installation, and 40-point safety check for peak engine longevity.',
    image: '/oil_change.jpg',
    icon: <OilIcon />,
    tag: 'Most Popular',
    tagColor: '#D32F2F',
    duration: '45 mins',
    features: ['100% Synthetic Oil', 'OEM Filter Replacement', 'Fluid Top-Ups'],
  },
  {
    id: 'diagnostics',
    category: 'diagnostics',
    title: 'Computer Diagnostics & ECM',
    description: 'Bosch computerized scanning to diagnose check engine lights, sensor issues, transmission faults, and ECU parameters.',
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=700&q=80&auto=format&fit=crop',
    icon: <SpeedIcon />,
    tag: 'Hi-Tech',
    tagColor: '#2563EB',
    duration: '1 - 2 hrs',
    features: ['Live Sensor Telemetry', 'Full Error Code Clear', 'ECU Calibration'],
  },
  {
    id: 'brakes',
    category: 'mechanical',
    title: 'Brake Systems & Calipers',
    description: 'Precision disc resurfacing, ceramic brake pad replacement, hydraulic brake bleeding, and ABS sensor testing.',
    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?w=700&q=80&auto=format&fit=crop',
    icon: <BrakeIcon />,
    tag: 'Critical Safety',
    tagColor: '#DC2626',
    duration: '1.5 hrs',
    features: ['Ceramic Brake Pads', 'Rotor Resurfacing', 'ABS Safety Test'],
  },
  {
    id: 'ac-service',
    category: 'mechanical',
    title: 'A/C & Climate Control',
    description: 'Digital refrigerant vacuum and refill, leak detection with UV dye, cabin antibacterial sanitization, and cooling test.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop',
    icon: <AcIcon />,
    tag: 'Comfort',
    tagColor: '#059669',
    duration: '1 hr',
    features: ['Eco R134a/1234yf', 'Leak UV Inspection', 'Cabin Odor Removal'],
  },
  {
    id: 'drivetrain',
    category: 'mechanical',
    title: 'Transmission & Gearbox',
    description: 'Automatic transmission fluid flushing, clutch replacement, differential servicing, and smooth gear shift calibration.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=700&q=80&auto=format&fit=crop',
    icon: <WrenchIcon />,
    tag: 'Precision',
    tagColor: '#7C3AED',
    duration: '2 - 4 hrs',
    features: ['ATF Flush & Filter', 'Clutch Plate Overhaul', 'Gearbox Tuning'],
  },
  {
    id: 'alignment',
    category: 'periodic',
    title: 'Laser 3D Wheel Alignment',
    description: 'Sub-millimeter laser alignment and high-speed computerized tire balancing to eliminate vibration and uneven wear.',
    image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=700&q=80&auto=format&fit=crop',
    icon: <SpeedIcon />,
    tag: 'Smooth Ride',
    tagColor: '#D97706',
    duration: '45 mins',
    features: ['3D Computer Camber', 'Road-Force Balancing', 'Tire Wear Analysis'],
  },
  {
    id: 'hybrid-ev',
    category: 'diagnostics',
    title: 'Hybrid & EV Care',
    description: 'High-voltage battery cell balance diagnostics, inverter cooling system maintenance, and regenerative brake service.',
    image: 'https://images.unsplash.com/photo-1632823470024-fd99de7c2c27?w=700&q=80&auto=format&fit=crop',
    icon: <ElecIcon />,
    tag: 'Specialized',
    tagColor: '#059669',
    duration: '2 - 3 hrs',
    features: ['HV Battery Health Check', 'Inverter Coolant Flush', 'Regen Brake Tune'],
  },
  {
    id: 'detailing',
    category: 'periodic',
    title: 'Ceramic Coating & Detailing',
    description: 'Multi-stage paint correction, 9H nano-ceramic protective shield, engine bay deep clean, and leather interior conditioning.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=700&q=80&auto=format&fit=crop',
    icon: <DetailingIcon />,
    tag: 'Showroom Finish',
    tagColor: '#B45309',
    duration: '3 - 6 hrs',
    features: ['Multi-Stage Cut & Polish', '9H Ceramic Shield', 'Interior Deep Steam'],
  },
];

const ServiceCard = ({ service, index, visible }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid',
        borderColor: hovered ? 'rgba(211,47,47,0.35)' : '#E5E7EB',
        boxShadow: hovered
          ? '0 24px 50px rgba(0,0,0,0.14), 0 0 20px rgba(211,47,47,0.1)'
          : '0 4px 18px rgba(0,0,0,0.05)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, border-color 0.3s ease, box-shadow 0.3s ease`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        <Box
          component="img"
          src={service.image}
          alt={service.title}
          className="service-img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />

        {/* Gradient Overlay on image */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Tag Badge */}
        <Chip
          label={service.tag}
          size="small"
          sx={{
            position: 'absolute',
            top: 14, left: 14,
            background: service.tagColor,
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.72rem',
            fontFamily: '"Inter", sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        />

        {/* Duration Badge */}
        <Box sx={{
          position: 'absolute',
          bottom: 12, right: 14,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          borderRadius: '100px',
          px: 1.5, py: 0.4,
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.72rem',
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          ⏱ {service.duration}
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#111827',
              mb: 1.2,
              lineHeight: 1.3,
              transition: 'color 0.2s ease',
              '&:hover': { color: '#D32F2F' },
            }}
          >
            {service.title}
          </Typography>

          <Typography sx={{
            fontSize: '0.88rem',
            color: '#6B7280',
            lineHeight: 1.65,
            fontFamily: '"Inter", sans-serif',
            mb: 2.5,
          }}>
            {service.description}
          </Typography>

          {/* Features list */}
          <Stack spacing={0.8} sx={{ mb: 3 }}>
            {service.features.map((feat) => (
              <Stack key={feat} direction="row" alignItems="center" spacing={1}>
                <CheckIcon sx={{ color: '#D32F2F', fontSize: 16 }} />
                <Typography sx={{
                  fontSize: '0.8rem',
                  color: '#374151',
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                }}>
                  {feat}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Action Button */}
        <Button
          fullWidth
          variant={hovered ? "contained" : "outlined"}
          endIcon={<ArrowIcon sx={{ fontSize: 18 }} />}
          onClick={() => (window.location.href = `/booking?service=${encodeURIComponent(service.id)}`)}
          id={`service-book-${service.id}`}
          sx={{
            py: 1.2,
            borderRadius: '10px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            fontSize: '0.86rem',
            textTransform: 'none',
            background: hovered ? 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)' : '#FFFFFF',
            borderColor: hovered ? 'transparent' : '#E5E7EB',
            color: hovered ? '#FFFFFF' : '#1F2937',
            boxShadow: hovered ? '0 6px 20px rgba(211,47,47,0.35)' : 'none',
            transition: 'all 0.25s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #C62828 0%, #A31515 100%)',
              borderColor: 'transparent',
              color: '#FFFFFF',
            }
          }}
        >
          Book This Service
        </Button>
      </Box>
    </Box>
  );
};

const ServicesShowcase = () => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [cardsRef, cardsVisible] = useScrollReveal(0.06);
  const [activeTab, setActiveTab] = useState('all');

  const filteredServices = activeTab === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeTab);

  return (
    <Box
      id="services"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: '#F8F9FB',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Grid Pattern */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)`,
        backgroundSize: '36px 36px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ────────────────────────────────────────── */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            maxWidth: 720,
            mx: 'auto',
            mb: { xs: 5, md: 7 },
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
            Complete Auto Solutions
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
            Specialized Care for{' '}
            <Box component="span" sx={{ color: '#D32F2F' }}>Every Vehicle</Box>
          </Typography>

          <Typography sx={{
            color: '#6B7280',
            fontSize: { xs: '0.98rem', md: '1.08rem' },
            lineHeight: 1.75,
            fontFamily: '"Inter", sans-serif',
          }}>
            From everyday maintenance to complex engine and electrical diagnostics,
            our certified technicians utilize advanced dealer-level tools to deliver perfection.
          </Typography>

          {/* Category Filter Pills */}
          <Stack
            direction="row"
            spacing={1.2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 3.5, gap: 1 }}
          >
            {[
              { id: 'all', label: 'All Services' },
              { id: 'periodic', label: 'Periodic Maintenance' },
              { id: 'diagnostics', label: 'Computer Diagnostics' },
              { id: 'mechanical', label: 'Mechanical & Brakes' },
            ].map((tab) => (
              <Chip
                key={tab.id}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                clickable
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  py: 2.2,
                  px: 1,
                  borderRadius: '10px',
                  background: activeTab === tab.id ? '#D32F2F' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#374151',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? '#D32F2F' : '#E5E7EB',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(211,47,47,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: activeTab === tab.id ? '#B71C1C' : '#F3F4F6',
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* ── Services Grid ─────────────────────────────────────────── */}
        <Box ref={cardsRef}>
          <Grid container spacing={3.5}>
            {filteredServices.map((service, index) => (
              <Grid item xs={12} sm={6} lg={3} key={service.id} sx={{ display: 'flex' }}>
                <ServiceCard service={service} index={index} visible={cardsVisible} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bottom Banner */}
        <Box sx={{
          mt: 7,
          p: { xs: 3, md: 4 },
          borderRadius: '18px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
        }}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box sx={{
              width: 54, height: 54, borderRadius: '14px',
              background: '#FFEBEE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <WrenchIcon sx={{ color: '#D32F2F', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#111827' }}>
                Need a Custom Inspection or Not Sure What's Wrong?
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: '#6B7280', fontFamily: '"Inter", sans-serif' }}>
                Bring your vehicle in for a complimentary computerized multi-point health check.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            onClick={() => (window.location.href = '/booking')}
            id="services-custom-booking-btn"
            sx={{
              px: 3.8, py: 1.4,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
              fontWeight: 700,
              fontSize: '0.92rem',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(211,47,47,0.3)',
              flexShrink: 0,
              '&:hover': {
                background: 'linear-gradient(135deg, #C62828 0%, #A31515 100%)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Book Free Inspection
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default ServicesShowcase;
