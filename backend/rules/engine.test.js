const RulesEngine = require('./engine');

describe('RulesEngine', () => {
  let rulesEngine;

  beforeEach(() => {
    rulesEngine = new RulesEngine();
  });

  describe('Shed Assessment', () => {
    test('should approve compliant shed proposal', () => {
      const property = {
        type: 'urban',
        lotSize: 800,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'shed',
        height: 3.5,
        floorArea: 40,
        distanceFromBoundary: 2.0
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('exempt');
      expect(result.conditions.length).toBeGreaterThan(0);
      expect(result.failedConditions.length).toBe(0);
      expect(result.clauses.length).toBeGreaterThan(0);
    });

    test('should reject shed that exceeds height limit', () => {
      const property = {
        type: 'urban',
        lotSize: 800,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'shed',
        height: 5.0, // Exceeds 4m limit
        floorArea: 40,
        distanceFromBoundary: 2.0
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.failedConditions.length).toBeGreaterThan(0);
      expect(result.failedConditions.some(condition => 
        condition.includes('height')
      )).toBe(true);
    });

    test('should reject shed that exceeds area limit', () => {
      const property = {
        type: 'urban',
        lotSize: 800,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'shed',
        height: 3.5,
        floorArea: 60, // Exceeds 50m² limit
        distanceFromBoundary: 2.0
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.failedConditions.some(condition => 
        condition.includes('area')
      )).toBe(true);
    });

    test('should reject shed with insufficient setback', () => {
      const property = {
        type: 'urban',
        lotSize: 800,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'shed',
        height: 3.5,
        floorArea: 40,
        distanceFromBoundary: 1.0 // Less than 1.5m requirement
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.failedConditions.some(condition => 
        condition.includes('setback') || condition.includes('boundary')
      )).toBe(true);
    });

    test('should reject shed on lot that is too small', () => {
      const property = {
        type: 'urban',
        lotSize: 300, // Less than 450m² requirement
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'shed',
        height: 3.5,
        floorArea: 40,
        distanceFromBoundary: 2.0
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.failedConditions.some(condition => 
        condition.includes('lot') || condition.includes('size')
      )).toBe(true);
    });
  });

  describe('Patio Assessment', () => {
    test('should approve compliant patio proposal', () => {
      const property = {
        type: 'urban',
        lotSize: 500,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'patio',
        height: 2.8,
        floorArea: 35,
        distanceFromBoundary: 1.5
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('exempt');
      expect(result.conditions.length).toBeGreaterThan(0);
      expect(result.failedConditions.length).toBe(0);
    });

    test('should reject patio that exceeds height limit', () => {
      const property = {
        type: 'urban',
        lotSize: 500,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'patio',
        height: 3.5, // Exceeds 3m limit
        floorArea: 35,
        distanceFromBoundary: 1.5
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.failedConditions.some(condition => 
        condition.includes('height')
      )).toBe(true);
    });
  });

  describe('Unsupported Structure Types', () => {
    test('should reject unsupported structure type', () => {
      const property = {
        type: 'urban',
        lotSize: 800,
        zoning: 'R1'
      };

      const proposal = {
        structureType: 'gazebo', // Not supported
        height: 3.0,
        floorArea: 20,
        distanceFromBoundary: 2.0
      };

      const result = rulesEngine.assessProposal(property, proposal);

      expect(result.recommendation).toBe('not_exempt');
      expect(result.reasoning).toContain('No rules found');
    });
  });
});
