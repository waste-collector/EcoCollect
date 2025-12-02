"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Report {
  id: number
  title: string
  description: string
  zone: string
  date: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
}

const initialReports: Report[] = [
  {
    id: 1,
    title: "Overflowing Container",
    description: "Main Street collection point is overflowing",
    zone: "Downtown District",
    date: "2025-11-28",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    title: "Damaged Container",
    description: "Wheel is broken on the container at Park Ave",
    zone: "Residential Area A",
    date: "2025-11-26",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Missed Collection",
    description: "No collection on scheduled date",
    zone: "Downtown District",
    date: "2025-11-24",
    status: "resolved",
    priority: "medium",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    zone: "Downtown District",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault()

    const newReport: Report = {
      id: Math.max(...reports.map((r) => r.id), 0) + 1,
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
                </select>
              </div>
              <Button type="submit" className="w-full">
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
            <div className="text-2xl font-bold text-red-600">{reports.filter((r) => r.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter((r) => r.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
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
                    <span className="text-xs text-foreground/60">📍 {report.zone}</span>
                    <span className="text-xs text-foreground/60">📅 {report.date}</span>
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
    </div>
  )
}
