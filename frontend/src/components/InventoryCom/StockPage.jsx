import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, ButtonGroup,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  createTheme, ThemeProvider, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  const [mode, setMode] = useState('light'); // State for dark/light mode

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Palette for light mode
                background: {
                  default: '#f5f5f5',
                  paper: '#fff',
                },
              }
            : {
                // Palette for dark mode
                background: {
                  default: '#121212',
                  paper: '#1d1d1d',
                },
              }),
        },
      }),
    [mode],
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
      const movementsData = filteredMovements;
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text("Stock Movement Report", 14, 22);
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      
      const tableColumn = ["Date", "Part ID", "Item Name", "Type", "Quantity", "Buying Price (LKR)", "Sales Price (LKR)", "Supplier", "Job ID", "Notes"];
      const tableRows = movementsData.map(movement => [
        new Date(movement.date).toLocaleDateString(),
        movement.partId || 'N/A',
        movement.inventory?.name || 'N/A',
        movement.type,
        movement.quantity,
        movement.buyingPrice ? movement.buyingPrice.toFixed(2) : '0.00',
        movement.salesPrice ? movement.salesPrice.toFixed(2) : '0.00',
        movement.supplier?.name || 'N/A',
        movement.jobId || 'N/A',
        movement.notes || '-',
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: '#0288D1' },
      });
      
      doc.save(`Stock_Report_${dateFilter}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setError('Failed to generate PDF. Please try again.');
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

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 10, color: 'text.primary' }}>
        <AdminHeader />
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Stock Movements
            </Typography>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
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