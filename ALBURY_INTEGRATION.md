# Albury Council Property Data Integration

## Overview

The Exempt Development Tool has been successfully integrated with official Albury Council property boundaries data, providing accurate property information for over 25,000 properties in the Albury region.

## Features

### 🏡 Real Property Data
- **25,305 properties** from official Albury Council database
- Accurate lot sizes, addresses, and property details
- Automatic property type classification (urban/rural)
- Zoning information based on suburb and lot characteristics

### 🔍 Property Search
- Search by address, street name, or suburb
- Autocomplete suggestions with real-time results
- Browse properties by suburb
- Detailed property information display

### 📊 Statistics Dashboard
- Total properties: 25,305
- Urban properties: 23,818 (94.1%)
- Rural properties: 1,487 (5.9%)
- Average lot size: 16,224m²
- Coverage: 15 suburbs in Albury region

## API Endpoints

### Property Search
```
GET /api/property/search?q={searchTerm}
```
Search properties by address, street, or suburb name.

### Property by Address
```
GET /api/property/address?houseNumber={num}&streetName={street}&suburb={suburb}
```
Get specific property details by address components.

### Property by Number
```
GET /api/property/number/{propertyNumber}
```
Get property details by council property number.

### Suburbs List
```
GET /api/property/suburbs
```
Get all available suburbs in the database.

### Streets in Suburb
```
GET /api/property/streets/{suburb}
```
Get all streets in a specific suburb.

### Statistics
```
GET /api/property/stats
```
Get database statistics and summary information.

## Data Processing

### Property Classification
Properties are automatically classified as:
- **Urban**: Properties in main Albury suburbs (Albury, East Albury, West Albury, North Albury, South Albury, Lavington, Thurgoona, Springdale Heights)
- **Rural**: Properties in outer areas or with large lot sizes (>2000m² in rural areas, >1000m² in outer suburbs)

### Zoning Assignment
Simplified zoning based on suburb and property type:
- **R1**: General Residential (default for most urban areas)
- **R2**: Low Density Residential (medium density suburbs)
- **R3**: Medium Density Residential (high density suburbs)
- **RU1**: Primary Production (rural properties)

### Area Conversion
- Hectares (h²) automatically converted to square meters (m²)
- Original area display preserved for reference
- Accurate calculations for assessment rules

## Covered Areas

### Urban Suburbs
- Albury
- East Albury
- West Albury
- North Albury
- South Albury
- Lavington
- Thurgoona
- Springdale Heights

### Rural/Outer Areas
- Table Top
- Wirlinga
- Ettamogah
- Splitters Creek
- Glenroy
- Hamilton Valley
- Lake Hume Village

## Usage

### Frontend Integration
The PropertySearch component provides:
- Real-time search with autocomplete
- Property selection with automatic form population
- Statistics display
- Suburb filtering
- User-friendly interface

### Backend Service
The PropertyService class handles:
- CSV data parsing and processing
- Property search and filtering
- Data validation and cleanup
- Statistics calculation
- API endpoint support

## Data Source

The integration uses the official **Property_Boundaries.csv** dataset from Albury Council, containing:
- Property boundaries and addresses
- Lot numbers and plan references
- Area measurements and units
- Suburb and postcode information
- Geometric data (shape area/length)

## Benefits

1. **Accuracy**: Real council data eliminates guesswork
2. **Convenience**: Users can search and select their property easily
3. **Compliance**: Proper lot sizes ensure accurate SEPP assessments
4. **Coverage**: Comprehensive database of Albury region properties
5. **Performance**: Fast search and lookup capabilities

## Technical Implementation

### Backend
- Node.js service with CSV parsing
- In-memory property database for fast queries
- RESTful API endpoints
- Error handling and validation

### Frontend
- React component with search functionality
- Real-time API integration
- Responsive design
- User-friendly interface

### Data Processing
- Automatic area unit conversion
- Property type classification
- Zoning determination
- Address normalization

## Future Enhancements

- Integration with additional council databases
- GIS mapping integration
- Property boundary visualization
- Historical property data
- Automated data updates
- Multi-council support

---

**Note**: This integration currently covers the Albury City Council area. For properties outside this region, the tool falls back to the existing address lookup functionality.