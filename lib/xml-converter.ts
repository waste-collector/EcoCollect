import { Builder } from "xml2js"
import { parseStringPromise } from "xml2js"
import type {
  Vehicule,
  CollectPoint,
  CollectTour,
  CollectAgent,
  IncidentReport,
  User,
  Citizen,
  Administrator
} from "./types"

// Input types for API routes (accepts both old and new field names)
interface VehiculeInput {
  immatV?: string
  id?: string
  immat?: string
  typeV?: string
  type?: string
  capacityV?: number
  capacity?: number
  stateV?: string
  state?: string
  fuelLevelV?: number
  fuelLevel?: number
  typeFuelV?: string
  fuelType?: string
  emissionCO2?: number
  dateLastMaintenance?: string
}

interface CollectPointInput {
  idCP?: string
  id?: string
  nameCP?: string
  name?: string
  adressCP?: string
  address?: string
  latitudeGPS?: number
  latitude?: number
  longitudeGPS?: number
  longitude?: number
  capacityCP?: number
  capacity?: number
  fillLevel?: number
  wasteType?: string
  priorityCP?: number
  priority?: number
  lastCollectDate?: string
}

interface CollectAgentInput {
  idUser?: string
  id?: string
  emailU?: string
  email?: string
  nameU?: string
  name?: string
  pwdU?: string
  password?: string
  role?: string
  recruitmentDateEmp?: string
  recruitmentDate?: string
  salaryEmp?: number
  salary?: number
  telEmp?: string
  phone?: string
  disponibility?: boolean
  roleAgent?: string
}

interface CollectTourInput {
  idTour?: string
  id?: string
  dateTour?: string
  date?: string
  statusTour?: string
  status?: string
  distanceTour?: number
  distance?: number
  estimedTimeTour?: string
  estimatedTime?: string
  duration?: string
  collectedQuantityTour?: number
  collectedQuantity?: number
  CO2emissionTour?: number
  co2Emission?: number
  idClAgents?: { idClAgent: string | string[] }
  agents?: string[]
  idCPs?: { idCP: string | string[] }
  collectionPoints?: string[]
  immatV?: string
  vehicleId?: string
  vehicle?: string
}

interface IncidentReportInput {
  idIR?: string
  id?: string
  typeIR?: string
  type?: string
  descIR?: string
  description?: string
  adressIR?: string
  address?: string
  location?: string
  dateIR?: string
  date?: string
  stateIR?: string
  state?: string
  status?: string
  idcitizen?: string
  citizenId?: string
  idCP?: string
  collectionPointId?: string
}

interface UserInput {
  idUser?: string
  id?: string
  emailU?: string
  email?: string
  nameU?: string
  name?: string
  pwdU?: string
  password?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

interface CitizenInput extends UserInput {
  adressCit?: string
  address?: string
  phoneCit?: string
  phone?: string
  zoneCit?: string
  zone?: string
}

interface AdministratorInput extends UserInput {
  recruitmentDateEmp?: string
  recruitmentDate?: string
  salaryEmp?: number
  salary?: number
  telEmp?: string
  phone?: string
  functionAdmin?: string
  function?: string
}

interface SessionInput {
  sessionId: string
  userId: string
  userRole: string
  createdAt?: string
  expiresAt: string
}

export class XMLConverter {
  private static builder = new Builder({
    xmldec: { version: "1.0", encoding: "utf-8" },
    renderOpts: { pretty: true, indent: "  " }
  })

  // ============ JSON to XML Converters ============

  static jsonToXML(data: Record<string, unknown>, rootElement: string): string {
    const obj = { [rootElement]: data }
    return this.builder.buildObject(obj)
  }

  static vehiculeToXML(data: VehiculeInput): string {
    const formatted = {
      immatV: data.immatV || data.id || data.immat,
      typeV: data.typeV || data.type,
      capacityV: data.capacityV ?? data.capacity,
      stateV: data.stateV || data.state || "operational",
      fuelLevelV: data.fuelLevelV ?? data.fuelLevel ?? 100,
      typeFuelV: data.typeFuelV || data.fuelType || "Diesel",
      emissionCO2: data.emissionCO2 ?? 0,
      dateLastMaintenance: data.dateLastMaintenance || new Date().toISOString().split("T")[0]
    }
    return this.jsonToXML(formatted, "Vehicule")
  }

