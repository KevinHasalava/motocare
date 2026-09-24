// frontend/src/components/Footer.jsx — Light Premium Version
import React from 'react';
import {
  Box, Container, Grid, Stack, Typography, Divider
} from '@mui/material';
import {
  LocationOn as MapPinIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  ArrowForward as ArrowIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import Logo from './Landing_Page/Logo';

const serviceLinks = [
  'Comprehensive Diagnostics',
  'Scheduled Maintenance',
  'Emergency Repairs',
  'Digital Records',
];

const quickLinks = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Services',   href: '/services' },
  { label: 'Process',    href: '/process' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQ',        href: '/faq' },
];

const Footer = () => (
  <Box
    component="footer"
    id="contact"
    sx={{
      background: '#F8F9FB',
      borderTop: '1px solid #E5E7EB',
      pt: { xs: 10, md: 14 },
      pb: { xs: 5, md: 6 },
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Red accent top stripe */}
    <Box sx={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 3,
      background: 'linear-gradient(90deg, #D32F2F 0%, #EF4444 50%, #D32F2F 100%)',
    }} />

    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      <Grid container spacing={{ xs: 5, md: 6 }}>

        {/* ── Brand Column ── */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <Logo
              size="medium"
              variant="default"
              showSubtitle={true}
              clickable={true}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: '#6B7280',
              fontSize: '0.92rem',
              lineHeight: 1.8,
              mb: 4,
              maxWidth: 280,
            }}
          >
            Revolutionizing vehicle servicing with cutting-edge technology and a commitment to premium automotive care.
          </Typography>

          {/* Contact info block */}
          <Stack spacing={2}>
            {[
              { Icon: MapPinIcon, text: 'Imaduwa, Galle District, Sri Lanka' },
              { Icon: MailIcon,   text: 'contact@motocare.lk' },
              { Icon: PhoneIcon,  text: '(+94) XX XXX XXXX' },
            ].map(({ Icon, text }) => (
              <Stack
                key={text}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateX(4px)' },
                  cursor: 'default',
                }}
              >
                <Box sx={{
                  width: 34, height: 34, borderRadius: '10px',
                  background: '#FFEBEE',
                  border: '1px solid rgba(211,47,47,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon sx={{ color: '#D32F2F', fontSize: '1.1rem' }} />
                </Box>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280',
                  fontSize: '0.87rem',
                  lineHeight: 1.5,
                }}>
                  {text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        {/* ── Quick Links ── */}
        <Grid item xs={6} md={2.5}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#111827',
              mb: 3,
            }}
          >
            Quick Links
          </Typography>
          <Stack spacing={2}>
            {quickLinks.map(({ label, href }) => (
              <Box
                key={label}
                component="a"
                href={href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#6B7280',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#D32F2F',
                    gap: 1.5,
                  },
                  '& .mc-arrow': {
                    fontSize: '0.85rem',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  },
                  '&:hover .mc-arrow': { opacity: 1 },
                }}
              >
                <ArrowIcon className="mc-arrow" sx={{ fontSize: '0.85rem' }} />
                {label}
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* ── Our Services ── */}
        <Grid item xs={6} md={2.5}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#111827',
              mb: 3,
            }}
          >
            Services
          </Typography>
          <Stack spacing={2}>
            {serviceLinks.map((service) => (
              <Box
                key={service}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#D32F2F',
                  flexShrink: 0,
                }} />
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280',
                  fontSize: '0.9rem',
                }}>
                  {service}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* ── CTA Column ── */}
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#111827',
              mb: 3,
            }}
          >
            Ready to Start?
          </Typography>
          <Typography sx={{
            fontFamily: '"Inter", sans-serif',
            color: '#6B7280',
            fontSize: '0.9rem',
            lineHeight: 1.75,
            mb: 3,
          }}>
            Book your next service today and experience the future of automotive care.
          </Typography>
          <Box
            component="a"
            href="/booking"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.3,
              borderRadius: '10px',
              background: '#D32F2F',
              color: 'white',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(211,47,47,0.28)',
              transition: 'all 0.22s ease',
              '&:hover': {
                background: '#B71C1C',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 28px rgba(211,47,47,0.4)',
              },
            }}
          >
            <CalendarIcon sx={{ fontSize: '1rem' }} />
            Book Service
            <ArrowIcon sx={{ fontSize: '0.9rem' }} />
          </Box>
        </Grid>
      </Grid>

      {/* ── Bottom Bar ── */}
      <Divider sx={{ mt: 8, mb: 4, borderColor: '#E5E7EB' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'space-between' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Typography sx={{
          fontFamily: '"Inter", sans-serif',
          color: '#9CA3AF',
          fontSize: '0.82rem',
        }}>
          © {new Date().getFullYear()} Moto-Care (Pvt) Ltd. All Rights Reserved.
        </Typography>

        <Stack direction="row" spacing={3}>
          {['Privacy Policy', 'Terms of Service'].map((item) => (
            <Typography
              key={item}
              sx={{
                fontFamily: '"Inter", sans-serif',
                color: '#9CA3AF',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#D32F2F' },
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Container>
  </Box>
);


export default Footer;