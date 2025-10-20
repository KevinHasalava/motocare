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
  People,
  BookOnline,
  Assignment,
  Inventory,
  Payment,
  Build,
  Menu as MenuIcon,
  KeyboardArrowDown,
  DirectionsCar,
  MiscellaneousServices,
  LocalShipping,
  Store,
  Assessment,
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

  // ✅ Reusable nav button style (same hover effect as public header)
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
        
        {/* ✅ Left: Logo + Title */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <Logo size="medium" variant="default" clickable />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </Typography>
        </Stack>

        {/* ✅ Center: Simplified Nav (desktop only) */}
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
                background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0e1a 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin-users")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><People sx={{ color: '#6366f1' }} /></ListItemIcon>
              <ListItemText>Users</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/bookings")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><BookOnline sx={{ color: '#8b5cf6' }} /></ListItemIcon>
              <ListItemText>Bookings</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/jobs")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><Assignment sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText>Jobs</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin/vehicles")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><DirectionsCar sx={{ color: '#3b82f6' }} /></ListItemIcon>
              <ListItemText>Vehicles</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/admin-service")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><MiscellaneousServices sx={{ color: '#f59e0b' }} /></ListItemIcon>
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
                background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0e1a 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick("/inventory")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><Inventory sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText>Items</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/stock")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><LocalShipping sx={{ color: '#3b82f6' }} /></ListItemIcon>
              <ListItemText>Stock Movement</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick("/suppliers")}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { 
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'white'
                }
              }}
            >
              <ListItemIcon><Store sx={{ color: '#f59e0b' }} /></ListItemIcon>
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

        {/* ✅ Right: Profile Chip + Logout */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    color: "white !important",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/profile")} 
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "white",
                fontWeight: 600,
                px: 1,
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

        {/* ✅ Mobile Hamburger */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, ml: 1, color: "white" }}
          onClick={() => navigate("/admin-menu")}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;