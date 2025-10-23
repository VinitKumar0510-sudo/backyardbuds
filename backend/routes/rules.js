const express = require('express');
const EnhancedRulesEngine = require('../rules/enhanced-engine');

const router = express.Router();
const enhancedEngine = new EnhancedRulesEngine();

// GET /api/rules - Retrieve current SEPP rules
router.get('/', (req, res) => {
  try {
    const rules = enhancedEngine.rules;
    
    res.json({
      success: true,
      rules: rules,
      metadata: {
        timestamp: new Date().toISOString(),
        ruleCount: rules.length,
        version: '2.0.0'
      }
    });
  } catch (error) {
    console.error('Error retrieving rules:', error);
    res.status(500).json({
      error: 'Failed to retrieve rules',
      message: 'Unable to load SEPP rules configuration'
    });
  }
});

// GET /api/rules/:structureType - Get rules for specific structure type
router.get('/:structureType', (req, res) => {
  try {
    const { structureType } = req.params;
    const rules = enhancedEngine.getRelevantLegislation(structureType);
    
    if (!rules || rules.length === 0) {
      return res.status(404).json({
        error: 'Structure type not found',
        message: `No rules found for structure type: ${structureType}`,
        availableTypes: ['Garden Structures & Storage', 'Carports', 'Outdoor Entertainment Areas']
      });
    }

    res.json({
      success: true,
      structureType: structureType,
      rules: rules,
      metadata: {
        timestamp: new Date().toISOString(),
        ruleCount: rules.length
      }
    });
  } catch (error) {
    console.error('Error retrieving structure rules:', error);
    res.status(500).json({
      error: 'Failed to retrieve structure rules',
      message: 'Unable to load rules for specified structure type'
    });
  }
});

// POST /api/rules/reload - Reload rules from configuration file
router.post('/reload', (req, res) => {
  try {
    const newEngine = new EnhancedRulesEngine();
    const rules = newEngine.rules;
    
    res.json({
      success: true,
      message: 'Rules reloaded successfully',
      metadata: {
        timestamp: new Date().toISOString(),
        ruleCount: rules.length
      }
    });
  } catch (error) {
    console.error('Error reloading rules:', error);
    res.status(500).json({
      error: 'Failed to reload rules',
      message: 'Unable to reload SEPP rules configuration'
    });
  }
});

module.exports = router;
