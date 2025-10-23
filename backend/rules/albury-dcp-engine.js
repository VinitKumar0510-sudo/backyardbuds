const fs = require('fs');
const path = require('path');

class AlburyDCPEngine {
  constructor() {
    this.dcpRules = this.loadDCPRules();
  }

  loadDCPRules() {
    try {
      const rulesPath = path.join(__dirname, '../../rules/albury-dcp-part10.json');
      const rulesData = fs.readFileSync(rulesPath, 'utf8');
      return JSON.parse(rulesData);
    } catch (error) {
      console.error('Error loading DCP rules:', error);
      return {};
    }
  }

  assessDwellingHouse(property, proposal) {
    const results = {
      compliant: true,
      violations: [],
      requirements: {},
      recommendations: []
    };

    // Check landscaping requirements
    const landscapingReq = this.getLandscapingRequirement(property.lotSize);
    results.requirements.landscaping = `${landscapingReq.percentage}%`;

    // Check setbacks
    const sideSetback = this.getSideSetback(proposal.buildingHeight);
    const rearSetback = this.getRearSetback(proposal.buildingHeight);
    
    results.requirements.min_side_setback = `${sideSetback}m`;
    results.requirements.min_rear_setback = `${rearSetback}m`;

    if (proposal.sideSetback < sideSetback) {
      results.violations.push(`Side setback ${proposal.sideSetback}m < required ${sideSetback}m`);
      results.compliant = false;
    }

    if (proposal.rearSetback < rearSetback) {
      results.violations.push(`Rear setback ${proposal.rearSetback}m < required ${rearSetback}m`);
      results.compliant = false;
    }

    // Check garage width
    const maxGarageWidth = this.getMaxGarageWidth(property.lotWidth);
    results.requirements.max_garage_width = `${maxGarageWidth}m`;

    if (proposal.garageWidth && proposal.garageWidth > maxGarageWidth) {
      results.violations.push(`Garage width ${proposal.garageWidth}m > maximum ${maxGarageWidth}m`);
      results.compliant = false;
    }

    // Check earthworks
    if (proposal.earthworksDifference && Math.abs(proposal.earthworksDifference) > 0.6) {
      results.violations.push(`Earthworks difference ${proposal.earthworksDifference}m exceeds 0.6m limit`);
      results.compliant = false;
    }

    // Check private open space
    const minPrivateOpenSpace = 36;
    if (proposal.privateOpenSpace < minPrivateOpenSpace) {
      results.violations.push(`Private open space ${proposal.privateOpenSpace}m² < required ${minPrivateOpenSpace}m²`);
      results.compliant = false;
    }

    return results;
  }

  getLandscapingRequirement(lotArea) {
    const rules = this.dcpRules.dwelling_house.landscaping;
    
    if (lotArea >= 300 && lotArea < 450) return rules['300-450'];
    if (lotArea >= 450 && lotArea < 600) return rules['450-600'];
    if (lotArea >= 600 && lotArea < 900) return rules['600-900'];
    if (lotArea >= 900 && lotArea < 1500) return rules['900-1500'];
    return rules['1500+'];
  }

  getSideSetback(buildingHeight) {
    const setbacks = this.dcpRules.dwelling_house.setbacks.side;
    return buildingHeight <= 4.5 ? setbacks.height_4_5m_or_less.minimum : setbacks.height_over_4_5m.minimum;
  }

  getRearSetback(buildingHeight) {
    const setbacks = this.dcpRules.dwelling_house.setbacks.rear;
    return buildingHeight <= 4.5 ? setbacks.height_4_5m_or_less.minimum : setbacks.height_over_4_5m.minimum;
  }

  getMaxGarageWidth(lotWidth) {
    const garageRules = this.dcpRules.dwelling_house.garage_width;
    
    if (lotWidth >= 7 && lotWidth <= 12) return garageRules['7-12m_lot'].maximum;
    if (lotWidth > 12 && lotWidth <= 24) return garageRules['12-24m_lot'].maximum;
    if (lotWidth > 24) return garageRules['24m+_lot'].maximum;
    return 0;
  }

  assessAncillaryDevelopment(property, proposal) {
    const results = {
      compliant: true,
      violations: [],
      requirements: {},
      recommendations: []
    };

    const ancillaryRules = this.dcpRules.ancillary_development.shed_garage;

    // Check wall height and setback relationship
    if (proposal.sideSetback >= 1.5) {
      results.requirements.max_wall_height = '3.6m';
      if (proposal.wallHeight > 3.6) {
        results.violations.push(`Wall height ${proposal.wallHeight}m > maximum 3.6m for 1.5m setback`);
        results.compliant = false;
      }
    } else if (proposal.sideSetback >= 0.9) {
      results.requirements.max_wall_height = '3.3m';
      if (proposal.wallHeight > 3.3) {
        results.violations.push(`Wall height ${proposal.wallHeight}m > maximum 3.3m for 0.9m setback`);
        results.compliant = false;
      }
    }

    // Check minimum setbacks
    if (proposal.sideSetback < 0.9) {
      results.violations.push(`Side setback ${proposal.sideSetback}m < minimum 0.9m`);
      results.compliant = false;
    }

    if (proposal.rearSetback < 0.9) {
      results.violations.push(`Rear setback ${proposal.rearSetback}m < minimum 0.9m`);
      results.compliant = false;
    }

    return results;
  }

  getDCPRules() {
    return this.dcpRules;
  }
}

module.exports = AlburyDCPEngine;