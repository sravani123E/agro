import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

interface OrderStatusProps {
  orderId: string;
}

interface Order {
  _id: string;
  status: 'Pending' | 'In Progress' | 'Delivered';
  product_id: {
    name: string;
    price_per_unit: number;
  };
  quantity: number;
  buyer_name: string;
  contact: string;
  address: string;
  createdAt: string;
}

const steps = ['Pending', 'In Progress', 'Delivered'];

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching order status');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="sm">
        <Typography color="error" align="center">
          {error || 'Order not found'}
        </Typography>
      </Container>
    );
  }

  const activeStep = steps.indexOf(order.status);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Status
        </Typography>

        <Box mb={4}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography>
              <strong>Order ID:</strong> {order._id}
            </Typography>
            <Typography>
              <strong>Product:</strong> {order.product_id.name}
            </Typography>
            <Typography>
              <strong>Quantity:</strong> {order.quantity}
            </Typography>
            <Typography>
              <strong>Total Amount:</strong> ${order.quantity * order.product_id.price_per_unit}
            </Typography>
            <Typography>
              <strong>Buyer:</strong> {order.buyer_name}
            </Typography>
            <Typography>
              <strong>Contact:</strong> {order.contact}
            </Typography>
            <Typography>
              <strong>Delivery Address:</strong> {order.address}
            </Typography>
            <Typography>
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderStatus; 