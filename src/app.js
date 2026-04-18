const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/email-simulator')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Import routes
const routes = require('./routes/routes');

// Use routes with /api prefix
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
    res.send("Server running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});