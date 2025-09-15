// frontend/src/config/logoConfig.js
// This file contains all logo-related configurations
// Change these values to update the logo across the entire application

export const logoConfig = {
  // Company/Brand Information
  brand: {
    name: "Moto-Care",
 
    tagline: "Professional Vehicle Care"
  },

  // Image/Icon Settings
  image: {
    // Set to true if you want to use an image instead of icon
    useImage: false,
    // Path to your logo image (when useImage is true)
    imagePath: "/assets/images/logo.png",
    // Alt text for the image
    imageAlt: "Moto-Care Logo",
    // Fallback icon component name (when useImage is false)
    iconName: "DirectionsCar" // You can change this to any Material-UI icon name
  },

  // Default Settings
  defaults: {
    size: 'medium',
    showSubtitle: true,
    variant: 'default'
  },

  // Colors and Styling
  styling: {
    // You can add custom color schemes here
    customVariants: {
      accent: {
        iconColor: 'secondary.main',
        titleColor: 'secondary.main',
        subtitleColor: 'secondary.light'
      },
      success: {
        iconColor: 'success.main',
        titleColor: 'success.main',
        subtitleColor: 'success.light'
      }
    }
  }
};

// Icon mapping - add more icons as needed
export const iconMapping = {
  DirectionsCar: 'DirectionsCar',
  Build: 'Build',
  Settings: 'Settings',
  Speed: 'Speed',
  LocalCarWash: 'LocalCarWash',
  Garage: 'Garage'
};

// Helper function to get logo configuration
export const getLogoConfig = () => logoConfig;

// Helper function to update brand name globally
export const updateBrandName = (newName, newSubtitle) => {
  logoConfig.brand.name = newName;
  if (newSubtitle) {
    logoConfig.brand.subtitle = newSubtitle;
  }
};

// Helper function to switch to image logo
export const enableImageLogo = (imagePath, altText = "Company Logo") => {
  logoConfig.image.useImage = true;
  logoConfig.image.imagePath = imagePath;
  logoConfig.image.imageAlt = altText;
};

// Helper function to switch to icon logo
export const enableIconLogo = (iconName = "DirectionsCar") => {
  logoConfig.image.useImage = false;
  logoConfig.image.iconName = iconName;
};