const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

// Full test suite based on the provided test scenarios
const fullTestSuite = [
  // P1 Series - Bushfire + Rural
  {
    id: 'P1-A',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 45, height: 2.8, boundary_distance: 10, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 1 },
    expected: 'APPROVED', reason: 'Structure >5m from dwelling, no bushfire material restrictions'
  },
  {
    id: 'P1-B',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.5, boundary_distance: 8, dwelling_distance: 3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'CONDITIONAL', reason: 'Structure <5m from dwelling - MUST use non-combustible materials'
  },
  {
    id: 'P1-C',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 48, height: 2.7, boundary_distance: 6, dwelling_distance: 4, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED', reason: 'Bushfire materials compliant: Steel/metal = non-combustible'
  },

  // P2 Series - Bushfire + Environmental (Double overlay)
  {
    id: 'P2-A',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 15, height: 2.5, boundary_distance: 8, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED', reason: 'Environmental overlay PROHIBITS garden structures'
  },
  {
    id: 'P2-B',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 40, height: 2.8, boundary_distance: 7, dwelling_distance: 3.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED', reason: 'SIZE EXCEEDS LIMIT (40m² > 25m²) for C3 zone'
  },

  // P3 Series - Easement scenarios
  {
    id: 'P3-A',
    property: { zone_type: 'MU1', area_total: 213.6, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: true, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.7, boundary_distance: 1.2, dwelling_distance: 5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'CONDITIONAL', reason: 'Must be ≥1m from easement. Distance not provided - need to verify'
  },

  // P6 Series - Flood overlay (should be informational only)
  {
    id: 'P6-A',
    property: { zone_type: 'R3', area_total: 765.1, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.5, boundary_distance: 2, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED', reason: 'Flood does NOT prevent exempt development. All requirements met.'
  },

  // P11 Series - Heritage overlay
  {
    id: 'P11-A',
    property: { zone_type: 'R1', area_total: 1056, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.6, boundary_distance: 3, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED', reason: 'Heritage overlay prohibits garden structures'
  },

  // P12 Series - Heritage + Bushfire (Double overlay)
  {
    id: 'P12-A',
    property: { zone_type: 'R1', area_total: 2194, heritage_overlay: true, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.7, boundary_distance: 4, dwelling_distance: 4.5, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED', reason: 'Heritage blocks (no exemption). Bushfire <5m requires non-combustible, timber prohibited'
  },

  // P15 Series - Clean properties (no overlays)
  {
    id: 'P15-A',
    property: { zone_type: 'W2', area_total: 242812, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 48, height: 2.9, boundary_distance: 20, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED', reason: 'No overlays. All requirements met. W2 treated as rural (50m² limit)'
  },
  {
    id: 'P15-B',
    property: { zone_type: 'W2', area_total: 242812, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Carports', floor_area: 49, height: 2.9, boundary_distance: 15, dwelling_distance: 12, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED', reason: 'No overlays. W2 allows 50m² (rural-style). Setbacks far exceed minimums'
  }
];

function runFullTestSuite() {
  const engine = new EnhancedRulesEngine();
  console.log('🧪 Running Full Test Suite - All Scenarios\n');
  console.log(`Testing ${fullTestSuite.length} scenarios...\n`);
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  fullTestSuite.forEach(scenario => {
    console.log(`📋 ${scenario.id}: ${scenario.reason}`);
    
    const result = engine.assessProperty(scenario.property, scenario.userInputs);
    
    // Determine if test passed
    let testPassed = false;
    if (scenario.expected === 'APPROVED' && result.result.includes('APPROVED')) {
      testPassed = true;
    } else if (scenario.expected === 'CONDITIONAL' && result.result.includes('CONDITIONAL')) {
      testPassed = true;
    } else if (scenario.expected === 'REJECTED' && result.result.includes('REJECTED')) {
      testPassed = true;
    }
    
    const status = testPassed ? '✅ PASS' : '❌ FAIL';
    console.log(`   Expected: ${scenario.expected} | Got: ${result.result} | ${status}`);
    
    if (testPassed) {
      passed++;
    } else {
      failed++;
      console.log(`   Issues: ${result.issues.join(', ')}`);
      console.log(`   Conditions: ${result.conditions.join(', ')}`);
    }
    
    results.push({
      id: scenario.id,
      expected: scenario.expected,
      actual: result.result,
      passed: testPassed,
      issues: result.issues.length,
      conditions: result.conditions.length
    });
  });
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 FULL TEST SUITE RESULTS`);
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Passed: ${passed}/${fullTestSuite.length}`);
  console.log(`❌ Failed: ${failed}/${fullTestSuite.length}`);
  console.log(`📈 Success Rate: ${((passed / fullTestSuite.length) * 100).toFixed(1)}%`);
  
  // Show failed tests
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log(`\n❌ Failed Tests:`);
    failedTests.forEach(test => {
      console.log(`   ${test.id}: Expected ${test.expected}, Got ${test.actual}`);
    });
  }
  
  // Summary by category
  const approvedTests = results.filter(r => r.expected === 'APPROVED');
  const conditionalTests = results.filter(r => r.expected === 'CONDITIONAL');
  const rejectedTests = results.filter(r => r.expected === 'REJECTED');
  
  console.log(`\n📈 Results by Category:`);
  console.log(`   APPROVED: ${approvedTests.filter(t => t.passed).length}/${approvedTests.length}`);
  console.log(`   CONDITIONAL: ${conditionalTests.filter(t => t.passed).length}/${conditionalTests.length}`);
  console.log(`   REJECTED: ${rejectedTests.filter(t => t.passed).length}/${rejectedTests.length}`);\n}\n\nrunFullTestSuite();