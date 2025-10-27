const RulesEngine = require('./backend/rules/engine');

const testScenarios = [
  {
    id: 'P1-A',
    property: {
      address: '10 Bellenya Drive SPLITTERS CREEK NSW 2640',
      zoning: 'RU4',
      lotSizeM2: 66900,
      heritageOverlay: false,
      bushfireProne: true,
      hasEnvironmentalOverlay: false,
      hasEasement: false,
      floodOverlay: false
    },
    proposal: {
      structureType: 'shed',
      floorArea: 45,
      height: 2.8,
      distanceFromBoundary: 10,
      distanceFromDwelling: 15,
      behindBuildingLine: true,
      isNonCombustible: false,
      stormwaterManaged: true
    },
    expected: 'EXEMPTED',
    reason: 'Structure >5m from dwelling, no bushfire material restrictions'
  },
  {
    id: 'P1-B',
    property: {
      address: '10 Bellenya Drive SPLITTERS CREEK NSW 2640',
      zoning: 'RU4',
      lotSizeM2: 66900,
      heritageOverlay: false,
      bushfireProne: true,
      hasEnvironmentalOverlay: false,
      hasEasement: false,
      floodOverlay: false
    },
    proposal: {
      structureType: 'shed',
      floorArea: 40,
      height: 2.5,
      distanceFromBoundary: 8,
      distanceFromDwelling: 3,
      behindBuildingLine: true,
      isNonCombustible: false,
      stormwaterManaged: true
    },
    expected: 'CONDITIONAL',
    reason: 'Structure <5m from dwelling - MUST use non-combustible materials'
  },
  {
    id: 'P2-A',
    property: {
      address: '181 Bretton Road SPLITTERS CREEK NSW 2640',
      zoning: 'C3',
      lotSizeM2: 40180,
      heritageOverlay: false,
      bushfireProne: true,
      hasEnvironmentalOverlay: true,
      hasEasement: false,
      floodOverlay: false
    },
    proposal: {
      structureType: 'shed',
      floorArea: 15,
      height: 2.5,
      distanceFromBoundary: 8,
      distanceFromDwelling: 10,
      behindBuildingLine: true,
      isNonCombustible: true,
      stormwaterManaged: true
    },
    expected: 'NOT EXEMPTED',
    reason: 'Environmental overlay PROHIBITS garden structures'
  },
  {
    id: 'P11-A',
    property: {
      address: '421 Albert Street LAVINGTON NSW 2641',
      zoning: 'R1',
      lotSizeM2: 1056,
      heritageOverlay: true,
      bushfireProne: false,
      hasEnvironmentalOverlay: false,
      hasEasement: false,
      floodOverlay: false
    },
    proposal: {
      structureType: 'shed',
      floorArea: 18,
      height: 2.6,
      distanceFromBoundary: 3,
      distanceFromDwelling: 8,
      behindBuildingLine: true,
      isNonCombustible: false,
      stormwaterManaged: true
    },
    expected: 'NOT EXEMPTED',
    reason: 'Heritage overlay prohibits garden structures'
  }
];

function runTests() {
  const engine = new RulesEngine();
  console.log('🧪 Running Test Scenarios\n');
  
  let passed = 0;
  let failed = 0;
  
  testScenarios.forEach(scenario => {
    console.log(`\n📋 Test ${scenario.id}: ${scenario.property.address}`);
    console.log(`Expected: ${scenario.expected}`);
    console.log(`Reason: ${scenario.reason}`);
    
    const result = engine.assessProposal(scenario.property, scenario.proposal);
    
    console.log(`\n🔍 Actual Result:`);
    console.log(`Recommendation: ${result.recommendation.toUpperCase()}`);
    console.log(`Reasoning: ${result.reasoning}`);
    
    if (result.failedConditions.length > 0) {
      console.log(`Failed Conditions:`);
      result.failedConditions.forEach(condition => {
        console.log(`  ❌ ${condition}`);
      });
    }
    
    if (result.warnings && result.warnings.length > 0) {
      console.log(`Warnings:`);
      result.warnings.forEach(warning => {
        console.log(`  ⚠️ ${warning}`);
      });
    }
    
    // Simple pass/fail check
    const actualResult = result.recommendation === 'exempt' ? 'EXEMPTED' : 'NOT EXEMPTED';
    const testPassed = actualResult === scenario.expected || 
                      (scenario.expected === 'CONDITIONAL' && result.recommendation === 'not_exempt');
    
    if (testPassed) {
      console.log(`✅ TEST PASSED`);
      passed++;
    } else {
      console.log(`❌ TEST FAILED - Expected: ${scenario.expected}, Got: ${actualResult}`);
      failed++;
    }
    
    console.log(`${'='.repeat(80)}`);
  });
  
  console.log(`\n📊 Test Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

runTests();