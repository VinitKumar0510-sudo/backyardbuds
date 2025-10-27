const axios = require('axios');
const fs = require('fs');

const testCases = `Test_ID,Test_Category,Zone,Lot_Size_m2,Heritage,Bushfire,Environmental,Easement,Flood,Structure_Type,Floor_Area_m2,Height_m,Boundary_Distance_m,Dwelling_Distance_m,Wall_Height_m,Floor_Height_m,Materials,Easement_Distance_m,Expected_Result
GS001,Garden Structures Basic,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,15,2.5,2,10,,,,,APPROVED
GS002,Garden Structures Basic,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,25,2.5,2,10,,,,,REJECTED
GS003,Garden Structures Basic,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,15,3.5,2,10,,,,,REJECTED
GS004,Garden Structures Basic,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,15,2.5,0.5,10,,,,,REJECTED
GS005,Garden Structures Rural,RU1,5000,NO,NO,NO,NO,NO,Garden Structures & Storage,45,2.5,6,10,,,,,APPROVED
GS006,Garden Structures Rural,RU2,5000,NO,NO,NO,NO,NO,Garden Structures & Storage,55,2.5,6,10,,,,,REJECTED
GS007,Garden Structures Rural,RU3,5000,NO,NO,NO,NO,NO,Garden Structures & Storage,45,2.5,3,10,,,,,REJECTED
GS008,Garden Structures Rural,RU4,5000,NO,NO,NO,NO,NO,Garden Structures & Storage,50,3,5,10,,,,,APPROVED
GS009,Garden Structures Heritage,R1,800,YES,NO,NO,NO,NO,Garden Structures & Storage,15,2.5,2,10,,,,,REJECTED
GS010,Garden Structures Heritage,R2,800,YES,NO,NO,NO,NO,Garden Structures & Storage,10,2,3,15,,,,,REJECTED
GS011,Garden Structures Environmental,R1,800,NO,NO,YES,NO,NO,Garden Structures & Storage,15,2.5,2,10,,,,,REJECTED
GS012,Garden Structures Environmental,E4,2000,NO,NO,YES,NO,NO,Garden Structures & Storage,18,2.8,2,0,,,,,REJECTED
GS013,Garden Structures Bushfire,R1,800,NO,YES,NO,NO,NO,Garden Structures & Storage,15,2.5,2,3,,timber,,CONDITIONAL
GS014,Garden Structures Bushfire,R1,800,NO,YES,NO,NO,NO,Garden Structures & Storage,15,2.5,2,3,,steel,,APPROVED
GS015,Garden Structures Bushfire,R1,800,NO,YES,NO,NO,NO,Garden Structures & Storage,15,2.5,2,6,,,,,APPROVED
CP001,Carports Basic,R1,250,NO,NO,NO,NO,NO,Carports,18,2.5,2,10,,,,,APPROVED
CP002,Carports Basic,R1,250,NO,NO,NO,NO,NO,Carports,25,2.5,2,10,,,,,REJECTED
CP003,Carports Basic,R1,400,NO,NO,NO,NO,NO,Carports,22,2.5,2,10,,,,,APPROVED
CP004,Carports Basic,R1,400,NO,NO,NO,NO,NO,Carports,30,2.5,2,10,,,,,REJECTED
OE001,Outdoor Entertainment Basic,R1,800,NO,NO,NO,NO,NO,Outdoor Entertainment Areas,20,2.5,2,10,,,,,APPROVED
OE002,Outdoor Entertainment Basic,R1,800,NO,NO,NO,NO,NO,Outdoor Entertainment Areas,30,2.5,2,10,,,,,REJECTED
OE003,Outdoor Entertainment Basic,R1,800,NO,NO,NO,NO,NO,Outdoor Entertainment Areas,20,3.5,2,10,,,,,REJECTED
EC001,Edge Cases,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,20,3,0.9,10,,,,,APPROVED
EC002,Edge Cases,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,20.1,3,0.9,10,,,,,REJECTED
EC003,Edge Cases,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,20,3.1,0.9,10,,,,,REJECTED
EC004,Edge Cases,R1,800,NO,NO,NO,NO,NO,Garden Structures & Storage,20,3,0.8,10,,,,,REJECTED`;

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const tests = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const test = {};
        headers.forEach((header, index) => {
            test[header] = values[index] || '';
        });
        tests.push(test);
    }
    return tests;
}

