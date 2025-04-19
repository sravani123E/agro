const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Place new order
router.post('/', async (req, res) => {
  const order = new Order({
    product_id: req.body.product_id,
    quantity: req.body.quantity,
    buyer_name: req.body.buyer_name,
    contact: req.body.contact,
    address: req.body.address
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order status
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('product_id', 'name price_per_unit');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Get all orders
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product_id', 'name price_per_unit')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/admin/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 