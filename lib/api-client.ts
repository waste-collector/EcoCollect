export async function fetchTours(format: "json" | "xml" = "json") {
  const response = await fetch(`/api/tours?format=${format}`)
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

export async function exportToursXML(tours: any[]) {
  const response = await fetch("/api/tours/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tours }),
  })
  return response.json()
}

export async function fetchCollectionPoints(zone?: string) {
  const url = zone ? `/api/collection-points?zone=${zone}` : "/api/collection-points"
  const response = await fetch(url)
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

export async function fetchVehicles() {
  const response = await fetch("/api/vehicles")
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

export async function fetchAgents(zone?: string) {
  const url = zone ? `/api/agents?zone=${zone}` : "/api/agents"
  const response = await fetch(url)
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
