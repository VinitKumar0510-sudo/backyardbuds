const fs = require('fs');
const path = require('path');

class EnhancedRulesEngine {
    constructor() {
        this.rules = this.loadRules();
        this.propertyData = null;
    }

    loadRules() {
        try {
            const rulesPath = path.join(__dirname, '../../rules/sepp-exempt-dev-rules-clean.csv');
            const csvContent = fs.readFileSync(rulesPath, 'utf-8');
            return this.parseCSV(csvContent);
        } catch (error) {
            console.error('Error loading rules:', error);
            return [];
        }
    }

    parseCSV(csvContent) {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        const rules = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCSVLine(lines[i]);
                const rule = {};
                headers.forEach((header, index) => {
                    rule[header.trim()] = values[index] ? values[index].trim() : '';
                });
                rules.push(rule);
            }
        }
        return rules;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    getRelevantLegislation(structureType, category = null) {
        let filtered = this.rules.filter(rule => 
            rule['Structure Type'] === structureType
        );
        
        if (category) {
            filtered = filtered.filter(rule => 
                rule['Category'] === category
            );
        }
        
        return filtered;
    }

    assessProperty(propertyData, userInputs) {
        this.propertyData = propertyData;
        const issues = [];
        const warnings = [];
        const conditions = [];
        const infoNotes = [];
        const legislationApplied = [];

        const structureType = userInputs.structure_type;

        // Step 1: Check General Requirements (Clause 1.16)
        this.checkGeneralRequirements(userInputs, issues, conditions, legislationApplied);

        // Step 2: Check Heritage & Environmental Overlays
        this.checkOverlays(propertyData, structureType, userInputs, issues, conditions, legislationApplied);

        // Step 3: Check Structure-Specific Requirements
        this.checkStructureSpecificRequirements(propertyData, userInputs, issues, conditions, legislationApplied);

        // Step 4: Determine Final Result
        const finalResult = this.determineFinalResult(issues, conditions);

        return {
            result: finalResult.status,
            message: finalResult.message,
            issues: finalResult.issues || issues,
            conditions: finalResult.conditions || conditions,
            warnings,
            infoNotes,
            legislationApplied,
            summary: {
                totalChecked: legislationApplied.length,
                complies: legislationApplied.filter(l => l.status.includes('✓')).length,
                fails: legislationApplied.filter(l => l.status.includes('❌')).length,
                conditional: legislationApplied.filter(l => l.status.includes('⚠️')).length
            }
        };
    }

    checkGeneralRequirements(userInputs, issues, conditions, legislationApplied) {
        // Tree removal check
        const treeRules = this.getRelevantLegislation('General Requirements', 'Vegetation Protection');
        if (treeRules.length > 0) {
            const rule = treeRules[0];
            if (userInputs.tree_removal && !userInputs.tree_permit) {
                issues.push("❌ TREE REMOVAL WITHOUT PERMIT");
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: '❌ FAILS'
                });
            } else {
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: '✓ COMPLIES'
                });
            }
        }

        // Asbestos check
        const asbestosRules = this.getRelevantLegislation('General Requirements', 'Hazardous Materials');
        asbestosRules.forEach(rule => {
            let status = '✓ COMPLIES';
            if (userInputs.asbestos_type === 'C') {
                issues.push("❌ ASBESTOS REMOVAL EXCEEDS LIMITS");
                status = '❌ FAILS';
            } else if (userInputs.asbestos_type === 'D') {
                status = '✓ COMPLIES (Licensed)';
            }

            legislationApplied.push({
                clause: rule['Clause Reference'],
                text: rule['Exact Legislative Text'],
                plain: rule['Plain English Explanation'],
                status
            });
        });
    }

    checkOverlays(propertyData, structureType, userInputs, issues, conditions, legislationApplied) {
        // Heritage check - Reject unless Heritage Act exemption obtained
        if (propertyData.heritage_overlay) {
            issues.push("❌ HERITAGE OVERLAY - Heritage overlay prohibits structures unless Heritage Act s.57 exemption obtained");
            legislationApplied.push({
                clause: '1.16(1)(c)',
                text: 'must not be carried out on heritage item',
                plain: 'Heritage overlay requires Development Application',
                status: '❌ FAILS'
            });
        }

        // Environmental overlay - Garden Structures rejected, others conditional
        if (propertyData.has_environmental_overlay) {
            if (structureType === 'Garden Structures & Storage') {
                issues.push("❌ ENVIRONMENTAL OVERLAY - Environmental overlay prohibits garden structures");
                legislationApplied.push({
                    clause: '2.17',
                    text: 'not constructed or installed in an environmentally sensitive area',
                    plain: 'Garden structures prohibited in environmentally sensitive areas',
                    status: '❌ FAILS'
                });
            } else {
                conditions.push("⚠️ ENVIRONMENTAL ASSESSMENT REQUIRED - Environmental assessment needed");
                legislationApplied.push({
                    clause: '1.16(1)(b1)',
                    text: 'must not be carried out on declared biodiversity or critical habitat areas',
                    plain: 'Environmental assessment required',
                    status: '⚠️ CONDITIONAL'
                });
            }
        }

        // Easement check - Garden Structures only
        if (propertyData.has_easement && structureType === 'Garden Structures & Storage') {
            if (userInputs.easement_distance !== undefined) {
                if (userInputs.easement_distance < 1.0) {
                    issues.push(`❌ EASEMENT SETBACK VIOLATION - Structure ${userInputs.easement_distance}m from easement. Must be ≥1m`);
                    legislationApplied.push({
                        clause: '2.18(1)(m)',
                        text: 'be located at least 1m from any registered easement',
                        plain: 'Must be at least 1 meter from any easement',
                        status: '❌ FAILS'
                    });
                } else {
                    legislationApplied.push({
                        clause: '2.18(1)(m)',
                        text: 'be located at least 1m from any registered easement',
                        plain: 'Must be at least 1 meter from any easement',
                        status: '✓ COMPLIES'
                    });
                }
            } else {
                conditions.push("⚠️ MORE INFO REQUIRED - EASEMENT LOCATION - Must be ≥1m from easement. Distance not provided - need to verify");
                legislationApplied.push({
                    clause: '2.18(1)(m)',
                    text: 'be located at least 1m from any registered easement',
                    plain: 'Must be at least 1 meter from any easement',
                    status: '⚠️ CONDITIONAL'
                });
            }
        } else if (propertyData.has_easement) {
            legislationApplied.push({
                clause: 'N/A',
                text: 'Property has easement - ensure structure doesn\'t block access',
                plain: 'Check easement location and avoid building over it',
                status: 'ℹ️ INFORMATIONAL'
            });
        }

        // Flood overlay - Informational only, no restrictions
        if (propertyData.flood_overlay) {
            legislationApplied.push({
                clause: 'N/A',
                text: 'Property is in flood-prone area - no SEPP restrictions for exempt development',
                plain: 'Consider flood risks when planning construction',
                status: 'ℹ️ INFORMATIONAL'
            });
        }
    }

    checkStructureSpecificRequirements(propertyData, userInputs, issues, conditions, legislationApplied) {
        const structureType = userInputs.structure_type;
        const zone = propertyData.zone_type;

        // Size limits
        this.checkSizeLimits(propertyData, userInputs, issues, legislationApplied);

        // Height limits
        this.checkHeightLimits(userInputs, issues, legislationApplied);

        // Boundary setbacks
        this.checkBoundarySetbacks(propertyData, userInputs, issues, legislationApplied);

        // Bushfire requirements
        this.checkBushfireRequirements(propertyData, userInputs, conditions, legislationApplied);

        // Drainage requirements
        this.checkDrainageRequirements(userInputs, issues, legislationApplied);

        // Structure-specific checks
        this.checkStructureSpecificRules(userInputs, issues, conditions, legislationApplied, propertyData);
    }

    checkSizeLimits(propertyData, userInputs, issues, legislationApplied) {
        const structureType = userInputs.structure_type;
        const zone = propertyData.zone_type;
        const lotSize = propertyData.area_total;

        const sizeRules = this.getRelevantLegislation(structureType, 'Size Limits');
        
        let maxSize;
        const ruralZones = ['RU1', 'RU2', 'RU3', 'RU4', 'RU6', 'R5', 'W2', 'C3']; // W2 and C3 treated as rural
        
        if (structureType === 'Garden Structures & Storage') {
            maxSize = ruralZones.includes(zone) ? 50 : 20;
        } else if (structureType === 'Carports') {
            if (ruralZones.includes(zone) && lotSize > 300) {
                maxSize = 50;
            } else if (lotSize > 300) {
                maxSize = 25;
            } else {
                maxSize = 20;
            }
        } else { // Outdoor Entertainment Areas
            maxSize = 25;
        }

        const sizeStatus = userInputs.floor_area <= maxSize ? '✓ COMPLIES' : '❌ FAILS';
        if (sizeStatus === '❌ FAILS') {
            issues.push(`❌ SIZE EXCEEDS LIMIT (${userInputs.floor_area}m² > ${maxSize}m²)`);
        }

        sizeRules.forEach(rule => {
            legislationApplied.push({
                clause: rule['Clause Reference'],
                text: rule['Exact Legislative Text'],
                plain: rule['Plain English Explanation'],
                status: sizeStatus,
                userValue: `${userInputs.floor_area}m²`,
                limit: `${maxSize}m²`
            });
        });
    }

    checkHeightLimits(userInputs, issues, legislationApplied) {
        const heightRules = this.getRelevantLegislation(userInputs.structure_type, 'Height & Dimensions');
        let heightIssueAdded = false;
        
        heightRules.forEach(rule => {
            if (rule['Exact Legislative Text'].includes('3m') || rule['Exact Legislative Text'].toLowerCase().includes('height')) {
                const heightStatus = userInputs.height <= 3 ? '✓ COMPLIES' : '❌ FAILS';
                if (heightStatus === '❌ FAILS' && !heightIssueAdded) {
                    issues.push(`❌ HEIGHT EXCEEDS LIMIT (${userInputs.height}m > 3m)`);
                    heightIssueAdded = true;
                }

                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: heightStatus,
                    userValue: `${userInputs.height}m`,
                    limit: '3m'
                });
            }
        });
    }

    checkBoundarySetbacks(propertyData, userInputs, issues, legislationApplied) {
        const zone = propertyData.zone_type;
        const setbackRules = this.getRelevantLegislation(userInputs.structure_type, 'Boundary Setbacks');
        
        const ruralZones = ['RU1', 'RU2', 'RU3', 'RU4', 'RU6', 'R5', 'W2', 'C3'];
        const minSetback = ruralZones.includes(zone) ? 5 : 0.9;
        const setbackStatus = userInputs.boundary_distance >= minSetback ? '✓ COMPLIES' : '❌ FAILS';
        
        if (setbackStatus === '❌ FAILS') {
            issues.push(`❌ BOUNDARY SETBACK TOO SMALL (${userInputs.boundary_distance}m < ${minSetback}m)`);
        }

        setbackRules.forEach(rule => {
            if (rule['Exact Legislative Text'].toLowerCase().includes('boundary')) {
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: setbackStatus,
                    userValue: `${userInputs.boundary_distance}m`,
                    limit: `${minSetback}m`
                });
            }
        });
    }

    checkBushfireRequirements(propertyData, userInputs, conditions, legislationApplied) {
        if (propertyData.bushfire_prone) {
            const bushfireRules = this.getRelevantLegislation(userInputs.structure_type, 'Bushfire Protection');
            
            let status, message;
            if (userInputs.dwelling_distance > 0 && userInputs.dwelling_distance < 5) {
                // Check if materials are specified as non-combustible
                if (userInputs.isNonCombustible === false || userInputs.materials === 'timber') {
                    conditions.push(`⚠️ MANDATORY: Must use non-combustible materials (steel, concrete, masonry) - structure is ${userInputs.dwelling_distance}m from dwelling`);
                    status = '⚠️ CONDITIONAL';
                    message = 'Non-combustible materials required - NO timber, plastic, or composite materials';
                } else {
                    status = '✓ OK';
                    message = `Structure is ${userInputs.dwelling_distance}m from dwelling. Non-combustible materials compliant.`;
                }
            } else if (userInputs.dwelling_distance >= 5) {
                status = '✓ OK';
                message = `Structure is ${userInputs.dwelling_distance}m from dwelling (more than 5m). Non-combustible materials not required.`;
            } else {
                status = '✓ OK';
                message = 'No dwelling on property. No bushfire material restrictions.';
            }

            bushfireRules.forEach(rule => {
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status,
                    userValue: `${userInputs.dwelling_distance}m from dwelling`,
                    note: message
                });
            });
        }
    }

    checkDrainageRequirements(userInputs, issues, legislationApplied) {
        const drainageRules = this.getRelevantLegislation(userInputs.structure_type, 'Drainage');
        let drainageIssueAdded = false;
        
        drainageRules.forEach(rule => {
            const drainageStatus = userInputs.stormwater_connected ? '✓ COMPLIES' : '❌ FAILS';
            if (drainageStatus === '❌ FAILS' && !drainageIssueAdded) {
                issues.push("❌ STORMWATER NOT CONNECTED");
                drainageIssueAdded = true;
            }

            legislationApplied.push({
                clause: rule['Clause Reference'],
                text: rule['Exact Legislative Text'],
                plain: rule['Plain English Explanation'],
                status: drainageStatus
            });
        });
    }

    checkStructureSpecificRules(userInputs, issues, conditions, legislationApplied, propertyData) {
        if (userInputs.structure_type === 'Garden Structures & Storage') {
            // Existing checks
            if (userInputs.is_shipping_container) {
                issues.push("❌ SHIPPING CONTAINERS NOT PERMITTED");
                legislationApplied.push({
                    clause: '2.18(1)(l)',
                    text: 'not be a shipping container',
                    plain: 'Shipping containers not permitted',
                    status: '❌ FAILS'
                });
            }

            if (userInputs.is_habitable) {
                issues.push("❌ STRUCTURE MUST BE NON-HABITABLE");
            }

            if (userInputs.existing_garden_structures >= 2) {
                issues.push("❌ MAXIMUM 2 GARDEN STRUCTURES PER LOT");
            }

            // BUG FIX #3: Building line validation (non-rural zones only)
            const ruralZones = ['RU1', 'RU2', 'RU3', 'RU4', 'RU6'];
            if (!ruralZones.includes(propertyData.zone_type) && userInputs.behind_building_line === false) {
                conditions.push("⚠️ BUILDING LINE SETBACK - Please verify with council that your structure location complies with building line requirements");
                legislationApplied.push({
                    clause: '2.18(1)(e)',
                    text: 'be located behind the building line of any road frontage',
                    plain: 'Must be behind building line (non-rural zones)',
                    status: '⚠️ CONDITIONAL'
                });
            }

            // BUG FIX #4: Metal reflectivity (residential zones only)
            const residentialZones = ['R1', 'R2', 'R3', 'R4', 'R5', 'B4'];
            if (userInputs.has_metal && residentialZones.includes(propertyData.zone_type) && !userInputs.metal_compliant) {
                conditions.push("⚠️ METAL COMPONENTS - Please verify with council that metal components meet reflectivity requirements");
                legislationApplied.push({
                    clause: '2.18(1)(h)',
                    text: 'be constructed of low reflective, factory pre-coloured materials if it is located on land in a residential zone',
                    plain: 'Metal parts must be low-reflective and factory colored in residential zones',
                    status: '⚠️ CONDITIONAL'
                });
            }

            // BUG FIX #5: Heritage rear yard
            if (propertyData.heritage_overlay && userInputs.in_rear_yard === false) {
                conditions.push("⚠️ HERITAGE CONSERVATION - Please verify with council regarding rear yard placement requirements");
                legislationApplied.push({
                    clause: '2.18(1)(j)',
                    text: 'be located in the rear yard if in heritage conservation area',
                    plain: 'Must be in rear yard if in heritage conservation area',
                    status: '⚠️ CONDITIONAL'
                });
            }

            // BUG FIX #6: Adjacent building safety
            if (userInputs.adjacent_building && userInputs.blocks_access) {
                conditions.push("⚠️ ADJACENT BUILDING SAFETY - Please verify with council that your structure does not interfere with building access or fire safety");
                legislationApplied.push({
                    clause: '2.18(1)(k)',
                    text: 'be located so that it does not interfere with the entry to, or exit from, or the fire safety measures contained within, that building',
                    plain: 'Cannot block access or fire safety features of adjacent buildings',
                    status: '⚠️ CONDITIONAL'
                });
            }

            // BUG FIX #7: Cabana services
            if (userInputs.is_cabana && userInputs.cabana_services) {
                conditions.push("⚠️ CABANA SERVICES - Please verify with council regarding water/sewer connection requirements for cabanas");
                legislationApplied.push({
                    clause: '2.18(1)(n)',
                    text: 'not be connected to water supply or sewerage services',
                    plain: 'Cabanas cannot connect to water or sewer',
                    status: '⚠️ CONDITIONAL'
                });
            }
        }

        // BUG FIX #8: Wall height validation for Outdoor Entertainment
        if (userInputs.structure_type === 'Outdoor Entertainment Areas' && userInputs.has_walls && userInputs.wall_height > 1.4) {
            issues.push(`❌ WALL HEIGHT VIOLATION - Wall height ${userInputs.wall_height}m exceeds maximum 1.4m allowed`);
            legislationApplied.push({
                clause: '2.12(1)(d)',
                text: 'not have an enclosing wall higher than 1.4m',
                plain: 'Any walls cannot be taller than 1.4 meters',
                status: '❌ FAILS'
            });
        }

        // Floor height validation for Outdoor Entertainment
        if (userInputs.structure_type === 'Outdoor Entertainment Areas' && userInputs.floor_height > 1.0) {
            issues.push(`❌ FLOOR HEIGHT VIOLATION - Floor height ${userInputs.floor_height}m exceeds maximum 1.0m allowed`);
            legislationApplied.push({
                clause: '2.12(1)(i)',
                text: 'have a floor height not more than 1m above ground level',
                plain: 'Floor cannot be more than 1 meter above existing ground level',
                status: '❌ FAILS'
            });
        }

        // Bushfire material validation for Outdoor Entertainment
        if (userInputs.structure_type === 'Outdoor Entertainment Areas' && propertyData.bushfire_prone && userInputs.dwelling_distance < 5 && userInputs.materials === 'timber') {
            issues.push(`❌ BUSHFIRE MATERIAL VIOLATION - Timber = combustible. Structure <5m from dwelling. Bushfire material requirement NOT met`);
            legislationApplied.push({
                clause: '2.12(1)(n)',
                text: 'be constructed of non-combustible material if on bush fire prone land and less than 5m from dwelling',
                plain: 'Must use non-combustible materials if on bushfire prone land within 5m of house',
                status: '❌ FAILS'
            });
        }

        // BUG FIX #10: Fascia connection for Carports
        if (userInputs.structure_type === 'Carports' && userInputs.connected_to_fascia && !userInputs.has_engineer_specs) {
            conditions.push("⚠️ FASCIA CONNECTION - Please verify engineer specifications with council");
            legislationApplied.push({
                clause: '2.20(1)(j)',
                text: 'be connected in accordance with a professional engineer\'s specifications',
                plain: 'Fascia connections must meet engineer\'s specifications',
                status: '⚠️ CONDITIONAL'
            });
        }
    }

    determineFinalResult(issues, conditions) {
        if (issues.length > 0) {
            return {
                status: "NON EXEMPT",
                message: "Development Approval Required - Your structure does not qualify as exempt development. You'll need to apply for development approval from council.",
                issues: issues
            };
        } else if (conditions.length > 0) {
            return {
                status: "CONDITIONAL", 
                message: "Conditional Approval - Your structure meets most requirements but has specific conditions. Review the detailed checks to see what adjustments may be needed.",
                conditions: conditions
            };
        } else {
            return {
                status: "APPROVED",
                message: "Likely Approved (Exempt Development) - Your structure appears to meet all exempt development criteria. Please ensure your actual structure complies with all the criteria you've confirmed. You may still need to notify council before starting work."
            };
        }
    }
}

module.exports = EnhancedRulesEngine;