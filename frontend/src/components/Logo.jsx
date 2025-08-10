// frontend/src/components/Logo.jsx (Enhanced Version)
import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import {
  DirectionsCar, Build, Settings, Speed, LocalCarWash, Garage
} from '@mui/icons-material';
import { gradientText } from '../utils/theme';
import { logoConfig } from '../config/logoConfig';

// Icon component mapping
const iconComponents = {
  DirectionsCar,
  Build,
  Settings,
  Speed,
  LocalCarWash,
  Garage
};

const Logo = ({ 
  size = logoConfig.defaults.size, 
  showSubtitle = logoConfig.defaults.showSubtitle, 
  clickable = false, 
  onClick,
  variant = logoConfig.defaults.variant,
  customStyle = {},
  overrideBrand = null // Allow temporary brand override
}) => {
  // Use override or config values
  const brandName = overrideBrand?.name || logoConfig.brand.name;
  const brandSubtitle = overrideBrand?.subtitle || logoConfig.brand.subtitle;

  // Size configurations
  const sizeConfig = {
    small: {
      iconSize: 24,
      titleVariant: 'h6',
      subtitleSize: '0.6rem',
      spacing: 1
    },
    medium: {
      iconSize: 40,
      titleVariant: 'h5',
      subtitleSize: '0.75rem',
      spacing: 1.5
    },
    large: {
      iconSize: 56,
      titleVariant: 'h4',
      subtitleSize: '0.9rem',
      spacing: 2
    },
    xlarge: {
      iconSize: 72,
      titleVariant: 'h3',
      subtitleSize: '1rem',
      spacing: 2.5
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      iconColor: 'primary.main',
      titleStyle: gradientText,
      subtitleColor: 'primary.light'
    },
    white: {
      iconColor: 'white',
      titleStyle: { color: 'white' },
      subtitleColor: 'rgba(255, 255, 255, 0.7)'
    },
    dark: {
      iconColor: 'primary.main',
      titleStyle: { color: 'text.primary' },
      subtitleColor: 'text.secondary'
    },
    monochrome: {
      iconColor: 'currentColor',
      titleStyle: { color: 'currentColor' },
      subtitleColor: 'currentColor'
    },
    // Add custom variants from config
    ...logoConfig.styling.customVariants
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  // Get the icon component
  const IconComponent = iconComponents[logoConfig.image.iconName] || DirectionsCar;

  // Render logo image or icon
  const renderLogoGraphic = () => {
    if (logoConfig.image.useImage) {
      return (
        <img 
          src={logoConfig.image.imagePath}
          alt={logoConfig.image.imageAlt}
          style={{
            width: config.iconSize,
            height: config.iconSize,
            objectFit: 'contain'
          }}
          onError={(e) => {
            console.warn('Logo image failed to load, falling back to icon');
            // Fallback to icon if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      );
    } else {
      return (
        <IconComponent sx={{ 
          fontSize: config.iconSize, 
          color: colors.iconColor 
        }} />
      );
    }
  };

  // Logo content
  const LogoContent = (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={config.spacing}
      sx={{
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': clickable ? {
          transform: 'scale(1.05)',
          filter: 'brightness(1.1)'
        } : {},
        ...customStyle
      }}
    >
      {/* Logo Graphic Container */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}>
        {renderLogoGraphic()}
        {/* Fallback icon (hidden by default, shown if image fails) */}
        {logoConfig.image.useImage && (
          <IconComponent 
            sx={{ 
              fontSize: config.iconSize, 
              color: colors.iconColor,
              display: 'none' // Hidden by default
            }} 
          />
        )}
      </Box>

      {/* Text Content */}
      <Box>
        <Typography 
          variant={config.titleVariant} 
          component="span" 
          sx={{ 
            ...colors.titleStyle, 
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          {brandName}
        </Typography>
        
        {showSubtitle && brandSubtitle && (
          <Typography 
            sx={{ 
              fontSize: config.subtitleSize, 
              color: colors.subtitleColor, 
              fontWeight: 'semibold', 
              letterSpacing: '0.1em',
              display: 'block',
              lineHeight: 1
            }}
          >
            {brandSubtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );

  // Return clickable or non-clickable version
  return clickable ? (
    <Box 
      onClick={onClick} 
      role="button" 
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {LogoContent}
    </Box>
  ) : (
    LogoContent
  );
};

export default Logo;