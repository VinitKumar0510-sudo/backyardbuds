class HeritageService {
  
  checkHeritageRestrictions(property, proposal) {
    const restrictions = {
      isHeritageItem: property.heritageOverlay || false,
      isHeritageConservationArea: this.isInHeritageConservationArea(property),
      restrictions: [],
      warnings: []
    };

    // Heritage item check (cl 2.17)
    if (restrictions.isHeritageItem) {
      restrictions.restrictions.push({
        type: 'CRITICAL',
        message: 'Development not exempt on heritage items',
        clause: 'Codes SEPP 2008 cl 2.17',
        recommendation: 'Heritage Development Application required'
      });
    }

    // Heritage conservation area check (cl 2.18(1)(j))
    if (restrictions.isHeritageConservationArea) {
      if (!proposal.inRearYard) {
        restrictions.restrictions.push({
          type: 'LOCATION',
          message: 'Structure must be in rear yard in heritage conservation area',
          clause: 'Codes SEPP 2008 cl 2.18(1)(j)',
          recommendation: 'Relocate to rear yard or apply for heritage approval'
        });
      } else {
        restrictions.warnings.push({
          type: 'HERITAGE_AREA',
          message: 'Heritage conservation area - design must be sympathetic',
          clause: 'Heritage considerations',
          recommendation: 'Consider heritage-appropriate materials and design'
        });
      }
    }

    return restrictions;
  }

  isInHeritageConservationArea(property) {
    // Heritage conservation areas in Albury region
    const heritageAreas = [
      'ALBURY COMMERCIAL CORE',
      'ALBURY RAILWAY PRECINCT', 
      'WODONGA PLACE PRECINCT'
    ];
    
    // Check if property is in known heritage area
    // This would typically come from heritage overlay mapping
    return property.heritageOverlay || false;
  }

  getHeritageGuidelines(structureType) {
    const guidelines = {
      shed: {
        materials: ['Colorbond steel', 'Timber weatherboard', 'Brick'],
        colors: ['Heritage green', 'Monument', 'Woodland grey'],
        design: 'Simple gable or skillion roof, minimal detailing'
      },
      patio: {
        materials: ['Timber posts', 'Steel frame with timber cladding'],
        colors: ['Natural timber', 'Heritage green', 'Cream'],
        design: 'Open structure, complement existing dwelling style'
      },
      carport: {
        materials: ['Steel frame', 'Timber posts'],
        colors: ['Match existing dwelling', 'Neutral tones'],
        design: 'Simple structure, minimal visual impact'
      }
    };

    return guidelines[structureType] || guidelines.shed;
  }
}

module.exports = new HeritageService();// Heritage service
