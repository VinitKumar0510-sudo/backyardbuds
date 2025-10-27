const EnhancedRulesEngine = require('./backend/rules/enhanced-engine');

console.log('🧪 TESTING P2-A SCENARIO');
console.log('========================\n');

const engine = new EnhancedRulesEngine();

// P2-A: 181 Bretton Road SPLITTERS CREEK NSW 2640
const p2aTest = {
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
    }
};

console.log('📋 Property Details:');
console.log(`   Address: ${p2aTest.property.address}`);
console.log(`   Zone: ${p2aTest.property.zone_type}`);
console.log(`   Lot Size: ${p2aTest.property.area_total.toLocaleString()} m²`);
console.log(`   Heritage: ${p2aTest.property.heritage_overlay ? 'YES' : 'NO'}`);
console.log(`   Bushfire: ${p2aTest.property.bushfire_prone ? 'YES' : 'NO'}`);
console.log(`   Environmental: ${p2aTest.property.has_environmental_overlay ? 'YES' : 'NO'}`);
console.log(`   Easement: ${p2aTest.property.has_easement ? 'YES' : 'NO'}`);
console.log(`   Flood: ${p2aTest.property.flood_overlay ? 'YES' : 'NO'}`);

console.log('\n📋 Proposed Structure:');
console.log(`   Type: ${p2aTest.userInputs.structure_type}`);
console.log(`   Floor Area: ${p2aTest.userInputs.floor_area} m²`);
console.log(`   Height: ${p2aTest.userInputs.height} m`);
console.log(`   Boundary Distance: ${p2aTest.userInputs.boundary_distance} m`);
console.log(`   Dwelling Distance: ${p2aTest.userInputs.dwelling_distance} m`);

console.log('\n🔍 ASSESSMENT RESULT:');
console.log('====================');

const result = engine.assessProperty(p2aTest.property, p2aTest.userInputs);

console.log(`Status: ${result.result}`);
console.log(`Message: ${result.message}`);

if (result.issues && result.issues.length > 0) {
    console.log('\n❌ Issues:');
    result.issues.forEach(issue => {
        console.log(`   ${issue}`);
    });
}

if (result.conditions && result.conditions.length > 0) {
    console.log('\n⚠️ Conditions:');
    result.conditions.forEach(condition => {
        console.log(`   ${condition}`);
    });
}

console.log('\n📊 Legislation Applied:');
result.legislationApplied.forEach(law => {
    console.log(`   ${law.status} ${law.clause}: ${law.plain}`);
});

console.log('\n📈 Summary:');
console.log(`   Total Checks: ${result.summary.totalChecked}`);
console.log(`   Complies: ${result.summary.complies}`);
console.log(`   Fails: ${result.summary.fails}`);
console.log(`   Conditional: ${result.summary.conditional}`);

console.log('\n✅ EXPECTED: EXEMPTED');
console.log(`🎯 ACTUAL: ${result.result}`);
console.log(`📊 TEST: ${result.result === 'APPROVED' ? 'PASS' : 'FAIL'}`);