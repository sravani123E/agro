import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid,
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box
} from '@mui/material';
import { GridSize } from '@mui/material/Grid';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price_per_unit: number;
}

interface GridItemProps {
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  const gridItemProps: GridItemProps = {
    xs: 12,
    sm: 6,
    md: 4
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Catalogue
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid {...gridItemProps} key={product._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Price: ${product.price_per_unit}
                </Typography>
                <Box mt={2}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {/* Handle order placement */}}
                  >
                    Place Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList; 