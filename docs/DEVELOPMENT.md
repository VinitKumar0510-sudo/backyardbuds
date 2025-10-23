# Development Guide

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd exempt-development-tool
```

2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Running the Application

#### Development Mode
Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend React app on http://localhost:3000

#### Individual Services
Start backend only:
```bash
npm run dev:backend
```

Start frontend only:
```bash
npm run dev:frontend
```

## Project Structure

```
exempt-development-tool/
├── backend/                 # Node.js Express API
│   ├── routes/             # API route handlers
│   │   ├── assessment.js   # Assessment endpoint
│   │   ├── rules.js        # Rules management
│   │   └── checkpoints.js  # Checkpoint management
│   ├── rules/              # Rules engine
│   │   ├── engine.js       # Main rules engine
│   │   └── engine.test.js  # Rules engine tests
│   ├── middleware/         # Express middleware
│   │   └── checkpoint.js   # Checkpoint middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── AssessmentPage.js
│   │   │   ├── ResultsPage.js
│   │   │   └── AboutPage.js
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── rules/                  # Configuration files
│   ├── sepp-part2.json    # SEPP Part 2 rules
│   └── validation.yaml     # Input validation rules
├── checkpoints/            # Checkpoint storage
├── scripts/                # Utility scripts
│   ├── checkpoint.js       # Create checkpoint
│   ├── list-checkpoints.js # List checkpoints
│   └── restore.js          # Restore checkpoint
├── docs/                   # Documentation
└── package.json            # Root package.json
```

## API Endpoints

### Assessment API
- `POST /api/assess` - Submit development proposal for assessment
- `POST /api/assess/validate` - Validate input without assessment

### Rules API
- `GET /api/rules` - Retrieve all SEPP rules
- `GET /api/rules/:structureType` - Get rules for specific structure
- `POST /api/rules/reload` - Reload rules from configuration

### Checkpoints API
- `GET /api/checkpoints` - List all checkpoints
- `GET /api/checkpoints/:id` - Get specific checkpoint
- `DELETE /api/checkpoints/:id` - Delete checkpoint

### Health Check
- `GET /api/health` - API health status

## Rules Engine

The rules engine is located in `backend/rules/engine.js` and processes SEPP Part 2 criteria.

### Adding New Structure Types

1. Add rules to `rules/sepp-part2.json`:
```json
{
  "new_structure": {
    "height_limit": {
      "condition": "height <= 3.0",
      "clause": "SEPP Part 2, Clause X.X(a)",
      "description": "Structure height must not exceed 3 metres"
    }
  }
}
```

2. Update validation in `backend/routes/assessment.js`:
```javascript
structureType: Joi.string().valid('shed', 'patio', 'pergola', 'carport', 'new_structure').required()
```

3. Add to frontend dropdown in `frontend/src/pages/AssessmentPage.js`:
```jsx
<option value="new_structure">New Structure</option>
```

### Modifying Rules

Rules use simple JavaScript expressions that are evaluated safely. Supported operations:
- Comparison: `<=`, `>=`, `<`, `>`, `==`, `!=`
- Arithmetic: `+`, `-`, `*`, `/`
- Logical: `&&`, `||`, `!`

Variables available in conditions:
- `height` - Structure height in metres
- `floorArea` - Floor area in square metres
- `distanceFromBoundary` - Minimum boundary setback in metres
- `lotSize` - Property lot size in square metres
- `type` - Property type ('urban' or 'rural')

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Rules engine tests only
npm run test:rules
```

### Writing Tests

Backend tests use Jest. Example test structure:
```javascript
describe('RulesEngine', () => {
  test('should approve compliant proposal', () => {
    const result = rulesEngine.assessProposal(property, proposal);
    expect(result.recommendation).toBe('exempt');
  });
});
```

## Checkpoint System

The checkpoint system automatically saves assessment data for debugging and rollback.

### Manual Checkpoints
```bash
# Create checkpoint
npm run checkpoint "Description of changes"

# List checkpoints
npm run list-checkpoints

# View checkpoint details
npm run restore <checkpoint-id>
```

### Automatic Checkpoints
Checkpoints are automatically created for:
- Each assessment request
- API errors and exceptions
- System state changes

## Styling

The frontend uses TailwindCSS for styling. Custom utility classes are defined in `frontend/src/index.css`.

### Common Classes
- `.form-input` - Standard form input styling
- `.form-label` - Form label styling
- `.form-select` - Select dropdown styling
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.alert-success` - Success message styling
- `.alert-danger` - Error message styling

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - API base URL (optional, uses proxy in development)

## Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Docker (Optional)
Create `Dockerfile` for containerized deployment:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN cd frontend && npm ci && npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes with regular commits
3. Add tests for new functionality
4. Create checkpoint: `npm run checkpoint "Feature description"`
5. Run tests: `npm test`
6. Submit pull request

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in backend/server.js or kill existing process

2. **Rules not loading**
   - Check `rules/sepp-part2.json` syntax
   - Verify file permissions

3. **Frontend not connecting to backend**
   - Ensure backend is running on port 3001
   - Check proxy configuration in frontend/package.json

4. **Tests failing**
   - Run `npm install` in both backend and frontend directories
   - Check Node.js version compatibility

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev:backend
```

### Logs

- Backend logs: Console output from Express server
- Frontend logs: Browser developer console
- Checkpoint logs: Automatic logging of all assessments

## Performance

### Optimization Tips
- Rules engine caches loaded rules
- Frontend uses React.memo for expensive components
- API responses include caching headers
- Static assets served with compression

### Monitoring
- Health check endpoint: `/api/health`
- Checkpoint system tracks performance metrics
- Error logging with stack traces in development
