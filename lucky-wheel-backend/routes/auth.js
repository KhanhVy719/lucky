const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Simple admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Compare with admin password from env
    const isValid = password === process.env.ADMIN_PASSWORD;
    
    if (isValid) {
      // In production, use JWT tokens
      res.json({ 
        success: true, 
        message: 'Login successful',
        token: 'admin-token' // Simple token for demo
      });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
