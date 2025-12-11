# XML-Based API Documentation

## Overview

This system implements a fully functional XML-based backend for the Intelligent Urban Waste Management System. All data is stored as XML files in the `/data` directory and validated against XSD schemas before storage.

## Architecture

### Data Flow
```
Frontend (JSON) → Backend API → JSON to XML Converter → XSD Validation → XML Storage (/data)
Frontend (JSON) ← Backend API ← XML to JSON Parser ← XML Storage (/data)
```

### Directory Structure
```
/data
  /collection-points  - Collection point XML files
  /agents            - Agent/Employee XML files
  /vehicles          - Vehicle XML files
  /tours             - Tour XML files
  /incidents         - Incident report XML files

/xml-schemas
  common.xsd         - Common types (User, Employee)
  CollectPoint.xsd   - Collection point schema
  CollectAgent.xsd   - Agent/Employee schema
  Vehicule.xsd       - Vehicle schema
  CollectTour.xsd    - Tour schema
  IncidentReport.xsd - Incident report schema

/lib
  xml-validator.ts   - XML validation against XSD
  xml-converter.ts   - JSON to XML conversion
  xml-storage.ts     - File-based storage operations
```

## API Endpoints

### Collection Points (`/api/collection-points`)

#### GET - Retrieve collection points
- **Get all**: `GET /api/collection-points`
- **Get one**: `GET /api/collection-points?id={id}`
- **Response**: JSON format

#### POST - Create collection point
- **Endpoint**: `POST /api/collection-points`
- **Body** (JSON):
```json
{
  "name": "Main Street Collection",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.006,
  "capacity": 100,
  "fillLevel": 75,
  "wasteType": "plastic",
  "priority": 1
}
```

#### PUT - Update collection point
- **Endpoint**: `PUT /api/collection-points`
- **Body**: Same as POST with `id` field

#### DELETE - Delete collection point
- **Endpoint**: `DELETE /api/collection-points?id={id}`

---

### Agents (`/api/agents`)

#### GET - Retrieve agents
- **Get all**: `GET /api/agents`
- **Get one**: `GET /api/agents?id={id}`

#### POST - Create agent
- **Endpoint**: `POST /api/agents`
- **Body** (JSON):
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "hashed_password",
  "phone": "+1234567890",
  "recruitmentDate": "2024-01-15",
  "salary": 35000,
  "disponibility": true,
  "roleAgent": "collector"
}
```

#### PUT - Update agent
- **Endpoint**: `PUT /api/agents`

#### DELETE - Delete agent
- **Endpoint**: `DELETE /api/agents?id={id}`

---

### Vehicles (`/api/vehicles`)

#### GET - Retrieve vehicles
- **Get all**: `GET /api/vehicles`
- **Get one**: `GET /api/vehicles?id={immat}`

#### POST - Create vehicle
- **Endpoint**: `POST /api/vehicles`
- **Body** (JSON):
```json
{
  "immat": "ABC-123",
  "type": "Compactor Truck",
  "capacity": 25000,
  "state": "operational",
  "fuelLevel": 85,
  "fuelType": "Diesel",
  "emissionCO2": 2.4,
  "dateLastMaintenance": "2024-11-01"
}
```

#### PUT - Update vehicle
- **Endpoint**: `PUT /api/vehicles`

#### DELETE - Delete vehicle
- **Endpoint**: `DELETE /api/vehicles?id={immat}`

---

### Tours (`/api/tours`)

#### GET - Retrieve tours
- **Get all**: `GET /api/tours`
- **Get one**: `GET /api/tours?id={id}`
- **Get as XML**: `GET /api/tours?format=xml`

#### POST - Create tour
- **Endpoint**: `POST /api/tours`
- **Body** (JSON):
```json
{
  "date": "2024-12-15",
  "status": "planned",
  "distance": 45.5,
  "estimatedTime": "3h 30m",
  "collectedQuantity": 0,
  "co2Emission": 12.5,
  "agents": ["agent-id-1", "agent-id-2"],
  "collectionPoints": ["cp-id-1", "cp-id-2", "cp-id-3"],
  "vehicleId": "ABC-123"
}
```

#### PUT - Update tour
- **Endpoint**: `PUT /api/tours`

#### DELETE - Delete tour
- **Endpoint**: `DELETE /api/tours?id={id}`

---

### Tours Import/Export

#### Import XML
- **Endpoint**: `POST /api/tours/import`
- **Body** (JSON):
```json
{
  "xmlContent": "<?xml version=\"1.0\"?>..."
}
```

#### Export XML
- **Get file**: `GET /api/tours/export`
- **Get specific**: `GET /api/tours/export?ids=id1,id2,id3`
- **Post request**: `POST /api/tours/export`
  - Body: `{ "ids": ["id1", "id2"] }` (optional - exports all if not provided)

---

### Incident Reports (`/api/incidents`)

#### GET - Retrieve incidents
- **Get all**: `GET /api/incidents`
- **Get one**: `GET /api/incidents?id={id}`

#### POST - Create incident
- **Endpoint**: `POST /api/incidents`
- **Body** (JSON):
```json
{
  "type": "Overflow",
  "description": "Container overflowing with waste",
  "address": "456 Oak Avenue",
  "date": "2024-12-11",
  "state": "pending",
  "citizenId": "citizen-123",
  "collectionPointId": "cp-456"
}
```

#### PUT - Update incident
- **Endpoint**: `PUT /api/incidents`

#### DELETE - Delete incident
- **Endpoint**: `DELETE /api/incidents?id={id}`

---

## XML Schema Validation

All data is validated against XSD schemas before storage. Validation errors are returned with HTTP 400 status.

### Example Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed: Element 'fillLevel': '150' is not a valid value of the atomic type 'xs:double'."
}
```

