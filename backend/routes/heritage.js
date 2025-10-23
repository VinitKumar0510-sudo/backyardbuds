const express = require('express');
const router = express.Router();
const heritageService = require('../services/heritageService');

// Check heritage status for an address
router.get('/check', (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address parameter is required'
      });
    }

    const heritage = heritageService.checkHeritage(address);
    
    res.json({
      success: true,
      heritage
    });
  } catch (error) {
    console.error('Heritage check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking heritage status'
    });
  }
});

module.exports = router;