function createAssessmentPayload(test) {
    return {
        property: {
            short_address: `Test Property ${test.Test_ID}`,
            zone_type: test.Zone,
            zone_description: `${test.Zone} Zone`,
            area_total: parseInt(test.Lot_Size_m2),
            area_units: 'm²',
            heritage_overlay: test.Heritage === 'YES',
            bushfire_prone: test.Bushfire === 'YES',
            has_environmental_overlay: test.Environmental === 'YES',
            has_easement: test.Easement === 'YES',
            flood_overlay: test.Flood === 'YES'
        },
        userInputs: {
            structure_type: test.Structure_Type,
            floor_area: parseFloat(test.Floor_Area_m2),
            height: parseFloat(test.Height_m),
            boundary_distance: parseFloat(test.Boundary_Distance_m),
            dwelling_distance: parseFloat(test.Dwelling_Distance_m) || 0,
            tree_removal: false,
            tree_permit: false,
            asbestos_type: 'A',
            stormwater_connected: true,
            is_shipping_container: false,
            is_habitable: false,
            cabana_services: false,
            existing_garden_structures: 0,
            new_driveway: false,
            road_consent: false,
            existing_carports: 0,
            has_walls: test.Wall_Height_m ? true : false,
            has_roof: true,
            attached: false,
            floor_height: parseFloat(test.Floor_Height_m) || 0,
            existing_outdoor_area: 0
        }
    };
}

function mapResult(assessment) {
    const result = assessment.result;
    const hasIssues = assessment.issues && assessment.issues.length > 0;
    const hasConditions = assessment.conditions && assessment.conditions.length > 0;
    
    if (hasIssues) return 'REJECTED';
    if (hasConditions) return 'CONDITIONAL';
    if (result.includes('LIKELY APPROVED') || result.includes('✅')) return 'APPROVED';
    if (result.includes('CONDITIONAL') || result.includes('⚠️')) return 'CONDITIONAL';
    if (result.includes('REJECTED') || result.includes('❌')) return 'REJECTED';
    return 'APPROVED'; // Default to approved if no issues or conditions
}

async function runTests() {
    const tests = parseCSV(testCases);
    const results = [];
    let passed = 0;
    let failed = 0;
    
    console.log(`Running ${tests.length} test cases...\n`);
    
    for (const test of tests) {
        try {
            const payload = createAssessmentPayload(test);
            const response = await axios.post('http://localhost:3001/api/assess', payload);
            
            const actualResult = mapResult(response.data.assessment);
            const expectedResult = test.Expected_Result;
            const isPass = actualResult === expectedResult;
            
            if (isPass) {
                passed++;
                console.log(`✅ ${test.Test_ID}: ${actualResult} (expected ${expectedResult})`);
            } else {
                failed++;
                console.log(`❌ ${test.Test_ID}: ${actualResult} (expected ${expectedResult})`);
            }
            
            results.push({
                testId: test.Test_ID,
                category: test.Test_Category,
                expected: expectedResult,
                actual: actualResult,
                pass: isPass,
                issues: response.data.assessment.issues || [],
                conditions: response.data.assessment.conditions || []
            });
            
        } catch (error) {
            failed++;
            console.log(`❌ ${test.Test_ID}: ERROR - ${error.message}`);
            results.push({
                testId: test.Test_ID,
                category: test.Test_Category,
                expected: test.Expected_Result,
                actual: 'ERROR',
                pass: false,
                error: error.message
            });
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
    
    // Save detailed results
    fs.writeFileSync('test-results-detailed.json', JSON.stringify(results, null, 2));
    console.log(`\n📄 Detailed results saved to test-results-detailed.json`);
    
    // Show failed tests summary
    const failedTests = results.filter(r => !r.pass);
    if (failedTests.length > 0) {
        console.log(`\n❌ Failed Tests Summary:`);
        failedTests.forEach(test => {
            console.log(`  ${test.testId} (${test.category}): Expected ${test.expected}, Got ${test.actual}`);
        });
    }
}

// Run the tests
runTests().catch(console.error);