const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Sequelize, Op } = require('sequelize');

// POST spin the wheel
router.post('/', async (req, res) => {
  try {
    const { excludedIds = [] } = req.body;

    // Build query: not blacklisted AND not in excluded list
    const whereClause = {
      blacklisted: false
    };

    if (excludedIds.length > 0) {
      whereClause.id = { [Op.notIn]: excludedIds };
    }

    // Find one random user
    const winner = await User.findOne({
      where: whereClause,
      order: [Sequelize.literal('RANDOM()')] // Postgres uses RANDOM()
    });

    if (!winner) {
      return res.json({
        success: false,
        message: 'No eligible winners',
        winner: null
      });
    }

    res.json({
      success: true,
      winner: {
        id: winner.id,
        name: winner.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
