// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Box, Container, Stack
} from '@mui/material';
import {
  Event as CalendarIcon, Menu as MenuIcon, DirectionsCar as CarIcon
} from '@mui/icons-material';
import { gradientText } from '../utils/theme';

const Header = ({ navItems, onBookNowClick, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsMenuOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, p: 2, backgroundColor: 'background.default', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton href={`#${item.toLowerCase()}`}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" component="h1" sx={{ ...gradientText, fontWeight: 'bold' }}>
                  Moto-Care
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  color: 'primary.light', 
                  fontWeight: 'semibold', 
                  letterSpacing: '0.1em' 
                }}>
                  PRO
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Navigation */}
            <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
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