  static collectionPointToXML(data: CollectPointInput): string {
    const formatted = {
      idCP: data.idCP || data.id,
      nameCP: data.nameCP || data.name,
      adressCP: data.adressCP || data.address || "",
      latitudeGPS: data.latitudeGPS ?? data.latitude,
      longitudeGPS: data.longitudeGPS ?? data.longitude,
      capacityCP: data.capacityCP ?? data.capacity ?? 500,
      fillLevel: data.fillLevel ?? 0,
      wasteType: data.wasteType || "mixed",
      priorityCP: data.priorityCP ?? data.priority ?? 1,
      lastCollectDate: data.lastCollectDate || new Date().toISOString().split("T")[0]
    }
    return this.jsonToXML(formatted, "CollectPoint")
  }

  static collectAgentToXML(data: CollectAgentInput): string {
    const formatted = {
      idUser: data.idUser || data.id,
      emailU: data.emailU || data.email,
      nameU: data.nameU || data.name,
      pwdU: data.pwdU || data.password || "",
      role: data.role || "agent",
      recruitmentDateEmp: data.recruitmentDateEmp || data.recruitmentDate || new Date().toISOString().split("T")[0],
      salaryEmp: data.salaryEmp ?? data.salary ?? 0,
      telEmp: data.telEmp || data.phone || "",
      disponibility: data.disponibility ?? true,
      roleAgent: data.roleAgent || "collector"
    }
    return this.jsonToXML(formatted, "CollectAgent")
  }

  static collectTourToXML(data: CollectTourInput): string {
    const formatted: Record<string, unknown> = {
      idTour: data.idTour || data.id,
      dateTour: data.dateTour || data.date || new Date().toISOString().split("T")[0],
      statusTour: data.statusTour || data.status || "pending",
      distanceTour: data.distanceTour ?? data.distance ?? 0,
      estimedTimeTour: data.estimedTimeTour || data.estimatedTime || data.duration || "00:00",
      collectedQuantityTour: data.collectedQuantityTour ?? data.collectedQuantity ?? 0,
      CO2emissionTour: data.CO2emissionTour ?? data.co2Emission ?? 0
    }

    // Handle agents
    if (data.agents && Array.isArray(data.agents) && data.agents.length > 0) {
      formatted.idClAgents = { idClAgent: data.agents }
    } else if (data.idClAgents) {
      formatted.idClAgents = data.idClAgents
    }

    // Handle collection points
    if (data.collectionPoints && Array.isArray(data.collectionPoints) && data.collectionPoints.length > 0) {
      formatted.idCPs = { idCP: data.collectionPoints }
    } else if (data.idCPs) {
      formatted.idCPs = data.idCPs
    }

    // Handle vehicle
    if (data.vehicleId || data.immatV || data.vehicle) {
      formatted.immatV = data.immatV || data.vehicleId || data.vehicle
    }

    return this.jsonToXML(formatted, "CollectTour")
  }

  static incidentReportToXML(data: IncidentReportInput): string {
    const formatted: Record<string, unknown> = {
      idIR: data.idIR || data.id,
      typeIR: data.typeIR || data.type,
      descIR: data.descIR || data.description,
      adressIR: data.adressIR || data.address || data.location || "",
      dateIR: data.dateIR || data.date || new Date().toISOString().split("T")[0],
      stateIR: data.stateIR || data.state || data.status || "pending"
    }
    
    const citizenId = data.idcitizen || data.citizenId
    if (citizenId) {
      formatted.idcitizen = citizenId
    }
    
    const cpId = data.idCP || data.collectionPointId
    if (cpId) {
      formatted.idCP = cpId
    }

    return this.jsonToXML(formatted, "IncidentReport")
  }

  // ============ User Type Converters ============

  static userToXML(data: UserInput): string {
    const formatted: Record<string, unknown> = {
      idUser: data.idUser || data.id,
      emailU: data.emailU || data.email,
      nameU: data.nameU || data.name,
      pwdU: data.pwdU || data.password || "",
      role: data.role || "citizen"
    }
    
    if (data.createdAt) {
      formatted.createdAt = data.createdAt
    }
    
    if (data.updatedAt) {
      formatted.updatedAt = data.updatedAt
    }

    return this.jsonToXML(formatted, "User")
  }

