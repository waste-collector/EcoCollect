"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Truck, CheckCircle } from "lucide-react"

interface Tour {
  id: string
  zone: string
  status: "completed" | "in-progress" | "pending"
  collections: number
  points: { name: string; collected: boolean }[]
  distance: number
  duration: string
  vehicle: string
  date: string
  startTime: string
  endTime?: string
}

const tours: Tour[] = [
  {
    id: "TOUR-A-001",
    zone: "Downtown District",
    status: "completed",
    collections: 12,
    points: [
      { name: "Main Street Collection", collected: true },
      { name: "Park Avenue Point", collected: true },
      { name: "Central Hub", collected: true },
    ],
    distance: 8.5,
    duration: "2h 30m",
    vehicle: "V-001",
    date: "2025-12-02",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
  },
  {
    id: "TOUR-A-002",
    zone: "Residential Area A",
    status: "in-progress",
    collections: 8,
    points: [
      { name: "North District", collected: true },
      { name: "West End Station", collected: false },
      { name: "South Point", collected: false },
    ],
    distance: 5.2,
    duration: "1h 45m",
    vehicle: "V-005",
    date: "2025-12-02",
    startTime: "12:00 PM",
  },
  {
    id: "TOUR-A-003",
    zone: "Residential Area B",
    status: "pending",
    collections: 0,
    points: [
      { name: "East Collection Point", collected: false },
      { name: "Valley Hub", collected: false },
    ],
    distance: 6.8,
    duration: "2h 0m",
    vehicle: "V-003",
    date: "2025-12-02",
    startTime: "02:00 PM",
  },
]

export default function ToursPage() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Tours</h1>
        <p className="text-foreground/60">View and manage your collection routes</p>
      </div>

      {/* Tour Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tours.filter((t) => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tours.filter((t) => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tours List */}
      <div className="space-y-3">
        {tours.map((tour) => (
          <Dialog key={tour.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-primary/50 transition">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{tour.zone}</h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded">{tour.id}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/60">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {tour.startTime} {tour.endTime ? `- ${tour.endTime}` : ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Vehicle {tour.vehicle}
                        </div>
                        <div>📏 {tour.distance} km</div>
                        <div>📦 {tour.collections} collections</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <StatusBadge
                        status={
                          tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"
                        }
                        label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{tour.zone}</DialogTitle>
                <DialogDescription>{tour.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Collection Points</p>
                  <div className="space-y-2">
                    {tour.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border border-border rounded">
                        {point.collected ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-yellow-600 rounded-full" />
                        )}
                        <span className="text-sm">{point.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60">Distance</p>
                    <p className="font-medium">{tour.distance} km</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Duration</p>
                    <p className="font-medium">{tour.duration}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Start Time</p>
                    <p className="font-medium">{tour.startTime}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Status</p>
                    <StatusBadge
                      status={
                        tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"
                      }
                      label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                    />
                  </div>
                </div>

                {tour.status === "in-progress" && <Button className="w-full">Complete Tour</Button>}
                {tour.status === "pending" && <Button className="w-full">Start Tour</Button>}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
