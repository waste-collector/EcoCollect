#!/bin/bash

echo "========================================="
echo "  XML-Based API Testing Script"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"

echo "Testing Collection Points API..."
echo "---------------------------------"

# Create a collection point
echo "1. Creating a collection point..."
CP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/collection-points" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Park Collection",
    "address": "456 Park Avenue",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "capacity": 150,
    "fillLevel": 80,
    "wasteType": "organic",
    "priority": 2
  }')

echo "$CP_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CP_RESPONSE"
CP_ID=$(echo "$CP_RESPONSE" | grep -o '"idCP":"[^"]*"' | cut -d'"' -f4 | head -1)
echo ""
echo "Created collection point with ID: $CP_ID"
echo ""

# Get all collection points
echo "2. Retrieving all collection points..."
curl -s "$BASE_URL/api/collection-points" | python3 -m json.tool 2>/dev/null
echo ""

# Get specific collection point
if [ -n "$CP_ID" ]; then
  echo "3. Retrieving specific collection point (ID: $CP_ID)..."
  curl -s "$BASE_URL/api/collection-points?id=$CP_ID" | python3 -m json.tool 2>/dev/null
  echo ""
fi

echo ""
echo "Testing Agents API..."
echo "---------------------"

# Create an agent
echo "1. Creating an agent..."
AGENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@ecocollect.io",
    "password": "secure123",
    "phone": "+1555123456",
    "recruitmentDate": "2024-03-01",
    "salary": 38000,
    "disponibility": true,
    "roleAgent": "driver"
  }')

echo "$AGENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AGENT_RESPONSE"
AGENT_ID=$(echo "$AGENT_RESPONSE" | grep -o '"idUser":"[^"]*"' | cut -d'"' -f4 | head -1)
echo ""
echo "Created agent with ID: $AGENT_ID"
echo ""

echo ""
echo "Testing Vehicles API..."
echo "-----------------------"

# Create a vehicle
echo "1. Creating a vehicle..."
VEHICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "immat": "XYZ-789",
    "type": "Recycling Truck",
    "capacity": 20000,
    "state": "operational",
    "fuelLevel": 90,
    "fuelType": "Electric",
    "emissionCO2": 0
  }')

echo "$VEHICLE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VEHICLE_RESPONSE"
echo ""

# Get all vehicles
echo "2. Retrieving all vehicles..."
curl -s "$BASE_URL/api/vehicles" | python3 -m json.tool 2>/dev/null
echo ""

echo ""
echo "Testing Tours API..."
echo "--------------------"

# Create a tour
echo "1. Creating a tour..."
TOUR_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tours" \
  -H "Content-Type: application/json" \
  -d "{
    \"date\": \"2025-12-12\",
    \"status\": \"planned\",
    \"distance\": 35.5,
    \"estimatedTime\": \"2h 45m\",
    \"collectedQuantity\": 0,
    \"co2Emission\": 8.5,
    \"agents\": [\"$AGENT_ID\"],
    \"collectionPoints\": [\"$CP_ID\"],
    \"vehicleId\": \"XYZ-789\"
  }")

echo "$TOUR_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$TOUR_RESPONSE"
TOUR_ID=$(echo "$TOUR_RESPONSE" | grep -o '"idTour":"[^"]*"' | cut -d'"' -f4 | head -1)
echo ""
echo "Created tour with ID: $TOUR_ID"
echo ""

# Get all tours
echo "2. Retrieving all tours..."
curl -s "$BASE_URL/api/tours" | python3 -m json.tool 2>/dev/null
echo ""

# Export tours as XML
echo "3. Exporting tours as XML..."
curl -s "$BASE_URL/api/tours/export" | head -30
echo ""
echo "... (truncated)"
echo ""

echo ""
echo "Testing Incidents API..."
echo "------------------------"

# Create an incident
echo "1. Creating an incident report..."
INCIDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/incidents" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Container Damage\",
    \"description\": \"Container lid is broken\",
    \"address\": \"456 Park Avenue\",
    \"date\": \"2025-12-11\",
    \"state\": \"pending\",
    \"collectionPointId\": \"$CP_ID\"
  }")

echo "$INCIDENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$INCIDENT_RESPONSE"
echo ""

echo ""
echo "Checking XML Files..."
echo "---------------------"

echo "Collection Points:"
ls -lh data/collection-points/ 2>/dev/null | tail -5

echo ""
echo "Agents:"
ls -lh data/agents/ 2>/dev/null | tail -5

echo ""
echo "Vehicles:"
ls -lh data/vehicles/ 2>/dev/null | tail -5

echo ""
echo "Tours:"
ls -lh data/tours/ 2>/dev/null | tail -5

echo ""
echo "Incidents:"
ls -lh data/incidents/ 2>/dev/null | tail -5

echo ""
echo "Sample XML File Content:"
echo "------------------------"
if [ -n "$CP_ID" ] && [ -f "data/collection-points/$CP_ID.xml" ]; then
  echo "Collection Point XML (data/collection-points/$CP_ID.xml):"
  cat "data/collection-points/$CP_ID.xml"
fi

echo ""
echo "========================================="
echo "  Testing Complete!"
echo "========================================="
