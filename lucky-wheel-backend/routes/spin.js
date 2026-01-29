const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST spin the wheel
router.post('/', async (req, res) => {
  try {
    const { excludedIds = [] } = req.body;
    
    // Find eligble users: not blacklisted AND not in excluded list
    const query = { 
      blacklisted: false,
      _id: { $nin: excludedIds }
    };
    
    // Get only non-blacklisted users
    const eligibleUsers = await User.find(query);
    
    if (eligibleUsers.length === 0) {
      return res.json({
        success: false,
        message: 'No eligible winners',
        winner: null
      });
    }
    
    // Randomly select one eligible user
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    const winner = eligibleUsers[randomIndex];
    
    res.json({
      success: true,
      winner: {
        id: winner._id,
        name: winner.name
      },
      totalEligible: eligibleUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
