import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    MenuItem
} from '@mui/material';
import {
    Search,
    Receipt,
    Visibility,
    FilterList,
    Payment,
    DateRange,
    TrendingUp,
    Edit,
    Delete,
    Save,
    Cancel
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAllPayments, updatePayment, deletePayment } from '../../api/paymentApi';
import Invoice from './Invoice';
import AdminHeader from '../AdminHeader';

const HistoryContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(10), // Account for fixed header
}));

const MainPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 1400,
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(3),
}));

const StatsCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    '& .MuiCardContent-root': {
        paddingBottom: '16px !important',
    }
}));

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });
    
    // Invoice dialog
    const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

    // Edit/Delete functionality
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Statistics
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0
    });

    useEffect(() => {
        fetchPayments();
    }, [page, rowsPerPage, statusFilter]);

    const fetchPayments = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching payments with params:', { page: page + 1, rowsPerPage, statusFilter, searchTerm });
            
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (searchTerm) filters.search = searchTerm;

            const response = await getAllPayments(page + 1, rowsPerPage, filters);
            console.log('Payment API response:', response);
            
            if (response && response.payments) {
                setPayments(response.payments);
                setTotalItems(response.pagination?.totalItems || 0);
                
                // Calculate statistics
                calculateStats(response.payments);
            } else {
                console.warn('Unexpected API response format:', response);
                setPayments([]);
                setTotalItems(0);
                setError('Unexpected response format from server');
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            console.error('Error details:', error.message);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Failed to load payment history';
            if (error.message) {
                errorMessage += `: ${error.message}`;
            } else if (error.response?.data?.message) {
                errorMessage += `: ${error.response.data.message}`;
            }
            
            setError(errorMessage);
            setPayments([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (paymentsData) => {
        const totalRevenue = paymentsData.reduce((sum, payment) => sum + payment.totalAmount, 0);
        const totalTransactions = paymentsData.length;
        const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        setStats({
            totalRevenue,
            totalTransactions,
            averageTransaction
        });
    };

    const handleSearch = () => {
        setPage(0);
        fetchPayments();
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewInvoice = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setInvoiceDialogOpen(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'refunded':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleEditPayment = (payment) => {
        setEditingPaymentId(payment._id);
        setEditFormData({
            discount: payment.discount || 0,
            discountPercentage: payment.discountPercentage || 0,
            paymentMethod: payment.paymentMethod || 'Cash',
            notes: payment.notes || '',
            paymentStatus: payment.paymentStatus || 'Paid'
        });
    };

    const handleSaveEdit = async (paymentId) => {
        try {
            setLoading(true);
            await updatePayment(paymentId, editFormData);
            setEditingPaymentId(null);
            setEditFormData({});
            fetchPayments(); // Refresh the list
            setError('');
        } catch (error) {
            console.error('Error updating payment:', error);
            setError(error.message || 'Failed to update payment');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingPaymentId(null);
        setEditFormData({});
    };

    const handleDeletePayment = async (paymentId) => {
        console.log('=== DELETE PAYMENT INITIATED ===');
        console.log('Payment ID to delete:', paymentId);
        
        if (window.confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
            try {
                setLoading(true);
                setError('');
                
                console.log('Calling delete API...');
                const response = await deletePayment(paymentId);
                console.log('Delete API response:', response);
                
                if (response && response.success) {
                    console.log('Payment deleted successfully, refreshing list...');
                    await fetchPayments(); // Refresh the list
                    console.log('Payment list refreshed');
                    
                    // Show success message
                    alert(`Payment ${response.invoiceId} deleted successfully!`);
                } else {
                    console.error('Delete response indicates failure:', response);
                    setError('Payment deletion failed - unexpected response');
                }
            } catch (error) {
                console.error('=== DELETE PAYMENT ERROR ===');
                console.error('Error deleting payment:', error);
                console.error('Error type:', typeof error);
                console.error('Error keys:', Object.keys(error || {}));
                console.error('Error response:', error.response?.data);
                console.error('Error message:', error.message);
                console.error('============================');
                
                let errorMessage = 'Failed to delete payment';
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            } finally {
                setLoading(false);
                console.log('=== DELETE PAYMENT COMPLETED ===');
            }
        } else {
            console.log('Delete payment cancelled by user');
        }
    };

    const handleEditFieldChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <AdminHeader />
            <HistoryContainer>
            <MainPaper>
                <HeaderSection>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <Receipt sx={{ fontSize: 40, marginRight: 2 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    Payment History
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                    Transaction records and invoice management
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Total Records: {totalItems}
                            </Typography>
                        </Box>
                    </Box>
                </HeaderSection>

                <Box p={3}>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <StatsCard>
                                <CardContent>
                                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        LKR {stats.totalRevenue.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Total Revenue
                                    </Typography>
                                </CardContent>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Payment sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.totalTransactions}
                                    </Typography>
                                    <Typography variant="body2">
                                        Total Transactions
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                                <CardContent>
                                    <Receipt sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        LKR {stats.averageTransaction.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Average Transaction
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by Invoice ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Refunded">Refunded</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    startIcon={<FilterList />}
                                    fullWidth
                                    sx={{ height: '56px' }}
                                >
                                    Apply Filters
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('');
                                        setPage(0);
                                        fetchPayments();
                                    }}
                                    fullWidth
                                    sx={{ height: '56px' }}
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Payment Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableCell><strong>Invoice ID</strong></TableCell>
                                    <TableCell><strong>Customer</strong></TableCell>
                                    <TableCell><strong>Vehicle</strong></TableCell>
                                    <TableCell><strong>Service</strong></TableCell>
                                    <TableCell align="right"><strong>Amount (LKR)</strong></TableCell>
                                    <TableCell><strong>Payment Method</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                            Loading payment history...
                                        </TableCell>
                                    </TableRow>
                                ) : payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                            No payment records found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment._id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    {payment.invoiceId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {payment.customer.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {payment.customer.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {payment.vehicle.vehicleNumber}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {payment.vehicle.brand} {payment.vehicle.model}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {payment.service.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    LKR {payment.service.price.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" fontWeight="bold">
                                                    {payment.totalAmount.toLocaleString()}
                                                </Typography>
                                                {editingPaymentId === payment._id ? (
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        label="Discount"
                                                        value={editFormData.discount || 0}
                                                        onChange={(e) => handleEditFieldChange('discount', parseFloat(e.target.value) || 0)}
                                                        sx={{ mt: 1, width: 100 }}
                                                    />
                                                ) : (
                                                    payment.discount > 0 && (
                                                        <Typography variant="caption" color="error">
                                                            Discount: {payment.discount.toLocaleString()}
                                                        </Typography>
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingPaymentId === payment._id ? (
                                                    <TextField
                                                        select
                                                        size="small"
                                                        value={editFormData.paymentMethod || 'Cash'}
                                                        onChange={(e) => handleEditFieldChange('paymentMethod', e.target.value)}
                                                        sx={{ width: 120 }}
                                                    >
                                                        <MenuItem value="Cash">Cash</MenuItem>
                                                        <MenuItem value="Card">Card</MenuItem>
                                                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                        <MenuItem value="Online">Online</MenuItem>
                                                    </TextField>
                                                ) : (
                                                    <Typography variant="body2">
                                                        {payment.paymentMethod}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingPaymentId === payment._id ? (
                                                    <TextField
                                                        select
                                                        size="small"
                                                        value={editFormData.paymentStatus || 'Paid'}
                                                        onChange={(e) => handleEditFieldChange('paymentStatus', e.target.value)}
                                                        sx={{ width: 120 }}
                                                    >
                                                        <MenuItem value="Paid">Paid</MenuItem>
                                                        <MenuItem value="Pending">Pending</MenuItem>
                                                        <MenuItem value="Refunded">Refunded</MenuItem>
                                                    </TextField>
                                                ) : (
                                                    <Chip
                                                        label={payment.paymentStatus}
                                                        color={getStatusColor(payment.paymentStatus)}
                                                        size="small"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatDate(payment.createdAt)}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    By: {payment.cashier.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {editingPaymentId === payment._id ? (
                                                    <Box display="flex" gap={1}>
                                                        <Tooltip title="Save Changes">
                                                            <IconButton
                                                                onClick={() => handleSaveEdit(payment._id)}
                                                                color="success"
                                                                size="small"
                                                            >
                                                                <Save />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cancel">
                                                            <IconButton
                                                                onClick={handleCancelEdit}
                                                                color="default"
                                                                size="small"
                                                            >
                                                                <Cancel />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ) : (
                                                    <Box display="flex" gap={1}>
                                                        <Tooltip title="View Invoice">
                                                            <IconButton
                                                                onClick={() => handleViewInvoice(payment.invoiceId)}
                                                                color="primary"
                                                                size="small"
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit Payment">
                                                            <IconButton
                                                                onClick={() => handleEditPayment(payment)}
                                                                color="warning"
                                                                size="small"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Payment">
                                                            <IconButton
                                                                onClick={() => handleDeletePayment(payment._id)}
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={totalItems}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </TableContainer>
                </Box>
            </MainPaper>

            {/* Invoice Dialog */}
            <Invoice
                invoiceId={selectedInvoiceId}
                open={invoiceDialogOpen}
                onClose={() => setInvoiceDialogOpen(false)}
            />
        </HistoryContainer>
        </>
    );
};

export default PaymentHistory;