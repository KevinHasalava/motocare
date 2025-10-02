import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Divider,
    Avatar,
    LinearProgress,
    Fab
} from '@mui/material';
import {
    Payment as PaymentIcon,
    Receipt as ReceiptIcon,
    CloudUpload as UploadIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Error as ErrorIcon,
    AttachFile as AttachFileIcon,
    Close as CloseIcon,
    History as HistoryIcon,
    AccountBalance as BankIcon,
    CreditCard as CardIcon,
    Money as CashIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Header from '../components/Header';
import { getUserPayments, uploadPaymentSlip } from '../api/paymentApi';
import Invoice from '../components/Cashier/Invoice';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    paddingTop: theme.spacing(10),
}));

const HeaderSection = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    borderRadius: '12px',
}));

const StatsCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    }
}));

const PaymentCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)',
    }
}));

const UploadArea = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.dark,
    },
    '&.dragover': {
        backgroundColor: theme.palette.primary.light + '20',
        borderColor: theme.palette.primary.main,
    }
}));

const MyPayments = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Dialog states
    const [slipUploadDialog, setSlipUploadDialog] = useState(false);
    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    
    // Upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadNotes, setUploadNotes] = useState('');
    const [uploading, setUploading] = useState(false);
    
    // Statistics
    const [stats, setStats] = useState({
        totalPaid: 0,
        totalPending: 0,
        totalPayments: 0,
        lastPayment: null
    });

    useEffect(() => {
        fetchUserPayments();
    }, []);

    const fetchUserPayments = async () => {
        setLoading(true);
        try {
            // This would need to be implemented in the API
            const response = await getUserPayments();
            setPayments(response.payments || []);
            calculateStats(response.payments || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (paymentsData) => {
        const totalPaid = paymentsData
            .filter(p => p.paymentStatus === 'Paid')
            .reduce((sum, p) => sum + p.totalAmount, 0);
        
        const totalPending = paymentsData
            .filter(p => p.paymentStatus === 'Pending')
            .reduce((sum, p) => sum + p.totalAmount, 0);
        
        const sortedPayments = [...paymentsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setStats({
            totalPaid,
            totalPending,
            totalPayments: paymentsData.length,
            lastPayment: sortedPayments[0] || null
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return <CheckCircleIcon color="success" />;
            case 'pending':
                return <PendingIcon color="warning" />;
            default:
                return <ErrorIcon color="error" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            default:
                return 'error';
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'cash':
                return <CashIcon />;
            case 'card':
                return <CardIcon />;
            case 'bank transfer':
                return <BankIcon />;
            default:
                return <PaymentIcon />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewInvoice = (payment) => {
        setSelectedPayment(payment);
        setInvoiceDialog(true);
    };

    const handleUploadSlip = (payment) => {
        setSelectedPayment(payment);
        setSlipUploadDialog(true);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type (images and PDFs)
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
                setError('');
            } else {
                setError('Please select a valid image (JPG, PNG) or PDF file');
            }
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
                setError('');
            } else {
                setError('Please select a valid image (JPG, PNG) or PDF file');
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSlipUpload = async () => {
        if (!selectedFile || !selectedPayment) {
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('slip', selectedFile);
            formData.append('paymentId', selectedPayment._id);
            formData.append('notes', uploadNotes);

            await uploadPaymentSlip(formData);
            setSuccess('Payment slip uploaded successfully');
            setSlipUploadDialog(false);
            setSelectedFile(null);
            setUploadNotes('');
            fetchUserPayments(); // Refresh the list
        } catch (error) {
            console.error('Error uploading slip:', error);
            setError('Failed to upload payment slip');
        } finally {
            setUploading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (activeTab === 0) return true; // All
        if (activeTab === 1) return payment.paymentStatus === 'Paid';
        if (activeTab === 2) return payment.paymentStatus === 'Pending';
        return true;
    });

    return (
        <>
            <Header />
            <PageContainer>
                <Container maxWidth="lg">
                    {/* Header Section */}
                    <HeaderSection elevation={0}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography variant="h3" fontWeight="bold" gutterBottom>
                                    My Payments
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Manage your payment history and upload payment slips
                                </Typography>
                            </Box>
                            <PaymentIcon sx={{ fontSize: 60, opacity: 0.7 }} />
                        </Box>
                    </HeaderSection>

                    {/* Error/Success Alerts */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    )}

                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: 'success.main', mb: 1, mx: 'auto' }}>
                                        <CheckCircleIcon />
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold">
                                        LKR {stats.totalPaid.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Paid
                                    </Typography>
                                </CardContent>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: 'warning.main', mb: 1, mx: 'auto' }}>
                                        <PendingIcon />
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold">
                                        LKR {stats.totalPending.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Pending
                                    </Typography>
                                </CardContent>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: 'primary.main', mb: 1, mx: 'auto' }}>
                                        <HistoryIcon />
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.totalPayments}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Payments
                                    </Typography>
                                </CardContent>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: 'info.main', mb: 1, mx: 'auto' }}>
                                        <ReceiptIcon />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">
                                        {stats.lastPayment ? formatDate(stats.lastPayment.createdAt) : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Last Payment
                                    </Typography>
                                </CardContent>
                            </StatsCard>
                        </Grid>
                    </Grid>

                    {/* Payment History Section */}
                    <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={activeTab} onChange={handleTabChange}>
                                <Tab label="All Payments" />
                                <Tab label="Paid" />
                                <Tab label="Pending" />
                            </Tabs>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {loading ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : filteredPayments.length === 0 ? (
                                <Box textAlign="center" py={6}>
                                    <PaymentIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary">
                                        No payments found
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Your payment history will appear here
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {filteredPayments.map((payment) => (
                                        <Grid item xs={12} key={payment._id}>
                                            <PaymentCard>
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={2}>
                                                            <Box display="flex" alignItems="center">
                                                                {getStatusIcon(payment.paymentStatus)}
                                                                <Box ml={1}>
                                                                    <Typography variant="h6" fontWeight="bold">
                                                                        {payment.invoiceId}
                                                                    </Typography>
                                                                    <Chip 
                                                                        label={payment.paymentStatus}
                                                                        color={getStatusColor(payment.paymentStatus)}
                                                                        size="small"
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        
                                                        <Grid item xs={12} sm={3}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Service
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                {payment.service?.name || 'Service'}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {payment.vehicle?.vehicleNumber}
                                                            </Typography>
                                                        </Grid>
                                                        
                                                        <Grid item xs={12} sm={2}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Amount
                                                            </Typography>
                                                            <Typography variant="h6" color="primary">
                                                                LKR {payment.totalAmount.toLocaleString()}
                                                            </Typography>
                                                        </Grid>
                                                        
                                                        <Grid item xs={12} sm={2}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Method
                                                            </Typography>
                                                            <Box display="flex" alignItems="center">
                                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                                                <Typography variant="body2" ml={1}>
                                                                    {payment.paymentMethod}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        
                                                        <Grid item xs={12} sm={2}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Date
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {formatDate(payment.createdAt)}
                                                            </Typography>
                                                        </Grid>
                                                        
                                                        <Grid item xs={12} sm={1}>
                                                            <Box display="flex" flexDirection="column" gap={1}>
                                                                <Tooltip title="View Invoice">
                                                                    <IconButton 
                                                                        onClick={() => handleViewInvoice(payment)}
                                                                        color="primary"
                                                                        size="small"
                                                                    >
                                                                        <ViewIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {payment.paymentStatus === 'Pending' && (
                                                                    <Tooltip title="Upload Payment Slip">
                                                                        <IconButton 
                                                                            onClick={() => handleUploadSlip(payment)}
                                                                            color="secondary"
                                                                            size="small"
                                                                        >
                                                                            <UploadIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </PaymentCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </PageContainer>

            {/* Payment Slip Upload Dialog */}
            <Dialog 
                open={slipUploadDialog} 
                onClose={() => setSlipUploadDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <UploadIcon sx={{ mr: 1 }} />
                        Upload Payment Slip
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                Invoice: {selectedPayment.invoiceId}
                            </Typography>
                            <Typography variant="body1" color="primary">
                                Amount: LKR {selectedPayment.totalAmount.toLocaleString()}
                            </Typography>
                        </Box>
                    )}

                    <UploadArea
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            hidden
                            accept="image/*,.pdf"
                            onChange={handleFileSelect}
                        />
                        
                        {selectedFile ? (
                            <Box>
                                <AttachFileIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    {selectedFile.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    File selected successfully
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Upload Payment Slip
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Drag and drop your payment slip here or click to browse
                                </Typography>
                                <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                                    Supported formats: JPG, PNG, PDF (Max 5MB)
                                </Typography>
                            </Box>
                        )}
                    </UploadArea>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notes (optional)"
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        placeholder="Add any additional notes about this payment..."
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSlipUploadDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSlipUpload}
                        variant="contained"
                        disabled={!selectedFile || uploading}
                        startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                    >
                        Upload Slip
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Invoice Dialog */}
            <Invoice
                invoiceId={selectedPayment?.invoiceId}
                open={invoiceDialog}
                onClose={() => setInvoiceDialog(false)}
            />
        </>
    );
};

export default MyPayments;