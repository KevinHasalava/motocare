// frontend/src/config/logoConfig.js
// Fixed version – 'tagline' → 'subtitle' to match Logo.jsx usage

export const logoConfig = {
  // Company/Brand Information
  brand: {
    name: "Moto-Care",
    subtitle: "Professional Vehicle Care" // ✅ renamed from tagline → subtitle
  },

  // Image/Icon Settings
  image: {
    useImage: false,
    imagePath: "/assets/images/logo.png",
    imageAlt: "Moto-Care Logo",
    iconName: "DirectionsCar"
  },

  // Default Settings
  defaults: {
    size: "medium",
    showSubtitle: true,
    variant: "default"
  },

  // Colors and Styling
  styling: {
    // Provide custom variants using titleStyle directly
    customVariants: {
      accent: {
        iconColor: "secondary.main",
        titleStyle: { color: "secondary.main" },  // ✅ now uses titleStyle instead of titleColor
        subtitleColor: "secondary.light"
      },
      success: {
        iconColor: "success.main",
        titleStyle: { color: "success.main" },    // ✅ fixed
        subtitleColor: "success.light"
      }
    }
  }
};

// Icon mapping - add more icons as needed
export const iconMapping = {
  DirectionsCar: "DirectionsCar",
  Build: "Build",
  Settings: "Settings",
  Speed: "Speed",
  LocalCarWash: "LocalCarWash",
  Garage: "Garage"
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
