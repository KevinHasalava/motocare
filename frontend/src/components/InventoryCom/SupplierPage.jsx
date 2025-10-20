import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { getSuppliers, deleteSupplier } from '../../api/supplierApi';
import DataTable from '../DataTable'; 
import AddEditSupplierDialog from './AddEditSupplierDialog';
import AdminHeader from '../AdminHeader';

// PDF generation now handled by backend API with custom letterhead template

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setError('Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenDialog = (supplier = null) => {
    setSupplierToEdit(supplier);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
      } catch (err) {
        console.error("Failed to delete supplier:", err);
        setError(err.response?.data?.message || 'Failed to delete supplier.');
      }
    }
  };

  // -------------------------------------------------------------------
  // UPDATED FUNCTION: PDF Download Handler (Using Backend API with Template)
  // -------------------------------------------------------------------
  const handleDownloadPdf = async () => {
    try {
      setError(''); // Clear any previous errors
      
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Call backend API to generate PDF with template
      const response = await fetch(`/api/suppliers/download-report-pdf?${queryParams.toString()}`, {
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
      link.download = `SupplierReport_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF report. Please try again.');
    }
  };
  // -------------------------------------------------------------------

  const columns = [
    { id: 'supplierId', label: 'Supplier ID', render: (row) => row.supplierId || '-' },
    { id: 'name', label: 'Name' },
    { id: 'contact.phone', label: 'Phone', render: (row) => row.contact?.phone || '-' },
    { id: 'contact.email', label: 'Email', render: (row) => row.contact?.email || '-' },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <Button size="small" onClick={() => handleOpenDialog(row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];
  
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.supplierId && s.supplierId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 10 }}>
      <AdminHeader />
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Supplier Management
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPdf}
            disabled={loading || filteredSuppliers.length === 0}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Supplier
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <DataTable
            title="Supplier List"
            columns={columns}
            data={filteredSuppliers}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by name or ID..."
          />
        )}
        <AddEditSupplierDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          supplierToEdit={supplierToEdit}
          onSave={fetchSuppliers}
        />
      </Container>
    </Box>
  );
};

export default SupplierPage;