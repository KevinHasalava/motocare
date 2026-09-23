// frontend/src/pages/FAQPage.jsx
import React, { useState } from 'react';
import {
  ThemeProvider, CssBaseline, Box, Container, Typography,
  Stack, Collapse, Divider,
} from '@mui/material';
import {
  Add as PlusIcon,
  Remove as MinusIcon,
} from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { theme } from '../utils/theme';

const NAV_ITEMS = ['Home', 'Services', 'About', 'Contact'];

const FAQS = [
  {
    q: 'How do I book a service appointment?',
    a: 'Booking is quick and fully online. Simply click "Book Your Service" from the navigation bar, sign in to your account, select your vehicle, choose the service type, pick a date and time slot, and confirm. You\'ll receive an instant booking confirmation.',
  },
  {
    q: 'What types of vehicles do you service?',
    a: 'We service a wide range of vehicles including petrol and diesel cars, SUVs, light trucks, and motorcycles. Our mechanics are trained to handle most makes and models available in the Sri Lankan market. Please contact us if you\'re unsure about your vehicle.',
  },
  {
    q: 'How can I track the progress of my vehicle\'s service?',
    a: 'Once your vehicle is checked in, you can log in to your Moto-Care account and view real-time status updates on your booking. Our mechanics update each stage of the job digitally, so you always know what\'s happening.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash, bank transfers, and digital payments processed through our cashier portal. Payment details are confirmed at the time of pickup and a digital invoice is issued for every completed job.',
  },
  {
    q: 'Can I cancel or reschedule my booking?',
    a: 'Yes. You can view and manage your bookings through the "My Bookings" section of your account. Cancellations or reschedules are allowed up to 24 hours before the scheduled appointment without any charge.',
  },
  {
    q: 'Are your mechanics certified?',
    a: 'Yes. Every mechanic at Moto-Care is trained and certified in automotive service and diagnostics. We invest in ongoing training to ensure our team stays up to date with modern vehicle technology.',
  },
  {
    q: 'Where is Moto-Care located?',
    a: 'We are located in Imaduwa, Galle District, Southern Province, Sri Lanka. Our facility operates Monday through Saturday, 8:00 AM to 6:00 PM. Visit the Contact Us page for more details.',
  },
];

const FAQItem = ({ q, a, isLast }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          py: 2.8,
          px: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 3,
          transition: 'all 0.2s ease',
          '&:hover': { '& .faq-q': { color: '#D32F2F' } },
        }}
      >
        <Typography
          className="faq-q"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.1rem' },
            color: open ? '#D32F2F' : '#111827',
            lineHeight: 1.5,
            transition: 'color 0.2s',
          }}
        >
          {q}
        </Typography>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: open ? '#D32F2F' : '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.25s ease',
          }}
        >
          {open
            ? <MinusIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
            : <PlusIcon sx={{ fontSize: '1.1rem', color: '#6B7280' }} />
          }
        </Box>
      </Box>

      <Collapse in={open}>
        <Box sx={{ pb: 3, pr: { md: 8 } }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', lineHeight: 1.9, fontSize: '0.95rem' }}>
            {a}
          </Typography>
        </Box>
      </Collapse>

      {!isLast && <Divider sx={{ borderColor: '#F3F4F6' }} />}
    </Box>
  );
};

const FAQPage = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <TopBar />
      <Header navItems={NAV_ITEMS} />

      <Box sx={{ pt: { xs: '64px', md: '76px' } }}>
        <PageHeaderBanner
          title="Frequently Asked Questions"
          breadcrumb="FAQ"
          imageUrl="https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=1400&q=80&auto=format&fit=crop"
        />
      </Box>

      {/* ── Intro ───────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: '#F8F9FB', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 2 }}>
            FAQ
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#111827', mb: 2 }}>
            Got Questions? We've Got Answers.
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '1rem', lineHeight: 1.85, maxWidth: 560, mx: 'auto' }}>
            Everything you need to know about booking, tracking, and paying for your service at Moto-Care.
          </Typography>
        </Container>
      </Box>

      {/* ── FAQ List ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Box
            sx={{
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              px: { xs: 3, md: 5 },
              py: 1,
            }}
          >
            {FAQS.map((item, idx) => (
              <FAQItem key={item.q} q={item.q} a={item.a} isLast={idx === FAQS.length - 1} />
            ))}
          </Box>

          {/* Still have a question? */}
          <Box
            sx={{
              mt: 6, p: { xs: 3, md: 4 },
              borderRadius: '20px',
              background: '#FFEBEE',
              border: '1px solid rgba(211,47,47,0.15)',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#111827', mb: 1 }}>
              Still have a question?
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '0.92rem', mb: 2.5 }}>
              Our team is ready to help. Get in touch directly.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Box
                component="a"
                href="/contact"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 3.5, py: 1.4, borderRadius: '10px',
                  background: '#D32F2F', color: '#fff',
                  fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(211,47,47,0.28)',
                  transition: 'all 0.22s ease',
                  '&:hover': { background: '#B71C1C', transform: 'translateY(-2px)' },
                }}
              >
                Contact Us
              </Box>
              <Box
                component="a"
                href="tel:+94XXXXXXXXX"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 3.5, py: 1.4, borderRadius: '10px',
                  border: '1.5px solid rgba(211,47,47,0.3)', color: '#D32F2F',
                  fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.22s ease',
                  '&:hover': { background: 'rgba(211,47,47,0.05)', transform: 'translateY(-2px)' },
                }}
              >
                (+94) XX XXX XXXX
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  </ThemeProvider>
);

export default FAQPage;
