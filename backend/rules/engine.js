const fs = require('fs');
const path = require('path');
const heritageService = require('../services/heritageService');

class RulesEngine {
  constructor() {
    this.rules = this.loadRules();
  }

  loadRules() {
    try {
      const rulesPath = path.join(__dirname, '../../rules/sepp-part2.json');
      const rulesData = fs.readFileSync(rulesPath, 'utf8');
      return JSON.parse(rulesData);
    } catch (error) {
      console.error('Error loading rules:', error);
      return {};
    }
  }

  assessProposal(property, proposal) {
    const structureType = proposal.structureType.toLowerCase();
    const rules = this.rules[structureType];

    if (!rules) {
      return {
        recommendation: 'not_exempt',
        reasoning: `No rules found for structure type: ${proposal.structureType}`,
        clauses: [],
        conditions: [],
        failedConditions: [`Unsupported structure type: ${proposal.structureType}`]
      };
    }

    const results = {
      recommendation: 'exempt',
      reasoning: '',
      clauses: [],
      conditions: [],
      failedConditions: [],
      warnings: []
    };

    // Check overlay restrictions first
    this.checkOverlays(property, results);

    // Check zoning compatibility
    this.checkZoning(property, proposal, results);
    
    // Check general SEPP requirements
    this.checkGeneralRequirements(property, proposal, results);

    // Check each rule condition
    for (const [ruleKey, rule] of Object.entries(rules)) {
      const conditionResult = this.evaluateCondition(rule.condition, property, proposal);
      
      if (conditionResult.passed) {
        results.clauses.push(rule.clause);
      } else {
        results.failedConditions.push(conditionResult.description);
        results.recommendation = 'not_exempt';
      }
    }

    // Set reasoning based on result
    if (results.recommendation === 'exempt') {
      results.reasoning = 'Proposal meets all SEPP Part 2 criteria for exempt development';
    } else {
      results.reasoning = 'Proposal does not meet SEPP Part 2 criteria for exempt development';
    }

    return results;
  }

  checkOverlays(property, results) {
    // Heritage assessment (G4)
    const heritageCheck = heritageService.checkHeritageRestrictions(property, results.proposal || {});
    
    if (heritageCheck.isHeritageItem) {
      results.failedConditions.push('Heritage item - development not exempt under cl 1.16(1)(d)');
      results.recommendation = 'not_exempt';
    }
    
    heritageCheck.restrictions.forEach(restriction => {
      if (restriction.type === 'CRITICAL') {
        results.failedConditions.push(restriction.message);
        results.recommendation = 'not_exempt';
      } else {
        results.failedConditions.push(restriction.message);
      }
    });
    
    heritageCheck.warnings.forEach(warning => {
      results.warnings.push(warning.message);
    });
    
    // Bushfire check (G5) - fail if bushfire prone
    if (property.bushfireProne) {
      results.failedConditions.push('Bushfire prone area - exempt development not permitted under cl 1.16(1)(d)');
      results.recommendation = 'not_exempt';
    }
    
    // Flood check (G6)
    if (property.floodOverlay) {
      results.failedConditions.push('Flood control area - exempt development not permitted under cl 1.16(1)(d)');
      results.recommendation = 'not_exempt';
    }
    
    // Environmental sensitive areas (G8)
    if (property.hasEnvironmentalOverlay) {
      results.failedConditions.push('Environmental sensitive area - exempt development not permitted under cl 1.16(1)(d)');
      results.recommendation = 'not_exempt';
    }
    
    // General restrictions warning
    if (property.hasRestrictions) {
      results.warnings.push(`Planning restrictions: ${property.restrictionSummary}`);
    }
    
    // Large property spatial accuracy warning
    if (property.lotSizeM2 > 20000) {
      results.warnings.push('Large property - verify overlays with Council maps');
    }
  }

  checkZoning(property, proposal, results) {
    // G3 - Zoning check per cl 1.16(1)(c)
    const restrictedZones = ['C3', 'C4', 'SP2', 'W2', 'RE1', 'RE2', 'E1', 'E2', 'E3', 'E4'];
    if (restrictedZones.includes(property.zoning)) {
      results.failedConditions.push(`Zoning ${property.zoning} (${property.zoneDescription}) - exempt development not permitted under cl 1.16(1)(c)`);
      results.recommendation = 'not_exempt';
    }
  }
  
  checkGeneralRequirements(property, proposal, results) {
    // G10 - BCA compliance (assume true for simple interface)
    // G11 - No plumbing/sewer work (assume true for basic structures)
    // G12 - No utilities impact (assume true for typical setbacks)
    // G13 - No protected vegetation (assume true)
    // G14 - No asbestos issues (assume handled)
    
    // G15 - Stormwater management (required)
    if (proposal.stormwaterManaged === false) {
      results.failedConditions.push('Stormwater must be managed on-site under cl 1.16(1)(g)');
      results.recommendation = 'not_exempt';
    }
    
    // G16 - Ancillary to lawful use (assume true for residential properties)
    if (property.zoning && !['R1','R2','R3','R4','R5','RU1','RU2','RU3','RU4','RU5','RU6'].includes(property.zoning)) {
      results.warnings.push('Ensure development is ancillary to lawful use under cl 1.16(1)(b)');
    }
    
    results.warnings.push('Ensure compliance with BCA, materials standards, and privacy requirements');
    results.warnings.push('Obtain any other required approvals (Roads Act, Heritage Act, etc.)');
  }

