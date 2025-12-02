"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Trash2, Edit, Download, Upload } from "lucide-react"

interface Tour {
  id: string
  name: string
  zone: string
  agent: string
  vehicle: string
  distance: number
  duration: string
  status: "completed" | "in-progress" | "pending"
  date: string
}

const initialTours: Tour[] = [
  {
    id: "TOUR-001",
    name: "Downtown Morning Route",
    zone: "Downtown District",
    agent: "John Smith",
    vehicle: "V-001",
    distance: 12.5,
    duration: "2h 30m",
    status: "completed",
    date: "2025-12-02",
  },
  {
    id: "TOUR-002",
    name: "Residential Area A - Afternoon",
    zone: "Residential Area A",
    agent: "Sarah Johnson",
    vehicle: "V-005",
    distance: 8.3,
    duration: "1h 45m",
    status: "in-progress",
    date: "2025-12-02",
  },
  {
    id: "TOUR-003",
    name: "Downtown Evening Route",
    zone: "Downtown District",
    agent: "Mike Wilson",
    vehicle: "V-003",
    distance: 10.2,
    duration: "2h 15m",
    status: "pending",
    date: "2025-12-03",
  },
]

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>(initialTours)
  const [formData, setFormData] = useState({
    name: "",
    zone: "",
    agent: "",
    vehicle: "",
    distance: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [xmlFile, setXmlFile] = useState<File | null>(null)

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault()

    const newTour: Tour = {
      id: `TOUR-${String(tours.length + 1).padStart(3, "0")}`,
      name: formData.name,
      zone: formData.zone,
      agent: formData.agent,
      vehicle: formData.vehicle,
      distance: Number.parseFloat(formData.distance),
      duration: "2h 0m",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    }

    setTours([...tours, newTour])
    setFormData({ name: "", zone: "", agent: "", vehicle: "", distance: "" })
    setDialogOpen(false)
  }

  const handleDeleteTour = (id: string) => {
    setTours(tours.filter((t) => t.id !== id))
  }

  const handleExportXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<tours>
  ${tours
    .map(
      (tour) => `
  <tour>
    <id>${tour.id}</id>
    <name>${tour.name}</name>
    <zone>${tour.zone}</zone>
    <agent>${tour.agent}</agent>
    <vehicle>${tour.vehicle}</vehicle>
    <distance>${tour.distance}</distance>
    <duration>${tour.duration}</duration>
    <status>${tour.status}</status>
    <date>${tour.date}</date>
  </tour>
  `,
    )
    .join("")}
</tours>`

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(xmlContent))
    element.setAttribute("download", "tours_export.xml")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleImportXML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const xml = event.target?.result as string
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xml, "text/xml")
          const tourElements = xmlDoc.getElementsByTagName("tour")

          const importedTours: Tour[] = Array.from(tourElements).map((el, idx) => ({
            id: el.getElementsByTagName("id")[0]?.textContent || `TOUR-IMP-${idx}`,
            name: el.getElementsByTagName("name")[0]?.textContent || "",
            zone: el.getElementsByTagName("zone")[0]?.textContent || "",
            agent: el.getElementsByTagName("agent")[0]?.textContent || "",
            vehicle: el.getElementsByTagName("vehicle")[0]?.textContent || "",
            distance: Number.parseFloat(el.getElementsByTagName("distance")[0]?.textContent || "0"),
            duration: el.getElementsByTagName("duration")[0]?.textContent || "",
            status: (el.getElementsByTagName("status")[0]?.textContent || "pending") as Tour["status"],
            date: el.getElementsByTagName("date")[0]?.textContent || "",
          }))

          setTours([...tours, ...importedTours])
          alert(`Successfully imported ${importedTours.length} tours`)
        } catch (error) {
          alert("Error parsing XML file")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tours Management</h1>
          <p className="text-foreground/60">Create and manage collection tours</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Tour</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Tour</DialogTitle>
                <DialogDescription>Add a new collection tour</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTour} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tour Name</label>
                  <Input
                    placeholder="e.g., Downtown Morning Route"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Zone</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    required
                  >
                    <option value="">Select zone...</option>
                    <option value="Downtown District">Downtown District</option>
                    <option value="Residential Area A">Residential Area A</option>
                    <option value="Residential Area B">Residential Area B</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Agent</label>
                  <Input
                    placeholder="Agent name"
                    value={formData.agent}
                    onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Vehicle ID</label>
                  <Input
                    placeholder="e.g., V-001"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Distance (km)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12.5"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Tour
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExportXML}>
            <Download className="w-4 h-4 mr-2" />
            Export XML
          </Button>
          <label className="cursor-pointer">
            <input type="file" accept=".xml" onChange={handleImportXML} className="hidden" />
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import XML
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Tours List */}
      <div className="space-y-3">
        {tours.map((tour) => (
          <Card key={tour.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{tour.name}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{tour.id}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/60">
                    <div>📍 Zone: {tour.zone}</div>
                    <div>👤 Agent: {tour.agent}</div>
                    <div>🚛 Vehicle: {tour.vehicle}</div>
                    <div>📏 Distance: {tour.distance} km</div>
                    <div>⏱️ Duration: {tour.duration}</div>
                    <div>📅 Date: {tour.date}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <StatusBadge
                    status={tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"}
                    label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTour(tour.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
