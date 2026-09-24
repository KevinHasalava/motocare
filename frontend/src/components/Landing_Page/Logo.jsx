// frontend/src/components/Landing_Page/Logo.jsx — Ultra Premium Automotive Brand Logo
import React from 'react';
import { Stack, Typography, Box } from '@mui/material';

const AutomotiveEmblem = ({ size = 40, isWhite = false }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 10px rgba(211,47,47,0.3))',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'scale(1.08) rotate(-2deg)',
        },
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main Shield Gradient */}
          <linearGradient id="mcShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#D32F2F" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Chrome / Silver Accent */}
          <linearGradient id="mcChromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.9" />
          </linearGradient>

          {/* Shimmer Effect */}
          <linearGradient id="mcShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shield Outer Shadow Border */}
        <path
          d="M24 3L40 9V22C40 33 33 41.5 24 45C15 41.5 8 33 8 22V9L24 3Z"
          fill="url(#mcShieldGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Inset */}
        <path
          d="M24 6L37 11V21.5C37 30.5 31.5 37.8 24 41C16.5 37.8 11 30.5 11 21.5V11L24 6Z"
          fill="#0F172A"
          opacity="0.88"
        />

        {/* Dynamic Speed Lines */}
        <path
          d="M13 18H21L19 21H12L13 18Z"
          fill="url(#mcShieldGrad)"
          opacity="0.8"
        />
        <path
          d="M11 23H17L15 26H10L11 23Z"
          fill="url(#mcShieldGrad)"
          opacity="0.5"
        />

        {/* Automotive Piston / Turbo / Wrench Stylized Emblem */}
        <path
          d="M17 28L21 21C20.5 19 21.5 17 23.5 16C25.5 15 27.5 15.5 29 17L26 20L28 22L31 19C32.5 20.5 33 22.5 32 24.5C31 26.5 29 27.5 27 27L20 31L17 28Z"
          fill="url(#mcChromeGrad)"
        />

        {/* Center Spark / Precision Point */}
        <circle cx="24" cy="24" r="2.5" fill="#EF4444" />
        <circle cx="24" cy="24" r="1.2" fill="#FFFFFF" />

        {/* Top Highlight Arc */}
        <path
          d="M24 7L35 11.5C35 15 34 20 32 24C30 18 27 12 24 7Z"
          fill="url(#mcShimmer)"
        />
      </svg>
    </Box>
  );
};

const Logo = ({
  size = 'medium',
  showSubtitle = true,
  clickable = true,
  onClick,
  variant = 'default',
  customStyle = {},
}) => {
  const sizeMap = {
    small: { emblemSize: 32, titleSize: '1.15rem', subSize: '0.62rem', spacing: 1.2 },
    medium: { emblemSize: 42, titleSize: '1.45rem', subSize: '0.72rem', spacing: 1.5 },
    large: { emblemSize: 52, titleSize: '1.85rem', subSize: '0.82rem', spacing: 1.8 },
    xlarge: { emblemSize: 64, titleSize: '2.3rem', subSize: '0.95rem', spacing: 2 },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;
  const isWhite = variant === 'white';

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={currentSize.spacing}
      onClick={onClick}
      sx={{
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none',
        transition: 'opacity 0.2s ease',
        '&:hover': clickable ? { opacity: 0.92 } : {},
        ...customStyle,
      }}
    >
      {/* Precision Automotive Emblem */}
      <AutomotiveEmblem size={currentSize.emblemSize} isWhite={isWhite} />

      {/* Brand Typography */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="baseline" spacing={0.3}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: currentSize.titleSize,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: isWhite ? '#FFFFFF' : '#0F172A',
            }}
          >
            MOTO
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: currentSize.titleSize,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#D32F2F',
            }}
          >
            CARE
          </Typography>
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#EF4444',
              ml: 0.2,
              mb: 0.4,
              boxShadow: '0 0 6px rgba(239,68,68,0.6)',
            }}
          />
        </Stack>

        {showSubtitle && (
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: currentSize.subSize,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isWhite ? 'rgba(255,255,255,0.7)' : '#64748B',
              lineHeight: 1,
              mt: 0.4,
            }}
          >
            Auto Service & Diagnostics
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default Logo;