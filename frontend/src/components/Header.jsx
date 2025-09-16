// frontend/src/components/Header.jsx

import React, { useEffect, useState } from 'react';
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

const Header = ({ navItems = [], onBookNowClick, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ handle login user
  const navigate = useNavigate();

  // When mount → read localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')) return;
    setIsMenuOpen(open);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNavClick = (section) => {
    navigate(`/home#${section}`);
  };

  // Drawer content for mobile
  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />
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

      {user ? (
        <>
          <Box sx={{ p: 2, borderTop: '1px solid rgba(51, 65, 85, 0.5)', mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ProfileIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" color="text.primary">
                {user.name}
              </Typography>
            </Stack>
          </Box>
          <Button variant="contained" fullWidth startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      )}

      <Button

        variant="contained"
        fullWidth
        startIcon={<CalendarIcon />}
        onClick={() => navigate("/booking")}
        sx={{ mt: 2 }}
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
          borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
            <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />

            {/* Desktop Nav Items */}
            <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button key={item} onClick={() => handleNavClick(item.toLowerCase())}>
                  {item}
                </Button>
              ))}

              {user ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <ProfileIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.name}
                  </Typography>
                  <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutIcon />}>
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Button onClick={() => navigate("/login")} variant="outlined" startIcon={<LoginIcon />}>
                  Login
                </Button>
              )}

              <Button
                onClick={() => navigate("/booking")}   // 👉 always go to /booking
                variant="contained"
                startIcon={<CalendarIcon />}
              >
                Book Now
              </Button>
            </Stack>

            {/* Mobile Drawer Button */}
            <IconButton color="inherit" onClick={toggleDrawer(true)} sx={{ display: { md: 'none' } }}>
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