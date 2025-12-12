// ============ Auth API ============

export async function login(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

export async function signup(data: {
  name: string
  email: string
  password: string
  userType?: string
  address?: string
  phone?: string
  zone?: string
}) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  })
  return response.json()
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me")
  return response.json()
}

// ============ Users API ============

export async function fetchUsers() {
  const response = await fetch("/api/users")
  return response.json()
}

export async function fetchUser(id: string) {
  const response = await fetch(`/api/users?id=${id}`)
  return response.json()
}

export async function updateUser(id: string, data: any) {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  })
  return response.json()
}

export async function deleteUser(id: string) {
  const response = await fetch(`/api/users?id=${id}`, {
    method: "DELETE",
  })
  return response.json()
}

// ============ Tours API ============

export async function fetchTours(format: "json" | "xml" = "json") {
  const response = await fetch(`/api/tours?format=${format}`)
  return response.json()
}

export async function fetchTour(id: string) {
  const response = await fetch(`/api/tours/${id}`)
  return response.json()
}

export async function createTour(tourData: any) {
  const response = await fetch("/api/tours", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tourData),
  })
  return response.json()
}

export async function updateTour(id: string, tourData: any) {
  const response = await fetch(`/api/tours/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tourData),
  })
  return response.json()
}

export async function deleteTour(id: string) {
  const response = await fetch(`/api/tours/${id}`, {
    method: "DELETE",
  })
  return response.json()
}

export async function importToursXML(xmlContent: string) {
  const response = await fetch("/api/tours/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xmlContent }),
  })
  return response.json()
}

export async function exportToursXML(ids?: string[]) {
  const response = await fetch("/api/tours/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  })
  return response.json()
}

// ============ Collection Points API ============

export async function fetchCollectionPoints(zone?: string) {
  const url = zone ? `/api/collection-points?zone=${zone}` : "/api/collection-points"
  const response = await fetch(url)
  return response.json()
}

export async function fetchCollectionPoint(id: string) {
  const response = await fetch(`/api/collection-points?id=${id}`)
  return response.json()
}

export async function createCollectionPoint(pointData: any) {
  const response = await fetch("/api/collection-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pointData),
  })
  return response.json()
}

export async function updateCollectionPoint(id: string, pointData: any) {
  const response = await fetch("/api/collection-points", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...pointData }),
  })
  return response.json()
}

export async function deleteCollectionPoint(id: string) {
  const response = await fetch(`/api/collection-points?id=${id}`, {
    method: "DELETE",
  })
  return response.json()
}

// ============ Vehicles API ============

export async function fetchVehicles() {
  const response = await fetch("/api/vehicles")
  return response.json()
}

export async function fetchVehicle(id: string) {
  const response = await fetch(`/api/vehicles?id=${id}`)
  return response.json()
}

export async function createVehicle(vehicleData: any) {
  const response = await fetch("/api/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicleData),
  })
  return response.json()
}

export async function updateVehicle(id: string, vehicleData: any) {
  const response = await fetch("/api/vehicles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...vehicleData }),
  })
  return response.json()
}

export async function deleteVehicle(id: string) {
  const response = await fetch(`/api/vehicles?id=${id}`, {
    method: "DELETE",
  })
  return response.json()
}

// ============ Agents API ============

export async function fetchAgents(zone?: string) {
  const url = zone ? `/api/agents?zone=${zone}` : "/api/agents"
  const response = await fetch(url)
  return response.json()
}

export async function fetchAgent(id: string) {
  const response = await fetch(`/api/agents?id=${id}`)
  return response.json()
}

export async function createAgent(agentData: any) {
  const response = await fetch("/api/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agentData),
  })
  return response.json()
}

export async function updateAgent(id: string, agentData: any) {
  const response = await fetch("/api/agents", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...agentData }),
  })
  return response.json()
}

export async function deleteAgent(id: string) {
  const response = await fetch(`/api/agents?id=${id}`, {
    method: "DELETE",
  })
  return response.json()
}

// ============ Incidents API ============

export async function fetchIncidents(filters?: { status?: string; citizenId?: string }) {
  let url = "/api/incidents"
  const params = new URLSearchParams()
  if (filters?.status) params.append("status", filters.status)
  if (filters?.citizenId) params.append("citizenId", filters.citizenId)
  if (params.toString()) url += `?${params.toString()}`
  
  const response = await fetch(url)
  return response.json()
}

export async function fetchIncident(id: string) {
  const response = await fetch(`/api/incidents?id=${id}`)
  return response.json()
}

export async function createIncident(incidentData: any) {
  const response = await fetch("/api/incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidentData),
  })
  return response.json()
}

export async function updateIncident(id: string, incidentData: any) {
  const response = await fetch("/api/incidents", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...incidentData }),
  })
  return response.json()
}

export async function deleteIncident(id: string) {
  const response = await fetch(`/api/incidents?id=${id}`, {
    method: "DELETE",
  })
  return response.json()
}

// ============ Import/Export API ============

export async function importVehiclesXML(xmlContent: string) {
  const response = await fetch("/api/vehicles/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xmlContent }),
  })
  return response.json()
}

export async function importAgentsXML(xmlContent: string) {
  const response = await fetch("/api/agents/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xmlContent }),
  })
  return response.json()
}

export async function importCollectionPointsXML(xmlContent: string) {
  const response = await fetch("/api/collection-points/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xmlContent }),
  })
  return response.json()
}

export async function exportCollectionPointsXML(ids?: string[]) {
  const response = await fetch("/api/collection-points/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  })
  return response.json()
}

// ============ Stats API ============

export async function fetchStats() {
  // Aggregate stats from various endpoints
  const [tours, vehicles, collectionPoints, agents, incidents] = await Promise.all([
    fetchTours(),
    fetchVehicles(),
    fetchCollectionPoints(),
    fetchAgents(),
    fetchIncidents(),
  ])

  const toursData = tours.data || []
  const vehiclesData = vehicles.data || []
  const pointsData = collectionPoints.data || []
  const agentsData = agents.data || []
  const incidentsData = incidents.data || []

  return {
    success: true,
    data: {
      totalTours: toursData.length,
      completedTours: toursData.filter((t: { statusTour?: string }) => t.statusTour === "completed").length,
      pendingTours: toursData.filter((t: { statusTour?: string }) => t.statusTour === "pending").length,
      inProgressTours: toursData.filter((t: { statusTour?: string }) => t.statusTour === "in-progress").length,
      totalVehicles: vehiclesData.length,
      operationalVehicles: vehiclesData.filter((v: { stateV?: string }) => v.stateV === "operational").length,
      maintenanceVehicles: vehiclesData.filter((v: { stateV?: string }) => v.stateV === "maintenance").length,
      totalCollectionPoints: pointsData.length,
      criticalPoints: pointsData.filter((p: { fillLevel?: number }) => (p.fillLevel || 0) >= 80).length,
      totalAgents: agentsData.length,
      availableAgents: agentsData.filter((a: { disponibility?: boolean | string }) => a.disponibility === true || a.disponibility === "true").length,
      totalIncidents: incidentsData.length,
      openIncidents: incidentsData.filter((i: { stateIR?: string }) => i.stateIR === "pending" || i.stateIR === "acknowledged").length,
      resolvedIncidents: incidentsData.filter((i: { stateIR?: string }) => i.stateIR === "resolved").length,
      // Calculate total CO2 saved (based on tour emissions)
      co2Saved: toursData.reduce((sum: number, t: { CO2emissionTour?: number }) => sum + (t.CO2emissionTour || 0), 0),
    }
  }
}
