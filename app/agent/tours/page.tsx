"use client"

import { useState, useEffect } from "react"
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
import { Clock, Truck, CheckCircle, Loader2 } from "lucide-react"
import { fetchTours, updateTour } from "@/lib/api-client"

interface CollectionPoint {
  name: string
  collected: boolean
}

interface Tour {
  id: string
  zone: string
  status: "completed" | "in-progress" | "pending"
  collections: number
  points: CollectionPoint[]
  distance: number
  duration: string
  vehicle: string
  date: string
  startTime: string
  endTime?: string
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadTours()
  }, [])

  async function loadTours() {
    try {
      const res = await fetchTours()
      if (res.success && res.data) {
        const mappedTours: Tour[] = res.data.map((t: any) => ({
          id: t.id || t.idCollectT,
          zone: t.zone || t.name || t.nameTour || "Unknown Zone",
          status: normalizeStatus(t.status || t.statusTour),
          collections: t.collectionPoints?.length || t.collectPoints?.length || 0,
          points: (t.collectionPoints || t.collectPoints || []).map((p: any) => ({
            name: p.name || p.addressCollectP || `Point ${p.id || p.idCollectP}`,
            collected: p.collected || false
          })),
          distance: parseFloat(t.distance || t.distanceTour) || 0,
          duration: formatDuration(t.duration || t.durationTour),
          vehicle: t.vehicle || t.vehicleId || "N/A",
          date: t.date || t.dateTour || new Date().toISOString().split("T")[0],
          startTime: t.startTime || t.startTimeTour || "09:00 AM",
          endTime: t.endTime || t.endTimeTour
        }))
        setTours(mappedTours)
      }
    } catch (error) {
      console.error("Failed to load tours:", error)
    } finally {
      setLoading(false)
    }
  }

  function normalizeStatus(status: string): "completed" | "in-progress" | "pending" {
    const s = (status || "pending").toLowerCase()
    if (s === "completed" || s === "done") return "completed"
    if (s === "in-progress" || s === "inprogress" || s === "active") return "in-progress"
    return "pending"
  }

  function formatDuration(duration: any): string {
    if (!duration) return "0h 0m"
    if (typeof duration === "string" && duration.includes("h")) return duration
    const mins = parseInt(duration) || 0
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
  }

  async function handleStartTour(tourId: string) {
    setActionLoading(tourId)
    try {
      const res = await updateTour(tourId, { 
        status: "in-progress",
        statusTour: "in-progress",
        startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      })
      
      if (res.success) {
        setTours(prev => prev.map(t => 
          t.id === tourId 
            ? { ...t, status: "in-progress", startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
            : t
        ))
      } else {
        alert(`Failed to start tour: ${res.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to start tour:", error)
      alert("Failed to start tour")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCompleteTour(tourId: string) {
    setActionLoading(tourId)
    try {
      const endTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      const res = await updateTour(tourId, { 
        status: "completed",
        statusTour: "completed",
        endTime
      })
      
      if (res.success) {
        setTours(prev => prev.map(t => 
          t.id === tourId 
            ? { 
                ...t, 
                status: "completed", 
                endTime,
                points: t.points.map(p => ({ ...p, collected: true }))
              }
            : t
        ))
      } else {
        alert(`Failed to complete tour: ${res.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to complete tour:", error)
      alert("Failed to complete tour")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const completedTours = tours.filter(t => t.status === "completed").length
  const inProgressTours = tours.filter(t => t.status === "in-progress").length

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
            <div className="text-2xl font-bold text-green-600">{completedTours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressTours}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tours List */}
      {tours.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground/60">
            No tours assigned. Check back later for new assignments.
          </CardContent>
        </Card>
      ) : (
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
                          <div>Distance: {tour.distance.toFixed(1)} km</div>
                          <div>Points: {tour.collections}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <StatusBadge
                          status={
                            tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"
                          }
                          label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1).replace("-", " ")}
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
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {tour.points.length === 0 ? (
                        <p className="text-sm text-foreground/60">No collection points defined</p>
                      ) : (
                        tour.points.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 border border-border rounded">
                            {point.collected ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-yellow-600 rounded-full" />
                            )}
                            <span className="text-sm">{point.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-foreground/60">Distance</p>
                      <p className="font-medium">{tour.distance.toFixed(1)} km</p>
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
                        label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1).replace("-", " ")}
                      />
                    </div>
                  </div>

                  {tour.status === "in-progress" && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCompleteTour(tour.id)}
                      disabled={actionLoading === tour.id}
                    >
                      {actionLoading === tour.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Complete Tour
                    </Button>
                  )}
                  {tour.status === "pending" && (
                    <Button 
                      className="w-full"
                      onClick={() => handleStartTour(tour.id)}
                      disabled={actionLoading === tour.id}
                    >
                      {actionLoading === tour.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Start Tour
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}
