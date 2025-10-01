import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem,
  Avatar, Divider, Button, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Build as BuildIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Engineering as EngineeringIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../utils/theme';

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const getWelcomeMessage = () => {
    const userType = user?.userType || 'user';
    const name = user?.name || 'User';
    
    switch (userType) {
      case 'admin':
        return `Admin Panel - Welcome, ${name}`;
      case 'mechanic':
        return `Mechanic Portal - Welcome, ${name}`;
      case 'cashier':
        return `Cashier Portal - Welcome, ${name}`;
      default:
        return `Dashboard - Welcome, ${name}`;
    }
  };

  const getNavigationItems = () => {
    const userType = user?.userType;
    
    switch (userType) {
      case 'admin':
        return [
          { label: 'Admin Dashboard', path: '/admin-job-view', icon: <DashboardIcon /> },
          { label: 'Manage Services', path: '/admin-service', icon: <SettingsIcon /> },
          { label: 'Create Walk-in Job', path: '/admin/walkinjob', icon: <BuildIcon /> }
        ];
      case 'mechanic':
        return [
          { label: 'My Jobs', path: '/mechanic-portal', icon: <EngineeringIcon /> }
        ];
      case 'cashier':
        return [
          { label: 'Dashboard', path: '/cashier-dashboard', icon: <DashboardIcon /> },
          { label: 'Process Payments', path: '/cashier', icon: <PaymentIcon /> },
          { label: 'Payment History', path: '/payment-history', icon: <ReceiptIcon /> },
          { label: 'Create Walk-in Job', path: '/admin/walkinjob', icon: <BuildIcon /> }
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Left side - Logo and Welcome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user.userType === 'admin' && <AdminIcon sx={{ color: '#f59e0b', fontSize: '2rem' }} />}
            {user.userType === 'mechanic' && <EngineeringIcon sx={{ color: '#f59e0b', fontSize: '2rem' }} />}
            {user.userType === 'cashier' && <PaymentIcon sx={{ color: '#f59e0b', fontSize: '2rem' }} />}
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              MotoCore
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#374151', height: 30 }} />
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#d1d5db',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              display: { xs: 'none', md: 'block' }
            }}
          >
            {getWelcomeMessage()}
          </Typography>
        </Box>

        {/* Center - Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {getNavigationItems().map((item, index) => (
            <Button
              key={index}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                borderColor: '#374151',
                '&:hover': {
                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                  borderColor: '#f59e0b'
                },
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
              variant="outlined"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right side - Profile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* User Type Badge */}
          <Box 
            sx={{ 
              px: 2, 
              py: 0.5, 
              bgcolor: user.userType === 'admin' ? '#dc2626' : user.userType === 'mechanic' ? '#f59e0b' : '#6366f1',
              borderRadius: 2,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}>
              {user.userType}
            </Typography>
          </Box>

          {/* Profile Menu */}
          <IconButton
            onClick={handleClick}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <Avatar sx={{ 
              bgcolor: '#f59e0b', 
              width: 36, 
              height: 36,
              fontSize: '1rem',
              fontWeight: 600
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: 'white',
                border: '1px solid #374151',
                minWidth: 200,
                mt: 1
              }
            }}
          >
            {/* User Info */}
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #374151' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                {user.email}
              </Typography>
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {getNavigationItems().map((item, index) => (
                <MenuItem key={index} onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
              <Divider sx={{ bgcolor: '#374151', my: 1 }} />
            </Box>

            {/* Profile Menu Items */}
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <ListItemIcon sx={{ color: 'white' }}>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            
            <Divider sx={{ bgcolor: '#374151' }} />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#ef4444' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#ef4444' }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;