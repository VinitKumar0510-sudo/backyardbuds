const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

// All test scenarios from the provided data
const allScenarios = [
  // P1 Series - Bushfire + Rural
  {
    id: 'P1-A',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 45, height: 2.8, boundary_distance: 10, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 1 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P1-B',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.5, boundary_distance: 8, dwelling_distance: 3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0, materials: 'timber' },
    expected: 'CONDITIONAL', actualResult: 'CONDITIONAL'
  },
  {
    id: 'P1-C',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 48, height: 2.7, boundary_distance: 6, dwelling_distance: 4, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'LIKELY EXEMPTED', actualResult: 'LIKELY EXEMPTED'
  },
  {
    id: 'P1-D',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 24, height: 2.9, boundary_distance: 7, dwelling_distance: 6, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P1-E',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 22, height: 2.5, boundary_distance: 6, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P2 Series - Bushfire + Environmental
  {
    id: 'P2-A',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 15, height: 2.5, boundary_distance: 8, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P2-B',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 40, height: 2.8, boundary_distance: 7, dwelling_distance: 3.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'NOT EXEMPTED', actualResult: 'NOT EXEMPTED'
  },
  {
    id: 'P2-C',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Outdoor Entertainment Areas', floor_area: 20, height: 2.6, boundary_distance: 6, dwelling_distance: 4, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'LIKELY EXEMPTED', actualResult: 'LIKELY EXEMPTED'
  },

  // P3 Series - Easement
  {
    id: 'P3-A',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P3-B',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P3-C',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P6 Series - Flood
  {
    id: 'P6-A',
    property: { zone_type: 'R3', area_total: 765.1, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.5, boundary_distance: 2, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P6-B',
    property: { zone_type: 'R3', area_total: 765.1, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Carports', floor_area: 24, height: 2.7, boundary_distance: 1.5, dwelling_distance: 3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P8 Series - Triple overlay
  {
    id: 'P8-A',
    property: { zone_type: 'C3', area_total: 49000, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.8, boundary_distance: 15, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P11 Series - Heritage
  {
    id: 'P11-A',
    property: { zone_type: 'R1', area_total: 1056, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.6, boundary_distance: 3, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P11-B',
    property: { zone_type: 'R1', area_total: 1056, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 24, height: 2.8, boundary_distance: 2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P12 Series - Heritage + Bushfire
  {
    id: 'P12-A',
    property: { zone_type: 'R1', area_total: 2194, heritage_overlay: true, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.7, boundary_distance: 4, dwelling_distance: 4.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },

  // P15 Series - Clean properties
  {
    id: 'P15-A',
    property: { zone_type: 'W2', area_total: 242812, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 48, height: 2.9, boundary_distance: 20, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  },
  {
    id: 'P15-B',
    property: { zone_type: 'W2', area_total: 242812, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 49, height: 2.9, boundary_distance: 15, dwelling_distance: 12, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'EXEMPTED', actualResult: 'EXEMPTED'
  }
];

function runAllScenarios() {
  const engine = new EnhancedRulesEngine();
  console.log('🧪 TESTING ALL SCENARIOS FROM TEST DATA');
  console.log('==========================================\n');
  
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let conditionalCorrect = 0;
  let approvedCorrect = 0;
  let rejectedCorrect = 0;
  
  const results = [];
  
  allScenarios.forEach(scenario => {
    totalTests++;
    console.log(`📋 ${scenario.id}: Testing ${scenario.userInputs.structure_type}`);
    
    const result = engine.assessProperty(scenario.property, scenario.userInputs);
    
    // Determine test outcome
    let testPassed = false;
    let category = result.result || 'UNKNOWN';
    
    if (category === 'APPROVED') {
      if (scenario.expected.includes('EXEMPTED') || scenario.expected.includes('APPROVED')) {
        testPassed = true;
        approvedCorrect++;
      }
    } else if (category === 'CONDITIONAL') {
      if (scenario.expected.includes('CONDITIONAL')) {
        testPassed = true;
        conditionalCorrect++;
      }
    } else if (category === 'NON EXEMPT') {
      category = 'REJECTED';
      if (scenario.expected.includes('NOT EXEMPTED') || scenario.expected.includes('REJECTED')) {
        testPassed = true;
        rejectedCorrect++;
      }
    }
    
    if (testPassed) {
      passed++;
      console.log(`   ✅ PASS: Expected ${scenario.expected} → Got ${category}`);
    } else {
      failed++;
      console.log(`   ❌ FAIL: Expected ${scenario.expected} → Got ${category}`);
      if (result.issues && result.issues.length > 0) {
        console.log(`      Issues: ${result.issues.slice(0, 2).join(', ')}${result.issues.length > 2 ? '...' : ''}`);
      }
      if (result.conditions && result.conditions.length > 0) {
        console.log(`      Conditions: ${result.conditions.length}`);
      }
    }
    
    results.push({
      id: scenario.id,
      expected: scenario.expected,
      actual: category,
      passed: testPassed,
      issues: result.issues.length,
      conditions: result.conditions.length
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📈 Results by Category:');
  console.log(`   ✅ Approved Correctly: ${approvedCorrect}`);
  console.log(`   ⚠️ Conditional Correctly: ${conditionalCorrect}`);
  console.log(`   ❌ Rejected Correctly: ${rejectedCorrect}`);
  
  // Show failed tests
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`   ${test.id}: Expected ${test.expected} → Got ${test.actual}`);
    });
  }
  
  // Show summary by test series
  console.log('\n📋 Results by Test Series:');
  const series = ['P1', 'P2', 'P3', 'P6', 'P8', 'P11', 'P12', 'P15'];
  series.forEach(s => {
    const seriesTests = results.filter(r => r.id.startsWith(s));
    const seriesPassed = seriesTests.filter(r => r.passed).length;
    if (seriesTests.length > 0) {
      console.log(`   ${s}: ${seriesPassed}/${seriesTests.length} passed`);
    }
  });
}

runAllScenarios();