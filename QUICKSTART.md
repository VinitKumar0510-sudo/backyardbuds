# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd exempt-development-tool

# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start the Application
```bash
# Start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (React app)
- **Backend**: http://localhost:3001 (API server)

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Start Assessment"
3. Fill out the form with sample data:
   - Property Type: Urban
   - Lot Size: 800
   - Structure Type: Shed
   - Height: 3.5
   - Floor Area: 40
   - Distance from Boundary: 2.5
4. Click "Assess Proposal"
5. View your results!

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend
```

## 📋 Sample Test Data

### Compliant Shed (Should be Exempt)
- Property Type: Urban
- Lot Size: 800 m²
- Structure Type: Shed
- Height: 3.5 m
- Floor Area: 40 m²
- Distance from Boundary: 2.5 m

### Non-Compliant Shed (Should NOT be Exempt)
- Property Type: Urban
- Lot Size: 800 m²
- Structure Type: Shed
- Height: 5.0 m (exceeds 4m limit)
- Floor Area: 40 m²
- Distance from Boundary: 2.5 m

### Compliant Patio (Should be Exempt)
- Property Type: Urban
- Lot Size: 500 m²
- Structure Type: Patio
- Height: 2.8 m
- Floor Area: 35 m²
- Distance from Boundary: 1.5 m

## 🔧 Development Commands

```bash
# Start development servers
npm run dev                 # Both frontend and backend
npm run dev:frontend        # Frontend only
npm run dev:backend         # Backend only

# Testing
npm test                    # All tests
npm run test:frontend       # Frontend tests
npm run test:backend        # Backend tests
npm run test:rules          # Rules engine tests

# Checkpoint management
npm run checkpoint "message"   # Create checkpoint
npm run list-checkpoints       # List all checkpoints
npm run restore <id>           # View checkpoint details

# Production
npm run build               # Build frontend for production
npm start                   # Start production server
```

## 🌐 API Endpoints

Test the API directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all rules
curl http://localhost:3001/api/rules

# Submit assessment
curl -X POST http://localhost:3001/api/assess \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## 📁 Key Files

- `backend/server.js` - Main API server
- `backend/rules/engine.js` - Rules processing logic
- `rules/sepp-part2.json` - SEPP Part 2 rules configuration
- `frontend/src/pages/AssessmentPage.js` - Main assessment form
- `frontend/src/pages/ResultsPage.js` - Results display

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Rules Not Loading
- Check `rules/sepp-part2.json` syntax
- Restart backend server: `npm run dev:backend`

## 📖 Next Steps

1. Read the full [README.md](README.md) for detailed information
2. Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for development guide
3. Explore the rules engine in `backend/rules/engine.js`
4. Customize rules in `rules/sepp-part2.json`
5. Add new structure types or modify existing ones

## 🎯 Features Implemented

✅ Web-based assessment form  
✅ Rule-based decision engine  
✅ SEPP Part 2 rules for sheds, patios, pergolas, carports  
✅ Clear exempt/not exempt recommendations  
✅ SEPP clause references  
✅ Input validation and error handling  
✅ Checkpoint system for debugging  
✅ Responsive design with TailwindCSS  
✅ Comprehensive test suite  
✅ API documentation  

---

**Ready to start developing?** Run `npm run dev` and open http://localhost:3000! 🎉
