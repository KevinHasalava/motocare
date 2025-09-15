// frontend/src/components/Header.jsx (Updated to use Logo component and proper navigation)
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Box, Container, Stack
} from '@mui/material';
import {
  Event as CalendarIcon, Menu as MenuIcon,
  Login as LoginIcon, AccountCircle as ProfileIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from './Landing_Page/Logo';

const Header = ({ navItems, onBookNowClick, onLoginClick, onLogoutClick, isLoggedIn, userProfile, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsMenuOpen(open);
  };

  const handleLogoClick = () => {
    if (window.location.pathname !== '/home') {
      navigate('/home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (section) => {
    if (window.location.pathname !== '/home') {
      navigate(`/home#${section}`);
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, p: 2, backgroundColor: 'background.default', height: '100%' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      {/* Logo in Mobile Menu */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <Logo 
          size="medium" 
          variant="default" 
          clickable={true}
          onClick={handleLogoClick}
        />
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => { handleNavClick(item.toLowerCase()); setIsMenuOpen(false); }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Login/Profile Section */}
      {isLoggedIn ? (
        <>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(51, 65, 85, 0.5)', mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ProfileIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" color="text.primary">
                {userProfile?.name || 'User'}
              </Typography>
            </Stack>
          </Box>
          <Button
            variant="contained" 
            fullWidth 
            startIcon={<LogoutIcon />} 
            onClick={onLogoutClick}
            sx={{ 
              mt: 2, 
              py: 1.5, 
              background: `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.dark})` 
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button
          variant="outlined" 
          fullWidth 
          startIcon={<LoginIcon />} 
          onClick={onLoginClick}
          sx={{ 
            mt: 2, 
            py: 1.5,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.light',
              backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }
          }}
        >
          Login
        </Button>
      )}
      
      <Button
        variant="contained" 
        fullWidth 
        startIcon={<CalendarIcon />} 
        onClick={onBookNowClick}
        sx={{ 
          mt: 2, 
          py: 1.5, 
          background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})` 
        }}
      >
        Book Now
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid', 
          borderColor: 'rgba(51, 65, 85, 0.5)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
            
            {/* Logo - Now using the Logo component */}
            <Logo 
              size="medium" 
              variant="default" 
              clickable={true}
              onClick={handleLogoClick}
              customStyle={{ 
                '&:hover': { 
                  transform: 'scale(1.02)' // Subtle hover effect for header
                }
              }}
            />

            {/* Desktop Navigation */}
            <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button 
                  key={item} 
                  onClick={() => handleNavClick(item.toLowerCase())}
                  sx={{
                    color: 'text.secondary', 
                    '&:hover': { color: 'primary.light', backgroundColor: 'transparent' },
                    position: 'relative',
                    '&::after': {
                      content: '""', 
                      position: 'absolute', 
                      width: 0, 
                      height: '2px', 
                      bottom: '-4px', 
                      left: 0,
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': { width: '100%' },
                  }}
                >
                  {item}
                </Button>
              ))}
              
              {/* Auth Section - Desktop */}
              {isLoggedIn ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton
                    onClick={() => console.log('Profile clicked')}
                    sx={{
                      color: 'primary.main',
                      '&:hover': { 
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ProfileIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {userProfile?.name || 'User'}
                  </Typography>
                  <Button
                    onClick={onLogoutClick}
                    variant="outlined"
                    size="small"
                    startIcon={<LogoutIcon />}
                    sx={{
                      borderColor: 'error.main',
                      color: 'error.main',
                      '&:hover': {
                        borderColor: 'error.light',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Button
                  onClick={onLoginClick}
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    px: 3, 
                    py: 1.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': { 
                      borderColor: 'primary.light',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Login
                </Button>
              )}
              
              <Button
                onClick={onBookNowClick} 
                variant="contained" 
                startIcon={<CalendarIcon />}
                sx={{
                  px: 3, 
                  py: 1.5, 
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: 'all 0.3s ease', 
                  '&:hover': { 
                    transform: 'scale(1.05)', 
                    boxShadow: `0 8px 25px ${theme.palette.primary.dark}` 
                  }
                }}
              >
                Book Now
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit" 
              aria-label="open drawer" 
              edge="end" 
              onClick={toggleDrawer(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;
