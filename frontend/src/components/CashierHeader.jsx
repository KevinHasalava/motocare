import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
  Chip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Receipt as InvoiceIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  AddTask as AddTaskIcon,
  Settings as SettingsIcon,
  Engineering as EngineeringIcon,
  Receipt as ReceiptIcon,
  KeyboardArrowDown,
  Assignment,
  VerifiedUser,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from "./Landing_Page/Logo";

const CashierHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [paymentsAnchor, setPaymentsAnchor] = useState(null);
  const [jobsAnchor, setJobsAnchor] = useState(null);

  // Load user on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePaymentsClick = (event) => {
    setPaymentsAnchor(event.currentTarget);
  };

  const handleJobsClick = (event) => {
    setJobsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setPaymentsAnchor(null);
    setJobsAnchor(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  // Reusable nav button style
  const navButtonStyle = {
    mx: 0.5,
    px: 2.5,
    py: 1,
    borderRadius: 2,
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.95rem",
    fontWeight: 600,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "white",
      background: "rgba(99, 102, 241, 0.1)",
      transform: "translateY(-2px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: "2px",
      background: "linear-gradient(90deg, #6366f1, #a855f7)",
      transition: "width 0.3s ease",
    },
    "&:hover::before": {
      width: "80%",
    },
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
        
        {/* Left: Logo + Title */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <Logo size="medium" variant="default" clickable />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/cashier-dashboard")}
          >
            Cashier Portal
          </Typography>
        </Stack>

        {/* Center: Simplified Cashier Navigation (desktop only) */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {/* Dashboard */}
          <Button 
            startIcon={<DashboardIcon />} 
            onClick={() => navigate("/cashier-dashboard")} 
            sx={navButtonStyle}
          >
            Dashboard
          </Button>

          {/* Payments Dropdown */}
          <Button 
            endIcon={<KeyboardArrowDown />}
            onClick={handlePaymentsClick}
            sx={navButtonStyle}
          >
            Payments
          </Button>
          <Menu
            anchorEl={paymentsAnchor}
            open={Boolean(paymentsAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0e1a 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/cashier")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><PaymentIcon sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText>Process Payments</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/payment-history")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><HistoryIcon sx={{ color: '#3b82f6' }} /></ListItemIcon>
              <ListItemText>Payment History</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/cashier/slip-verification")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><VerifiedUser sx={{ color: '#f59e0b' }} /></ListItemIcon>
              <ListItemText>Slip Verification</ListItemText>
            </MenuItem>
          </Menu>

          {/* Jobs Dropdown */}
          <Button 
            endIcon={<KeyboardArrowDown />}
            onClick={handleJobsClick}
            sx={navButtonStyle}
          >
            Jobs
          </Button>
          <Menu
            anchorEl={jobsAnchor}
            open={Boolean(jobsAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0e1a 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/walkinjob")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><AddTaskIcon sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText>Create Walk-in Job</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/jobs")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><Assignment sx={{ color: '#6366f1' }} /></ListItemIcon>
              <ListItemText>View All Jobs</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>

        {/* Right: Profile Chip + Logout */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                    color: "white !important",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/cashier/profile")} 
              sx={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "white",
                fontWeight: 600,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(245, 158, 11, 0.2)",
                },
                "& .MuiChip-avatar": {
                  color: "white",
                },
              }}
            />
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#ef4444",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.2)",
                  transform: "rotate(180deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              ml: 3,
              px: 3,
              py: 1,
              borderRadius: 2,
              borderColor: "rgba(99, 102, 241, 0.5)",
              color: "#6366f1",
              fontWeight: 600,
              background: "rgba(99, 102, 241, 0.05)",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99, 102, 241, 0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CashierHeader;