  static citizenToXML(data: CitizenInput): string {
    const formatted: Record<string, unknown> = {
      idUser: data.idUser || data.id,
      emailU: data.emailU || data.email,
      nameU: data.nameU || data.name,
      pwdU: data.pwdU || data.password || "",
      role: data.role || "citizen",
      adressCit: data.adressCit || data.address || "",
      phoneCit: data.phoneCit || data.phone || "",
      zoneCit: data.zoneCit || data.zone || ""
    }
    
    if (data.createdAt) {
      formatted.createdAt = data.createdAt
    }
    
    if (data.updatedAt) {
      formatted.updatedAt = data.updatedAt
    }

    return this.jsonToXML(formatted, "Citizen")
  }

  static administratorToXML(data: AdministratorInput): string {
    const formatted: Record<string, unknown> = {
      idUser: data.idUser || data.id,
      emailU: data.emailU || data.email,
      nameU: data.nameU || data.name,
      pwdU: data.pwdU || data.password || "",
      role: data.role || "administrator",
      recruitmentDateEmp: data.recruitmentDateEmp || data.recruitmentDate || new Date().toISOString().split("T")[0],
      salaryEmp: data.salaryEmp ?? data.salary ?? 0,
      telEmp: data.telEmp || data.phone || "",
      functionAdmin: data.functionAdmin || data.function || "Administrator"
    }
    
    if (data.createdAt) {
      formatted.createdAt = data.createdAt
    }
    
    if (data.updatedAt) {
      formatted.updatedAt = data.updatedAt
    }

    return this.jsonToXML(formatted, "Administrator")
  }

  static sessionToXML(data: SessionInput): string {
    const formatted = {
      sessionId: data.sessionId,
      userId: data.userId,
      userRole: data.userRole,
      createdAt: data.createdAt || new Date().toISOString(),
      expiresAt: data.expiresAt
    }
    return this.jsonToXML(formatted, "Session")
  }

  // ============ XML to JSON Converters ============

  static async xmlToJSON(xmlString: string): Promise<Record<string, unknown>> {
    try {
      const result = await parseStringPromise(xmlString, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true
      })
      return result
    } catch (error) {
      throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async vehiculeFromXML(xmlString: string): Promise<Vehicule> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (parsed as { Vehicule: Record<string, string> }).Vehicule
    return {
      immatV: data.immatV,
      typeV: data.typeV,
      capacityV: parseFloat(data.capacityV),
      stateV: data.stateV,
      fuelLevelV: parseFloat(data.fuelLevelV),
      typeFuelV: data.typeFuelV,
      emissionCO2: parseFloat(data.emissionCO2) || 0,
      dateLastMaintenance: data.dateLastMaintenance
    }
  }

  static async collectionPointFromXML(xmlString: string): Promise<CollectPoint> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (parsed as { CollectPoint: Record<string, string> }).CollectPoint
    return {
      idCP: data.idCP,
      nameCP: data.nameCP,
      adressCP: data.adressCP,
      latitudeGPS: parseFloat(data.latitudeGPS),
      longitudeGPS: parseFloat(data.longitudeGPS),
      capacityCP: parseFloat(data.capacityCP),
      fillLevel: parseFloat(data.fillLevel),
      wasteType: data.wasteType,
      priorityCP: parseInt(data.priorityCP),
      lastCollectDate: data.lastCollectDate
    }
  }