## XML Storage Format

### Collection Point Example
```xml
<?xml version="1.0" encoding="utf-8"?>
<CollectPoint>
  <idCP>cp-123</idCP>
  <nameCP>Main Street Collection</nameCP>
  <adressCP>123 Main St</adressCP>
  <latitudeGPS>40.7128</latitudeGPS>
  <longitudeGPS>-74.006</longitudeGPS>
  <capacityCP>100</capacityCP>
  <fillLevel>75</fillLevel>
  <wasteType>plastic</wasteType>
  <priorityCP>1</priorityCP>
  <lastCollectDate>2024-12-10</lastCollectDate>
</CollectPoint>
```

### Tour Example
```xml
<?xml version="1.0" encoding="utf-8"?>
<CollectTour>
  <idTour>tour-456</idTour>
  <dateTour>2024-12-15</dateTour>
  <statusTour>planned</statusTour>
  <distanceTour>45.5</distanceTour>
  <estimedTimeTour>3h 30m</estimedTimeTour>
  <collectedQuantityTour>0</collectedQuantityTour>
  <CO2emissionTour>12.5</CO2emissionTour>
  <idClAgents>
    <idClAgent>agent-1</idClAgent>
    <idClAgent>agent-2</idClAgent>
  </idClAgents>
  <idCPs>
    <idCP>cp-1</idCP>
    <idCP>cp-2</idCP>
  </idCPs>
  <immatV>ABC-123</immatV>
</CollectTour>
```

## Utility Functions

### XMLValidator
- `validate(xmlString, schemaName)` - Validates XML against XSD schema
- `parseXMLToJSON(xmlString)` - Converts XML to JSON

### XMLConverter
- `collectionPointToXML(data)` - Converts JSON to CollectPoint XML
- `collectAgentToXML(data)` - Converts JSON to CollectAgent XML
- `vehicleToXML(data)` - Converts JSON to Vehicle XML
- `collectTourToXML(data)` - Converts JSON to Tour XML
- `incidentReportToXML(data)` - Converts JSON to Incident XML

### XMLStorage
- `save(resource, id, xmlContent, schemaName)` - Save with validation
- `read(resource, id)` - Read XML file
- `readAll(resource)` - Read all XML files for resource
- `update(resource, id, xmlContent, schemaName)` - Update with validation
- `delete(resource, id)` - Delete XML file
- `exists(resource, id)` - Check if file exists

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, missing fields)
- `404` - Not Found
- `409` - Conflict (duplicate ID)
- `500` - Internal Server Error

## Testing the API

### Using cURL

#### Create a collection point
```bash
curl -X POST http://localhost:3000/api/collection-points \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Point",
    "address": "123 Test St",
    "latitude": 40.7128,
    "longitude": -74.006,
    "capacity": 100,
    "fillLevel": 50,
    "wasteType": "plastic",
    "priority": 1
  }'
```

#### Get all collection points
```bash
curl http://localhost:3000/api/collection-points
```

#### Export tours as XML
```bash
curl http://localhost:3000/api/tours/export?format=xml
```

## Project Requirements Compliance

This implementation satisfies the following project requirements:

✅ **XML/XSD Structuring** - All data entities have dedicated XSD schemas
✅ **Validation** - XSD validation before storage
✅ **Serialization** - JSON ↔ XML conversion
✅ **Module B: Collection Point Management** - Full CRUD with validation
✅ **Module C: Employee & Route Management** - Agents and Tours APIs
✅ **Module D: Interoperability** - XML import/export for tours
✅ **File-based Storage** - XML files in /data directory
✅ **RESTful API** - Standard HTTP methods and responses

## Next Steps

1. Add authentication/authorization
2. Implement batch operations
3. Add search and filtering capabilities
4. Create XML export for all resources (not just tours)
5. Add data migration utilities
6. Implement backup and restore functionality
