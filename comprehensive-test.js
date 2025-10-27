const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

const testScenarios = [
  {
    id: 'P1-A',
    property: {
      address: '10 Bellenya Drive SPLITTERS CREEK NSW 2640',
      zone_type: 'RU4',
      area_total: 66900,
      heritage_overlay: false,
      bushfire_prone: true,
      has_environmental_overlay: false,
      has_easement: false,
      flood_overlay: false
    },
    userInputs: {
      structure_type: 'Garden Structures & Storage',
      floor_area: 45,
      height: 2.8,
      boundary_distance: 10,
      dwelling_distance: 15,
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0
    },
    expected: 'LIKELY APPROVED',
    reason: 'Structure >5m from dwelling, no bushfire material restrictions'
  },
  {
    id: 'P1-B',
    property: {
      address: '10 Bellenya Drive SPLITTERS CREEK NSW 2640',
      zone_type: 'RU4',
      area_total: 66900,
      heritage_overlay: false,
      bushfire_prone: true,
      has_environmental_overlay: false,
      has_easement: false,
      flood_overlay: false
    },
    userInputs: {
      structure_type: 'Garden Structures & Storage',
      floor_area: 40,
      height: 2.5,
      boundary_distance: 8,
      dwelling_distance: 3,
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0
    },
    expected: 'CONDITIONAL',
    reason: 'Structure <5m from dwelling - MUST use non-combustible materials'
  },
  {
    id: 'P2-A',
    property: {
      address: '181 Bretton Road SPLITTERS CREEK NSW 2640',
      zone_type: 'C3',
      area_total: 40180,
      heritage_overlay: false,
      bushfire_prone: true,
      has_environmental_overlay: true,
      has_easement: false,
      flood_overlay: false
    },
    userInputs: {
      structure_type: 'Garden Structures & Storage',
      floor_area: 15,
      height: 2.5,
      boundary_distance: 8,
      dwelling_distance: 10,
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0
    },
    expected: 'LIKELY REJECTED',
    reason: 'Environmental overlay PROHIBITS garden structures'
  },
  {
    id: 'P11-A',
    property: {
      address: '421 Albert Street LAVINGTON NSW 2641',
      zone_type: 'R1',
      area_total: 1056,
      heritage_overlay: true,
      bushfire_prone: false,
      has_environmental_overlay: false,
      has_easement: false,
      flood_overlay: false
    },
    userInputs: {
      structure_type: 'Garden Structures & Storage',
      floor_area: 18,
      height: 2.6,
      boundary_distance: 3,
      dwelling_distance: 8,
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0
    },
    expected: 'LIKELY REJECTED',
    reason: 'Heritage overlay prohibits garden structures'
  },
  {
    id: 'P6-A',
    property: {
      address: '501 Abercorn Street SOUTH ALBURY NSW 2640',
      zone_type: 'R3',
      area_total: 765.1,
      heritage_overlay: false,
      bushfire_prone: false,
      has_environmental_overlay: false,
      has_easement: false,
      flood_overlay: true
    },
    userInputs: {
      structure_type: 'Garden Structures & Storage',
      floor_area: 19,
      height: 2.5,
      boundary_distance: 2,
      dwelling_distance: 8,
      tree_removal: false,
      asbestos_type: 'A',
      stormwater_connected: true,
      is_shipping_container: false,
      is_habitable: false,
      existing_garden_structures: 0
    },
    expected: 'LIKELY APPROVED',
    reason: 'Flood does NOT prevent exempt development. All requirements met.'
  }
];

function runComprehensiveTests() {
  const engine = new EnhancedRulesEngine();
  console.log('🧪 Running Comprehensive Test Scenarios with Enhanced Engine\n');
  
  let passed = 0;
  let failed = 0;
  
  testScenarios.forEach(scenario => {
    console.log(`\n📋 Test ${scenario.id}: ${scenario.property.address}`);
    console.log(`Expected: ${scenario.expected}`);
    console.log(`Reason: ${scenario.reason}`);
    
    const result = engine.assessProperty(scenario.property, scenario.userInputs);
    
    console.log(`\n🔍 Actual Result: ${result.result}`);
    
    if (result.issues.length > 0) {
      console.log(`Issues:`);
      result.issues.forEach(issue => {
        console.log(`  ${issue}`);
      });
    }
    
    if (result.conditions.length > 0) {
      console.log(`Conditions:`);
      result.conditions.forEach(condition => {
        console.log(`  ${condition}`);
      });
    }
    
    console.log(`\n📊 Summary: ${result.summary.complies} complies, ${result.summary.fails} fails, ${result.summary.conditional} conditional`);
    
    // Test pass/fail logic
    const testPassed = result.result.includes(scenario.expected.split(' ')[1]) || 
                      (scenario.expected === 'CONDITIONAL' && result.result.includes('CONDITIONAL'));
    
    if (testPassed) {
      console.log(`✅ TEST PASSED`);
      passed++;
    } else {
      console.log(`❌ TEST FAILED - Expected: ${scenario.expected}, Got: ${result.result}`);
      failed++;
    }
    
    console.log(`${'='.repeat(80)}`);
  });
  
  console.log(`\n📊 Test Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

runComprehensiveTests();