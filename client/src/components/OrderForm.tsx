import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Theme
} from '@mui/material';
import { SxProps } from '@mui/system';
import axios from 'axios';

interface OrderFormProps {
  productId: string;
  productName: string;
  price: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ productId, productName, price }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    buyer_name: '',
    contact: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        product_id: productId
      };
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('Order placed successfully:', response.data);
      // Handle success (e.g., show success message, redirect, etc.)
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (e.g., show error message)
    }
  };

  const gridItemProps = {
    xs: 12 as const
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Place Order for {productName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Price per unit: ${price}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid {...gridItemProps}>
              <TextField
                required
                fullWidth
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid {...gridItemProps}>
              <TextField
                required
                fullWidth
                label="Your Name"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid {...gridItemProps}>
              <TextField
                required
                fullWidth
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </Grid>
            <Grid {...gridItemProps}>
              <TextField
                required
                fullWidth
                label="Delivery Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid {...gridItemProps}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Place Order
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderForm; 