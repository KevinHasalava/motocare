// frontend/src/components/Landing_Page/ServicesShowcase.jsx — Interactive Luxury Service Studio
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Stack, Chip, Grid } from '@mui/material';
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
  Verified as VerifiedIcon,
  CalendarMonth as CalendarIcon,
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

const ALL_SERVICES = [
  {
    id: 'diagnostics',
    category: 'diagnostics',
    title: 'Computer Diagnostics & ECU Tuning',
    subtitle: 'Bosch 3D ECU Scanning & Sensor Telemetry',
    description: 'Dealer-level computerized diagnostic scanning to decode check engine warnings, read live fuel-trim and oxygen sensor telemetry, diagnose transmission glitches, and calibrate electronic throttle controls with precision.',
    image: '/service_diagnostics.jpg',
    icon: <SpeedIcon sx={{ fontSize: 22 }} />,
    tag: 'Hi-Tech Diagnostic',
    tagColor: '#2563EB',
    duration: '1 - 2 Hours',
    price: 'From Rs. 4,500',
    equipment: 'Bosch KTS & Launch X431 Pro',
    warranty: '100% Accuracy Guarantee',
    deliverables: [
      'Live ECU sensor graphing and fault code decoding',
      'Engine misfire and air-fuel ratio telemetry',
      'Electronic sensor calibration and error reset',
      'Full PDF diagnostic health report sent to WhatsApp',
    ],
  },
  {
    id: 'oil-fluid',
    category: 'periodic',
    title: 'Periodic Maintenance & Synthetic Oil',
    subtitle: 'Factory-Standard Multi-Point Inspection',
    description: 'Comprehensive factory-scheduled maintenance replacing motor oil with premium synthetic grades, installing genuine OEM filters, and carrying out a 40-point safety check across brakes, belts, battery, and suspension.',
    image: '/oil_change.jpg',
    icon: <OilIcon sx={{ fontSize: 22 }} />,
    tag: 'Essential Care',
    tagColor: '#D32F2F',
    duration: '45 Minutes',
    price: 'From Rs. 8,500',
    equipment: 'Pneumatic Fluid Extractors & Torque Wrenches',
    warranty: '10,000 KM Interval Warranty',
    deliverables: [
      '100% Synthetic engine oil replacement (Mobil/Castrol/Shell)',
      'Genuine OEM oil and air filter replacement',
      'Brake fluid, coolant, and washer fluid top-up',
      '40-point vehicle safety checklist certification',
    ],
  },
  {
    id: 'brakes',
    category: 'mechanical',
    title: 'Brake Systems & Caliper Overhaul',
    subtitle: 'On-Car Lathe Resurfacing & Ceramic Pads',
    description: 'Precision on-car disc resurfacing eliminates brake pedal pulsation and vibrations. Installation of premium dust-free ceramic pads, fluid pressure bleeding, and computerized ABS actuator safety testing.',
    image: '/service_brakes.jpg',
    icon: <BrakeIcon sx={{ fontSize: 22 }} />,
    tag: 'Critical Safety',
    tagColor: '#EF4444',
    duration: '1.5 Hours',
    price: 'From Rs. 6,500',
    equipment: 'On-Car Precision Brake Lathe & ABS Bleeder',
    warranty: '12-Month / 20,000 KM Warranty',
    deliverables: [
      'Precision rotor lathe resurfacing to sub-micron tolerances',
      'Low-dust high-coefficient ceramic brake pads',
      'High-temp synthetic caliper slide pin lubrication',
      'Brake line pressure bleeding and ABS sensor test',
    ],
  },
  {
    id: 'ac-service',
    category: 'mechanical',
    title: 'A/C Climate Control & Sanitization',
    subtitle: 'Digital Recovery, Vacuum & UV Leak Test',
    description: 'Automated refrigerant evacuation, nitrogen leak testing with UV dye, high-precision electronic gas recharge, and deep antibacterial cabin evaporator sanitization to eliminate odors and restore ice-cold cooling.',
    image: '/service_ac.jpg',
    icon: <AcIcon sx={{ fontSize: 22 }} />,
    tag: 'Cabin Comfort',
    tagColor: '#059669',
    duration: '1 Hour',
    price: 'From Rs. 5,500',
    equipment: 'Robinair Automatic Recovery & Recharge Station',
    warranty: '6-Month Cooling Guarantee',
    deliverables: [
      'Full electronic vacuum leak test and moisture purge',
      'R134a / 1234yf refrigerant recharge to exact factory grams',
      'Compressor PAG lubricating oil replacement',
      'Antibacterial evaporator treatment & cabin filter swap',
    ],
  },
  {
    id: 'alignment',
    category: 'periodic',
    title: '3D Laser Wheel Alignment & Balancing',
    subtitle: 'High-Definition Optical Camera Alignment Rig',
    description: 'Sub-millimeter optical sensors measure caster, camber, and toe angles to eliminate steering pull and uneven tire wear. Combined with computerized dynamic road-force tire balancing for silky smooth highway cruising.',
    image: '/service_alignment.jpg',
    icon: <SpeedIcon sx={{ fontSize: 22 }} />,
    tag: 'Smooth Ride',
    tagColor: '#D97706',
    duration: '45 Minutes',
    price: 'From Rs. 3,500',
    equipment: 'Corghi 3D Optical Laser Alignment Station',
    warranty: 'Tire Wear & Steering Guarantee',
    deliverables: [
      '3D camera measurement of all 4 wheel alignment angles',
      'Steering angle sensor (SAS) electronic zero-point reset',
      'Dynamic high-speed computerized wheel balancing',
      'Full color printout of before-and-after alignment geometry',
    ],
  },
  {
    id: 'detailing',
    category: 'periodic',
    title: '9H Ceramic Shield & Auto Detailing',
    subtitle: 'Multi-Stage Paint Correction & Nano-Ceramic',
    description: 'Rotary machine compounding eliminates 95% of swirl marks, scratches, and oxidation. Topped with a multi-layer 9H nano-ceramic coating for extreme hydrophobic gloss, followed by steam interior leather conditioning.',
    image: '/service_detailing.jpg',
    icon: <DetailingIcon sx={{ fontSize: 22 }} />,
    tag: 'Showroom Gloss',
    tagColor: '#B45309',
    duration: '3 - 6 Hours',
    price: 'From Rs. 18,000',
    equipment: 'Rupes Dual-Action Polishers & Infrared Curing Lamps',
    warranty: '3-Year Hydrophobic Coating Warranty',
    deliverables: [
      '3-stage swirl mark and paint defect compounding',
      '9H ultra-hydrophobic nano-ceramic coat application',
      'Engine bay steam cleaning and plastic UV protection',
      'Interior leather conditioning & antibacterial sanitization',
    ],
  },
  {
    id: 'full-service',
    category: 'mechanical',
    title: 'Master Vehicle Overhaul & Inspection',
    subtitle: 'Complete Drivetrain, Suspension & Systems Care',
    description: 'An exhaustive master service covering suspension bushings, shock absorbers, steering rack, cooling system pressure tests, transmission fluid flush, spark plugs, and complete mechanical road testing.',
    image: '/mechanic_service.jpg',
    icon: <WrenchIcon sx={{ fontSize: 22 }} />,
    tag: 'Comprehensive',
    tagColor: '#D32F2F',
    duration: '4 - 6 Hours',
    price: 'From Rs. 24,000',
    equipment: '5-Ton Heavy 4-Post Hoists & Diagnostic Scanners',
    warranty: '1-Year Full Workshop Warranty',
    deliverables: [
      'Complete undercarriage and suspension bushing inspection',
      'Cooling system pressure test and radiator flush',
      'Spark plug replacement and throttle body deep cleaning',
      'Full diagnostic scan, road test, and complimentary wash',
    ],
  },
  {
    id: 'hybrid-ev',
    category: 'diagnostics',
    title: 'Hybrid & High-Voltage Care',
    subtitle: 'Traction Battery Diagnostics & Inverter Service',
    description: 'Specialized high-voltage testing of hybrid battery cell resistance, individual module balancing, cooling fan cleaning to prevent overheating, inverter coolant flushing, and regenerative brake calibration.',
    image: '/hero_car.jpg',
    icon: <ElecIcon sx={{ fontSize: 22 }} />,
    tag: 'Specialized Hybrid',
    tagColor: '#10B981',
    duration: '2 - 3 Hours',
    price: 'From Rs. 12,000',
    equipment: 'High-Voltage Insulated Safety Tools & Hybrid Scanner',
    warranty: 'Battery Health Certification',
    deliverables: [
      'High-voltage battery module internal resistance analysis',
      'Battery cooling fan removal, de-dusting, and testing',
      'Inverter electric water pump and coolant circuit flush',
      'Regenerative braking sensor zero-point calibration',
    ],
  },
];

