const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (for buyers)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('id name price_per_unit');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Create new product
router.post('/admin', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price_per_unit: req.body.price_per_unit
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/admin/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name || product.name;
    product.price_per_unit = req.body.price_per_unit || product.price_per_unit;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/admin/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 