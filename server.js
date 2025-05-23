const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Compression middleware
app.use(compression());

// Enhanced CORS configuration
app.use(cors({
<<<<<<< HEAD
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'],
=======
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'],
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// MongoDB Connection with more detailed error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('MongoDB Connected Successfully');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, enum: ['fruit', 'vegetable'] },
  stock: { type: Number, required: true }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes with better error handling
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
<<<<<<< HEAD
    const limit = parseInt(req.query.limit) || 50;
=======
    const limit = parseInt(req.query.limit) || 10;
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error('Detailed error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Error fetching product',
      error: error.message 
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product',
      error: error.message 
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      message: 'Error updating product',
      error: error.message 
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      message: 'Error deleting product',
      error: error.message 
    });
  }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        email: user.email, 
        isAdmin: user.isAdmin,
        _id: user._id
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      isAdmin: false
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { 
        email: user.email, 
        isAdmin: user.isAdmin,
        _id: user._id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
});

// Token verification endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Error during verification' });
  }
});

// Protected routes
app.use('/api/admin', authenticateToken);

// Initialize sample products if none exist
const initializeProducts = async () => {
  try {
    // Drop the existing products collection
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    const sampleProducts = [
      {
<<<<<<< HEAD
        name: 'Fresh Red Apples',
        description: 'Sweet and crisp red apples from local orchards, perfect for snacking, baking, or making fresh apple juice.',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
=======
        name: 'Fresh Apples',
        description: 'Crisp and juicy red apples, perfect for snacking or baking.',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'fruit',
        stock: 100
      },
      {
        name: 'Organic Bananas',
<<<<<<< HEAD
        description: 'Perfectly ripened organic bananas, rich in potassium and natural sweetness.',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
=======
        description: 'Sweet and creamy organic bananas, rich in potassium.',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'fruit',
        stock: 150
      },
      {
        name: 'Fresh Carrots',
<<<<<<< HEAD
        description: 'Locally grown organic carrots, sweet and crunchy. Perfect for salads and cooking.',
        price: 1.49,
        image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
=======
        description: 'Crunchy and sweet carrots, great for snacking or cooking.',
        price: 1.49,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'vegetable',
        stock: 200
      },
      {
        name: 'Ripe Mangoes',
<<<<<<< HEAD
        description: 'Sweet and juicy mangoes at peak ripeness. Perfect for smoothies and desserts.',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed',
=======
        description: 'Sweet and juicy mangoes at peak ripeness.',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'fruit',
        stock: 75
      },
      {
        name: 'Fresh Spinach',
<<<<<<< HEAD
        description: 'Tender and nutritious spinach leaves. Ideal for salads and cooking.',
=======
        description: 'Tender and nutritious spinach leaves.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
        category: 'vegetable',
        stock: 120
      },
      {
<<<<<<< HEAD
        name: 'Navel Oranges',
        description: 'Juicy and sweet oranges, packed with vitamin C.',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9999276',
=======
        name: 'Sweet Oranges',
        description: 'Juicy and sweet oranges, packed with vitamin C.',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'fruit',
        stock: 90
      },
      {
<<<<<<< HEAD
        name: 'Broccoli Crown',
        description: 'Fresh broccoli crowns with tight, green florets. Perfect for steaming.',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc',
=======
        name: 'Fresh Broccoli',
        description: 'Crisp and nutritious broccoli florets.',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'vegetable',
        stock: 80
      },
      {
        name: 'Red Grapes',
<<<<<<< HEAD
        description: 'Sweet and seedless red grapes. Great for snacking.',
=======
        description: 'Sweet and seedless red grapes.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f',
        category: 'fruit',
        stock: 100
      },
      {
        name: 'Bell Peppers',
<<<<<<< HEAD
        description: 'Colorful mix of sweet bell peppers. Perfect for salads and cooking.',
=======
        description: 'Colorful and crisp bell peppers.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83',
        category: 'vegetable',
        stock: 110
      },
      {
        name: 'Fresh Strawberries',
<<<<<<< HEAD
        description: 'Sweet and juicy strawberries. Perfect for desserts.',
=======
        description: 'Sweet and juicy strawberries.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 4.49,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
        category: 'fruit',
        stock: 85
      },
      {
        name: 'Cherry Tomatoes',
<<<<<<< HEAD
        description: 'Sweet and bite-sized cherry tomatoes. Great for salads.',
        price: 3.29,
        image: 'https://images.unsplash.com/photo-1561155707-3f9e6bb380b4',
=======
        description: 'Sweet and bite-sized cherry tomatoes.',
        price: 3.29,
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'vegetable',
        stock: 95
      },
      {
        name: 'Fresh Blueberries',
<<<<<<< HEAD
        description: 'Plump and sweet blueberries. Rich in antioxidants.',
=======
        description: 'Plump and sweet blueberries.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e',
        category: 'fruit',
        stock: 70
      },
      {
        name: 'Green Beans',
<<<<<<< HEAD
        description: 'Crisp and tender green beans. Perfect for stir-fries.',
=======
        description: 'Crisp and tender green beans.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 2.79,
        image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0',
        category: 'vegetable',
        stock: 130
      },
      {
<<<<<<< HEAD
        name: 'Golden Pineapple',
        description: 'Sweet and tropical fresh pineapple. Great for fruit salads.',
=======
        name: 'Fresh Pineapple',
        description: 'Sweet and tropical fresh pineapple.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba',
        category: 'fruit',
        stock: 60
      },
      {
<<<<<<< HEAD
        name: 'English Cucumber',
        description: 'Cool and crisp cucumbers. Perfect for salads.',
        price: 1.79,
        image: 'https://images.unsplash.com/photo-1449300079323-02847456d222',
=======
        name: 'Cucumber',
        description: 'Cool and crisp cucumbers.',
        price: 1.79,
        image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'vegetable',
        stock: 140
      },
      {
<<<<<<< HEAD
        name: 'Ripe Avocados',
        description: 'Creamy and nutritious avocados. Perfect for guacamole.',
=======
        name: 'Avocados',
        description: 'Creamy and nutritious avocados.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
        category: 'fruit',
        stock: 80
      },
      {
        name: 'Sweet Potatoes',
<<<<<<< HEAD
        description: 'Nutritious and versatile sweet potatoes. Great for roasting.',
=======
        description: 'Nutritious and versatile sweet potatoes.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1596097557993-54e1dbe3149f',
        category: 'vegetable',
        stock: 120
      },
      {
<<<<<<< HEAD
        name: 'Fresh Kiwi',
        description: 'Tangy and sweet kiwi fruits. Rich in vitamin C.',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1610917040803-1fccf9623064',
=======
        name: 'Kiwi',
        description: 'Tangy and sweet kiwi fruits.',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        category: 'fruit',
        stock: 90
      },
      {
<<<<<<< HEAD
        name: 'Green Asparagus',
        description: 'Fresh and tender asparagus spears. Perfect for grilling.',
=======
        name: 'Asparagus',
        description: 'Fresh and tender asparagus spears.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777',
        category: 'vegetable',
        stock: 75
      },
      {
        name: 'Dragon Fruit',
<<<<<<< HEAD
        description: 'Exotic dragon fruit with vibrant pink flesh. Rich in antioxidants.',
=======
        description: 'Exotic and beautiful dragon fruit.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1527325678964-54921661f888',
        category: 'fruit',
        stock: 50
      },
      {
        name: 'Brussels Sprouts',
<<<<<<< HEAD
        description: 'Fresh and nutritious Brussels sprouts. Great for roasting.',
=======
        description: 'Fresh and nutritious Brussels sprouts.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1438118907704-7718ee9a191a',
        category: 'vegetable',
        stock: 100
      },
      {
<<<<<<< HEAD
        name: 'Fresh Pomegranate',
        description: 'Sweet and juicy pomegranate. Full of healthy antioxidants.',
=======
        name: 'Pomegranate',
        description: 'Sweet and juicy pomegranate.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc',
        category: 'fruit',
        stock: 70
      },
      {
<<<<<<< HEAD
        name: 'White Cauliflower',
        description: 'Fresh and versatile cauliflower. Perfect for roasting.',
=======
        name: 'Cauliflower',
        description: 'Fresh and versatile cauliflower.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3',
        category: 'vegetable',
        stock: 85
      },
      {
        name: 'Passion Fruit',
<<<<<<< HEAD
        description: 'Exotic and aromatic passion fruit. Great for juices and desserts.',
=======
        description: 'Exotic and aromatic passion fruit.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1604495772376-9657f0035eb5',
        category: 'fruit',
        stock: 60
      },
      {
<<<<<<< HEAD
        name: 'Fresh Artichokes',
        description: 'Fresh and flavorful artichokes. Perfect for steaming.',
=======
        name: 'Artichokes',
        description: 'Fresh and flavorful artichokes.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1612258264055-11ab003d9459',
        category: 'vegetable',
        stock: 70
      },
      {
<<<<<<< HEAD
        name: 'Fresh Lychee',
        description: 'Sweet and fragrant lychee fruits. Perfect for desserts.',
=======
        name: 'Lychee',
        description: 'Sweet and fragrant lychee fruits.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1629721671030-a83edbb11211',
        category: 'fruit',
        stock: 45
      },
      {
<<<<<<< HEAD
        name: 'Italian Eggplant',
        description: 'Fresh and glossy eggplants. Great for grilling or baking.',
=======
        name: 'Eggplant',
        description: 'Fresh and glossy eggplants.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1605196560547-b2f7281b7e68',
        category: 'vegetable',
        stock: 95
      },
      {
        name: 'Fresh Figs',
<<<<<<< HEAD
        description: 'Sweet and delicate fresh figs. Perfect for desserts.',
=======
        description: 'Sweet and delicate fresh figs.',
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1601379760883-1bb497c558f0',
        category: 'fruit',
        stock: 55
<<<<<<< HEAD
      },
      {
        name: 'Zucchini',
        description: 'Fresh green zucchini. Perfect for grilling or pasta dishes.',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f',
        category: 'vegetable',
        stock: 110
      },
      {
        name: 'Fresh Raspberries',
        description: 'Sweet and tender raspberries. Great for snacking or baking.',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5',
        category: 'fruit',
        stock: 65
      },
      {
        name: 'Red Onions',
        description: 'Sweet and crisp red onions. Essential for salads and cooking.',
        price: 1.49,
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1',
        category: 'vegetable',
        stock: 150
=======
>>>>>>> 7ba558e890b2aaf9bac9f4aa84cd0362304ec730
      }
    ];
    
    await Product.insertMany(sampleProducts);
    const count = await Product.countDocuments();
    console.log(`Initialized ${count} products successfully`);
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Order endpoints
// Create new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customerName, contactNumber, deliveryAddress, items, notes } = req.body;

    // Calculate total amount and verify product availability
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
      totalAmount += product.price * item.quantity;

      // Update product stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = new Order({
      userId: req.user.userId,
      customerName,
      contactNumber,
      deliveryAddress,
      items,
      totalAmount,
      notes,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get single order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status (admin only)
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    if (!['pending', 'processing', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'email');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Improved server startup
const startServer = async () => {
  try {
    await mongoose.connection.once('open', () => {
      console.log('MongoDB connection ready');
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      initializeProducts();
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer(); 