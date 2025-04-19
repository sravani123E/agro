import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { CartItem, Order } from '../types';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    deliveryAddress: '',
    notes: '',
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<'Pending' | 'In Progress' | 'Delivered'>('Pending');

  useEffect(() => {
    const items = localStorage.getItem('cart');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollOrderStatus = async () => {
      if (order) {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/${order._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const updatedOrder = await response.json();
            setOrderStatus(updatedOrder.status);
            
            // Stop polling if order is delivered
            if (updatedOrder.status === 'Delivered') {
              clearInterval(intervalId);
            }
          }
        } catch (err) {
          console.error('Error fetching order status:', err);
        }
      }
    };

    if (order) {
      // Poll every 10 seconds
      intervalId = setInterval(pollOrderStatus, 10000);
      
      // Initial poll
      pollOrderStatus();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [order, token]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} />;
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please log in to place an order');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!formData.customerName || !formData.contactNumber || !formData.deliveryAddress) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrder(data);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Order Placed Successfully!
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <Stepper activeStep={['Pending', 'In Progress', 'Delivered'].indexOf(orderStatus)} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Pending</StepLabel>
              </Step>
              <Step>
                <StepLabel>In Progress</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
              </Step>
            </Stepper>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Order Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Order ID:</strong> {order._id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {order.customerName}
                </Typography>
                <Typography variant="body1">
                  <strong>Contact:</strong> {order.contactNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {order.deliveryAddress}
                </Typography>
                {order.notes && (
                  <Typography variant="body1">
                    <strong>Notes:</strong> {order.notes}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Items Ordered
              </Typography>
              <List>
                {order.items.map((item) => (
                  <React.Fragment key={item.productId}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                <ListItem>
                  <ListItemText primary="Total Amount" />
                  <Typography variant="subtitle1">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Delivery Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Delivery Address"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.productId}>
                  <ListItem>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">${totalAmount.toFixed(2)}</Typography>
              </ListItem>
            </List>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Place Order'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 