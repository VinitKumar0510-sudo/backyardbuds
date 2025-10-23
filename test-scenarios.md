# Test Scenarios for SEPP Assessment

## 1. EXEMPT Shed Tests

### Test 1A: Small Urban Shed (SHOULD BE EXEMPT)
- **Address**: 708 Dean Street ALBURY
- **Structure**: Shed
- **Dimensions**: Height 2.5m, Area 15m², Setback 1.5m
- **Expected**: EXEMPT (under 20m² limit for non-RU zones)

### Test 1B: Rural Shed (SHOULD BE EXEMPT)  
- **Address**: 77 Barwonga Drive SPLITTERS CREEK
- **Structure**: Shed
- **Dimensions**: Height 3m, Area 45m², Setback 6m
- **Expected**: EXEMPT (under 50m² limit for RU zones)

## 2. NOT EXEMPT Shed Tests

### Test 2A: Oversized Urban Shed (NOT EXEMPT)
- **Address**: 708 Dean Street ALBURY  
- **Structure**: Shed
- **Dimensions**: Height 2.5m, Area 25m², Setback 1.5m
- **Expected**: NOT EXEMPT (exceeds 20m² for R1 zone)

### Test 2B: Too Close to Boundary (NOT EXEMPT)
- **Address**: 77 Barwonga Drive SPLITTERS CREEK
- **Structure**: Shed  
- **Dimensions**: Height 3m, Area 40m², Setback 3m
- **Expected**: NOT EXEMPT (RU4 requires ≥5m setback)

### Test 2C: Too High (NOT EXEMPT)
- **Address**: 708 Dean Street ALBURY
- **Structure**: Shed
- **Dimensions**: Height 3.5m, Area 15m², Setback 1.5m  
- **Expected**: NOT EXEMPT (exceeds 3m height limit)

## 3. Heritage Overlay Tests

### Test 3A: Heritage Property (NOT EXEMPT)
- **Address**: 638 Table Top Road TABLE TOP
- **Structure**: Any
- **Expected**: NOT EXEMPT (heritage overlay detected)

## 4. Patio Tests

### Test 4A: Compliant Patio (SHOULD BE EXEMPT)
- **Address**: 485 Ainslie Avenue LAVINGTON
- **Structure**: Patio
- **Dimensions**: Height 2.8m, Area 20m², Setback 1.2m
- **Expected**: EXEMPT

### Test 4B: Oversized Patio (NOT EXEMPT)
- **Address**: 485 Ainslie Avenue LAVINGTON  
- **Structure**: Patio
- **Dimensions**: Height 2.8m, Area 30m², Setback 1.2m
- **Expected**: NOT EXEMPT (exceeds 25m² limit)

## 5. Carport Tests

### Test 5A: Compliant Carport (SHOULD BE EXEMPT)
- **Address**: 389 Alana Street EAST ALBURY
- **Structure**: Carport
- **Dimensions**: Height 2.5m, Area 35m², Setback 1.0m
- **Expected**: EXEMPT

## 6. Large Property Warning Tests

### Test 6A: Large Rural Property
- **Address**: 102 Nioka Road TABLE TOP (41.6 hectares)
- **Structure**: Any
- **Expected**: Warning about verifying overlays with Council

## 7. Bushfire Tests

### Test 7A: Bushfire Prone Area
- **Address**: 63 Barwonga Drive SPLITTERS CREEK
- **Structure**: Shed
- **Expected**: Warning about bushfire construction requirements

## Quick Test Commands:

```bash
# Start backend
cd backend && npm start

# Start frontend  
cd frontend && npm start

# Test API directly
curl -X POST http://localhost:3001/api/assess \
  -H "Content-Type: application/json" \
  -d '{
    "property": {
      "type": "urban",
      "lotSize": 784,
      "zoning": "R1"
    },
    "proposal": {
      "structureType": "shed",
      "height": 2.5,
      "floorArea": 15,
      "distanceFromBoundary": 1.5
    }
  }'
```