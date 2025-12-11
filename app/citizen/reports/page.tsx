"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchIncidents, createIncident, getCurrentUser } from "@/lib/api-client"

interface Report {
  id: string
  title: string
  description: string
  zone: string
  date: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    zone: "Downtown District",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    try {
      // Get current user
      const userRes = await getCurrentUser()
      let currentUserId = null
      if (userRes.success && userRes.data) {
        currentUserId = userRes.data.id || userRes.data.idUser
      } else {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          currentUserId = parsed.id || parsed.idUser
        }
      }
      setUserId(currentUserId)

      // Fetch incidents (optionally filter by citizen ID)
      const res = await fetchIncidents(currentUserId ? { citizenId: currentUserId } : undefined)
      if (res.success && res.data) {
        const mappedReports: Report[] = res.data.map((i: any) => ({
          id: i.id || i.idIR,
          title: i.title || i.titleIR || "Untitled Report",
          description: i.description || i.descriptionIR || "",
          zone: i.location || i.locationIR || i.zone || "Unknown Zone",
          date: (i.timestamp || i.dateIR || new Date().toISOString()).split("T")[0],
          status: normalizeStatus(i.status || i.stateIR),
          priority: normalizePriority(i.severity || i.severityIR || i.priority)
        }))
        setReports(mappedReports)
      }
    } catch (error) {
      console.error("Failed to load reports:", error)
    } finally {
      setLoading(false)
    }
  }

  function normalizeStatus(status: string): Report["status"] {
    const s = (status || "open").toLowerCase()
    if (s === "resolved" || s === "closed" || s === "done") return "resolved"
    if (s === "in-progress" || s === "acknowledged" || s === "pending") return "in-progress"
    return "open"
  }

  function normalizePriority(priority: string): Report["priority"] {
    const p = (priority || "medium").toLowerCase()
    if (p === "high" || p === "critical") return "high"
    if (p === "low" || p === "minor") return "low"
    return "medium"
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const incidentData = {
        title: formData.title,
        titleIR: formData.title,
        description: formData.description,
        descriptionIR: formData.description,
        location: formData.zone,
        locationIR: formData.zone,
        type: "container-problem",
        typeIR: "container-problem",
        severity: "medium",
        severityIR: "medium",
        status: "open",
        stateIR: "open",
        citizenId: userId,
        timestamp: new Date().toISOString(),
        dateIR: new Date().toISOString()
      }

      const res = await createIncident(incidentData)
      
      if (res.success) {
        const newReport: Report = {
          id: res.data?.id || `RPT-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          zone: formData.zone,
          date: new Date().toISOString().split("T")[0],
          status: "open",
          priority: "medium",
        }

        setReports([newReport, ...reports])
        setFormData({ title: "", description: "", zone: "Downtown District" })
        setDialogOpen(false)
      } else {
        alert(`Failed to submit report: ${res.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to submit report:", error)
      alert("Failed to submit report")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getStatusLabel = (status: Report["status"]) => {
    switch (status) {
      case "open":
        return "Open"
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const openReports = reports.filter(r => r.status === "open").length
  const resolvedReports = reports.filter(r => r.status === "resolved").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-foreground/60">Track your issue reports and updates</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Submit New Report</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
              <DialogDescription>Tell us about waste management issues in your area</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Issue Title</label>
                <Input
                  placeholder="e.g., Overflowing Container"
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
                  placeholder="Describe the issue..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zone</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                >
                  <option>Downtown District</option>
                  <option>Residential Area A</option>
                  <option>Residential Area B</option>
                  <option>Industrial Zone</option>
                  <option>Commercial Center</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Report
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{openReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground/60">
            No reports submitted yet. Click "Submit New Report" to report an issue.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div>{getStatusIcon(report.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{report.title}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{report.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-foreground/60">Zone: {report.zone}</span>
                      <span className="text-xs text-foreground/60">Date: {report.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <StatusBadge
                      status={
                        report.status === "resolved" ? "empty" : report.status === "in-progress" ? "partial" : "full"
                      }
                      label={getStatusLabel(report.status)}
                    />
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                    </span>
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
