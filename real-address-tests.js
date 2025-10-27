const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

// Real address test scenarios from Albury area
const realAddressTests = [
  // ALBURY CBD AND SURROUNDS
  { id: 'RA001', address: '123 Dean Street ALBURY NSW 2640', property: { zone_type: 'B4', area_total: 650, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.5, boundary_distance: 2, dwelling_distance: 0 }, expected: 'APPROVED' },
  { id: 'RA002', address: '456 Swift Street ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 800, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 15, height: 2.3, boundary_distance: 2.5, dwelling_distance: 8 }, expected: 'REJECTED' },
  { id: 'RA003', address: '789 Kiewa Street ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 900, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Carports', floor_area: 24, height: 2.7, boundary_distance: 1.5, dwelling_distance: 5 }, expected: 'APPROVED' },
  
  // LAVINGTON
  { id: 'RA004', address: '234 Urana Road LAVINGTON NSW 2641', property: { zone_type: 'R1', area_total: 750, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.8, boundary_distance: 1.8, dwelling_distance: 12, easement_distance: 1.2 }, expected: 'APPROVED' },
  { id: 'RA005', address: '567 Hamilton Valley Road LAVINGTON NSW 2641', property: { zone_type: 'R2', area_total: 600, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 16, height: 2.4, boundary_distance: 2.2, dwelling_distance: 3.5, materials: 'timber' }, expected: 'CONDITIONAL' },
  { id: 'RA006', address: '890 Griffith Road LAVINGTON NSW 2641', property: { zone_type: 'R3', area_total: 1200, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 22, height: 2.6, boundary_distance: 2.8, dwelling_distance: 6, has_walls: true, wall_height: 1.3 }, expected: 'APPROVED' },
  
  // NORTH ALBURY
  { id: 'RA007', address: '345 Fallon Street NORTH ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 850, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: true, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 17, height: 2.5, boundary_distance: 2.1, dwelling_distance: 9 }, expected: 'REJECTED' },
  { id: 'RA008', address: '678 Pemberton Street NORTH ALBURY NSW 2640', property: { zone_type: 'R2', area_total: 720, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: true, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 20, height: 2.4, boundary_distance: 1.8, dwelling_distance: 7 }, expected: 'CONDITIONAL' },
  { id: 'RA009', address: '901 Macauley Street NORTH ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 680, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 18, height: 2.3, boundary_distance: 1.5, dwelling_distance: 4, floor_height: 1.2 }, expected: 'REJECTED' },
  
  // SOUTH ALBURY
  { id: 'RA010', address: '123 Olive Street SOUTH ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 950, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.7, boundary_distance: 2.5, dwelling_distance: 11 }, expected: 'APPROVED' },
  { id: 'RA011', address: '456 Abercorn Street SOUTH ALBURY NSW 2640', property: { zone_type: 'R3', area_total: 1100, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Carports', floor_area: 23, height: 2.8, boundary_distance: 2.2, dwelling_distance: 8 }, expected: 'APPROVED' },
  { id: 'RA012', address: '789 Riverina Highway SOUTH ALBURY NSW 2640', property: { zone_type: 'B1', area_total: 1500, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 25, height: 2.9, boundary_distance: 3, dwelling_distance: 0 }, expected: 'APPROVED' },
  
  // WEST ALBURY
  { id: 'RA013', address: '234 Smollett Street WEST ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 780, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 21, height: 2.6, boundary_distance: 1.9, dwelling_distance: 6 }, expected: 'REJECTED' },
  { id: 'RA014', address: '567 Electra Street WEST ALBURY NSW 2640', property: { zone_type: 'R2', area_total: 650, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 16, height: 2.2, boundary_distance: 1.7, dwelling_distance: 9, easement_distance: 0.8 }, expected: 'REJECTED' },
  { id: 'RA015', address: '890 Thurgoona Street WEST ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 820, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 24, height: 2.5, boundary_distance: 2.3, dwelling_distance: 7, has_walls: true, wall_height: 1.5 }, expected: 'REJECTED' },
  
  // EAST ALBURY
  { id: 'RA016', address: '345 Wodonga Place EAST ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 700, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.4, boundary_distance: 2.1, dwelling_distance: 4.2, materials: 'steel' }, expected: 'APPROVED' },
  { id: 'RA017', address: '678 Borella Road EAST ALBURY NSW 2640', property: { zone_type: 'R2', area_total: 880, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 20, height: 2.7, boundary_distance: 2.4, dwelling_distance: 4.8, materials: 'timber' }, expected: 'REJECTED' },
  { id: 'RA018', address: '901 Young Street EAST ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 760, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 22, height: 2.5, boundary_distance: 1.8, dwelling_distance: 6.5, materials: 'steel' }, expected: 'APPROVED' },
  
  // THURGOONA
  { id: 'RA019', address: '123 Riverstone Road THURGOONA NSW 2640', property: { zone_type: 'R1', area_total: 1200, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.8, boundary_distance: 3.2, dwelling_distance: 8.5 }, expected: 'APPROVED' },
  { id: 'RA020', address: '456 Boomerang Drive THURGOONA NSW 2640', property: { zone_type: 'R2', area_total: 950, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 21, height: 2.6, boundary_distance: 2.8, dwelling_distance: 3.8, materials: 'timber' }, expected: 'REJECTED' },
  { id: 'RA021', address: '789 Springdale Heights Drive THURGOONA NSW 2640', property: { zone_type: 'R1', area_total: 1050, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 24, height: 2.7, boundary_distance: 2.5, dwelling_distance: 9 }, expected: 'APPROVED' },
  
  // RURAL AREAS
  { id: 'RA022', address: '234 Table Top Road TABLE TOP NSW 2640', property: { zone_type: 'RU1', area_total: 5000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 45, height: 2.9, boundary_distance: 8, dwelling_distance: 12 }, expected: 'APPROVED' },
  { id: 'RA023', address: '567 Jindera Road JINDERA NSW 2642', property: { zone_type: 'RU2', area_total: 8000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 48, height: 2.8, boundary_distance: 6.5, dwelling_distance: 4.5, materials: 'timber' }, expected: 'CONDITIONAL' },
  { id: 'RA024', address: '890 Howlong Road HOWLONG NSW 2643', property: { zone_type: 'RU3', area_total: 12000, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: true, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 35, height: 2.7, boundary_distance: 7, dwelling_distance: 15 }, expected: 'REJECTED' },
  
  // SPLITTERS CREEK AREA
  { id: 'RA025', address: '345 Bellenya Drive SPLITTERS CREEK NSW 2640', property: { zone_type: 'RU4', area_total: 25000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 42, height: 2.6, boundary_distance: 12, dwelling_distance: 18 }, expected: 'APPROVED' },
  { id: 'RA026', address: '678 Riverina Highway SPLITTERS CREEK NSW 2640', property: { zone_type: 'C3', area_total: 35000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 38, height: 2.5, boundary_distance: 15, dwelling_distance: 20 }, expected: 'REJECTED' },
  { id: 'RA027', address: '901 Ettamogah Road SPLITTERS CREEK NSW 2640', property: { zone_type: 'RU4', area_total: 18000, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 46, height: 2.8, boundary_distance: 8.5, dwelling_distance: 14 }, expected: 'APPROVED' },
  
  // INDUSTRIAL AREAS
  { id: 'RA028', address: '123 Enterprise Way LAVINGTON NSW 2641', property: { zone_type: 'E4', area_total: 3000, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.7, boundary_distance: 3, dwelling_distance: 0 }, expected: 'APPROVED' },
  { id: 'RA029', address: '456 Commercial Road LAVINGTON NSW 2641', property: { zone_type: 'E2', area_total: 2500, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: true, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 17, height: 2.4, boundary_distance: 2.5, dwelling_distance: 0 }, expected: 'REJECTED' },
  { id: 'RA030', address: '789 Gateway Drive LAVINGTON NSW 2641', property: { zone_type: 'E4', area_total: 4500, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 24, height: 2.9, boundary_distance: 4, dwelling_distance: 0 }, expected: 'APPROVED' },
  
  // MIXED USE AREAS
  { id: 'RA031', address: '234 David Street ALBURY NSW 2640', property: { zone_type: 'MU1', area_total: 400, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.5, boundary_distance: 1.5, dwelling_distance: 8, easement_distance: 1.3 }, expected: 'APPROVED' },
  { id: 'RA032', address: '567 Townsend Street ALBURY NSW 2640', property: { zone_type: 'MU1', area_total: 350, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 19, height: 2.4, boundary_distance: 1.2, dwelling_distance: 6, easement_distance: 0.7 }, expected: 'APPROVED' },
  
  // HERITAGE AREAS
  { id: 'RA033', address: '890 Kiewa Street ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 850, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 20, height: 2.3, boundary_distance: 2.8, dwelling_distance: 7 }, expected: 'REJECTED' },
  { id: 'RA034', address: '123 Wilson Street ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 920, heritage_overlay: true, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 16, height: 2.2, boundary_distance: 2.5, dwelling_distance: 9 }, expected: 'REJECTED' },
  
  // EDGE CASES WITH REAL ADDRESSES
  { id: 'RA035', address: '456 Noreuil Park Drive NOREUIL PARK NSW 2641', property: { zone_type: 'R1', area_total: 299, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 20, height: 2.5, boundary_distance: 1.8, dwelling_distance: 5 }, expected: 'APPROVED' },
  { id: 'RA036', address: '789 Hamilton Valley Road LAVINGTON NSW 2641', property: { zone_type: 'R1', area_total: 301, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false }, userInputs: { structure_type: 'Carports', floor_area: 25, height: 2.6, boundary_distance: 2.1, dwelling_distance: 7 }, expected: 'APPROVED' },
  
  // WATERFRONT AREAS
  { id: 'RA037', address: '234 Murray River Drive ALBURY NSW 2640', property: { zone_type: 'R1', area_total: 1200, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: true, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 22, height: 2.4, boundary_distance: 3.5, dwelling_distance: 8 }, expected: 'CONDITIONAL' },
  { id: 'RA038', address: '567 Hume Weir Road ALBURY NSW 2640', property: { zone_type: 'R2', area_total: 950, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true }, userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 2.8, dwelling_distance: 10 }, expected: 'APPROVED' }
];

function runRealAddressTests() {
  const engine = new EnhancedRulesEngine();
  console.log('🏠 REAL ADDRESS TEST SUITE - ALBURY AREA');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  let approved = 0;
  let conditional = 0;
  let rejected = 0;
  
  const failedTests = [];
  
  realAddressTests.forEach((test, index) => {
    // Add default values
    const userInputs = {
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0,
      ...test.userInputs
    };
    
    const result = engine.assessProperty(test.property, userInputs);
    
    let actualResult;
    if (result.result === 'APPROVED') {
      actualResult = 'APPROVED';
      approved++;
    } else if (result.result === 'CONDITIONAL') {
      actualResult = 'CONDITIONAL';
      conditional++;
    } else {
      actualResult = 'REJECTED';
      rejected++;
    }
    
    const testPassed = actualResult === test.expected;
    
    if (testPassed) {
      passed++;
      console.log(`✅ ${test.id}: ${test.address} → ${actualResult}`);
    } else {
      failed++;
      console.log(`❌ ${test.id}: ${test.address} → Expected ${test.expected}, Got ${actualResult}`);
      failedTests.push({
        id: test.id,
        address: test.address,
        expected: test.expected,
        actual: actualResult
      });
    }
  });
  
  console.log('\n📊 REAL ADDRESS TEST RESULTS');
  console.log('============================');
  console.log(`Total Properties Tested: ${realAddressTests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / realAddressTests.length) * 100).toFixed(1)}%`);
  
  console.log('\n📈 Result Distribution:');
  console.log(`✅ Approved: ${approved} (${((approved / realAddressTests.length) * 100).toFixed(1)}%)`);
  console.log(`⚠️ Conditional: ${conditional} (${((conditional / realAddressTests.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Rejected: ${rejected} (${((rejected / realAddressTests.length) * 100).toFixed(1)}%)`);
  
  console.log('\n🏘️ Areas Tested:');
  console.log('- ✅ Albury CBD (Dean St, Swift St, Kiewa St)');
  console.log('- ✅ Lavington (Urana Rd, Hamilton Valley Rd, Griffith Rd)');
  console.log('- ✅ North Albury (Fallon St, Pemberton St, Macauley St)');
  console.log('- ✅ South Albury (Olive St, Abercorn St, Riverina Hwy)');
  console.log('- ✅ West Albury (Smollett St, Electra St, Thurgoona St)');
  console.log('- ✅ East Albury (Wodonga Pl, Borella Rd, Young St)');
  console.log('- ✅ Thurgoona (Riverstone Rd, Boomerang Dr, Springdale Heights)');
  console.log('- ✅ Rural Areas (Table Top Rd, Jindera Rd, Howlong Rd)');
  console.log('- ✅ Splitters Creek (Bellenya Dr, Riverina Hwy, Ettamogah Rd)');
  console.log('- ✅ Industrial Areas (Enterprise Way, Commercial Rd, Gateway Dr)');
  console.log('- ✅ Mixed Use (David St, Townsend St)');
  console.log('- ✅ Heritage Areas (Kiewa St, Wilson St)');
  console.log('- ✅ Waterfront (Murray River Dr, Hume Weir Rd)');
  
  if (failedTests.length > 0) {
    console.log(`\n❌ Failed Properties (${failedTests.length}):`);
    failedTests.forEach(test => {
      console.log(`   ${test.id}: ${test.address}`);
      console.log(`      Expected: ${test.expected} | Got: ${test.actual}`);
    });
  }
  
  return {
    total: realAddressTests.length,
    passed,
    failed,
    successRate: ((passed / realAddressTests.length) * 100).toFixed(1)
  };
}

runRealAddressTests();