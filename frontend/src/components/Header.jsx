// frontend/src/components/Header.jsx

import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem,
  ListItemButton, ListItemText, Box, Container, Stack, Avatar, Chip, Fade, Zoom,
  Menu, MenuItem, Divider, CircularProgress, Tooltip
} from '@mui/material';
import {
  Event as CalendarIcon, Menu as MenuIcon, Close as CloseIcon,
  Login as LoginIcon, AccountCircle as ProfileIcon, Logout as LogoutIcon,
  Home as HomeIcon, DirectionsCar as CarIcon, Build as ServiceIcon,
  AutoAwesome as SparkleIcon, ArrowForward as ArrowIcon, 
  Dashboard as DashboardIcon, ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon, Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from './Landing_Page/Logo';
import { getMyVehicles } from '../api/vehicleService';

const Header = ({ navItems = [], onBookNowClick, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehicleMenuAnchor, setVehicleMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!savedUser;

  const isAdmin = user?.userType === "admin";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When mount → read localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Fetch vehicles if user is a customer
      if (userData.userType === 'customer') {
        fetchUserVehicles();
      }
    }
  }, []);

  // Fetch user vehicles
  const fetchUserVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const response = await getMyVehicles();
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Handle role-based navigation
  const handleRoleBasedNavigation = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userType = user.userType || 'customer'; // Fallback to customer
    switch (userType) {
      case 'mechanic':
        navigate("/mechanic-portal");
        break;
      case 'admin':
        navigate("/admin-job-view");
        break;
      case 'customer':
        navigate("/profile");
        break;
      default:
        navigate("/profile");
    }
  };

  // Get role-specific dashboard text
  const getRoleDashboardText = () => {
    if (!user) return "Login";
    
    const userType = user.userType || 'customer'; // Fallback to customer
    switch (userType) {
      case 'mechanic':
        return "Mechanic Portal";
      case 'admin':
        return "Admin Portal";
      case 'customer':
        return "My Profile";
      default:
        return "Dashboard";
    }
  };

  // Vehicle menu handlers
  const handleVehicleMenuOpen = (event) => {
    setVehicleMenuAnchor(event.currentTarget);
  };

  const handleVehicleMenuClose = () => {
    setVehicleMenuAnchor(null);
  };

  const handleVehicleSelect = (vehicleId) => {
    navigate(`/VehiclePage?selected=${vehicleId}`);
    handleVehicleMenuClose();
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

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
    if (section === 'vehicles' && user?.userType === 'customer') {
      // For customers, navigate to VehiclePage
      navigate("/VehiclePage");
    } else if (section === 'services') {
      if (user?.userType === 'admin' || user?.userType === 'mechanic') {
        // For admin/mechanic, navigate to admin ServicesPage
        navigate("/admin-service");
      } else {
        // For customers and non-logged users, navigate to customer services page
        navigate("/services");
      }
    } else {
      // For other cases, navigate to landing page sections
      navigate(`/home#${section}`);
    }
  };

  // Get nav icon based on item name
  const getNavIcon = (item) => {
    const icons = {
      'home': <HomeIcon sx={{ fontSize: 20 }} />,
      'services': <ServiceIcon sx={{ fontSize: 20 }} />,
      'vehicles': <CarIcon sx={{ fontSize: 20 }} />,
    };
    return icons[item.toLowerCase()] || null;
  };

  // Drawer content for mobile
  const drawerContent = (
    <Box 
      sx={{ 
        width: 320, 
        height: '100%',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #1a1f2e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />
          <IconButton 
            onClick={toggleDrawer(false)}
            sx={{ 
              color: 'white',
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Navigation Items */}
      <List sx={{ p: 2 }}>
        {/* ✅ Admin Dashboard link (only visible for admins) */}
{isAdmin && (
  <Fade in timeout={200}>
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemButton 
        onClick={() => { navigate('/admin-dashboard'); setIsMenuOpen(false); }}
        sx={{
          borderRadius: 2,
          py: 1.5,
          px: 2,
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 159, 64, 0.1) 100%)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 159, 64, 0.2) 100%)',
            borderColor: 'rgba(255, 107, 107, 0.5)',
            transform: 'translateX(8px)',
          }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <DashboardIcon sx={{ fontSize: 20, color: '#ff6b6b' }} />
          <ListItemText 
            primary="Admin Dashboard" 
            sx={{ 
              '& .MuiListItemText-primary': { 
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem'
              } 
            }} 
          />
        </Stack>
      </ListItemButton>
    </ListItem>
  </Fade>
)}
        {navItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => { handleNavClick(item.toLowerCase()); setIsMenuOpen(false); }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    transform: 'translateX(8px)',
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {getNavIcon(item)}
                  <ListItemText 
                    primary={item} 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem'
                      } 
                    }} 
                  />
                </Stack>
              </ListItemButton>
            </ListItem>
          </Fade>
        ))}
      </List>

      {/* User Section */}
      <Box sx={{ p: 3, mt: 'auto' }}>
        {user ? (
          <Fade in>
            <Box>
              <Box 
                sx={{ 
                  p: 2.5, 
                  mb: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      width: 48,
                      height: 48
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Chip 
                      label="Logged In" 
                      size="small"
                      sx={{ 
                        mt: 0.5,
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<ProfileIcon />} 
                onClick={() => { handleRoleBasedNavigation(); setIsMenuOpen(false); }}
                sx={{
                  py: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  }
                }}
              >
                {getRoleDashboardText()}
              </Button>

              {/* Vehicles Section for Customers */}
              {user.userType === 'customer' && (
                <Box sx={{ mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={vehiclesLoading ? <CircularProgress size={16} /> : <CarIcon />}
                    onClick={() => { navigate("/VehiclePage"); setIsMenuOpen(false); }}
                    sx={{
                      py: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(34, 197, 94, 0.2)',
                      }
                    }}
                  >
                    My Vehicles {vehicles.length > 0 && `(${vehicles.length})`}
                  </Button>
                  
                  {vehicles.length > 0 && (
                    <Box sx={{ pl: 2, maxHeight: 150, overflowY: 'auto' }}>
                      {vehicles.slice(0, 3).map((vehicle) => (
                        <Button
                          key={vehicle._id}
                          size="small"
                          fullWidth
                          onClick={() => { handleVehicleSelect(vehicle._id); setIsMenuOpen(false); }}
                          sx={{
                            py: 0.5,
                            mb: 0.5,
                            borderRadius: 1,
                            background: 'rgba(255, 255, 255, 0.02)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.75rem',
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            '&:hover': {
                              background: 'rgba(34, 197, 94, 0.1)',
                              color: '#22c55e',
                            }
                          }}
                        >
                          {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                        </Button>
                      ))}
                      {vehicles.length > 3 && (
                        <Typography 
                          variant="caption" 
                          sx={{ color: 'rgba(255, 255, 255, 0.5)', pl: 1 }}
                        >
                          +{vehicles.length - 3} more vehicles
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
              
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.2)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Fade>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: '#6366f1',
              background: 'rgba(99, 102, 241, 0.05)',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#6366f1',
                background: 'rgba(99, 102, 241, 0.1)',
              }
            }}
          >
            Login to Continue
          </Button>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<CalendarIcon />}
          endIcon={<SparkleIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate("/booking")}
          sx={{ 
            mt: 2,
            py: 1.8,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled 
            ? 'rgba(10, 14, 26, 0.95)' 
            : 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: scrolled 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)',
            opacity: scrolled ? 0.5 : 0,
            transition: 'opacity 0.3s ease',
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
            <Zoom in timeout={500}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Logo size="medium" variant="default" clickable={true} onClick={handleLogoClick} />
              </Box>
            </Zoom>

            {/* Desktop Nav Items */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {/* ✅ Admin Dashboard button (desktop) */}
              {isAdmin && (
                <Fade in timeout={200}>
                  <Button 
                    onClick={() => navigate('/admin-dashboard')}
                    startIcon={<DashboardIcon />}
                    sx={{
                      mx: 0.5,
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      border: 'none',
                      '&:hover': {transform: 'translateY(-2px)',
                      boxShadow: '0 6px 18px rgba(99, 102, 241, 0.4)', }
                    }}
                  >
                    Admin Dashboard
                  </Button>
                </Fade>
              )}
              {navItems.map((item, index) => (
                <Fade in timeout={300 + index * 100} key={item}>
                  <Button 
                    onClick={() => handleNavClick(item.toLowerCase())}
                    startIcon={getNavIcon(item)}
                    sx={{
                      mx: 0.5,
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'white',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::before': {
                        width: '80%',
                      }
                    }}
                  >
                    {item}
                  </Button>
                </Fade>
              ))}

              {/* User Section */}
              {user ? (
                <Fade in timeout={600}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 3 }}>
                    {/* Vehicle Button for Customers */}
                    {user.userType === 'customer' && (
                      <Tooltip title={`My Vehicles (${vehicles.length})`}>
                        <Button
                          onClick={handleVehicleMenuOpen}
                          startIcon={vehiclesLoading ? <CircularProgress size={16} /> : <CarIcon />}
                          endIcon={<ExpandMoreIcon />}
                          sx={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#22c55e',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                              background: 'rgba(34, 197, 94, 0.2)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {vehicles.length} Vehicle{vehicles.length !== 1 ? 's' : ''}
                        </Button>
                      </Tooltip>
                    )}

                    {/* User Profile Chip */}
                    <Chip
                      avatar={
                        <Avatar 
                          sx={{ 
                            background: user.userType === 'customer' 
                              ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                              : user.userType === 'mechanic'
                              ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                              : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            color: 'white !important'
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      label={`${user.name} • ${user.userType || 'user'}`}
                      onClick={handleProfileMenuOpen}
                      sx={{
                        background: user.userType === 'customer'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : user.userType === 'mechanic'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(139, 92, 246, 0.1)',
                        border: user.userType === 'customer'
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : user.userType === 'mechanic'
                          ? '1px solid rgba(245, 158, 11, 0.3)'
                          : '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        fontWeight: 600,
                        px: 1,
                        cursor: 'pointer',
                        '& .MuiChip-avatar': {
                          color: 'white',
                        },
                        '&:hover': {
                          background: user.userType === 'customer'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : user.userType === 'mechanic'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(139, 92, 246, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />

                    <IconButton 
                      onClick={handleLogout}
                      sx={{
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.2)',
                          transform: 'rotate(180deg)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Stack>
                </Fade>
              ) : (
                <Fade in timeout={600}>
                  <Button 
                    onClick={() => navigate("/login")} 
                    variant="outlined" 
                    startIcon={<LoginIcon />}
                    sx={{
                      ml: 3,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      color: '#6366f1',
                      fontWeight: 600,
                      background: 'rgba(99, 102, 241, 0.05)',
                      '&:hover': {
                        borderColor: '#6366f1',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Login
                  </Button>
                </Fade>
              )}

              <Fade in timeout={700}>
                <Box sx={{ ml: 2, position: 'relative' }}>
                  {/* Glow effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -10,
                      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      animation: 'pulse 3s ease-in-out infinite',
                    }}
                  />
                  <Button
                    onClick={() => navigate("/booking")}
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    endIcon={<ArrowIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      position: 'relative',
                      px: 3.5,
                      py: 1.2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                        '& .MuiButton-endIcon': {
                          transform: 'translateX(4px)',
                        }
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Fade>
            </Stack>

            {/* Mobile Menu Button */}
            <Zoom in timeout={500}>
              <IconButton 
                color="inherit" 
                onClick={toggleDrawer(true)} 
                sx={{ 
                  display: { md: 'none' },
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Zoom>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer 
        anchor="right" 
        open={isMenuOpen} 
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Vehicle Menu */}
      <Menu
        anchorEl={vehicleMenuAnchor}
        open={Boolean(vehicleMenuAnchor)}
        onClose={handleVehicleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 2,
            mt: 1,
            minWidth: 280,
            maxHeight: 400,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600, mb: 1 }}>
            My Vehicles
          </Typography>
          <Divider sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', mb: 1 }} />
        </Box>
        
        {vehiclesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ color: '#22c55e' }} />
          </Box>
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <MenuItem
              key={vehicle._id}
              onClick={() => handleVehicleSelect(vehicle._id)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                color: 'white',
                '&:hover': {
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                }
              }}
            >
              <Stack>
                <Typography variant="body2" fontWeight={600}>
                  {vehicle.make} {vehicle.model}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {vehicle.licensePlate} • {vehicle.year}
                </Typography>
              </Stack>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <Typography variant="body2">No vehicles found</Typography>
          </MenuItem>
        )}
        
        <Divider sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', mx: 2, my: 1 }} />
        <MenuItem
          onClick={() => { navigate("/VehiclePage"); handleVehicleMenuClose(); }}
          sx={{
            mx: 1,
            mb: 1,
            borderRadius: 1,
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
            '&:hover': {
              background: 'rgba(34, 197, 94, 0.2)',
            }
          }}
        >
          <CarIcon sx={{ mr: 1 }} />
          Manage All Vehicles
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: user?.userType === 'customer'
              ? '1px solid rgba(16, 185, 129, 0.2)'
              : user?.userType === 'mechanic'
              ? '1px solid rgba(245, 158, 11, 0.2)'
              : '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ 
            color: user?.userType === 'customer' 
              ? '#10b981' 
              : user?.userType === 'mechanic'
              ? '#f59e0b'
              : '#8b5cf6',
            fontWeight: 600, 
            mb: 1 
          }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user?.userType || 'user'} • {user?.email}
          </Typography>
          <Divider sx={{ 
            bgcolor: user?.userType === 'customer'
              ? 'rgba(16, 185, 129, 0.2)'
              : user?.userType === 'mechanic'
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(139, 92, 246, 0.2)',
            mt: 1 
          }} />
        </Box>
        
        <MenuItem
          onClick={() => { handleRoleBasedNavigation(); handleProfileMenuClose(); }}
          sx={{
            mx: 1,
            mb: 0.5,
            borderRadius: 1,
            color: 'white',
            '&:hover': {
              background: user?.userType === 'customer'
                ? 'rgba(16, 185, 129, 0.1)'
                : user?.userType === 'mechanic'
                ? 'rgba(245, 158, 11, 0.1)'
                : 'rgba(139, 92, 246, 0.1)',
              color: user?.userType === 'customer'
                ? '#10b981'
                : user?.userType === 'mechanic'
                ? '#f59e0b'
                : '#8b5cf6',
            }
          }}
        >
          {user?.userType === 'customer' ? (
            <ProfileIcon sx={{ mr: 1 }} />
          ) : (
            <DashboardIcon sx={{ mr: 1 }} />
          )}
          {getRoleDashboardText()}
        </MenuItem>

        {user?.userType === 'customer' && (
          <MenuItem
            onClick={() => { navigate("/my-bookings"); handleProfileMenuClose(); }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              color: 'white',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
              }
            }}
          >
            <CalendarIcon sx={{ mr: 1 }} />
            My Bookings
          </MenuItem>
        )}

        {user?.userType === 'customer' && (
          <MenuItem
            onClick={() => { navigate("/my-payments"); handleProfileMenuClose(); }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              color: 'white',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
              }
            }}
          >
            <PaymentIcon sx={{ mr: 1 }} />
            Payments
          </MenuItem>
        )}

        <MenuItem
          onClick={() => { navigate("/profile"); handleProfileMenuClose(); }}
          sx={{
            mx: 1,
            mb: 1,
            borderRadius: 1,
            color: 'white',
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
            }
          }}
        >
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
      </Menu>

      {/* Add animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default Header;