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
        this.checkOverlays(propertyData, structureType, issues, conditions, legislationApplied);

        // Step 3: Check Structure-Specific Requirements
        this.checkStructureSpecificRequirements(propertyData, userInputs, issues, conditions, legislationApplied);

        // Step 4: Determine Final Result
        const result = this.determineFinalResult(issues, conditions);

        return {
            result,
            issues,
            conditions,
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

    checkOverlays(propertyData, structureType, issues, conditions, legislationApplied) {
        // Heritage check - ALL structure types rejected unless exemption
        if (propertyData.heritage_overlay) {
            issues.push("❌ HERITAGE OVERLAY RESTRICTION - May proceed if you have Heritage Act exemption under section 57");
            const heritageRules = this.getRelevantLegislation('General Requirements', 'Heritage Conservation');
            heritageRules.forEach(rule => {
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: '❌ FAILS'
                });
            });
        }

        // Environmental check - Garden Structures rejected, others conditional
        if (propertyData.has_environmental_overlay) {
            if (structureType === 'Garden Structures & Storage') {
                issues.push("❌ ENVIRONMENTAL OVERLAY RESTRICTION - Garden structures not permitted in environmentally sensitive areas");
            } else {
                conditions.push("⚠️ ENVIRONMENTAL ASSESSMENT MAY BE REQUIRED - Contact council environmental planning department");
            }
            
            const envRules = this.getRelevantLegislation('General Requirements', 'Environmental Protection');
            envRules.forEach(rule => {
                legislationApplied.push({
                    clause: rule['Clause Reference'],
                    text: rule['Exact Legislative Text'],
                    plain: rule['Plain English Explanation'],
                    status: structureType === 'Garden Structures & Storage' ? '❌ FAILS' : '⚠️ CONDITIONAL'
                });
            });
        }

        // Easement check - Only Garden Structures have specific requirements
        if (propertyData.has_easement) {
            if (structureType === 'Garden Structures & Storage') {
                conditions.push("⚠️ EASEMENT PRESENT - Structure must be at least 1m from any registered easement");
                legislationApplied.push({
                    clause: '2.18(1)(m)',
                    text: 'be located at least 1m from any registered easement',
                    plain: 'Must be at least 1 meter from any easement',
                    status: '⚠️ MORE INFO REQUIRED'
                });
            } else {
                // Informational only for other types
                legislationApplied.push({
                    clause: 'N/A',
                    text: 'Property has easement - ensure structure doesn\'t block access',
                    plain: 'Check easement location and avoid building over it',
                    status: 'ℹ️ INFORMATIONAL'
                });
            }
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
        this.checkStructureSpecificRules(userInputs, issues, legislationApplied);
    }

    checkSizeLimits(propertyData, userInputs, issues, legislationApplied) {
        const structureType = userInputs.structure_type;
        const zone = propertyData.zone_type;
        const lotSize = propertyData.area_total;

        const sizeRules = this.getRelevantLegislation(structureType, 'Size Limits');
        
        let maxSize;
        if (structureType === 'Garden Structures & Storage') {
            maxSize = ['RU1', 'RU2', 'RU3', 'RU4', 'RU6', 'R5'].includes(zone) ? 50 : 20;
        } else if (structureType === 'Carports') {
            if (['RU1', 'RU2', 'RU3', 'RU4', 'RU6', 'R5'].includes(zone) && lotSize > 300) {
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
        
        const minSetback = ['RU1', 'RU2', 'RU3', 'RU4', 'RU6', 'R5'].includes(zone) ? 5 : 0.9;
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
                conditions.push(`⚠️ MANDATORY: Must use non-combustible materials (steel, concrete, masonry) - structure is ${userInputs.dwelling_distance}m from dwelling`);
                status = '⚠️ CONDITIONAL';
                message = 'Non-combustible materials required - NO timber, plastic, or composite materials';
            } else if (userInputs.dwelling_distance >= 5) {
                status = '✓ OK';
                message = `Structure is ${userInputs.dwelling_distance}m from dwelling (more than 5m). Non-combustible materials not required but recommended.`;
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

    checkStructureSpecificRules(userInputs, issues, legislationApplied) {
        if (userInputs.structure_type === 'Garden Structures & Storage') {
            if (userInputs.is_shipping_container) {
                issues.push("❌ SHIPPING CONTAINERS NOT PERMITTED");
                const shippingRule = this.rules.find(rule => 
                    rule['Structure Type'] === userInputs.structure_type && 
                    rule['Exact Legislative Text'].toLowerCase().includes('shipping container')
                );
                if (shippingRule) {
                    legislationApplied.push({
                        clause: shippingRule['Clause Reference'],
                        text: shippingRule['Exact Legislative Text'],
                        plain: shippingRule['Plain English Explanation'],
                        status: '❌ FAILS'
                    });
                }
            }

            if (userInputs.is_habitable) {
                issues.push("❌ STRUCTURE MUST BE NON-HABITABLE");
            }

            if (userInputs.existing_garden_structures >= 2) {
                issues.push("❌ MAXIMUM 2 GARDEN STRUCTURES PER LOT");
            }
        }
    }

    determineFinalResult(issues, conditions) {
        if (issues.length > 0) {
            return "❌ LIKELY REJECTED";
        } else if (conditions.length > 0) {
            return "⚠️ CONDITIONAL APPROVAL LIKELY";
        } else {
            return "✅ LIKELY APPROVED";
        }
    }
}

module.exports = EnhancedRulesEngine;