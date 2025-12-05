import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    CircularProgress,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    InputAdornment
} from '@mui/material';
import {
    Search,
    DirectionsCar,
    Person,
    Build,
    Add,
    Delete,
    Receipt,
    Print,
    Calculate,
    Payment,
    Clear
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    searchVehicles,
    getJobByVehicle,
    searchInventoryItems,
    calculatePayment,
    createPayment
} from '../../api/paymentApi';
import HeaderWrapper from '../HeaderWrapper';

// Custom debounce function to avoid lodash dependency
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Styled Components
const CashierContainer = styled(Box)(({ theme }) => ({
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const ContentSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const SectionCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
    padding: theme.spacing(1.5, 2),
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    color: '#495057',
}));

const CashierPortal = () => {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [jobData, setJobData] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    
    const [inventorySearch, setInventorySearch] = useState('');
    const [inventoryOptions, setInventoryOptions] = useState([]);
    const [extraItems, setExtraItems] = useState([]);
    
    const [paymentCalculation, setPaymentCalculation] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentStatus, setPaymentStatus] = useState('Paid');
    const [notes, setNotes] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [createdPayment, setCreatedPayment] = useState(null);

    // Debounced search functions
    const debouncedVehicleSearch = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setVehicleOptions([]);
                return;
            }
            try {
                const vehicles = await searchVehicles(query);
                setVehicleOptions(vehicles);
            } catch (error) {
                console.error('Error searching vehicles:', error);
                setVehicleOptions([]);
            }
        }, 300),
        []
    );

    const debouncedInventorySearch = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setInventoryOptions([]);
                return;
            }
            try {
                const items = await searchInventoryItems(query);
                setInventoryOptions(items);
            } catch (error) {
                console.error('Error searching inventory:', error);
                setInventoryOptions([]);
            }
        }, 300),
        []
    );

    // Handle vehicle search
    useEffect(() => {
        debouncedVehicleSearch(searchQuery);
    }, [searchQuery, debouncedVehicleSearch]);

    // Handle inventory search
    useEffect(() => {
        debouncedInventorySearch(inventorySearch);
    }, [inventorySearch, debouncedInventorySearch]);

    // Handle vehicle selection
    const handleVehicleSelect = async (vehicle) => {
        if (!vehicle) return;
        
        setSelectedVehicle(vehicle);
        setLoading(true);
        setError('');
        
        try {
            const response = await getJobByVehicle(vehicle.vehicleNumber);
            if (response.job) {
                setJobData(response.job);
                setVehicleData(response.vehicle);
            } else {
                setJobData(null);
                setVehicleData(response.vehicle);
                setError('No active job found for this vehicle. Customer can use walk-in service.');
            }
        } catch (error) {
            console.error('Error fetching job:', error);
            
            // Handle specific case for already paid jobs
            if (error.paymentExists) {
                setError(`⚠️ ${error.message}\n\nThis job has already been processed. You can edit or delete the existing payment from the Payment History section.`);
                setJobData(null);
                setVehicleData(error.vehicle);
            } else {
                setError(error.message || 'Error fetching job data');
                setJobData(null);
                setVehicleData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Add extra item
    const addExtraItem = (item, quantity = 1) => {
        const existingIndex = extraItems.findIndex(
            existing => existing.inventoryItem === item._id
        );

        if (existingIndex >= 0) {
            const updated = [...extraItems];
            updated[existingIndex].quantity += quantity;
            setExtraItems(updated);
        } else {
            setExtraItems([...extraItems, {
                inventoryItem: item._id,
                itemName: item?.name || 'Unknown Item',
                quantity: quantity,
                unitPrice: item?.salesPrice || 0,
                availableStock: item?.quantity || 0
            }]);
        }
        setInventorySearch('');
        setInventoryOptions([]);
    };

    // Update extra item quantity
    const updateExtraItemQuantity = (index, quantity) => {
        const updated = [...extraItems];
        updated[index].quantity = Math.max(0, quantity);
        setExtraItems(updated);
    };

    // Remove extra item
    const removeExtraItem = (index) => {
        const updated = extraItems.filter((_, i) => i !== index);
        setExtraItems(updated);
    };

    // Calculate payment
    const handleCalculatePayment = async () => {
        if (!jobData || !jobData._id) {
            setError('No valid job selected for payment calculation');
            return;
        }

        setLoading(true);
        try {
            const calculation = await calculatePayment({
                jobId: jobData._id,
                extraItems: extraItems.filter(item => item.inventoryItem && item.quantity > 0),
                discount: discount || 0,
                discountPercentage: discountPercentage || 0
            });
            setPaymentCalculation(calculation);
            setError('');
        } catch (error) {
            console.error('Error calculating payment:', error);
            setError(error.message || 'Error calculating payment');
        } finally {
            setLoading(false);
        }
    };

    // Process payment
    const handleProcessPayment = async () => {
        if (!paymentCalculation) {
            setError('Please calculate payment first');
            return;
        }

        if (!jobData || !jobData._id) {
            setError('No job selected. Please select a vehicle and job first.');
            return;
        }

        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please log in again.');
            return;
        }

        setLoading(true);
        try {
            console.log('Processing payment for job:', jobData._id);
            console.log('Extra items:', extraItems);
            
            const paymentResult = await createPayment({
                jobId: jobData._id,
                extraItems: extraItems.filter(item => item.inventoryItem && item.quantity > 0), // Filter out invalid items
                discount: discount || 0,
                discountPercentage: discountPercentage || 0,
                paymentMethod: paymentMethod || 'Cash',
                paymentStatus: paymentStatus || 'Pending',
                notes: notes || ''
            });

            setCreatedPayment(paymentResult.payment);
            setInvoiceDialog(true);
            setSuccess('Payment processed successfully!');
            
            // Reset form
            resetForm();
        } catch (error) {
            console.error('Error processing payment:', error);
            // Extract more detailed error message
            let errorMessage = 'Error processing payment';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setSelectedVehicle(null);
        setJobData(null);
        setVehicleData(null);
        setExtraItems([]);
        setPaymentCalculation(null);
        setDiscount(0);
        setDiscountPercentage(0);
        setNotes('');
        setSearchQuery('');
        setInventorySearch('');
        setError('');
    };

    // Print invoice
    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <>
            <HeaderWrapper />
            <CashierContainer>
            <MainPaper>
                <HeaderSection>
                    <Box display="flex" alignItems="center">
                        <Payment sx={{ fontSize: 40, marginRight: 2 }} />
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Cashier Portal
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                Payment Processing & Invoice Generation
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Clear />}
                        onClick={resetForm}
                        sx={{ 
                            borderColor: 'rgba(255,255,255,0.5)',
                            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Clear All
                    </Button>
                </HeaderSection>

                <ContentSection>
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

                    <Grid container spacing={3}>
                        {/* Vehicle Search Section */}
                        <Grid item xs={12} md={6}>
                            <SectionCard>
                                <SectionHeader>
                                    <DirectionsCar sx={{ mr: 1, color: '#007bff' }} />
                                    Vehicle Search
                                </SectionHeader>
                                <CardContent>
                                    <Autocomplete
                                        options={vehicleOptions}
                                        getOptionLabel={(option) => 
                                            `${option?.vehicleNumber || 'N/A'} - ${option?.brand || ''} ${option?.model || ''} (${option?.ownerName || 'Unknown Owner'})`
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Vehicle Number"
                                                placeholder="Type vehicle number..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Search />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                        onInputChange={(event, newValue) => {
                                            setSearchQuery(newValue);
                                        }}
                                        onChange={(event, newValue) => {
                                            handleVehicleSelect(newValue);
                                        }}
                                        loading={loading}
                                        loadingText="Searching vehicles..."
                                        noOptionsText="No vehicles found"
                                        fullWidth
                                    />
                                </CardContent>
                            </SectionCard>
                        </Grid>

                        {/* Customer & Vehicle Info */}
                        {(jobData || vehicleData) && (
                            <Grid item xs={12} md={6}>
                                <SectionCard>
                                    <SectionHeader>
                                        <Person sx={{ mr: 1, color: '#28a745' }} />
                                        Customer & Vehicle Details
                                    </SectionHeader>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" color="primary">
                                                    {jobData?.user?.name || vehicleData?.ownerName || 'No customer info'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {jobData?.user?.email || 'No email available'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {jobData?.user?.phone || 'No phone available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Vehicle: {vehicleData?.vehicleNumber}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {vehicleData?.brand} {vehicleData?.model} ({vehicleData?.year})
                                                </Typography>
                                                <Chip 
                                                    label={vehicleData?.type} 
                                                    size="small" 
                                                    color="primary" 
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </SectionCard>
                            </Grid>
                        )}

                        {/* Service Details */}
                        {jobData && (
                            <Grid item xs={12}>
                                <SectionCard>
                                    <SectionHeader>
                                        <Build sx={{ mr: 1, color: '#ffc107' }} />
                                        Service Details - Job ID: {jobData?.jobId || 'N/A'}
                                    </SectionHeader>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Service
                                                </Typography>
                                                <Typography variant="h6">
                                                    {jobData?.service?.name || 'No service info'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Price
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    LKR {jobData?.service?.price?.toLocaleString() || '0'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Duration
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobData?.service?.duration || 0} minutes
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Status
                                                </Typography>
                                                <Chip 
                                                    label={jobData?.status || 'Unknown'} 
                                                    color={jobData?.status === 'Completed' ? 'success' : 'warning'}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </SectionCard>
                            </Grid>
                        )}

                        {/* Extra Items Section */}
                        {jobData && (
                            <Grid item xs={12}>
                                <SectionCard>
                                    <SectionHeader>
                                        <Add sx={{ mr: 1, color: '#17a2b8' }} />
                                        Extra Items from Inventory
                                    </SectionHeader>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Autocomplete
                                                    options={inventoryOptions}
                                                    getOptionLabel={(option) => 
                                                        `${option?.name || 'Unknown Item'} - LKR ${option?.salesPrice || 0} (Stock: ${option?.quantity || 0})`
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Search Inventory Items"
                                                            placeholder="Type item name or part ID..."
                                                        />
                                                    )}
                                                    onInputChange={(event, newValue) => {
                                                        setInventorySearch(newValue);
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) addExtraItem(newValue);
                                                    }}
                                                    noOptionsText="No items found"
                                                />
                                            </Grid>
                                        </Grid>

                                        {extraItems.length > 0 && (
                                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Item Name</TableCell>
                                                            <TableCell align="center">Unit Price</TableCell>
                                                            <TableCell align="center">Quantity</TableCell>
                                                            <TableCell align="center">Total</TableCell>
                                                            <TableCell align="center">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {extraItems.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {item.itemName}
                                                                    {item.availableStock && (
                                                                        <Typography variant="caption" color="textSecondary" display="block">
                                                                            Stock: {item.availableStock}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    LKR {item.unitPrice.toLocaleString()}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => 
                                                                            updateExtraItemQuantity(index, parseInt(e.target.value) || 0)
                                                                        }
                                                                        inputProps={{ 
                                                                            min: 1, 
                                                                            max: item.availableStock,
                                                                            style: { textAlign: 'center', width: '60px' }
                                                                        }}
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Typography fontWeight="bold">
                                                                        LKR {(item.quantity * item.unitPrice).toLocaleString()}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <IconButton 
                                                                        onClick={() => removeExtraItem(index)}
                                                                        size="small"
                                                                        color="error"
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </SectionCard>
                            </Grid>
                        )}

                        {/* Payment Calculation Section */}
                        {jobData && (
                            <Grid item xs={12}>
                                <SectionCard>
                                    <SectionHeader>
                                        <Calculate sx={{ mr: 1, color: '#dc3545' }} />
                                        Payment Calculation
                                    </SectionHeader>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    label="Discount Amount"
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e) => {
                                                        setDiscount(parseFloat(e.target.value) || 0);
                                                        setDiscountPercentage(0);
                                                    }}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    label="Discount Percentage"
                                                    type="number"
                                                    value={discountPercentage}
                                                    onChange={(e) => {
                                                        setDiscountPercentage(parseFloat(e.target.value) || 0);
                                                        setDiscount(0);
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    inputProps={{ min: 0, max: 100 }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    select
                                                    label="Payment Method"
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    fullWidth
                                                >
                                                    <MenuItem value="Cash">Cash</MenuItem>
                                                    <MenuItem value="Card">Card</MenuItem>
                                                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    select
                                                    label="Payment Status"
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                    fullWidth
                                                >
                                                    <MenuItem value="Paid">Paid</MenuItem>
                                                    <MenuItem value="Pending">Pending (Customer Offline)</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleCalculatePayment}
                                                    disabled={loading}
                                                    startIcon={<Calculate />}
                                                    fullWidth
                                                    sx={{ height: '56px' }}
                                                >
                                                    Calculate
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Notes"
                                                    multiline
                                                    rows={2}
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Enter any additional notes..."
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>

                                        {paymentCalculation && (
                                            <Box mt={3}>
                                                <Divider sx={{ mb: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body1">
                                                            Service Amount: <strong>LKR {paymentCalculation.serviceAmount.toLocaleString()}</strong>
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Extra Items: <strong>LKR {paymentCalculation.extraItemsTotal.toLocaleString()}</strong>
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Subtotal: <strong>LKR {paymentCalculation.subtotal.toLocaleString()}</strong>
                                                        </Typography>
                                                        <Typography variant="body1" color="error">
                                                            Discount: <strong>LKR {paymentCalculation.discount.toLocaleString()}</strong>
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Typography variant="h6" color="primary">
                                                            Total Amount: <strong>LKR {paymentCalculation.totalAmount.toLocaleString()}</strong>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Button
                                                            variant="contained"
                                                            size="large"
                                                            onClick={handleProcessPayment}
                                                            disabled={loading}
                                                            startIcon={loading ? <CircularProgress size={20} /> : <Receipt />}
                                                            fullWidth
                                                            sx={{ 
                                                                py: 2,
                                                                fontSize: '1.1rem',
                                                                background: 'linear-gradient(45deg, #28a745, #20c997)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(45deg, #218838, #1ea080)',
                                                                }
                                                            }}
                                                        >
                                                            Process Payment & Generate Invoice
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}
                                    </CardContent>
                                </SectionCard>
                            </Grid>
                        )}
                    </Grid>
                </ContentSection>
            </MainPaper>

            {/* Invoice Dialog */}
            <Dialog 
                open={invoiceDialog} 
                onClose={() => setInvoiceDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                    <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Payment Successful
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {createdPayment && (
                        <Box textAlign="center">
                            <Typography variant="h6" gutterBottom>
                                Invoice Generated Successfully!
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                Invoice ID: {createdPayment.invoiceId}
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                Total Amount: LKR {createdPayment.totalAmount.toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handlePrintInvoice}
                        startIcon={<Print />}
                        sx={{ mr: 2 }}
                    >
                        Print Invoice
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setInvoiceDialog(false)}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </CashierContainer>
        </>
    );
};

export default CashierPortal;