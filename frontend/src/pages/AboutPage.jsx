// frontend/src/pages/AboutPage.jsx
import React from 'react';
import {
  ThemeProvider, CssBaseline, Box, Container, Grid, Typography,
  Stack, Divider,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Build as BuildIcon,
  Groups as GroupsIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { theme } from '../utils/theme';

const NAV_ITEMS = ['Home', 'Services', 'About', 'Contact'];

const STATS = [
  { label: 'Happy Customers',    value: '5,000+',  Icon: StarIcon },
  { label: 'Services Completed', value: '15,000+', Icon: CarIcon },
  { label: 'Average Rating',     value: '4.9/5',   Icon: SpeedIcon },
  { label: 'Response Time',      value: '<2hrs',   Icon: EngineeringIcon },
];

const VALUES = [
  {
    Icon: VerifiedIcon,
    title: 'Certified Excellence',
    desc: 'Every mechanic on our team is factory-trained and holds industry certifications. We never cut corners.',
  },
  {
    Icon: BuildIcon,
    title: 'Modern Technology',
    desc: 'State-of-the-art diagnostic tools and our proprietary booking platform bring auto care into the digital age.',
  },
  {
    Icon: GroupsIcon,
    title: 'Customer First',
    desc: 'Transparent pricing, real-time updates, and no surprise fees. Your trust is our most valuable asset.',
  },
  {
    Icon: TrophyIcon,
    title: 'Premium Standards',
    desc: 'From the workshop floor to our digital platform, everything is designed to the highest possible standard.',
  },
];

const AboutPage = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <TopBar />
      <Header navItems={NAV_ITEMS} />

      {/* Header banner — offset for sticky header + topbar */}
      <Box sx={{ pt: { xs: '64px', md: '76px' } }}>
        <PageHeaderBanner
          title="About Us"
          breadcrumb="About Us"
          imageUrl="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=1400&q=80&auto=format&fit=crop"
        />
      </Box>

      {/* ── Mission Section ──────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
            {/* Image */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop"
                  alt="Moto-Care service bay"
                  sx={{
                    width: '100%',
                    height: { xs: 260, md: 420 },
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
                    display: 'block',
                  }}
                />
                {/* Floating badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -24,
                    right: -20,
                    background: '#D32F2F',
                    borderRadius: '16px',
                    p: 2.5,
                    boxShadow: '0 8px 32px rgba(211,47,47,0.35)',
                    textAlign: 'center',
                    minWidth: 110,
                  }}
                >
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>
                    10+
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.5 }}>
                    Years of Service
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Text */}
            <Grid item xs={12} md={7}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 2 }}>
                Our Mission
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 3, color: '#111827', fontFamily: '"Outfit", sans-serif', fontWeight: 900 }}
              >
                Redefining Vehicle<br />Care in Sri Lanka
              </Typography>
              <Typography sx={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem', fontFamily: '"Inter", sans-serif', mb: 3 }}>
                Founded in Imaduwa, Galle District, Moto-Care was born from a simple vision: every vehicle owner deserves
                transparent, high-quality service backed by modern technology. We combine the expertise of certified
                mechanics with a smart digital platform so you're always in the loop — from booking to pickup.
              </Typography>
              <Typography sx={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem', fontFamily: '"Inter", sans-serif', mb: 4 }}>
                Today, we serve thousands of satisfied customers across the Galle District, delivering everything from
                routine maintenance to complex diagnostics with the same commitment to excellence.
              </Typography>
              <Divider sx={{ borderColor: '#F3F4F6', mb: 4 }} />
              <Stack spacing={2}>
                {['Certified & trained mechanics', 'Transparent, upfront pricing', 'Real-time digital service tracking'].map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#D32F2F', flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: '#111827' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {STATS.map(({ label, value, Icon }) => (
              <Grid item xs={6} md={3} key={label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '16px',
                    background: 'rgba(211,47,47,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2,
                  }}>
                    <Icon sx={{ color: '#EF4444', fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.6rem' }, color: '#fff', lineHeight: 1, mb: 0.5 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Values Section ───────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8F9FB' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 2 }}>
              What We Stand For
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: '#111827', fontFamily: '"Outfit", sans-serif', fontWeight: 900 }}>
              Our Core Values
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {VALUES.map(({ Icon, title, desc }) => (
              <Grid item xs={12} sm={6} key={title}>
                <Box
                  sx={{
                    p: 4, borderRadius: '20px', background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      transform: 'translateY(-4px)',
                      borderColor: 'rgba(211,47,47,0.2)',
                    },
                  }}
                >
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '16px',
                    background: '#FFEBEE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 2.5,
                  }}>
                    <Icon sx={{ color: '#D32F2F', fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#111827', mb: 1.5 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', lineHeight: 1.8, fontSize: '0.92rem' }}>
                    {desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: '#D32F2F', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#fff', mb: 2 }}>
            Ready to Experience the Difference?
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.8, mb: 4, maxWidth: 480, mx: 'auto' }}>
            Join thousands of satisfied customers and book your next service today.
          </Typography>
          <Box
            component="a"
            href="/booking"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 4, py: 1.7, borderRadius: '12px',
              background: '#fff', color: '#D32F2F',
              fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.22s ease',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 36px rgba(0,0,0,0.25)' },
            }}
          >
            Book Your Service
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  </ThemeProvider>
);

export default AboutPage;
