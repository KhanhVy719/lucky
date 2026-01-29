const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check admin auth (simplified)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET all users
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/users called');
    const users = await User.find().lean();
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error in GET /api/users:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new user (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const user = new User({ name, blacklisted: false });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH toggle blacklist status (admin only)
router.patch('/:id/blacklist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.blacklisted = !user.blacklisted;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
