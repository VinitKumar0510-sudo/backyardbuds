# Exempt Development Assessment Tool (Prototype)

## Overview

This project is a web-based prototype tool that helps residents, builders, and property purchasers in Albury determine whether their shed or patio proposal qualifies as Exempt Development under the [NSW State Environmental Planning Policy (Exempt & Complying Development Codes) 2008](https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572).

The tool simplifies complex planning rules by providing an interactive questionnaire, a rule-based decision engine, and a clear recommendation with references to the relevant planning clauses.

## Objectives

- Assess shed and patio proposals against SEPP Exempt Development rules
- Provide yes/no recommendations on whether development is exempt
- Explain recommendations with references to SEPP Part 2 clauses
- Offer a user-friendly web form for residents
- Keep architecture simple, extensible, and rules-driven (no AI/ML for MVP)

## Scope

### Must-Haves
- Web-based assessment form
- Rule-based decision engine for SEPP Part 2 (Exempt Development) rules
- Property and proposal input fields:
  - Property type (urban/rural, lot size)
  - Proposed structure type (shed, patio, pergola, carport)
  - Dimensions (height, floor area, distance from boundaries)
- Clear recommendation (Exempt or Not Exempt)

### Should-Haves
- Explanation of decision with SEPP clause references
- Basic input validation and error handling

### Could-Haves
- 10–15 sample properties with different lot characteristics
- Recommendation output with structured reasoning

### Out of Scope
- Multiple planning instruments (LEP, DCP)
- Live GIS data or overlays
- Complying Development or full DA assessment
- Multiple councils or statewide scaling (prototype is Albury-only)

## Architecture

- **Frontend**: React + TailwindCSS (clean UI, fast prototyping)
- **Backend**: Node.js (Express) with a rules engine module
- **Rules Engine**: JSON/YAML-based decision tree applying SEPP criteria
- **Checkpoint System**: Save each user submission to a `.checkpoint.json` file for rollback and debugging
- **Version Control**: Git (with feature branching and rollback support)

## Example User Flow

1. User selects property type (urban/rural, lot size) from dropdown
2. User enters proposal details (structure type, dimensions, placement)
3. System applies SEPP Part 2 exempt development rules
4. Tool returns recommendation:
   - **Exempt Development** — no DA required
   - **Not Exempt** — requires Development Application
5. Recommendation includes:
   - Reasoning (rule match/fail)
   - Clause references (e.g., SEPP Part 2, Clause 2.12)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd exempt-development-tool

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Project Structure

```
exempt-development-tool/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
├── backend/                 # Node.js Express server
│   ├── routes/             # API routes
│   ├── rules/              # Rules engine
│   └── middleware/         # Express middleware
├── rules/                  # SEPP rules configuration
│   ├── sepp-part2.json    # SEPP Part 2 rules
│   └── validation.yaml     # Input validation rules
├── checkpoints/            # Checkpoint files
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

## Development Workflow

### Feature Development
1. Create feature branch: `git checkout -b feature/assessment-form`
2. Implement changes with regular commits
3. Create checkpoint: `npm run checkpoint`
4. Test functionality
5. Merge to main branch

### Checkpoint System
The checkpoint system automatically saves user submissions and system state for debugging and rollback purposes.

```bash
# Create manual checkpoint
npm run checkpoint "Description of changes"

# Restore from checkpoint
npm run restore <checkpoint-id>

# List checkpoints
npm run list-checkpoints
```

## API Endpoints

### Assessment API
- `POST /api/assess` - Submit development proposal for assessment
- `GET /api/rules` - Retrieve current SEPP rules
- `GET /api/checkpoints` - List available checkpoints

### Example Request
```json
{
  "property": {
    "type": "urban",
    "lotSize": 800,
    "zoning": "R1"
  },
  "proposal": {
    "structureType": "shed",
    "height": 3.5,
    "floorArea": 40,
    "distanceFromBoundary": 2.5
  }
}
```

### Example Response
```json
{
  "recommendation": "exempt",
  "reasoning": "Proposal meets all SEPP Part 2 criteria for exempt development",
  "clauses": ["2.12", "2.13"],
  "conditions": [
    "Structure height under 4m limit",
    "Floor area under 50m² limit",
    "Adequate boundary setback"
  ]
}
```

## Rules Engine

The rules engine processes SEPP Part 2 criteria through a decision tree structure:

```yaml
# Example rule structure
shed_assessment:
  height_limit:
    condition: "height <= 4.0"
    clause: "SEPP Part 2, Clause 2.12(a)"
  area_limit:
    condition: "floorArea <= 50"
    clause: "SEPP Part 2, Clause 2.12(b)"
  setback_requirement:
    condition: "distanceFromBoundary >= 1.5"
    clause: "SEPP Part 2, Clause 2.12(c)"
```

## Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run rules engine tests
npm run test:rules
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NSW Department of Planning and Environment for SEPP documentation
- Albury City Council for local planning context
- Community feedback and testing participants

## Support

For questions or issues, please:
1. Check the documentation in the `/docs` folder
2. Review existing GitHub issues
3. Create a new issue with detailed description and steps to reproduce

---

**Note**: This is a prototype tool for educational and planning assistance purposes. Always consult with qualified professionals and relevant authorities for official planning advice.
