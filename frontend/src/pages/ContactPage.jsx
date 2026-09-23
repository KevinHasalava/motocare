// frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import {
  ThemeProvider, CssBaseline, Box, Container, Grid, Typography,
  Stack, TextField, Button, Paper, Alert, Snackbar,
} from '@mui/material';
import {
  LocationOn as MapPinIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  AccessTime as ClockIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { theme } from '../utils/theme';

const NAV_ITEMS = ['Home', 'Services', 'About', 'Contact'];

const CONTACT_INFO = [
  {
    Icon: MapPinIcon,
    label: 'Our Location',
    value: 'Imaduwa, Galle District\nSouthern Province, Sri Lanka',
  },
  {
    Icon: PhoneIcon,
    label: 'Phone',
    value: '(+94) XX XXX XXXX',
  },
  {
    Icon: MailIcon,
    label: 'Email',
    value: 'contact@motocare.lk',
  },
  {
    Icon: ClockIcon,
    label: 'Business Hours',
    value: 'Monday – Saturday\n8:00 AM – 6:00 PM',
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [snackOpen, setSnackOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Presentational submit — no backend POST invented. Logs to console.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[ContactPage] Form submission:', form);
    setSnackOpen(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <TopBar />
        <Header navItems={NAV_ITEMS} />

        <Box sx={{ pt: { xs: '64px', md: '76px' } }}>
          <PageHeaderBanner
            title="Contact Us"
            breadcrumb="Contact Us"
            imageUrl="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1400&q=80&auto=format&fit=crop"
          />
        </Box>

        {/* ── Main Content ──────────────────────────────────── */}
        <Box sx={{ py: { xs: 8, md: 12 }, background: '#FFFFFF' }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 5, md: 8 }}>

              {/* Left: Contact Info */}
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 1.5 }}>
                  Get in Touch
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', mb: 2 }}>
                  We'd Love to Hear From You
                </Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', lineHeight: 1.85, fontSize: '0.98rem', mb: 5 }}>
                  Have a question about our services, or want to make a booking enquiry? Reach out through any of the channels below and our team will get back to you promptly.
                </Typography>

                <Stack spacing={3}>
                  {CONTACT_INFO.map(({ Icon, label, value }) => (
                    <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{
                        width: 46, height: 46, borderRadius: '14px',
                        background: '#FFEBEE',
                        border: '1.5px solid rgba(211,47,47,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ color: '#D32F2F', fontSize: '1.2rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                          {value}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>

                {/* Map placeholder */}
                <Box
                  sx={{
                    mt: 5, borderRadius: '18px', overflow: 'hidden',
                    height: 200,
                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                    border: '1px solid #E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=70&auto=format&fit=crop"
                    alt="Imaduwa, Galle District location"
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <MapPinIcon sx={{ fontSize: 36, color: '#D32F2F', filter: 'drop-shadow(0 2px 8px rgba(211,47,47,0.5))' }} />
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff', mt: 1, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      Imaduwa, Galle District
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right: Contact Form */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: '24px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
                    background: '#FFFFFF',
                  }}
                >
                  <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.6rem', color: '#111827', mb: 1 }}>
                    Send Us a Message
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#9CA3AF', fontSize: '0.88rem', mb: 4 }}>
                    Fill in the form below and we'll respond within 24 hours.
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        multiline
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        endIcon={<SendIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: '12px',
                          background: '#D32F2F',
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: '0 6px 24px rgba(211,47,47,0.3)',
                          '&:hover': {
                            background: '#B71C1C',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 32px rgba(211,47,47,0.4)',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ borderRadius: '12px', fontFamily: '"Inter", sans-serif' }}>
            Message received! We'll be in touch shortly.
          </Alert>
        </Snackbar>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ContactPage;
