"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle, MapPin, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchCollectionPoints, fetchTours, getCurrentUser } from "@/lib/api-client"

interface CollectionPoint {
  idCP: string
  nameCP: string
  adressCP: string
  distance: number
  status: "empty" | "partial" | "full"
  fillLevel: number
}

interface Collection {
  idCollectT: string
  zone: string
  date: string
  time: string
}

const wasteStats = [
  { month: "Jan", recycled: 45, waste: 24 },
  { month: "Feb", recycled: 52, waste: 28 },
  { month: "Mar", recycled: 48, waste: 22 },
  { month: "Apr", recycled: 61, waste: 25 },
  { month: "May", recycled: 55, waste: 21 },
  { month: "Jun", recycled: 67, waste: 19 },
]

export default function CitizenDashboard() {
  const [user, setUser] = useState<any>(null)
  const [nearbyPoints, setNearbyPoints] = useState<CollectionPoint[]>([])
  const [nextCollections, setNextCollections] = useState<Collection[]>([])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get current user
        const userRes = await getCurrentUser()
        if (userRes.success && userRes.data) {
          setUser(userRes.data)
        } else {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }

        // Fetch collection points
        const pointsRes = await fetchCollectionPoints()
        console.log(pointsRes)
        if (pointsRes.success && pointsRes.data) {
          const mappedPoints: CollectionPoint[] = pointsRes.data.slice(0, 5).map((p: any) => {
            const fillLevel = parseInt(p.fillLevel) || 0
            let status: "empty" | "partial" | "full" = "empty"
            if (fillLevel >= 80) status = "full"
            else if (fillLevel >= 40) status = "partial"
            
            return {
              idCP: p.idCP,
              nameCP: p.nameCP,
              adressCP: p.adressCP,
              distance: parseFloat((Math.random() * 2).toFixed(1)),
              status,
              fillLevel
            }
          })
          setNearbyPoints(mappedPoints)

          // Check for full containers to create alert
          const fullPoints = mappedPoints.filter(p => p.status === "full")
          if (fullPoints.length > 0) {
            setAlertMessage(
              `Collection point${fullPoints.length > 1 ? 's' : ''} near you (${fullPoints.map(p => p.nameCP).join(", ")}) ${fullPoints.length > 1 ? 'are' : 'is'} full. Please use alternate locations temporarily.`
            )
          }
        }

        // Fetch tours for upcoming collections
        const toursRes = await fetchTours()
        if (toursRes.success && toursRes.data) {
          const pendingTours = toursRes.data
            .filter((t: any) => t.status === "pending" || t.statusTour === "pending")
            .slice(0, 3)
          
          const mappedCollections: Collection[] = pendingTours.map((t: any, index: number) => ({
            idCollectT: t.idCollectT || t.id || `tour-${index}`,
            zone: t.nameTour || t.name || t.zone || "Unknown Zone",
            date: t.dateTour || t.date || new Date().toISOString().split("T")[0],
            time: t.startTimeTour || t.startTime || "09:00 AM"
          }))
          setNextCollections(mappedCollections)
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const userZone = user?.zone || user?.address || "Downtown District"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-foreground/60">Here's your waste management overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Waste This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">145 kg</div>
            <p className="text-xs text-foreground/60 mt-1">Estimated average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recycled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">67 kg</div>
            <p className="text-xs text-foreground/60 mt-1">46% of total waste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary truncate">{userZone}</div>
            <p className="text-xs text-foreground/60 mt-1">Your service area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nearby Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{nearbyPoints.length}</div>
            <p className="text-xs text-foreground/60 mt-1">Collection points</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alertMessage && (
        <Alert className="border-accent/20 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Next Collections */}
      <Card>
        <CardHeader>
          <CardTitle>Next Collections</CardTitle>
          <CardDescription>Scheduled waste collection in your zone</CardDescription>
        </CardHeader>
        <CardContent>
          {nextCollections.length === 0 ? (
            <div className="text-center py-6 text-foreground/60">
              No upcoming collections scheduled
            </div>
          ) : (
            <div className="space-y-3">
              {nextCollections.map((collection) => (
                <div
                  key={collection.idCollectT}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{collection.zone}</p>
                      <p className="text-sm text-foreground/60">
                        {collection.date} at {collection.time}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="empty" label="Upcoming" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby Collection Points */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Collection Points</CardTitle>
          <CardDescription>Container status near your location</CardDescription>
        </CardHeader>
        <CardContent>
          {nearbyPoints.length === 0 ? (
            <div className="text-center py-6 text-foreground/60">
              No collection points found nearby
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyPoints.map((point) => (
                <div key={point.idCP} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{point.nameCP}</p>
                      <p className="text-sm text-foreground/60">{point.distance} km away</p>
                    </div>
                  </div>
                  <StatusBadge status={point.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waste Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Community Contribution</CardTitle>
          <CardDescription>Monthly waste and recycling trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recycled" fill="#16a34a" name="Recycled (kg)" />
              <Bar dataKey="waste" fill="#dc2626" name="Waste (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button asChild>
          <Link href="/citizen/reports">Report an Issue</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/citizen/schedules">View All Schedules</Link>
        </Button>
      </div>
    </div>
  )
}