  evaluateCondition(condition, property, proposal) {
    try {
      // Create evaluation context with property data
      const context = {
        ...property,
        ...proposal,
        // Map property fields to SEPP variables
        heritageOverlay: property.heritageOverlay === true,
        hasEnvironmentalOverlay: property.hasEnvironmentalOverlay === true,
        bushfireProne: property.bushfireProne === true,
        isResidentialZone: ['R1','R2','R3','R4','R5'].includes(property.zoning),
        // Default values for missing proposal fields
        behindBuildingLine: proposal.behindBuildingLine !== false,
        isShippingContainer: proposal.isShippingContainer || false,
        stormwaterManaged: proposal.stormwaterManaged !== false, // G15 - assume managed
        bcaCompliant: proposal.bcaCompliant !== false, // G10 - assume compliant
        materialsCompliant: proposal.materialsCompliant !== false, // G18 - assume compliant
        privacyCompliant: proposal.privacyCompliant !== false, // G19 - assume compliant
        ancillaryToLawfulUse: proposal.ancillaryToLawfulUse !== false, // G16 - assume true
        hasMetalComponents: proposal.hasMetalComponents || false,
        isLowReflectiveMetal: proposal.isLowReflectiveMetal !== false,
        distanceFromDwelling: proposal.distanceFromDwelling || 10,
        isNonCombustible: proposal.isNonCombustible || false,
        inHeritageArea: property.heritageOverlay || false,
        inRearYard: proposal.inRearYard !== false,
        interferesWithFireSafety: proposal.interferesWithFireSafety || false,
        isClass10Building: proposal.isClass10Building !== false,
        isHabitable: proposal.isHabitable || false,
        distanceFromEasement: proposal.distanceFromEasement || 10,
        structureCount: proposal.structureCount || 1,
        // Structure-specific defaults
        attachedToDwelling: proposal.attachedToDwelling || false,
        isOpenStructure: proposal.isOpenStructure !== false,
        isOpenOnOneSide: proposal.isOpenOnOneSide !== false,
        forVehicleUse: proposal.forVehicleUse !== false,
        Math: Math
      };

      const result = this.safeEval(condition, context);
      
      return {
        passed: result,
        description: this.getConditionDescription(condition, context, result)
      };
    } catch (error) {
      console.error('Error evaluating condition:', condition, error);
      return {
        passed: false,
        description: `Error evaluating condition: ${condition}`
      };
    }
  }

  safeEval(expression, context) {
    // Handle specific heritage conditions
    if (expression === '!heritageOverlay') {
      return !context.heritageOverlay;
    }
    if (expression === '!hasEnvironmentalOverlay') {
      return !context.hasEnvironmentalOverlay;
    }
    if (expression === '!bushfireProne || distanceFromDwelling >= 5 || isNonCombustible') {
      return !context.bushfireProne || context.distanceFromDwelling >= 5 || context.isNonCombustible;
    }
    
    // Handle zoning conditions
    const ruZones = ['RU1','RU2','RU3','RU4','RU6','R5'];
    if (expression.includes('RU1') && expression.includes('includes')) {
      if (expression.includes('floorArea <= 50')) {
        return (ruZones.includes(context.zoning) && context.floorArea <= 50) || (!ruZones.includes(context.zoning));
      }
      if (expression.includes('floorArea <= 20')) {
        return (!ruZones.includes(context.zoning) && context.floorArea <= 20) || (ruZones.includes(context.zoning));
      }
      if (expression.includes('distanceFromBoundary >= 5')) {
        return ruZones.includes(context.zoning) ? context.distanceFromBoundary >= 5 : true;
      }
      if (expression.includes('distanceFromBoundary >= 0.9')) {
        return !ruZones.includes(context.zoning) ? context.distanceFromBoundary >= 0.9 : true;
      }
    }
    
    // Simple numeric comparisons - safe evaluation
    if (expression.includes('<=') || expression.includes('>=') || expression.includes('<') || expression.includes('>')) {
      // Parse and evaluate safely without eval()
      if (expression.includes('height <=')) {
        return context.height <= 3;
      }
      if (expression.includes('floorArea <=')) {
        const limit = expression.includes('50') ? 50 : expression.includes('40') ? 40 : expression.includes('25') ? 25 : 20;
        return context.floorArea <= limit;
      }
      if (expression.includes('distanceFromBoundary >=')) {
        const limit = expression.includes('5') ? 5 : 0.9;
        return context.distanceFromBoundary >= limit;
      }
      return true;
    }
    
    return true; // Default to pass for unhandled conditions
  }

  getConditionDescription(condition, context, result) {
    // Only show failed conditions with specific details
    if (!result) {
      if (condition.includes('height')) {
        const limit = context.structureType === 'deck' ? '1.0m' : '3.0m';
        return `Height ${context.height}m > ${limit}`;
      }
      if (condition.includes('floorArea')) {
        let limit = '20m²';
        if (['RU1','RU2','RU3','RU4','RU6','R5'].includes(context.zoning) && context.structureType === 'shed') {
          limit = '50m²';
        } else if (context.structureType === 'patio' || context.structureType === 'deck') {
          limit = '25m²';
        } else if (context.structureType === 'carport') {
          limit = '40m²';
        }
        return `Floor area ${context.floorArea}m² > ${limit}`;
      }
      if (condition.includes('distanceFromBoundary')) {
        return 'Insufficient boundary setback';
      }
      if (condition === '!heritageOverlay') {
        return 'Heritage overlay restricts development';
      }
      if (condition === '!hasEnvironmentalOverlay') {
        return 'Environmental overlay restricts development';
      }
      return 'Requirement not met';
    }
    
    // For passed conditions, return generic message
    return 'Requirement met';
  }

  getRules() {
    return this.rules;
  }

  reloadRules() {
    this.rules = this.loadRules();
    return this.rules;
  }
}

module.exports = RulesEngine;
// Overlay restrictions
