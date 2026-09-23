// frontend/src/components/TopBar.jsx — Slim utility bar (desktop only)
import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import {
  Phone as PhoneIcon,
  Mail as MailIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';

const TopBar = () => (
  <Box
    sx={{
      background: '#F8F9FB',
      borderBottom: '1px solid #E5E7EB',
      height: 40,
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
    }}
  >
    <Container maxWidth="xl">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left: phone + email */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack direction="row" spacing={0.7} alignItems="center">
            <PhoneIcon sx={{ fontSize: '0.82rem', color: '#D32F2F' }} />
            <Typography
              component="a"
              href="tel:+94XXXXXXXXX"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.76rem',
                fontWeight: 500,
                color: '#6B7280',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#D32F2F' },
              }}
            >
              (+94) XX XXX XXXX
            </Typography>
          </Stack>

          <Box sx={{ width: 1, height: 14, background: '#D1D5DB' }} />

          <Stack direction="row" spacing={0.7} alignItems="center">
            <MailIcon sx={{ fontSize: '0.82rem', color: '#D32F2F' }} />
            <Typography
              component="a"
              href="mailto:contact@motocare.lk"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.76rem',
                fontWeight: 500,
                color: '#6B7280',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#D32F2F' },
              }}
            >
              contact@motocare.lk
            </Typography>
          </Stack>
        </Stack>

        {/* Right: hours */}
        <Stack direction="row" spacing={0.7} alignItems="center">
          <ClockIcon sx={{ fontSize: '0.82rem', color: '#D32F2F' }} />
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.76rem',
              fontWeight: 500,
              color: '#6B7280',
            }}
          >
            Mon – Sat: 8:00 AM – 6:00 PM
          </Typography>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default TopBar;
