// src/components/InventoryCom/StatsCards.jsx
import React from "react";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import LowPriorityIcon from '@mui/icons-material/LowPriority'; // For low stock
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // For total value

const StatsCards = ({ totalItems, lowStockCount, totalInventoryValue }) => {
  const cardSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 3,
    boxShadow: 3,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  };

  const iconSx = {
    fontSize: 40,
    color: 'primary.main',
    opacity: 0.8,
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={cardSx}>
            <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InventoryIcon sx={{ mr: 1, fontSize: 18 }} /> Total Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={cardSx}>
            <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold', color: 'error.main' }}>
                {lowStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LowPriorityIcon sx={{ mr: 1, fontSize: 18, color: 'error.main' }} /> Low Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={cardSx}>
            <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                ${totalInventoryValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonetizationOnIcon sx={{ mr: 1, fontSize: 18 }} /> Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

StatsCards.propTypes = {
  totalItems: PropTypes.number.isRequired,
  lowStockCount: PropTypes.number.isRequired,
  totalInventoryValue: PropTypes.number.isRequired,
};

export default StatsCards;