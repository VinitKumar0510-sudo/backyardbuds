const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

const testScenarios = [
  {
    id: 'P1-A',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 45, height: 2.8, boundary_distance: 10, dwelling_distance: 15, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 1 },
    expected: 'APPROVED'
  },
  {
    id: 'P1-B',
    property: { zone_type: 'RU4', area_total: 66900, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 40, height: 2.5, boundary_distance: 8, dwelling_distance: 3, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'CONDITIONAL'
  },
  {
    id: 'P2-A',
    property: { zone_type: 'C3', area_total: 40180, heritage_overlay: false, bushfire_prone: true, has_environmental_overlay: true, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 15, height: 2.5, boundary_distance: 8, dwelling_distance: 10, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P11-A',
    property: { zone_type: 'R1', area_total: 1056, heritage_overlay: true, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: false },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 18, height: 2.6, boundary_distance: 3, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'REJECTED'
  },
  {
    id: 'P6-A',
    property: { zone_type: 'R3', area_total: 765.1, heritage_overlay: false, bushfire_prone: false, has_environmental_overlay: false, has_easement: false, flood_overlay: true },
    userInputs: { structure_type: 'Garden Structures & Storage', floor_area: 19, height: 2.5, boundary_distance: 2, dwelling_distance: 8, tree_removal: false, asbestos_type: 'A', stormwater_connected: true, is_shipping_container: false, is_habitable: false, existing_garden_structures: 0 },
    expected: 'APPROVED'
  }
];

function runTests() {
  const engine = new EnhancedRulesEngine();
  console.log('Testing Enhanced Rules Engine\n');
  
  let passed = 0;
  let failed = 0;
  
  testScenarios.forEach(scenario => {
    console.log(`Test ${scenario.id}:`);
    
    const result = engine.assessProperty(scenario.property, scenario.userInputs);
    
    let testPassed = false;
    if (scenario.expected === 'APPROVED' && result.result.includes('APPROVED')) {
      testPassed = true;
    } else if (scenario.expected === 'CONDITIONAL' && result.result.includes('CONDITIONAL')) {
      testPassed = true;
    } else if (scenario.expected === 'REJECTED' && result.result.includes('REJECTED')) {
      testPassed = true;
    }
    
    console.log(`  Expected: ${scenario.expected}`);
    console.log(`  Got: ${result.result}`);
    console.log(`  Result: ${testPassed ? 'PASS' : 'FAIL'}`);
    
    if (result.issues.length > 0) {
      console.log(`  Issues: ${result.issues.length}`);
    }
    if (result.conditions.length > 0) {
      console.log(`  Conditions: ${result.conditions.length}`);
    }
    
    if (testPassed) {
      passed++;
    } else {
      failed++;
    }
    
    console.log('');
  });
  
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

runTests();