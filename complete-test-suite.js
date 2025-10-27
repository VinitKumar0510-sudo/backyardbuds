const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

const testCases = [
  {
    id: 'P1-A',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 45, height: 2.8, boundary_distance: 10, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 1 },
    expected: 'APPROVED'
  },
  {
    id: 'P1-B',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.5, boundary_distance: 8, dwelling_distance: 3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0, materials: 'timber' },
    expected: 'CONDITIONAL'
  },
  {
    id: 'P1-C',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 48, height: 2.7, boundary_distance: 6, dwelling_distance: 4, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, materials: 'steel' },
    expected: 'APPROVED'
  },
  {
    id: 'P1-D',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 24, height: 2.9, boundary_distance: 7, dwelling_distance: 6, has_walls: true, wall_height: 1.6, tree_removal: false, asbestos_type: 'A', stormwater_connected: true },
    expected: 'REJECTED'
  },
  {
    id: 'P1-E',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 22, height: 2.5, boundary_distance: 6, dwelling_distance: 8, floor_height: 1.3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true },
    expected: 'REJECTED'
  },
  {
    id: 'P2-A',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 15, height: 2.5, boundary_distance: 8, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P2-B',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 40, height: 2.8, boundary_distance: 7, dwelling_distance: 3.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, materials: 'steel' },
    expected: 'CONDITIONAL'
  },
  {
    id: 'P2-C',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 20, height: 2.6, boundary_distance: 6, dwelling_distance: 4, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, materials: 'timber' },
    expected: 'REJECTED'
  },
  {
    id: 'P3-A',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'CONDITIONAL'
  },
  {
    id: 'P3-B',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, easement_distance: 2.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED'
  },
  {
    id: 'P3-C',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, easement_distance: 0.6, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P6-A',
    property: { zone_type: 'R3', area_total: 765.1, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.5, boundary_distance: 2, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED'
  },
  {
    id: 'P8-A',
    property: { zone_type: 'C3', area_total: 49000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.8, boundary_distance: 15, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P11-A',
    property: { zone_type: 'R1', area_total: 1056, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.6, boundary_distance: 3, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P15-A',
    property: { zone_type: 'W2', area_total: 242812, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 48, height: 2.9, boundary_distance: 20, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED'
  }
];

function runCompleteTestSuite() {
  const engine = new EnhancedRulesEngine();
  console.log('🧪 COMPLETE TEST SUITE - ALL PROVIDED CASES');
  console.log('===========================================\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(testCase => {
    const result = engine.assessProperty(testCase.property, testCase.userInputs);
    
    let actualResult;
    if (result.result === 'APPROVED') actualResult = 'APPROVED';
    else if (result.result === 'CONDITIONAL') actualResult = 'CONDITIONAL';
    else actualResult = 'REJECTED';
    
    const testPassed = actualResult === testCase.expected;
    
    console.log(`📋 ${testCase.id}: ${testPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Expected: ${testCase.expected} | Got: ${actualResult}`);
    
    if (!testPassed) {
      if (result.issues && result.issues.length > 0) {
        console.log(`   Issues: ${result.issues[0]}`);
      }
      if (result.conditions && result.conditions.length > 0) {
        console.log(`   Conditions: ${result.conditions[0]}`);
      }
    }
    
    if (testPassed) passed++;
    else failed++;
    
    console.log('');
  });
  
  console.log('📊 FINAL RESULTS');
  console.log('================');
  console.log(`✅ Passed: ${passed}/${testCases.length}`);
  console.log(`❌ Failed: ${failed}/${testCases.length}`);
  console.log(`📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testCases.forEach(testCase => {
      const result = engine.assessProperty(testCase.property, testCase.userInputs);
      let actualResult;
      if (result.result === 'APPROVED') actualResult = 'APPROVED';
      else if (result.result === 'CONDITIONAL') actualResult = 'CONDITIONAL';
      else actualResult = 'REJECTED';
      
      if (actualResult !== testCase.expected) {
        console.log(`   ${testCase.id}: Expected ${testCase.expected} → Got ${actualResult}`);
      }
    });
  }
}

runCompleteTestSuite();