"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { AlertCircle, Clock } from "lucide-react"

interface Incident {
  id: string
  title: string
  description: string
  location: string
  type: "vehicle-issue" | "container-problem" | "route-issue" | "other"
  severity: "low" | "medium" | "high"
  status: "open" | "acknowledged" | "resolved"
  timestamp: string
  photos?: number
}

const initialIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "Vehicle Breakdown",
    description: "Engine warning light appeared during route",
    location: "Downtown District - Main Street",
    type: "vehicle-issue",
    severity: "high",
    status: "open",
    timestamp: "2025-12-02 02:30 PM",
    photos: 2,
  },
  {
    id: "INC-002",
    title: "Container Overflow",
    description: "Collection point overflowing, could not empty",
    location: "Residential Area A - North District",
    type: "container-problem",
    severity: "high",
    status: "acknowledged",
    timestamp: "2025-12-02 01:15 PM",
    photos: 1,
  },
  {
    id: "INC-003",
    title: "Traffic Delay",
    description: "Unexpected traffic caused route delay",
    location: "Downtown District",
    type: "route-issue",
    severity: "low",
    status: "resolved",
    timestamp: "2025-12-01 11:00 AM",
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "other" as Incident["type"],
    severity: "medium" as Incident["severity"],
  })

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault()

    const newIncident: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "open",
      timestamp: new Date().toLocaleString(),
    }

    setIncidents([newIncident, ...incidents])
    setFormData({ title: "", description: "", location: "", type: "other", severity: "medium" })
    setDialogOpen(false)
  }

  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-300"
    }
  }

  const getTypeLabel = (type: Incident["type"]) => {
    const labels: Record<Incident["type"], string> = {
      "vehicle-issue": "Vehicle Issue",
      "container-problem": "Container Problem",
      "route-issue": "Route Issue",
      other: "Other",
    }
    return labels[type]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
          <p className="text-foreground/60">Report and track operational issues</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Report Incident</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report an Incident</DialogTitle>
              <DialogDescription>Document issues during your collection route</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Incident Title</label>
                <Input
                  placeholder="e.g., Vehicle Breakdown"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Describe the incident..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <Input
                  placeholder="Collection point or route location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Incident["type"] })}
                  >
                    <option value="vehicle-issue">Vehicle Issue</option>
                    <option value="container-problem">Container Problem</option>
                    <option value="route-issue">Route Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Severity</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as Incident["severity"] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Submit Incident
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incident Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{incidents.filter((i) => i.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter((i) => i.severity === "high").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${incident.severity === "high" ? "bg-red-100 dark:bg-red-900" : incident.severity === "medium" ? "bg-yellow-100 dark:bg-yellow-900" : "bg-green-100 dark:bg-green-900"}`}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{incident.title}</h3>
                      <p className="text-sm text-foreground/60 mt-1">{incident.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                  <div>📍 {incident.location}</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {incident.timestamp}
                  </div>
                  <div className="bg-muted px-2 py-1 rounded">{getTypeLabel(incident.type)}</div>
                  {incident.photos && <div>📷 {incident.photos} photo(s)</div>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <StatusBadge
                    status={
                      incident.status === "resolved" ? "empty" : incident.status === "acknowledged" ? "partial" : "full"
                    }
                    label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  />
                  {incident.status === "open" && (
                    <Button variant="outline" size="sm">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