const ServicesShowcase = () => {
  const [headerRef, headerVisible] = useScrollReveal(0.1);
  const [activeTab, setActiveTab] = useState('all');
  const [activeServiceId, setActiveServiceId] = useState('diagnostics');

  const filteredServices = activeTab === 'all'
    ? ALL_SERVICES
    : ALL_SERVICES.filter((s) => s.category === activeTab);

  const activeService = ALL_SERVICES.find((s) => s.id === activeServiceId) || ALL_SERVICES[0];

  return (
    <Box
      id="services"
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        background: '#070B13',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Background Ambience */}
      <Box sx={{
        position: 'absolute', top: '10%', right: '-8%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,47,47,0.12) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ────────────────────────────────────────── */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            maxWidth: 780,
            mx: 'auto',
            mb: { xs: 6, md: 8 },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            background: 'rgba(211,47,47,0.14)',
            border: '1px solid rgba(211,47,47,0.35)',
            borderRadius: '100px',
            px: 2.2, py: 0.7, mb: 2,
          }}>
            <VerifiedIcon sx={{ color: '#EF4444', fontSize: 16 }} />
            <Typography sx={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#FCA5A5',
              fontFamily: '"Inter", sans-serif',
            }}>
              Dealer-Grade Automotive Studio
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '2.4rem', md: '3.6rem' },
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Precision Service{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #FF7878 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Master Studio
            </Box>
          </Typography>

          <Typography sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: { xs: '0.98rem', md: '1.1rem' },
            lineHeight: 1.75,
            fontFamily: '"Inter", sans-serif',
          }}>
            Explore our comprehensive range of specialized automotive services. Click any service
            to view live diagnostic procedures, equipment, time estimates, and pricing.
          </Typography>

          {/* Category Filter Pills */}
          <Stack
            direction="row"
            spacing={1.2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 4, gap: 1 }}
          >
            {[
              { id: 'all', label: 'All Services' },
              { id: 'diagnostics', label: 'Computer Diagnostics' },
              { id: 'periodic', label: 'Periodic Maintenance' },
              { id: 'mechanical', label: 'Brakes & Mechanical' },
            ].map((tab) => (
              <Chip
                key={tab.id}
                label={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  const firstMatching = tab.id === 'all'
                    ? ALL_SERVICES[0]
                    : ALL_SERVICES.find((s) => s.category === tab.id);
                  if (firstMatching) setActiveServiceId(firstMatching.id);
                }}
                clickable
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  py: 2.2,
                  px: 1.5,
                  borderRadius: '12px',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? '#EF4444' : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: activeTab === tab.id ? '0 4px 16px rgba(211,47,47,0.4)' : 'none',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: activeTab === tab.id
                      ? 'linear-gradient(135deg, #E53935 0%, #C62828 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* ── 2-COLUMN DYNAMIC INTERACTIVE STUDIO SHOWCASE ────────── */}
        <Grid container spacing={4} alignItems="stretch">

          {/* ── LEFT: Cinematic Active Service Spotlight ───────────── */}
          <Grid item xs={12} lg={7} sx={{ display: 'flex' }}>
            <Box
              sx={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '26px',
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 60px rgba(0,0,0,0.45), 0 0 30px rgba(211,47,47,0.12)',
                transition: 'all 0.4s ease',
              }}
            >
              {/* Photo Banner with Badges */}
              <Box sx={{ position: 'relative', height: { xs: 260, md: 340 }, overflow: 'hidden' }}>
                <Box
                  component="img"
                  key={activeService.image}
                  src={activeService.image}
                  alt={activeService.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'mc-fade-in 0.5s ease',
                  }}
                />
                <Box sx={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(7,11,19,0.15) 0%, rgba(15,23,42,0.95) 100%)',
                }} />

                {/* Tag Badge */}
                <Box sx={{
                  position: 'absolute',
                  top: 18, left: 18,
                  background: activeService.tagColor,
                  borderRadius: '100px',
                  px: 2, py: 0.6,
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                }}>
                  {activeService.tag}
                </Box>

                {/* Duration & Price Floating Pill */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    position: 'absolute',
                    top: 18, right: 18,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '100px',
                    px: 2, py: 0.6,
                  }}
                >
                  <Typography sx={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>
                    ⏱ {activeService.duration}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                    {activeService.price}
                  </Typography>
                </Stack>

                {/* Subtitle Banner at bottom of photo */}
                <Box sx={{ position: 'absolute', bottom: 16, left: 20 }}>
                  <Typography sx={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#EF4444',
                    fontFamily: '"Inter", sans-serif',
                  }}>
                    {activeService.subtitle}
                  </Typography>
                </Box>
              </Box>

              {/* Body Content */}
              <Box sx={{ p: { xs: 3, md: 4.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: '1.6rem', md: '2.1rem' },
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    mb: 1.8,
                  }}>
                    {activeService.title}
                  </Typography>

                  <Typography sx={{
                    fontSize: '0.96rem',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.75,
                    fontFamily: '"Inter", sans-serif',
                    mb: 3,
                  }}>
                    {activeService.description}
                  </Typography>

                  {/* Tech Specs Grid */}
                  <Grid container spacing={2} sx={{ mb: 3.5 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        p: 1.8,
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                          Diagnostic Equipment
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, mt: 0.3, fontFamily: '"Outfit", sans-serif' }}>
                          {activeService.equipment}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        p: 1.8,
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                          Service Warranty
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 700, mt: 0.3, fontFamily: '"Outfit", sans-serif' }}>
                          {activeService.warranty}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Deliverables Checklist */}
                  <Typography sx={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#EF4444',
                    fontFamily: '"Inter", sans-serif',
                    mb: 1.5,
                  }}>
                    What is Included in This Service:
                  </Typography>

                  <Stack spacing={1.2} sx={{ mb: 4 }}>
                    {activeService.deliverables.map((item) => (
                      <Stack key={item} direction="row" alignItems="center" spacing={1.5}>
                        <CheckIcon sx={{ color: '#EF4444', fontSize: 18, flexShrink: 0 }} />
                        <Typography sx={{
                          fontSize: '0.88rem',
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 500,
                          fontFamily: '"Inter", sans-serif',
                        }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Primary CTA */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarIcon />}
                  endIcon={<ArrowIcon />}
                  onClick={() => (window.location.href = `/booking?service=${encodeURIComponent(activeService.id)}`)}
                  id={`spotlight-book-${activeService.id}`}
                  sx={{
                    py: 1.8,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #B71C1C 100%)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    boxShadow: '0 8px 30px rgba(211,47,47,0.45)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F87171 0%, #C62828 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(211,47,47,0.6)',
                    }
                  }}
                >
                  Schedule {activeService.title}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* ── RIGHT: Interactive Service Selector Directory ───────── */}
          <Grid item xs={12} lg={5} sx={{ display: 'flex' }}>
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: { lg: 820 },
              overflowY: { lg: 'auto' },
              pr: { lg: 1 },
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(211,47,47,0.5)', borderRadius: 3 },
            }}>
              {filteredServices.map((service) => {
                const isSelected = service.id === activeServiceId;
                return (
                  <Box
                    key={service.id}
                    onClick={() => setActiveServiceId(service.id)}
                    sx={{
                      p: 2.2,
                      borderRadius: '18px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(211,47,47,0.18) 0%, rgba(17,24,39,0.9) 100%)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid',
                      borderColor: isSelected ? '#EF4444' : 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(16px)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isSelected ? '0 10px 30px rgba(211,47,47,0.2)' : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderColor: isSelected ? '#EF4444' : 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Image Thumbnail */}
                      <Box sx={{
                        width: 76,
                        height: 76,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}>
                        <Box
                          component="img"
                          src={service.image}
                          alt={service.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography sx={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: service.tagColor,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}>
                            {service.tag}
                          </Typography>
                          <Typography sx={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#10B981',
                            fontFamily: '"Outfit", sans-serif',
                          }}>
                            {service.price}
                          </Typography>
                        </Stack>

                        <Typography sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: '#FFFFFF',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {service.title}
                        </Typography>

                        <Stack direction="row" spacing={1.5} sx={{ mt: 0.8 }} alignItems="center">
                          <Typography sx={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)' }}>
                            ⏱ {service.duration}
                          </Typography>
                          <Typography sx={{ fontSize: '0.76rem', color: isSelected ? '#EF4444' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            {isSelected ? '● Currently Viewing' : 'Click to inspect'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Grid>

        </Grid>

        {/* ── 4-PILLAR SERVICE GUARANTEE STRIP (Fills space cleanly) ── */}
        <Box sx={{
          mt: 8,
          p: { xs: 3.5, md: 4.5 },
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          backdropFilter: 'blur(16px)',
        }}>
          <Grid container spacing={3}>
            {[
              { title: '100% Genuine OEM Parts', desc: 'Sourced directly from authorized manufacturers with full serial traceability.' },
              { title: 'Digital WhatsApp Reports', desc: 'High-res photos and computerized diagnostics sent straight to your phone.' },
              { title: 'Zero Hidden Charges', desc: 'Itemized quotation approved by you before a single tool touches your car.' },
              { title: '12-Month Guarantee', desc: 'Complete peace of mind covering both replacement components and labor.' },
            ].map((pillar) => (
              <Grid item xs={12} sm={6} lg={3} key={pillar.title}>
                <Stack direction="row" spacing={1.8} alignItems="flex-start">
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: 'rgba(211,47,47,0.15)',
                    border: '1px solid rgba(211,47,47,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CheckIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.98rem', color: '#FFFFFF', mb: 0.3 }}>
                      {pillar.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>
                      {pillar.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default ServicesShowcase;
