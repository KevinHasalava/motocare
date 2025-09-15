// frontend/src/components/vehicle/VehicleList.jsx (Redesigned)
import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack, Tooltip
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, DirectionsCar as CarIcon,
  SearchOff as NoResultsIcon
} from '@mui/icons-material';
import { deleteVehicle } from '../../api/vehicleService';
import { gradientText } from '../../utils/theme';

const VehicleList = ({ vehicles, onVehicleDeleted, onEdit }) => {
  const handleDelete = async (id) => {
    // A confirmation dialog from MUI would be a better UX than window.confirm
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      onVehicleDeleted();
    }
  };

  return (
    <Paper sx={{
      maxWidth: 1200,
      mx: 'auto',
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      backdropFilter: 'blur(10px)',
      background: 'rgba(30, 41, 59, 0.5)', // From theme.palette.background.paper
      p: { xs: 2, md: 3 },
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <CarIcon sx={{ color: 'primary.light' }}/>
        <Typography variant="h5" component="h2" sx={{...gradientText, fontWeight: 'bold'}}>
          Registered Vehicles
        </Typography>
      </Stack>
      
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="vehicle list">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid rgba(51, 65, 85, 0.5)', fontWeight: 'bold' } }}>
              <TableCell>Owner</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Brand & Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <TableRow
                  key={v._id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' }
                  }}
                >
                  <TableCell component="th" scope="row">{v.ownerName}</TableCell>
                  <TableCell>{v.vehicleNumber}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{`${v.brand} ${v.model}`}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Vehicle">
                      <IconButton onClick={() => onEdit(v)} color="success" sx={{ '&:hover': { transform: 'scale(1.2)' } }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Vehicle">
                      <IconButton onClick={() => handleDelete(v._id)} color="error" sx={{ '&:hover': { transform: 'scale(1.2)' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                    <NoResultsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No Vehicles Found</Typography>
                    <Typography color="text.secondary">Add a vehicle using the form above to get started.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VehicleList;