const express = require('express');
const Joi = require('joi');
const EnhancedRulesEngine = require('../rules/enhanced-engine');
const { saveCheckpoint } = require('../middleware/checkpoint');

const router = express.Router();
const enhancedEngine = new EnhancedRulesEngine();

// Enhanced validation schema
const assessmentSchema = Joi.object({
  property: Joi.object({
    short_address: Joi.string().required(),
    zone_type: Joi.string().required(),
    zone_description: Joi.string().optional(),
    area_total: Joi.number().positive().required(),
    area_units: Joi.string().optional(),
    heritage_overlay: Joi.boolean().required(),
    bushfire_prone: Joi.boolean().required(),
    has_environmental_overlay: Joi.boolean().required(),
    has_easement: Joi.boolean().required(),
    flood_overlay: Joi.boolean().required()
  }).required(),
  userInputs: Joi.object({
    structure_type: Joi.string().valid('Garden Structures & Storage', 'Carports', 'Outdoor Entertainment Areas').required(),
    floor_area: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    boundary_distance: Joi.number().min(0).required(),
    dwelling_distance: Joi.number().min(0).required(),
    tree_removal: Joi.boolean().required(),
    tree_permit: Joi.boolean().optional(),
    asbestos_type: Joi.string().valid('A', 'B', 'C', 'D').required(),
    stormwater_connected: Joi.boolean().required(),
    is_shipping_container: Joi.boolean().optional(),
    is_habitable: Joi.boolean().optional(),
    cabana_services: Joi.boolean().optional(),
    existing_garden_structures: Joi.number().min(0).optional(),
    roof_boundary_distance: Joi.number().min(0).optional(),
    new_driveway: Joi.boolean().optional(),
    road_consent: Joi.boolean().optional(),
    existing_carports: Joi.number().min(0).optional(),
    has_walls: Joi.boolean().optional(),
    wall_height: Joi.number().positive().optional(),
    has_roof: Joi.boolean().optional(),
    roof_overhang: Joi.number().min(0).optional(),
    attached: Joi.boolean().optional(),
    floor_height: Joi.number().min(0).optional(),
    existing_outdoor_area: Joi.number().min(0).optional()
  }).required()
});

// POST /api/assess - Submit development proposal for assessment
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = assessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { property, userInputs } = value;

    // Assess the proposal using enhanced rules engine
    const assessment = enhancedEngine.assessProperty(property, userInputs);

    // Save checkpoint
    await saveCheckpoint({
      timestamp: new Date().toISOString(),
      input: { property, userInputs },
      output: assessment,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Return assessment result
    res.json({
      success: true,
      assessment: {
        result: assessment.result,
        issues: assessment.issues,
        conditions: assessment.conditions,
        warnings: assessment.warnings,
        infoNotes: assessment.infoNotes,
        legislationApplied: assessment.legislationApplied,
        summary: assessment.summary
      },
      metadata: {
        timestamp: new Date().toISOString(),
        structureType: userInputs.structure_type,
        propertyAddress: property.short_address
      }
    });

  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({
      error: 'Assessment failed',
      message: 'Unable to process development proposal'
    });
  }
});

// GET /api/assess/validate - Validate input without assessment
router.post('/validate', (req, res) => {
  const { error, value } = assessmentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      valid: false,
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  res.json({
    valid: true,
    data: value
  });
});

module.exports = router;
// Security fixes
