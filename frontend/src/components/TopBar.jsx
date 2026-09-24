// frontend/src/components/TopBar.jsx — Premium Dark Top Bar (Fixed & Aligned)
import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import {
  Phone as PhoneIcon,
  Mail as MailIcon,
  AccessTime as ClockIcon,
  Facebook as FbIcon,
  Instagram as IgIcon,
  Twitter as TwIcon,
  YouTube as YtIcon,
} from '@mui/icons-material';

const INFO = [
  { icon: <PhoneIcon sx={{ fontSize: 13, color: '#EF4444' }} />, text: '(+94) 77 XXX XXXX', href: 'tel:+94XXXXXXXXX' },
  { icon: <MailIcon sx={{ fontSize: 13, color: '#EF4444' }} />, text: 'contact@motocare.lk', href: 'mailto:contact@motocare.lk' },
  { icon: <ClockIcon sx={{ fontSize: 13, color: '#EF4444' }} />, text: 'Mon – Sat: 8:00 AM – 6:00 PM', href: null },
];

const SOCIALS = [
  { icon: <FbIcon sx={{ fontSize: 14 }} />, href: '#', label: 'Facebook' },
  { icon: <IgIcon sx={{ fontSize: 14 }} />, href: '#', label: 'Instagram' },
  { icon: <TwIcon sx={{ fontSize: 14 }} />, href: '#', label: 'Twitter' },
  { icon: <YtIcon sx={{ fontSize: 14 }} />, href: '#', label: 'YouTube' },
];

const TopBar = () => (
  <Box
    sx={{
      background: '#0F172A',
      height: 42,
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      width: '100%',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: '100%' }}
      >
        {/* Left: contact info */}
        <Stack direction="row" alignItems="center" spacing={0} divider={
          <Box sx={{ width: '1px', height: 14, background: 'rgba(255,255,255,0.12)', mx: 2 }} />
        }>
          {INFO.map((item) => (
            <Stack key={item.text} direction="row" alignItems="center" spacing={0.7}>
              {item.icon}
              <Typography
                component={item.href ? 'a' : 'span'}
                href={item.href || undefined}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  transition: 'color 0.2s',
                  ...(item.href && { '&:hover': { color: '#fff' } }),
                }}
              >
                {item.text}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Right: social icons */}
        <Stack direction="row" alignItems="center" spacing={0.75}>
          {SOCIALS.map((s) => (
            <Box
              key={s.label}
              component="a"
              href={s.href}
              aria-label={s.label}
              sx={{
                width: 28, height: 28,
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#D32F2F',
                  borderColor: '#D32F2F',
                  color: 'white',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {s.icon}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default TopBar;
