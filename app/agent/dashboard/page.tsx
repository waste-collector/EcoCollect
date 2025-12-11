"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchTours, fetchIncidents, getCurrentUser } from "@/lib/api-client"
import type { CollectTour, IncidentReport } from "@/lib/types"

interface DisplayTour {
  id: string
  zone: string
  name: string
  status: string
  collections: number
  distance: number
}

export default function AgentDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null)
  const [tours, setTours] = useState<DisplayTour[]>([])
  const [stats, setStats] = useState({
    completedCollections: 0,
    totalDistance: 0,
    incidentsThisWeek: 0,
    efficiency: 0
  })
  const [performanceData, setPerformanceData] = useState([
    { day: "Mon", collections: 0, incidents: 0 },
    { day: "Tue", collections: 0, incidents: 0 },
    { day: "Wed", collections: 0, incidents: 0 },
    { day: "Thu", collections: 0, incidents: 0 },
    { day: "Fri", collections: 0, incidents: 0 },
    { day: "Sat", collections: 0, incidents: 0 },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get current user
        const userRes = await getCurrentUser()
        if (userRes.success && userRes.data) {
          setUser(userRes.data)
        } else {
          // Try localStorage
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }

        // Fetch tours
        const toursRes = await fetchTours()
        if (toursRes.success && toursRes.data) {
          const toursData: DisplayTour[] = toursRes.data.map((t: CollectTour) => {
            const cpIds = t.idCPs?.idCP
            const cpArray = Array.isArray(cpIds) ? cpIds : cpIds ? [cpIds] : []
            
            return {
              id: t.idTour,
              zone: `Tour ${t.idTour}`,
              name: t.idTour,
              status: t.statusTour || "pending",
              collections: cpArray.length,
              distance: t.distanceTour || 0
            }
          })
          
          // Show today's tours (limit to 5)
          setTours(toursData.slice(0, 5))
          
          // Calculate stats
          const completedTours = toursData.filter((t: DisplayTour) => t.status === "completed")
          const inProgressTour = toursData.find((t: DisplayTour) => t.status === "in-progress")
          
          const totalCollections = completedTours.reduce((sum: number, t: DisplayTour) => sum + t.collections, 0)
          const currentDistance = inProgressTour ? inProgressTour.distance : 0
          
          // Calculate efficiency (completed / total * 100)
          const efficiency = toursData.length > 0 
            ? Math.round((completedTours.length / toursData.length) * 100) 
            : 0
          
          setStats(prev => ({
            ...prev,
            completedCollections: totalCollections,
            totalDistance: currentDistance,
            efficiency
          }))
          
          // Generate mock performance data based on tours
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          const mockPerformance = days.map((day, index) => ({
            day,
            collections: Math.floor(Math.random() * 10) + (completedTours.length > 0 ? 5 : 0),
            incidents: index === 1 || index === 3 ? 1 : 0
          }))
          setPerformanceData(mockPerformance)
        }

        // Fetch incidents
        const incidentsRes = await fetchIncidents()
        if (incidentsRes.success && incidentsRes.data) {
          const openIncidents = incidentsRes.data.filter((i: IncidentReport) => 
            i.stateIR === "open" || i.stateIR === "pending"
          )
          setStats(prev => ({
            ...prev,
            incidentsThisWeek: openIncidents.length
          }))
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.name || "Collection Agent"}!
        </h1>
        <p className="text-foreground/60">{formatDate()} - Your daily overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.completedCollections}</div>
            <p className="text-xs text-foreground/60 mt-1">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distance Traveled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-foreground/60 mt-1">Current tour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.incidentsThisWeek}</div>
            <p className="text-xs text-foreground/60 mt-1">Open this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.efficiency}%</div>
            <p className="text-xs text-foreground/60 mt-1">Tours completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tours */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tours</CardTitle>
          <CardDescription>Your scheduled collection routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tours.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">
              No tours assigned for today
            </div>
          ) : (
            tours.map((tour) => (
              <div key={tour.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tour.zone}</p>
                    <p className="text-sm text-foreground/60">
                      {tour.collections} collections • {tour.distance.toFixed(1)} km
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"}
                  label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1).replace("-", " ")}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance This Week</CardTitle>
          <CardDescription>Collections and incidents trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="collections" stroke="#38b000" strokeWidth={2} name="Collections" />
              <Line type="monotone" dataKey="incidents" stroke="#dc2626" strokeWidth={2} name="Incidents" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button asChild>
          <Link href="/agent/tours">View All Tours</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/agent/incidents">Report Incident</Link>
        </Button>
      </div>
    </div>
  )
}
