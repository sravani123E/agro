import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Search, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
  });
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
    setShowDeliveryForm(true);
  };

  const handleDeliveryDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: [{
            productId: selectedProduct._id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
          }],
          ...deliveryDetails,
        }),
      });

      if (response.ok) {
        setActiveStep(1);
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleClose = () => {
    setShowDeliveryForm(false);
    setActiveStep(0);
    setDeliveryDetails({
      name: '',
      address: '',
      phone: '',
      notes: '',
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'vegetable', 'fruit'];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Fresh Market
          </Typography>
          <Typography variant="h5" gutterBottom>
            Discover the finest selection of fresh vegetables and fruits
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image || '/images/placeholder.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delivery Details Dialog */}
      <Dialog open={showDeliveryForm} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Delivery Details</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Delivery Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Order Confirmation</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={deliveryDetails.name}
                onChange={handleDeliveryDetailsChange}
                required
              />
              <TextField
                fullWidth
                label="Delivery Address"
                name="address"
                value={deliveryDetails.address}
                onChange={handleDeliveryDetailsChange}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleDeliveryDetailsChange}
                required
              />
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={deliveryDetails.notes}
                onChange={handleDeliveryDetailsChange}
                multiline
                rows={3}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Thank you for your order. We will process it shortly.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep === 0 ? (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                disabled={!deliveryDetails.name || !deliveryDetails.address || !deliveryDetails.phone}
              >
                Place Order
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleClose();
                navigate('/orders');
              }}
            >
              View Orders
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 