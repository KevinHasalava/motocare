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
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People,
  BookOnline,
  Assignment,
  Inventory,
  Payment,
  Menu as MenuIcon,
  KeyboardArrowDown,
  DirectionsCar,
  MiscellaneousServices,
  LocalShipping,
  Store,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from "./Landing_Page/Logo"; // ✅ Logo import

const AdminHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [managementAnchor, setManagementAnchor] = useState(null);
  const [inventoryAnchor, setInventoryAnchor] = useState(null);

  // ✅ Load user on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleManagementClick = (event) => {
    setManagementAnchor(event.currentTarget);
  };

  const handleInventoryClick = (event) => {
    setInventoryAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setManagementAnchor(null);
    setInventoryAnchor(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  // Reusable nav button style (Light Premium Automotive Theme)
  const navButtonStyle = {
    mx: 0.5,
    px: 2,
    py: 1,
    borderRadius: 2,
    color: "#374151",
    fontSize: "0.95rem",
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s ease",
    "&:hover": {
      color: "#D32F2F",
      background: "rgba(211, 47, 47, 0.04)",
      transform: "translateY(-1px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: "2px",
      background: "#D32F2F",
      transition: "width 0.25s ease",
    },
    "&:hover::before": {
      width: "80%",
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
        
        {/* Left: Logo + Title */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <Logo size="medium" variant="default" clickable />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: '"Outfit", sans-serif',
              color: "#111827",
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </Typography>
        </Stack>

        {/* Center: Simplified Nav (desktop only) */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {/* Dashboard */}
          <Button 
            startIcon={<DashboardIcon />} 
            onClick={() => navigate("/admin-dashboard")} 
            sx={navButtonStyle}
          >
            Dashboard
          </Button>

          {/* Management Dropdown */}
          <Button 
            endIcon={<KeyboardArrowDown />}
            onClick={handleManagementClick}
            sx={navButtonStyle}
          >
            Management
          </Button>
          <Menu
            anchorEl={managementAnchor}
            open={Boolean(managementAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin-users")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><People sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Users</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/bookings")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><BookOnline sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Bookings</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/jobs")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><Assignment sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Jobs</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/vehicles")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><DirectionsCar sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Vehicles</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin-service")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><MiscellaneousServices sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Services</ListItemText>
            </MenuItem>
          </Menu>

          {/* Inventory Dropdown */}
          <Button 
            endIcon={<KeyboardArrowDown />}
            onClick={handleInventoryClick}
            sx={navButtonStyle}
          >
            Inventory
          </Button>
          <Menu
            anchorEl={inventoryAnchor}
            open={Boolean(inventoryAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/inventory")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><Inventory sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Items</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/stock")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><LocalShipping sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Stock Movement</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/suppliers")}
              sx={{ 
                color: '#1F2937',
                '&:hover': { 
                  background: 'rgba(211, 47, 47, 0.05)',
                  color: '#D32F2F'
                }
              }}
            >
              <ListItemIcon><Store sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Suppliers</ListItemText>
            </MenuItem>
          </Menu>

          {/* Payments */}
          <Button 
            startIcon={<Payment />} 
            onClick={() => navigate("/admin/payments")} 
            sx={navButtonStyle}
          >
            Payments
          </Button>
        </Stack>

        {/* Right: Profile Chip + Logout */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: "#D32F2F",
                    color: "white !important",
                    fontWeight: 700,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/profile")} 
              sx={{
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                fontWeight: 600,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  background: "#FCD34D30",
                },
                "& .MuiChip-avatar": {
                  color: "white",
                },
              }}
            />
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#D32F2F",
                background: "rgba(211, 47, 47, 0.08)",
                border: "1px solid rgba(211, 47, 47, 0.2)",
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.16)",
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
              borderColor: "#D32F2F",
              color: "#D32F2F",
              fontWeight: 600,
              background: "rgba(211, 47, 47, 0.05)",
              "&:hover": {
                borderColor: "#B71C1C",
                background: "#D32F2F",
                color: "white",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Login
          </Button>
        )}

        {/* Mobile Hamburger */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, ml: 1, color: "#111827" }}
          onClick={() => navigate("/admin-menu")}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;