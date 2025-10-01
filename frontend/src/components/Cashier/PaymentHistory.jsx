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
    TrendingUp
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAllPayments } from '../../api/paymentApi';
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
        try {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (searchTerm) filters.search = searchTerm;

            const response = await getAllPayments(page + 1, rowsPerPage, filters);
            setPayments(response.payments);
            setTotalItems(response.pagination.totalItems);
            
            // Calculate statistics
            calculateStats(response.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError('Failed to load payment history');
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
                                                {payment.discount > 0 && (
                                                    <Typography variant="caption" color="error">
                                                        Discount: {payment.discount.toLocaleString()}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {payment.paymentMethod}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.paymentStatus}
                                                    color={getStatusColor(payment.paymentStatus)}
                                                    size="small"
                                                />
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
                                                <Tooltip title="View Invoice">
                                                    <IconButton
                                                        onClick={() => handleViewInvoice(payment.invoiceId)}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
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