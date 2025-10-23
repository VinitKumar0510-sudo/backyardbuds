const fs = require('fs');
const path = require('path');

class PropertyService {
  constructor() {
    this.properties = [];
    this.loaded = false;
    this.loadData();
  }

  loadData() {
    try {
      const csvPath = path.join(__dirname, '../data/Property_Boundaries.csv');
      const csvData = fs.readFileSync(csvPath, 'utf8');
      
      // Parse CSV data
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');
      
      this.properties = lines.slice(1)
        .filter(line => line.trim()) // Remove empty lines
        .map(line => {
          const values = this.parseCSVLine(line);
          const property = {};
          
          headers.forEach((header, index) => {
            property[header.trim()] = values[index] ? values[index].trim() : '';
          });
          
          return this.processProperty(property);
        })
        .filter(property => property.addressNumber); // Filter out invalid entries
      
      this.loaded = true;
      console.log(`✅ Loaded ${this.properties.length} properties from Albury Council data`);
      
    } catch (error) {
      console.error('❌ Error loading property data:', error.message);
      this.properties = [];
      this.loaded = false;
    }
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current); // Add the last value
    return values;
  }

  processProperty(rawProperty) {
    // Convert area to square meters if needed
    let lotSizeM2 = 0;
    const areaTotal = parseFloat(rawProperty.area_total) || 0;
    const areaUnits = rawProperty.area_units || '';
    
    if (areaUnits === 'm²') {
      lotSizeM2 = areaTotal;
    } else if (areaUnits === 'h²') {
      lotSizeM2 = areaTotal * 10000; // Convert hectares to m²
    }

    // Use actual zoning from dataset
    const zoning = rawProperty.zone_type || 'R1';
    const propertyType = this.determinePropertyType(lotSizeM2, zoning);

    return {
      objectId: rawProperty.OBJECTID,
      propertyNumber: rawProperty.property_number,
      houseNumber: rawProperty.house_number,
      addressNumber: rawProperty.address_number,
      streetName: rawProperty.street_name,
      streetSuffix: rawProperty.street_suffix,
      suburb: rawProperty.suburb,
      postCode: rawProperty.post_code,
      fullAddress: rawProperty.short_address,
      lotNumber: rawProperty.lot_number,
      planNumber: rawProperty.plan_number,
      title: rawProperty.title,
      lotSizeM2: Math.round(lotSizeM2),
      lotSizeDisplay: `${areaTotal} ${areaUnits}`,
      propertyType,
      zoning,
      zoneDescription: rawProperty.zone_description,
      latitude: parseFloat(rawProperty.latitude) || 0,
      longitude: parseFloat(rawProperty.longitude) || 0,
      heritageOverlay: rawProperty.heritage_overlay === 'True',
      floodOverlay: rawProperty.flood_overlay === 'True',
      bushfireProne: rawProperty.bushfire_prone === 'True',
      hasRestrictions: rawProperty.has_any_restrictions === 'True',
      restrictionSummary: rawProperty.restriction_summary,
      shapeArea: parseFloat(rawProperty.Shape__Area) || 0,
      shapeLength: parseFloat(rawProperty.Shape__Length) || 0
    };
  }

  determinePropertyType(lotSizeM2, zoning) {
    // Use zoning to determine property type
    const ruralZones = ['RU1', 'RU2', 'RU4', 'RU5', 'C3', 'C4'];
    const urbanZones = ['R1', 'R2', 'R3', 'R5', 'B1', 'B2', 'B3', 'B4'];
    
    if (ruralZones.includes(zoning)) {
      return 'rural';
    } else if (urbanZones.includes(zoning)) {
      return 'urban';
    }
    
    // Fallback to lot size if zoning unclear
    return lotSizeM2 > 2000 ? 'rural' : 'urban';
  }



  // Search properties by address
  searchByAddress(searchTerm) {
    if (!this.loaded || !searchTerm) {
      return [];
    }

    const term = searchTerm.toLowerCase().trim();
    
    return this.properties
      .filter(property => {
        const fullAddress = property.fullAddress?.toLowerCase() || '';
        const streetName = property.streetName?.toLowerCase() || '';
        const suburb = property.suburb?.toLowerCase() || '';
        
        return fullAddress.includes(term) || 
               streetName.includes(term) || 
               suburb.includes(term) ||
               (property.houseNumber && property.houseNumber.toString().includes(term));
      })
      .slice(0, 10); // Limit to 10 results
  }

  // Get property by exact address match
  getByAddress(houseNumber, streetName, suburb) {
    if (!this.loaded) {
      return null;
    }

    return this.properties.find(property => {
      const matchHouse = !houseNumber || property.houseNumber === houseNumber.toString();
      const matchStreet = !streetName || 
        property.streetName?.toLowerCase() === streetName.toLowerCase();
      const matchSuburb = !suburb || 
        property.suburb?.toLowerCase() === suburb.toLowerCase();
      
      return matchHouse && matchStreet && matchSuburb;
    });
  }

  // Get property by property number
  getByPropertyNumber(propertyNumber) {
    if (!this.loaded) {
      return null;
    }

    return this.properties.find(property => 
      property.propertyNumber === propertyNumber.toString()
    );
  }

  // Get all suburbs
  getSuburbs() {
    if (!this.loaded) {
      return [];
    }

    const suburbs = [...new Set(this.properties.map(p => p.suburb).filter(Boolean))];
    return suburbs.sort();
  }

  // Get streets in a suburb
  getStreetsInSuburb(suburb) {
    if (!this.loaded || !suburb) {
      return [];
    }

    const streets = this.properties
      .filter(p => p.suburb?.toLowerCase() === suburb.toLowerCase())
      .map(p => `${p.streetName} ${p.streetSuffix}`.trim())
      .filter(Boolean);
    
    return [...new Set(streets)].sort();
  }

  // Get property statistics
  getStats() {
    if (!this.loaded) {
      return null;
    }

    const totalProperties = this.properties.length;
    const urbanProperties = this.properties.filter(p => p.propertyType === 'urban').length;
    const ruralProperties = this.properties.filter(p => p.propertyType === 'rural').length;
    
    const suburbs = this.getSuburbs();
    
    const avgLotSize = this.properties.reduce((sum, p) => sum + p.lotSizeM2, 0) / totalProperties;
    
    return {
      totalProperties,
      urbanProperties,
      ruralProperties,
      totalSuburbs: suburbs.length,
      averageLotSize: Math.round(avgLotSize),
      suburbs: suburbs.slice(0, 10) // Top 10 suburbs
    };
  }
}

// Create singleton instance
const propertyService = new PropertyService();

module.exports = propertyService;// Dataset integration
