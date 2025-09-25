import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem,
  ListItemButton, ListItemText, Box, Container, Stack
} from '@mui/material';
import {
  Event as CalendarIcon, Menu as MenuIcon,
  Login as LoginIcon, AccountCircle as ProfileIcon, Logout as LogoutIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from './Landing_Page/Logo'; // Fixed import path (assumes Logo.jsx is in components/)

const Header = ({ navItems, onBookNowClick, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!savedUser;

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
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/Login');
    setIsMenuOpen(false);
  };

  const handleRegisterClick = () => {
    navigate('/Register');
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'background.default', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleNavClick(item.toLowerCase())}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        {isLoggedIn && savedUser.userType === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/admin/dashboard'); setIsMenuOpen(false); }}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        )}
        {isLoggedIn ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLoginClick}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRegisterClick}>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
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
            <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />

            <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.light', backgroundColor: 'transparent' }
                  }}
                >
                  {item}
                </Button>
              ))}
              {isLoggedIn && savedUser.userType === 'admin' && (
                <Button
                  onClick={() => navigate('/admin/dashboard')}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.light', backgroundColor: 'transparent' }
                  }}
                >
                  Dashboard
                </Button>
              )}
              {isLoggedIn ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton
                    onClick={() => navigate('/profile')}
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
                    {savedUser?.name || 'User'}
                  </Typography>
                  <Button
                    onClick={handleLogoutClick}
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
                <>
                  <Button onClick={handleLoginClick} variant="outlined" startIcon={<LoginIcon />}>
                    Login
                  </Button>
                  <Button onClick={handleRegisterClick} variant="outlined" startIcon={<RegisterIcon />}>
                    Register
                  </Button>
                </>
              )}
              <Button onClick={onBookNowClick} variant="contained" startIcon={<CalendarIcon />}>
                Book Now
              </Button>
            </Stack>

            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