  static async collectAgentFromXML(xmlString: string): Promise<CollectAgent> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (parsed as { CollectAgent: Record<string, string> }).CollectAgent
    return {
      idUser: data.idUser,
      emailU: data.emailU,
      nameU: data.nameU,
      pwdU: data.pwdU,
      role: data.role,
      recruitmentDateEmp: data.recruitmentDateEmp,
      salaryEmp: parseFloat(data.salaryEmp) || 0,
      telEmp: data.telEmp,
      disponibility: data.disponibility === "true" || data.disponibility === true as unknown as string,
      roleAgent: data.roleAgent
    }
  }

  static async collectTourFromXML(xmlString: string): Promise<CollectTour> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (parsed as { CollectTour: Record<string, unknown> }).CollectTour
    
    const tour: CollectTour = {
      idTour: data.idTour as string,
      dateTour: data.dateTour as string,
      statusTour: data.statusTour as string,
      distanceTour: parseFloat(data.distanceTour as string) || 0,
      estimedTimeTour: data.estimedTimeTour as string,
      collectedQuantityTour: parseFloat(data.collectedQuantityTour as string) || 0,
      CO2emissionTour: parseFloat(data.CO2emissionTour as string) || 0
    }

    if (data.idClAgents) {
      tour.idClAgents = data.idClAgents as { idClAgent: string | string[] }
    }

    if (data.idCPs) {
      tour.idCPs = data.idCPs as { idCP: string | string[] }
    }

    if (data.immatV) {
      tour.immatV = data.immatV as string
    }

    return tour
  }

  static async incidentReportFromXML(xmlString: string): Promise<IncidentReport> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (parsed as { IncidentReport: Record<string, string> }).IncidentReport
    
    const incident: IncidentReport = {
      idIR: data.idIR,
      typeIR: data.typeIR,
      descIR: data.descIR,
      adressIR: data.adressIR,
      dateIR: data.dateIR,
      stateIR: data.stateIR
    }
    
    if (data.idcitizen) {
      incident.idcitizen = data.idcitizen
    }
    
    if (data.idCP) {
      incident.idCP = data.idCP
    }

    return incident
  }

  static async userFromXML(xmlString: string): Promise<User | Citizen | Administrator | CollectAgent> {
    const parsed = await this.xmlToJSON(xmlString)
    const data = (
      (parsed as { User?: Record<string, string> }).User ||
      (parsed as { Citizen?: Record<string, string> }).Citizen ||
      (parsed as { Administrator?: Record<string, string> }).Administrator ||
      (parsed as { CollectAgent?: Record<string, string> }).CollectAgent
    ) as Record<string, string>
    
    const role = data.role
    
    const baseUser = {
      idUser: data.idUser,
      emailU: data.emailU,
      nameU: data.nameU,
      pwdU: data.pwdU,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
    
    if (role === "citizen") {
      return {
        ...baseUser,
        role: "citizen" as const,
        adressCit: data.adressCit,
        phoneCit: data.phoneCit,
        zoneCit: data.zoneCit
      } as Citizen
    }
    
    if (role === "administrator") {
      return {
        ...baseUser,
        role: "administrator" as const,
        recruitmentDateEmp: data.recruitmentDateEmp,
        salaryEmp: parseFloat(data.salaryEmp) || undefined,
        telEmp: data.telEmp,
        functionAdmin: data.functionAdmin
      } as Administrator
    }
    
    if (role === "agent") {
      return {
        idUser: data.idUser,
        emailU: data.emailU,
        nameU: data.nameU,
        pwdU: data.pwdU,
        role: "agent",
        recruitmentDateEmp: data.recruitmentDateEmp,
        salaryEmp: parseFloat(data.salaryEmp) || 0,
        telEmp: data.telEmp,
        disponibility: data.disponibility === "true",
        roleAgent: data.roleAgent
      } as CollectAgent
    }
    
    return baseUser as User
  }

  // ============ Helper methods for arrays in tours ============

  static getAgentIdsFromTour(tour: CollectTour): string[] {
    if (!tour.idClAgents) return []
    if (Array.isArray(tour.idClAgents.idClAgent)) {
      return tour.idClAgents.idClAgent
    }
    return tour.idClAgents.idClAgent ? [tour.idClAgents.idClAgent] : []
  }

  static getCollectionPointIdsFromTour(tour: CollectTour): string[] {
    if (!tour.idCPs) return []
    if (Array.isArray(tour.idCPs.idCP)) {
      return tour.idCPs.idCP
    }
    return tour.idCPs.idCP ? [tour.idCPs.idCP] : []
  }

  static buildAgentsElement(agentIds: string[]): { idClAgent: string[] } | undefined {
    if (agentIds.length === 0) return undefined
    return { idClAgent: agentIds }
  }

  static buildCollectionPointsElement(cpIds: string[]): { idCP: string[] } | undefined {
    if (cpIds.length === 0) return undefined
    return { idCP: cpIds }
  }
}
