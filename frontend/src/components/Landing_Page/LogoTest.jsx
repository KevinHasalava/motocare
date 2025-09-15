// frontend/src/components/LogoTest.jsx
import React, { useState } from 'react';
import { 
  ThemeProvider, CssBaseline, Box, Container, Typography, Grid, Paper, 
  Button, Stack, FormControl, InputLabel, Select, MenuItem, Switch, 
  FormControlLabel, TextField
} from '@mui/material';
import Logo from './Logo';
import { theme } from '../../utils/theme';
import { logoConfig, enableImageLogo, enableIconLogo, updateBrandName } from '../../config/logoConfig';

const LogoTest = () => {
  const [logoSize, setLogoSize] = useState('medium');
  const [logoVariant, setLogoVariant] = useState('default');
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [useImage, setUseImage] = useState(logoConfig.image.useImage);
  const [brandName, setBrandName] = useState(logoConfig.brand.name);
  const [brandSubtitle, setBrandSubtitle] = useState(logoConfig.brand.subtitle);

  const handleUpdateBrand = () => {
    updateBrandName(brandName, brandSubtitle);
    // Force re-render by updating a state
    setLogoSize(prev => prev);
  };

  const handleImageToggle = (event) => {
    const checked = event.target.checked;
    setUseImage(checked);
    if (checked) {
      enableImageLogo('/assets/images/logo.png', 'Moto-Care Logo');
    } else {
      enableIconLogo('DirectionsCar');
    }
  };

  const handleLogoClick = () => {
    alert('Logo clicked!');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'white' }}>
            🎨 Logo Component Test Lab
          </Typography>

          <Grid container spacing={4}>
            {/* Controls Panel */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(30, 41, 59, 0.8)', height: 'fit-content' }}>
                <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
                  Logo Controls
                </Typography>

                <Stack spacing={3}>
                  {/* Brand Name */}
                  <TextField
                    label="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                  />

                  {/* Brand Subtitle */}
                  <TextField
                    label="Brand Subtitle"
                    value={brandSubtitle}
                    onChange={(e) => setBrandSubtitle(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleUpdateBrand}
                    sx={{ background: theme.palette.primary.main }}
                  >
                    Update Brand
                  </Button>

                  {/* Size Control */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'text.secondary' }}>Size</InputLabel>
                    <Select
                      value={logoSize}
                      label="Size"
                      onChange={(e) => setLogoSize(e.target.value)}
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                      <MenuItem value="xlarge">Extra Large</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Variant Control */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'text.secondary' }}>Variant</InputLabel>
                    <Select
                      value={logoVariant}
                      label="Variant"
                      onChange={(e) => setLogoVariant(e.target.value)}
                    >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="white">White</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="monochrome">Monochrome</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Show Subtitle Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showSubtitle}
                        onChange={(e) => setShowSubtitle(e.target.checked)}
                      />
                    }
                    label="Show Subtitle"
                    sx={{ color: 'text.secondary' }}
                  />

                  {/* Use Image Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useImage}
                        onChange={handleImageToggle}
                      />
                    }
                    label="Use Image Logo"
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Logo Display Panel */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                <Typography variant="h5" sx={{ mb: 4, color: 'white' }}>
                  Logo Preview
                </Typography>

                {/* Current Configuration Display */}
                <Box sx={{ mb: 4, p: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
                  <Logo
                    size={logoSize}
                    variant={logoVariant}
                    showSubtitle={showSubtitle}
                    clickable={true}
                    onClick={handleLogoClick}
                    overrideBrand={brandName !== logoConfig.brand.name || brandSubtitle !== logoConfig.brand.subtitle ? {
                      name: brandName,
                      subtitle: brandSubtitle
                    } : null}
                  />
                </Box>

                {/* Different Background Tests */}
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Background Tests:
                </Typography>

                <Grid container spacing={2}>
                  {/* Dark Background */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: '#1a1a1a', 
                      borderRadius: 1, 
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                        Dark Background
                      </Typography>
                      <Logo
                        size={logoSize}
                        variant="white"
                        showSubtitle={showSubtitle}
                        overrideBrand={brandName !== logoConfig.brand.name || brandSubtitle !== logoConfig.brand.subtitle ? {
                          name: brandName,
                          subtitle: brandSubtitle
                        } : null}
                      />
                    </Box>
                  </Grid>

                  {/* Light Background */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: 1, 
                      textAlign: 'center',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                        Light Background
                      </Typography>
                      <Logo
                        size={logoSize}
                        variant="dark"
                        showSubtitle={showSubtitle}
                        overrideBrand={brandName !== logoConfig.brand.name || brandSubtitle !== logoConfig.brand.subtitle ? {
                          name: brandName,
                          subtitle: brandSubtitle
                        } : null}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Size Comparison */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: 'white' }}>
                  Size Comparison:
                </Typography>

                <Stack spacing={3} alignItems="flex-start">
                  {['small', 'medium', 'large', 'xlarge'].map((size) => (
                    <Box key={size} sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(0,0,0,0.2)', 
                      borderRadius: 1,
                      border: logoSize === size ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Typography>
                      <Logo
                        size={size}
                        variant={logoVariant}
                        showSubtitle={showSubtitle}
                        overrideBrand={brandName !== logoConfig.brand.name || brandSubtitle !== logoConfig.brand.subtitle ? {
                          name: brandName,
                          subtitle: brandSubtitle
                        } : null}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Usage Instructions */}
          <Paper sx={{ mt: 4, p: 4, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
              💡 How to Change Logo Globally
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Method 1: Using Config File
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Edit <code style={{ color: '#60a5fa' }}>frontend/src/config/logoConfig.js</code>:
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0,0,0,0.4)', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#e5e7eb',
                  overflow: 'auto'
                }}>
                  <div>// Change brand name</div>
                  <div>brand: &#123;</div>
                  <div>&nbsp;&nbsp;name: "Your-Brand",</div>
                  <div>&nbsp;&nbsp;subtitle: "Pro"</div>
                  <div>&#125;,</div>
                  <br />
                  <div>// Switch to image logo</div>
                  <div>image: &#123;</div>
                  <div>&nbsp;&nbsp;useImage: true,</div>
                  <div>&nbsp;&nbsp;imagePath: "/assets/logo.png"</div>
                  <div>&#125;</div>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Method 2: Using Helper Functions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Use these functions anywhere in your app:
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0,0,0,0.4)', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#e5e7eb',
                  overflow: 'auto'
                }}>
                  <div>import &#123; updateBrandName, enableImageLogo &#125; from './config/logoConfig';</div>
                  <br />
                  <div>// Update brand</div>
                  <div>updateBrandName('New Brand', 'Pro');</div>
                  <br />
                  <div>// Switch to image</div>
                  <div>enableImageLogo('/path/to/logo.png');</div>
                </Box>
              </Grid>
            </Grid>
          </Paper>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LogoTest;