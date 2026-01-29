const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const spinRouter = require('./routes/spin');
const seedRouter = require('./routes/seed');

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/spin', spinRouter);
app.use('/api/seed', seedRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lucky Wheel Backend (PostgreSQL) is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
