// Load environment variables
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./src/routes/todoRoutes');
const authRoutes = require('./src/routes/authRoutes'); // Assuming you have auth routes

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add diagnostic logging for environment variables
console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Is defined' : 'Not defined');
console.log('PORT:', process.env.PORT || 'Not defined, will use default');

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Routes
    app.get('/', (req, res) => {
      res.json({ message: 'Server is running' });
    });
    // aurhorized routes
    app.use('/auth', authRoutes);
    // todo routes
    app.use('/api', todoRoutes);
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error occurred:', err.stack);
      res.status(500).json({ message: "Something went wrong" });
    });
    
    // Start the server only after database connection is established
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
      console.error('Failed to start server:', err);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Export app for testing purposes
module.exports = app;