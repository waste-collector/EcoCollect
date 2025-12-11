// scripts/seed-data.ts
// Run with: npx tsx scripts/seed-data.ts

import { writeFileSync, mkdirSync, existsSync } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

// Base64 encoding for passwords (simple demo encoding)
function encodePassword(password: string): string {
  return Buffer.from(`salt:${password}`).toString("base64")
}

const today = new Date().toISOString().split("T")[0]
const now = new Date().toISOString()

// ============ Users (using User.xsd field names) ============

const users = [
  {
    idUser: "admin-001",
    nameU: "Admin User",
    emailU: "admin@ecocollect.io",
    pwdU: encodePassword("admin123"),
    role: "administrator",
    telEmp: "+216 71 123 456",
    functionAdmin: "System Administrator",
    recruitmentDateEmp: "2024-01-15",
    salaryEmp: 5000,
    createdAt: now,
    updatedAt: now
  },
  {
    idUser: "citizen-001",
    nameU: "Mohamed Salah",
    emailU: "citizen@ecocollect.io",
    pwdU: encodePassword("citizen123"),
    role: "citizen",
    phoneCit: "+216 71 456 789",
    adressCit: "123 Main Street, Downtown",
    zoneCit: "Downtown District",
    createdAt: now,
    updatedAt: now
  },
  {
    idUser: "citizen-002",
    nameU: "Sara Hamdi",
    emailU: "sara@ecocollect.io",
    pwdU: encodePassword("citizen123"),
    role: "citizen",
    phoneCit: "+216 71 567 890",
    adressCit: "45 Park Avenue, Residential Area A",
    zoneCit: "Residential Area A",
    createdAt: now,
    updatedAt: now
  }
]

