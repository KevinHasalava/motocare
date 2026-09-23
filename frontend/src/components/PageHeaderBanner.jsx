// frontend/src/components/PageHeaderBanner.jsx — Shared inner-page banner
import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { Home as HomeIcon, ChevronRight as ChevronIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * PageHeaderBanner — reusable banner for inner pages
 * Props:
 *   title       {string}  — page title (e.g. "About Us")
 *   breadcrumb  {string}  — current page label for breadcrumb (e.g. "About Us")
 *   imageUrl    {string}  — optional background image URL
 *   compact     {boolean} — shorter height variant
 */
const PageHeaderBanner = ({
  title,
  breadcrumb,
  imageUrl = 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=1400&q=80&auto=format&fit=crop',
  compact = false,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        height: compact ? 220 : 290,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        mt: 0,
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55)',
          transform: 'scale(1.04)',
          transition: 'transform 6s ease',
        }}
      />

      {/* Light gradient overlay — left-heavy so text on left is crisp */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Red left accent bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: '#D32F2F',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': { color: '#fff' },
            }}
          >
            <HomeIcon sx={{ fontSize: '0.9rem' }} />
            Home
          </Box>
          <ChevronIcon sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)' }} />
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#EF4444',
            }}
          >
            {breadcrumb || title}
          </Typography>
        </Stack>

        {/* Page title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3.2rem' },
            color: '#FFFFFF',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </Typography>
      </Container>
    </Box>
  );
};

export default PageHeaderBanner;
