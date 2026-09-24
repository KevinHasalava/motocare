// frontend/src/components/Landing_Page/CtaSection.jsx — Premium Light Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Button, Stack
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Phone as PhoneIcon,
  LocalPhone as PhoneAltIcon,
  AccessTime as ClockIcon,
  LocationOn as LocationIcon,
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

const CtaSection = ({ theme }) => {
  const [aboutRef, aboutVisible] = useScrollReveal(0.1);
  const [ctaRef, ctaVisible] = useScrollReveal(0.1);

  const benefits = [
    'Online booking in under 2 minutes',
    'Real-time service progress tracking',
    'Digital records always available',
    'Expert certified mechanics',
    'Transparent pricing, no hidden fees',
  ];

  const contactInfo = [
    { icon: <ClockIcon sx={{ fontSize: 18, color: '#D32F2F' }} />, label: 'Working Hours', value: 'Mon–Sat: 8AM–6PM' },
    { icon: <LocationIcon sx={{ fontSize: 18, color: '#D32F2F' }} />, label: 'Location', value: 'Imaduwa, Galle District' },
    { icon: <PhoneAltIcon sx={{ fontSize: 18, color: '#D32F2F' }} />, label: 'Contact', value: '+94 XX XXX XXXX' },
  ];

  return (
    <>
      {/* ── About Section ─────────────────────────────────────────── */}
      <Box
        id="about"
        component="section"
        ref={aboutRef}
        sx={{
          py: { xs: 10, md: 14 },
          background: '#F8F9FB',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle pattern */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)`,
          backgroundSize: '36px 36px',
          opacity: 0.4,
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 10 }} alignItems="center">

            {/* Left: Image stack */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  opacity: aboutVisible ? 1 : 0,
                  transform: aboutVisible ? 'translateX(0)' : 'translateX(-40px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                {/* Main image */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop"
                  alt="Premium Moto-Care service bay"
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 420 },
                    objectFit: 'cover',
                    borderRadius: '24px',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.14)',
                    display: 'block',
                  }}
                />

                {/* Overlay accent image */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&q=80&auto=format&fit=crop"
                  alt="Premium garage interior"
                  sx={{
                    position: 'absolute',
                    bottom: -28, right: -24,
                    width: { xs: 130, md: 190 },
                    height: { xs: 100, md: 150 },
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                    border: '5px solid white',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />

                {/* Red floating badge */}
                <Box sx={{
                  position: 'absolute', top: 24, left: -20,
                  background: 'linear-gradient(135deg, #D32F2F, #B71C1C)',
                  borderRadius: '16px',
                  p: 2.5, textAlign: 'center',
                  boxShadow: '0 10px 28px rgba(211,47,47,0.4)',
                  animation: 'mc-float 4s ease-in-out infinite',
                }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: 'white', lineHeight: 1 }}>4.9★</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, mt: 0.3 }}>
                    Average<br />Rating
                  </Typography>
                </Box>

                {/* Years badge */}
                <Box sx={{
                  position: 'absolute', bottom: 28, left: -20,
                  background: '#111827',
                  borderRadius: '16px',
                  p: 2, textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  animation: 'mc-float 5.5s ease-in-out infinite 0.8s',
                }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'white', lineHeight: 1 }}>15+</Typography>
                  <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, mt: 0.3 }}>
                    Years<br />Experience
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right: Content */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  opacity: aboutVisible ? 1 : 0,
                  transform: aboutVisible ? 'translateX(0)' : 'translateX(40px)',
                  transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s',
                }}
              >
                <Typography sx={{
                  display: 'inline-block',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: '#D32F2F',
                  fontFamily: '"Inter", sans-serif', mb: 2,
                  background: '#FFEBEE', px: 2, py: 0.75,
                  borderRadius: '100px', border: '1px solid rgba(211,47,47,0.2)',
                }}>
                  About Moto-Care
                </Typography>

                <Typography
                  variant="h2"
                  component="h2"
                  sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' }, color: '#111827', mb: 2, mt: 1 }}
                >
                  Imaduwa's Most{' '}
                  <Box component="span" sx={{ color: '#D32F2F' }}>Trusted</Box>
                  {' '}Auto Service
                </Typography>

                <Typography sx={{ color: '#6B7280', mb: 4, lineHeight: 1.85, fontSize: '1rem' }}>
                  With over 15 years of experience in the Galle District, Moto-Care has built a reputation
                  for precision, transparency, and world-class customer service. Our certified team uses
                  the latest diagnostic technology to keep your vehicle performing at its best.
                </Typography>

                {/* Benefits list */}
                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {benefits.map((item, i) => (
                    <Stack key={item} direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#FFEBEE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <CheckIcon sx={{ color: '#D32F2F', fontSize: 15 }} />
                      </Box>
                      <Typography sx={{ color: '#374151', fontWeight: 500, fontSize: '0.93rem' }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* Contact info row */}
                <Box id="contact" sx={{
                  p: 2.5,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  mb: 3.5,
                }}>
                  <Stack spacing={1.5}>
                    {contactInfo.map((info) => (
                      <Stack key={info.label} direction="row" alignItems="center" spacing={1.5}>
                        {info.icon}
                        <Box>
                          <Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
                            {info.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.88rem', color: '#374151', fontWeight: 600 }}>
                            {info.value}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    href="/booking"
                    startIcon={<CalendarIcon />}
                    id="about-book-btn"
                    sx={{
                      px: 3.5, py: 1.5,
                      background: 'linear-gradient(135deg, #D32F2F, #B71C1C)',
                      fontWeight: 700, borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(211,47,47,0.3)',
                      '&:hover': { background: 'linear-gradient(135deg, #C62828, #A31515)', transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(211,47,47,0.4)' },
                    }}
                  >
                    Book a Service
                  </Button>
                  <Button
                    variant="outlined"
                    href="tel:+94XXXXXXXXX"
                    startIcon={<PhoneIcon />}
                    id="about-call-btn"
                    sx={{
                      px: 3.5, py: 1.5,
                      borderColor: '#E5E7EB', color: '#374151',
                      fontWeight: 600, borderRadius: '12px',
                      '&:hover': { borderColor: '#D32F2F', color: '#D32F2F', background: '#FFF5F5', transform: 'translateY(-2px)' },
                    }}
                  >
                    Call Us Now
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <Box
        id="cta"
        component="section"
        ref={ctaRef}
        sx={{
          py: { xs: 9, md: 12 },
          background: '#111827',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />
        {/* Red glow */}
        <Box sx={{
          position: 'absolute', bottom: '-30%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(211,47,47,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)', zIndex: 0,
        }} />
        {/* Left glow */}
        <Box sx={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(211,47,47,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)', zIndex: 0,
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box
            sx={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            {/* Top label */}
            <Typography sx={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Inter", sans-serif', mb: 3,
            }}>
              Ready to Get Started?
            </Typography>

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.2rem' },
                color: 'white', mb: 2, fontWeight: 900,
                lineHeight: { xs: 1.2, md: 1.1 },
              }}
            >
              Your Vehicle Deserves{' '}
              <Box component="span" sx={{ color: '#EF4444' }}>the Best</Box>
            </Typography>

            <Typography sx={{
              color: 'rgba(255,255,255,0.6)',
              mb: 6, lineHeight: 1.8, fontSize: '1.05rem',
              maxWidth: 520, mx: 'auto',
            }}>
              Join 5,000+ satisfied customers who trust Moto-Care for all their vehicle service needs.
              Book today and experience the difference.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                href="/booking"
                size="large"
                startIcon={<CalendarIcon />}
                endIcon={<ArrowIcon />}
                id="cta-book-btn"
                sx={{
                  px: 5, py: 1.8,
                  background: 'white', color: '#D32F2F',
                  fontWeight: 700, fontSize: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  '&:hover': {
                    background: '#F8F9FB',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                  },
                }}
              >
                Book Your Service
              </Button>
              <Button
                variant="outlined"
                href="/services"
                size="large"
                id="cta-services-btn"
                sx={{
                  px: 5, py: 1.8,
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: 'white', fontWeight: 600,
                  fontSize: '1rem', borderRadius: '12px',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
                    background: 'rgba(255,255,255,0.07)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                View Our Services
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CtaSection;