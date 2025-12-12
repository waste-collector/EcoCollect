/**
 * TypeScript Types matching XSD Schemas exactly
 * This is the single source of truth for all data types in the application
 * Field names match XSD element names exactly - DO NOT create aliases
 */

// ============ Vehicule (matches Vehicule.xsd) ============
export interface Vehicule {
  immatV: string              // Primary ID - vehicle registration/license plate
  typeV: string               // Vehicle type (e.g., "garbage-truck", "compactor")
  capacityV: number           // Capacity in kg
  stateV: string              // State: "operational" | "maintenance" | "out-of-service"
  fuelLevelV: number          // Fuel level percentage (0-100)
  typeFuelV: string           // Fuel type (e.g., "Diesel", "Electric")
  emissionCO2: number         // CO2 emissions
  dateLastMaintenance: string // ISO date string (YYYY-MM-DD)
}

// ============ CollectPoint (matches CollectPoint.xsd) ============
export interface CollectPoint {
  idCP: string                // Primary ID
  nameCP: string              // Collection point name
  adressCP: string            // Address (note: "adress" matches XSD spelling)
  latitudeGPS: number         // GPS latitude
  longitudeGPS: number        // GPS longitude
  capacityCP: number          // Capacity
  fillLevel: number           // Fill level percentage (0-100)
  wasteType: string           // Waste type: "mixed" | "recyclable" | "organic"
  priorityCP: number          // Priority level (1-5)
  lastCollectDate: string     // ISO date string (YYYY-MM-DD)
}

// ============ CollectTour (matches CollectTour.xsd) ============
export interface CollectTour {
  idTour: string              // Primary ID
  dateTour: string            // ISO date string (YYYY-MM-DD)
  statusTour: string          // Status: "pending" | "in-progress" | "completed"
  distanceTour: number        // Distance in km
  estimedTimeTour: string     // Estimated time (e.g., "02:30" or "150 min")
  collectedQuantityTour: number // Collected quantity in kg
  CO2emissionTour: number     // CO2 emissions for this tour
  idClAgents?: {              // Optional: assigned agent IDs
    idClAgent: string | string[]
  }
  idCPs?: {                   // Optional: collection point IDs
    idCP: string | string[]
  }
  immatV?: string             // Optional: assigned vehicle registration
}

// ============ CollectAgent (matches CollectAgent.xsd) ============
export interface CollectAgent {
  idUser: string              // Primary ID (same as user ID)
  emailU: string              // Email
  nameU: string               // Full name
  pwdU: string                // Hashed password
  role: string                // Role: "agent"
  recruitmentDateEmp: string  // ISO date string (YYYY-MM-DD)
  salaryEmp: number           // Salary
  telEmp: string              // Phone number
  disponibility: boolean      // Availability status
  roleAgent: string           // Agent role: "collector" | "driver" | "supervisor"
}

// ============ IncidentReport (matches IncidentReport.xsd) ============
export interface IncidentReport {
  idIR: string                // Primary ID
  typeIR: string              // Incident type: "container-problem" | "vehicle-issue" | "route-issue"
  descIR: string              // Description
  adressIR: string            // Address (note: "adress" matches XSD spelling)
  dateIR: string              // ISO date string (YYYY-MM-DD)
  stateIR: string             // State: "pending" | "acknowledged" | "resolved"
  idcitizen?: string          // Optional: reporting citizen ID
  idCP?: string               // Optional: related collection point ID
}

// ============ User (matches User.xsd) ============
export interface User {
  idUser: string              // Primary ID
  emailU: string              // Email
  nameU: string               // Full name
  pwdU: string                // Hashed password
  role: string                // Role: "admin" | "agent" | "citizen"
  createdAt?: string          // ISO datetime string
  updatedAt?: string          // ISO datetime string
}

// ============ Citizen (matches Citizen.xsd) ============
export interface Citizen extends Omit<User, "role"> {
  role: "citizen"             // Fixed role
  adressCit?: string          // Address (note: "adress" matches XSD spelling)
  phoneCit?: string           // Phone number
  zoneCit?: string            // Zone/district
}

// ============ Administrator (matches Administrator.xsd) ============
export interface Administrator extends Omit<User, "role"> {
  role: "administrator"       // Fixed role
  recruitmentDateEmp?: string // ISO date string (YYYY-MM-DD)
  salaryEmp?: number          // Salary
  telEmp?: string             // Phone number
  functionAdmin?: string      // Admin function/title
}

// ============ Session (matches Session.xsd) ============
export interface Session {
  sessionId: string           // Primary ID
  userId: string              // Reference to user
  userRole: string            // User's role
  createdAt: string           // ISO datetime string
  expiresAt: string           // ISO datetime string
}

// ============ API Response Types ============
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

// ============ Stats Types ============
export interface DashboardStats {
  totalTours: number
  completedTours: number
  pendingTours: number
  inProgressTours: number
  totalVehicles: number
  operationalVehicles: number
  maintenanceVehicles: number
  totalCollectionPoints: number
  criticalPoints: number
  totalAgents: number
  availableAgents: number
  totalIncidents: number
  openIncidents: number
  resolvedIncidents: number
  co2Saved: number
}

// ============ Helper type for union of all user types ============
export type AnyUser = User | Citizen | Administrator | CollectAgent

// ============ Form Input Types (for creating/updating) ============
export interface VehiculeInput {
  immatV: string
  typeV: string
  capacityV: number
  stateV?: string
  fuelLevelV?: number
  typeFuelV?: string
  emissionCO2?: number
  dateLastMaintenance?: string
}

export interface CollectPointInput {
  idCP?: string
  nameCP: string
  adressCP: string
  latitudeGPS: number
  longitudeGPS: number
  capacityCP?: number
  fillLevel?: number
  wasteType?: string
  priorityCP?: number
  lastCollectDate?: string
}

export interface CollectTourInput {
  idTour?: string
  dateTour: string
  statusTour?: string
  distanceTour?: number
  estimedTimeTour?: string
  collectedQuantityTour?: number
  CO2emissionTour?: number
  agentIds?: string[]  // Array of agent IDs (required: at least 1)
  collectionPointIds?: string[]
  immatV?: string  // Vehicle ID (required)
  idClAgents?: {  // Used for internal XML representation
    idClAgent: string | string[]
  }
  idCPs?: {  // Used for internal XML representation
    idCP: string | string[]
  }
}

export interface IncidentReportInput {
  idIR?: string
  typeIR: string
  descIR: string
  adressIR: string
  dateIR?: string
  stateIR?: string
  idcitizen?: string
  idCP?: string
}

export interface CollectAgentInput {
  idUser?: string
  emailU: string
  nameU: string
  pwdU?: string
  recruitmentDateEmp?: string
  salaryEmp?: number
  telEmp?: string
  disponibility?: boolean
  roleAgent?: string
}

export interface CitizenInput {
  idUser?: string
  emailU: string
  nameU: string
  pwdU?: string
  adressCit?: string
  phoneCit?: string
  zoneCit?: string
}
