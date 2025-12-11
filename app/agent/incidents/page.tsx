"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { AlertCircle, Clock, Loader2 } from "lucide-react"
import { fetchIncidents, createIncident, updateIncident } from "@/lib/api-client"
import type { IncidentReport } from "@/lib/types"

interface DisplayIncident {
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

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<DisplayIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "other" as DisplayIncident["type"],
    severity: "medium" as DisplayIncident["severity"],
  })

  useEffect(() => {
    loadIncidents()
  }, [])

  async function loadIncidents() {
    try {
      const res = await fetchIncidents()
      if (res.success && res.data) {
        const mappedIncidents: DisplayIncident[] = res.data.map((i: IncidentReport) => ({
          id: i.idIR,
          title: i.typeIR,
          description: i.descIR,
          location: i.adressIR,
          type: normalizeType(i.typeIR),
          severity: "medium", // XSD doesn't have severity, default to medium
          status: normalizeStatus(i.stateIR),
          timestamp: i.dateIR,
          photos: 0
        }))
        setIncidents(mappedIncidents)
      }
    } catch (error) {
      console.error("Failed to load incidents:", error)
    } finally {
      setLoading(false)
    }
  }

  function normalizeType(type: string): DisplayIncident["type"] {
    const t = (type || "other").toLowerCase().replace(/\s+/g, "-")
    if (t.includes("vehicle")) return "vehicle-issue"
    if (t.includes("container") || t.includes("overflow")) return "container-problem"
    if (t.includes("route") || t.includes("traffic")) return "route-issue"
    return "other"
  }

  function normalizeStatus(status: string): DisplayIncident["status"] {
    const s = (status || "open").toLowerCase()
    if (s === "resolved" || s === "closed" || s === "done") return "resolved"
    if (s === "acknowledged" || s === "in-progress" || s === "pending") return "acknowledged"
    return "open"
  }

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const incidentData = {
        title: formData.title,
        titleIR: formData.title,
        description: formData.description,
        descriptionIR: formData.description,
        location: formData.location,
        locationIR: formData.location,
        type: formData.type,
        typeIR: formData.type,
        severity: formData.severity,
        severityIR: formData.severity,
        status: "open",
        stateIR: "open",
        timestamp: new Date().toISOString(),
        dateIR: new Date().toISOString()
      }

      const res = await createIncident(incidentData)
      
      if (res.success) {
        const newIncident: DisplayIncident = {
          id: res.data?.id || `INC-${Date.now()}`,
          ...formData,
          status: "open",
          timestamp: new Date().toLocaleString(),
        }

        setIncidents([newIncident, ...incidents])
        setFormData({ title: "", description: "", location: "", type: "other", severity: "medium" })
        setDialogOpen(false)
      } else {
        alert(`Failed to create incident: ${res.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to create incident:", error)
      alert("Failed to create incident")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcknowledge = async (incidentId: string) => {
    try {
      const res = await updateIncident(incidentId, { 
        status: "acknowledged",
        stateIR: "acknowledged"
      })
      
      if (res.success) {
        setIncidents(prev => prev.map(i => 
          i.id === incidentId ? { ...i, status: "acknowledged" } : i
        ))
      }
    } catch (error) {
      console.error("Failed to acknowledge incident:", error)
    }
  }

  const getSeverityColor = (severity: DisplayIncident["severity"]) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-300"
    }
  }

  const getTypeLabel = (type: DisplayIncident["type"]) => {
    const labels: Record<DisplayIncident["type"], string> = {
      "vehicle-issue": "Vehicle Issue",
      "container-problem": "Container Problem",
      "route-issue": "Route Issue",
      other: "Other",
    }
    return labels[type]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const openIncidents = incidents.filter(i => i.status === "open").length
  const highSeverity = incidents.filter(i => i.severity === "high").length

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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DisplayIncident["type"] })}
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
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as DisplayIncident["severity"] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
            <div className="text-2xl font-bold text-red-600">{openIncidents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highSeverity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground/60">
            No incidents reported. Click "Report Incident" to create one.
          </CardContent>
        </Card>
      ) : (
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
                    <div>Location: {incident.location}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {incident.timestamp}
                    </div>
                    <div className="bg-muted px-2 py-1 rounded">{getTypeLabel(incident.type)}</div>
                    {incident.photos && incident.photos > 0 && <div>Photos: {incident.photos}</div>}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <StatusBadge
                      status={
                        incident.status === "resolved" ? "empty" : incident.status === "acknowledged" ? "partial" : "full"
                      }
                      label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    />
                    {incident.status === "open" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAcknowledge(incident.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
