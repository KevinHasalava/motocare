import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, ButtonGroup,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  createTheme, ThemeProvider, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
// PDF generation now handled by backend API with custom letterhead template
import { getStockMovements, deleteStockMovement } from '../../api/stockApi';
import AddStockInForm from './AddStockInForm';
import AddStockOutForm from './AddStockOutForm';
import AdminHeader from "../../components/AdminHeader";


const StockPage = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openInDialog, setOpenInDialog] = useState(false);
  const [openOutDialog, setOpenOutDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          background: {
            default: '#F8F9FB',
            paper: '#fff',
          },
        },
      }),
    [],
  );

  const fetchStockMovements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getStockMovements();
      setStockMovements(response.data);
    } catch (err) {
      console.error("Failed to fetch stock movements:", err);
      setError('Failed to fetch stock movements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const handleOpenInDialog = () => setOpenInDialog(true);
  const handleCloseInDialog = () => setOpenInDialog(false);
  const handleOpenOutDialog = () => setOpenOutDialog(true);
  const handleCloseOutDialog = () => setOpenOutDialog(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock movement?')) {
      try {
        await deleteStockMovement(id);
        fetchStockMovements();
      } catch (err) {
        console.error("Failed to delete stock movement:", err);
        setError(err.response?.data?.message || 'Failed to delete stock movement.');
      }
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Add date filtering based on dateFilter state
      const now = new Date();
      switch (dateFilter) {
        case 'today':
          queryParams.append('startDate', now.toISOString().split('T')[0]);
          queryParams.append('endDate', now.toISOString().split('T')[0]);
          break;
        case 'thisWeek':
          const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
          queryParams.append('startDate', startOfWeek.toISOString().split('T')[0]);
          queryParams.append('endDate', endOfWeek.toISOString().split('T')[0]);
          break;
        case 'thisMonth':
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          queryParams.append('startDate', startOfMonth.toISOString().split('T')[0]);
          queryParams.append('endDate', endOfMonth.toISOString().split('T')[0]);
          break;
        // 'all' case - no date filtering
      }
      
      // Call backend API to generate PDF with template
      const response = await fetch(`/api/stock/download-report-pdf?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `StockMovementReport_${dateFilter}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const columns = [
    { id: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { id: 'partId', label: 'Part ID', render: (row) => row.partId || '-' },
    { id: 'name', label: 'Item Name', render: (row) => row.inventory?.name || '-' },
    { id: 'type', label: 'Type' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'buyingPrice', label: 'Buying Price', render: (row) => `LKR ${row.buyingPrice ? row.buyingPrice.toFixed(2) : '0.00'}` },
    { id: 'salesPrice', label: 'Sales Price', render: (row) => `LKR ${row.salesPrice ? row.salesPrice.toFixed(2) : '0.00'}` },
    { id: 'supplier', label: 'Supplier', render: (row) => row.supplier?.name || '-' },
    { id: 'jobId', label: 'Job ID', render: (row) => row.jobId || '-' },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <Button size="small" color="error" onClick={() => handleDelete(row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const filteredMovements = stockMovements.filter(m => {
    const searchMatch = (m.inventory?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.partId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.jobId || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!searchMatch) {
      return false;
    }

    const movementDate = new Date(m.date);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return movementDate.toDateString() === now.toDateString();
      case 'thisWeek':
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
        return movementDate >= startOfWeek && movementDate < endOfWeek;
      case 'thisMonth':
        return movementDate.getMonth() === now.getMonth() && movementDate.getFullYear() === now.getFullYear();
      case 'all':
      default:
        return true;
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 10, color: 'text.primary' }}>
        <AdminHeader />
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Stock Movements
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={() => setDateFilter('all')} variant={dateFilter === 'all' ? 'contained' : 'outlined'}>All</Button>
              <Button onClick={() => setDateFilter('today')} variant={dateFilter === 'today' ? 'contained' : 'outlined'}>Today</Button>
              <Button onClick={() => setDateFilter('thisWeek')} variant={dateFilter === 'thisWeek' ? 'contained' : 'outlined'}>This Week</Button>
              <Button onClick={() => setDateFilter('thisMonth')} variant={dateFilter === 'thisMonth' ? 'contained' : 'outlined'}>This Month</Button>
            </ButtonGroup>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenInDialog}
                color='success'
              >
                Add Stock
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenOutDialog}
                color='error'
              >
                Remove Stock
              </Button>
              <Button
                variant="outlined"
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
                onClick={handleGeneratePDF}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate PDF Report'}
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: '12px' }}>
              <Table stickyHeader aria-label="stock movements table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{ 
                          backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.action.hover,
                          fontWeight: 'bold'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMovements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No transactions.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovements.map((row, index) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          backgroundColor: index % 2 === 0 
                            ? (theme.palette.mode === 'light' ? '#fafafa' : theme.palette.background.paper)
                            : (theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.background.default),
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? '#cfd8dc' : '#424242',
                          },
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.id}>
                            {column.render ? column.render(row) : row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <AddStockInForm
            open={openInDialog}
            handleClose={handleCloseInDialog}
            onSave={fetchStockMovements}
          />
          <AddStockOutForm
            open={openOutDialog}
            handleClose={handleCloseOutDialog}
            onSave={fetchStockMovements}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default StockPage;