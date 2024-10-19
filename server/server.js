
// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const User = require('./models/User'); // Import your User model

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Clear all user data when server starts
const clearAllUsers = async () => {
  try {
    await User.deleteMany({}); // Delete all users
    console.log('All user data has been cleared.');
  } catch (error) {
    console.error('Error clearing user data:', error.message);
  }
};

// Call the function to clear user data
clearAllUsers();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