function userToXml(user: typeof users[0]): string {
  if (user.role === "administrator") {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Administrator>
  <idUser>${user.idUser}</idUser>
  <emailU>${user.emailU}</emailU>
  <nameU>${user.nameU}</nameU>
  <pwdU>${user.pwdU}</pwdU>
  <role>${user.role}</role>
  <recruitmentDateEmp>${user.recruitmentDateEmp || today}</recruitmentDateEmp>
  <salaryEmp>${user.salaryEmp || 0}</salaryEmp>
  <telEmp>${user.telEmp || ""}</telEmp>
  <functionAdmin>${user.functionAdmin || "Administrator"}</functionAdmin>
  <createdAt>${user.createdAt}</createdAt>
  <updatedAt>${user.updatedAt}</updatedAt>
</Administrator>`
  }
  
  // Citizen
  return `<?xml version="1.0" encoding="UTF-8"?>
<Citizen>
  <idUser>${user.idUser}</idUser>
  <emailU>${user.emailU}</emailU>
  <nameU>${user.nameU}</nameU>
  <pwdU>${user.pwdU}</pwdU>
  <role>${user.role}</role>
  <adressCit>${user.adressCit || ""}</adressCit>
  <phoneCit>${user.phoneCit || ""}</phoneCit>
  <zoneCit>${user.zoneCit || ""}</zoneCit>
  <createdAt>${user.createdAt}</createdAt>
  <updatedAt>${user.updatedAt}</updatedAt>
</Citizen>`
}

// ============ Agents (using CollectAgent.xsd field names) ============

const agents = [
  {
    idUser: "AGENT-001",
    nameU: "Ahmed Ben Ali",
    emailU: "agent@ecocollect.io",
    pwdU: encodePassword("agent123"),
    role: "agent",
    recruitmentDateEmp: "2024-03-01",
    salaryEmp: 2500,
    telEmp: "+216 71 234 567",
    disponibility: true,
    roleAgent: "collector"
  },
  {
    idUser: "AGENT-002",
    nameU: "Fatima Trabelsi",
    emailU: "fatima@ecocollect.io",
    pwdU: encodePassword("agent123"),
    role: "agent",
    recruitmentDateEmp: "2024-04-15",
    salaryEmp: 2500,
    telEmp: "+216 71 345 678",
    disponibility: true,
    roleAgent: "driver"
  },
  {
    idUser: "AGENT-003",
    nameU: "Youssef Karim",
    emailU: "youssef@ecocollect.io",
    pwdU: encodePassword("agent123"),
    role: "agent",
    recruitmentDateEmp: "2024-02-20",
    salaryEmp: 2800,
    telEmp: "+216 71 678 901",
    disponibility: false,
    roleAgent: "supervisor"
  }
]

function agentToXml(agent: typeof agents[0]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<CollectAgent>
  <idUser>${agent.idUser}</idUser>
  <emailU>${agent.emailU}</emailU>
  <nameU>${agent.nameU}</nameU>
  <pwdU>${agent.pwdU}</pwdU>
  <role>${agent.role}</role>
  <recruitmentDateEmp>${agent.recruitmentDateEmp}</recruitmentDateEmp>
  <salaryEmp>${agent.salaryEmp}</salaryEmp>
  <telEmp>${agent.telEmp}</telEmp>
  <disponibility>${agent.disponibility}</disponibility>
  <roleAgent>${agent.roleAgent}</roleAgent>
</CollectAgent>`
}

// ============ Vehicles (using Vehicule.xsd field names) ============

const vehicles = [
  {
    immatV: "VEH-002",
    typeV: "compactor",
    capacityV: 8000,
    stateV: "operational",
    fuelLevelV: 85,
    typeFuelV: "Diesel",
    emissionCO2: 45.2,
    dateLastMaintenance: "2025-11-20"
  },
  {
    immatV: "VEH-003",
    typeV: "garbage-truck",
    capacityV: 12000,
    stateV: "maintenance",
    fuelLevelV: 60,
    typeFuelV: "Diesel",
    emissionCO2: 52.8,
    dateLastMaintenance: "2025-12-01"
  },
  {
    immatV: "VEH-004",
    typeV: "recycling-truck",
    capacityV: 6000,
    stateV: "operational",
    fuelLevelV: 95,
    typeFuelV: "Electric",
    emissionCO2: 0,
    dateLastMaintenance: "2025-10-30"
  }
]

function vehiculeToXml(vehicle: typeof vehicles[0]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Vehicule>
  <immatV>${vehicle.immatV}</immatV>
  <typeV>${vehicle.typeV}</typeV>
  <capacityV>${vehicle.capacityV}</capacityV>
  <stateV>${vehicle.stateV}</stateV>
  <fuelLevelV>${vehicle.fuelLevelV}</fuelLevelV>
  <typeFuelV>${vehicle.typeFuelV}</typeFuelV>
  <emissionCO2>${vehicle.emissionCO2}</emissionCO2>
  <dateLastMaintenance>${vehicle.dateLastMaintenance}</dateLastMaintenance>
</Vehicule>`
}

// ============ Collection Points (using CollectPoint.xsd field names) ============

const collectionPoints = [
  {
    idCP: "CP-001",
    nameCP: "Main Street Collection",
    adressCP: "123 Main Street, Downtown",
    latitudeGPS: 36.8065,
    longitudeGPS: 10.1815,
    capacityCP: 500,
    fillLevel: 45,
    wasteType: "mixed",
    priorityCP: 2,
    lastCollectDate: "2025-12-10"
  },
  {
    idCP: "CP-002",
    nameCP: "Park Avenue Point",
    adressCP: "45 Park Avenue, Downtown",
    latitudeGPS: 36.8089,
    longitudeGPS: 10.1798,
    capacityCP: 400,
    fillLevel: 78,
    wasteType: "recyclable",
    priorityCP: 1,
    lastCollectDate: "2025-12-09"
  },
  {
    idCP: "CP-003",
    nameCP: "Central Hub",
    adressCP: "1 Central Plaza, Downtown",
    latitudeGPS: 36.8102,
    longitudeGPS: 10.1832,
    capacityCP: 800,
    fillLevel: 92,
    wasteType: "mixed",
    priorityCP: 1,
    lastCollectDate: "2025-12-08"
  },
  {
    idCP: "CP-004",
    nameCP: "North District Point",
    adressCP: "78 North Road, Residential Area A",
    latitudeGPS: 36.8145,
    longitudeGPS: 10.1756,
    capacityCP: 350,
    fillLevel: 35,
    wasteType: "organic",
    priorityCP: 3,
    lastCollectDate: "2025-12-10"
  },
  {
    idCP: "CP-005",
    nameCP: "West End Station",
    adressCP: "22 West End Lane, Residential Area A",
    latitudeGPS: 36.8023,
    longitudeGPS: 10.1689,
    capacityCP: 450,
    fillLevel: 62,
    wasteType: "mixed",
    priorityCP: 2,
    lastCollectDate: "2025-12-09"
  },
  {
    idCP: "CP-006",
    nameCP: "South Point",
    adressCP: "99 South Avenue, Residential Area B",
    latitudeGPS: 36.7998,
    longitudeGPS: 10.1845,
    capacityCP: 300,
    fillLevel: 28,
    wasteType: "recyclable",
    priorityCP: 4,
    lastCollectDate: "2025-12-10"
  }
]

function collectionPointToXml(point: typeof collectionPoints[0]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<CollectPoint>
  <idCP>${point.idCP}</idCP>
  <nameCP>${point.nameCP}</nameCP>
  <adressCP>${point.adressCP}</adressCP>
  <latitudeGPS>${point.latitudeGPS}</latitudeGPS>
  <longitudeGPS>${point.longitudeGPS}</longitudeGPS>
  <capacityCP>${point.capacityCP}</capacityCP>
  <fillLevel>${point.fillLevel}</fillLevel>
  <wasteType>${point.wasteType}</wasteType>
  <priorityCP>${point.priorityCP}</priorityCP>
  <lastCollectDate>${point.lastCollectDate}</lastCollectDate>
</CollectPoint>`
}

// ============ Tours (using CollectTour.xsd field names) ============

const tours = [
  {
    idTour: "TOUR-001",
    dateTour: "2025-12-10",
    statusTour: "completed",
    distanceTour: 12.5,
    estimedTimeTour: "03:30",
    collectedQuantityTour: 2500,
    CO2emissionTour: 15.2,
    agentIds: ["AGENT-001"],
    collectionPointIds: ["CP-001", "CP-002", "CP-003"],
    immatV: "VEH-002"
  },
  {
    idTour: "TOUR-002",
    dateTour: "2025-12-11",
    statusTour: "in-progress",
    distanceTour: 8.3,
    estimedTimeTour: "02:00",
    collectedQuantityTour: 800,
    CO2emissionTour: 8.5,
    agentIds: ["AGENT-002"],
    collectionPointIds: ["CP-004", "CP-005"],
    immatV: "VEH-004"
  },
  {
    idTour: "TOUR-003",
    dateTour: "2025-12-12",
    statusTour: "pending",
    distanceTour: 6.8,
    estimedTimeTour: "02:00",
    collectedQuantityTour: 0,
    CO2emissionTour: 0,
    agentIds: ["AGENT-003"],
    collectionPointIds: ["CP-006"],
    immatV: "VEH-003"
  },
  {
    idTour: "TOUR-004",
    dateTour: "2025-12-13",
    statusTour: "pending",
    distanceTour: 10.2,
    estimedTimeTour: "03:00",
    collectedQuantityTour: 0,
    CO2emissionTour: 0,
    agentIds: ["AGENT-001"],
    collectionPointIds: ["CP-001", "CP-002"],
    immatV: "VEH-002"
  }
]

function tourToXml(tour: typeof tours[0]): string {
  const agentsXml = tour.agentIds.map(id => `      <idClAgent>${id}</idClAgent>`).join("\n")
  const pointsXml = tour.collectionPointIds.map(id => `      <idCP>${id}</idCP>`).join("\n")
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<CollectTour>
  <idTour>${tour.idTour}</idTour>
  <dateTour>${tour.dateTour}</dateTour>
  <statusTour>${tour.statusTour}</statusTour>
  <distanceTour>${tour.distanceTour}</distanceTour>
  <estimedTimeTour>${tour.estimedTimeTour}</estimedTimeTour>
  <collectedQuantityTour>${tour.collectedQuantityTour}</collectedQuantityTour>
  <CO2emissionTour>${tour.CO2emissionTour}</CO2emissionTour>
  <idClAgents>
${agentsXml}
  </idClAgents>
  <idCPs>
${pointsXml}
  </idCPs>
  <immatV>${tour.immatV}</immatV>
</CollectTour>`
}

// ============ Incidents (using IncidentReport.xsd field names) ============

const incidents = [
  {
    idIR: "INC-001",
    typeIR: "container-problem",
    descIR: "Container at Central Hub is overflowing and needs immediate attention",
    adressIR: "1 Central Plaza, Downtown",
    dateIR: "2025-12-10",
    stateIR: "pending",
    idcitizen: "citizen-001",
    idCP: "CP-003"
  },
  {
    idIR: "INC-002",
    typeIR: "vehicle-issue",
    descIR: "Vehicle VEH-003 engine warning light appeared during route",
    adressIR: "78 North Road, Residential Area A",
    dateIR: "2025-12-09",
    stateIR: "acknowledged",
    idcitizen: "",
    idCP: ""
  },
  {
    idIR: "INC-003",
    typeIR: "route-issue",
    descIR: "Scheduled collection was missed at West End Station",
    adressIR: "22 West End Lane, Residential Area A",
    dateIR: "2025-12-08",
    stateIR: "resolved",
    idcitizen: "citizen-002",
    idCP: "CP-005"
  }
]

function incidentToXml(incident: typeof incidents[0]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<IncidentReport>
  <idIR>${incident.idIR}</idIR>
  <typeIR>${incident.typeIR}</typeIR>
  <descIR>${incident.descIR}</descIR>
  <adressIR>${incident.adressIR}</adressIR>
  <dateIR>${incident.dateIR}</dateIR>
  <stateIR>${incident.stateIR}</stateIR>
  <idcitizen>${incident.idcitizen}</idcitizen>
  <idCP>${incident.idCP}</idCP>
</IncidentReport>`
}

// ============ Main Seed Function ============

async function seed() {
  console.log("Starting seed process...")

  // Ensure directories
  const dirs = ["users", "agents", "vehicles", "collection-points", "tours", "incidents", "sessions"]
  dirs.forEach(dir => {
    ensureDir(path.join(dataDir, dir))
    console.log(`Created directory: data/${dir}`)
  })

  // Seed users
  console.log("\nSeeding users...")
  users.forEach(user => {
    const xml = userToXml(user)
    writeFileSync(path.join(dataDir, "users", `${user.idUser}.xml`), xml)
    console.log(`  ${user.nameU} (${user.emailU}) - ${user.role}`)
  })

  // Seed agents
  console.log("\nSeeding agents...")
  agents.forEach(agent => {
    const xml = agentToXml(agent)
    writeFileSync(path.join(dataDir, "agents", `${agent.idUser}.xml`), xml)
    console.log(`  ${agent.nameU} - ${agent.roleAgent}`)
  })

  // Seed vehicles
  console.log("\nSeeding vehicles...")
  vehicles.forEach(vehicle => {
    const xml = vehiculeToXml(vehicle)
    writeFileSync(path.join(dataDir, "vehicles", `${vehicle.immatV}.xml`), xml)
    console.log(`  ${vehicle.immatV} - ${vehicle.typeV} (${vehicle.stateV})`)
  })

  // Seed collection points
  console.log("\nSeeding collection points...")
  collectionPoints.forEach(point => {
    const xml = collectionPointToXml(point)
    writeFileSync(path.join(dataDir, "collection-points", `${point.idCP}.xml`), xml)
    console.log(`  ${point.nameCP} - ${point.fillLevel}% full`)
  })

  // Seed tours
  console.log("\nSeeding tours...")
  tours.forEach(tour => {
    const xml = tourToXml(tour)
    writeFileSync(path.join(dataDir, "tours", `${tour.idTour}.xml`), xml)
    console.log(`  ${tour.idTour} - ${tour.statusTour}`)
  })

  // Seed incidents
  console.log("\nSeeding incidents...")
  incidents.forEach(incident => {
    const xml = incidentToXml(incident)
    writeFileSync(path.join(dataDir, "incidents", `${incident.idIR}.xml`), xml)
    console.log(`  ${incident.idIR} - ${incident.stateIR}`)
  })

  console.log("\nSeed completed successfully!")
  console.log("\nDemo Accounts:")
  console.log("  Admin:   admin@ecocollect.io / admin123")
  console.log("  Agent:   agent@ecocollect.io / agent123")
  console.log("  Citizen: citizen@ecocollect.io / citizen123")
}

seed().catch(console.error)
