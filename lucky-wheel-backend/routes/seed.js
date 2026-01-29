const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { users } = req.body; // Expecting array of { name: '...' }

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Clear existing data? Maybe not for seed, usually seed is additive or reset.
    // Let's just bulk create.
    const createdUsers = await User.bulkCreate(users);

    res.status(201).json({
      success: true,
      message: `Added ${createdUsers.length} users`,
      users: createdUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear all users route
router.delete('/', async (req, res) => {
   try {
     await User.destroy({
       where: {},
       truncate: true // Faster
     });
     res.json({ message: 'All users cleared' });
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
});

module.exports = router;
