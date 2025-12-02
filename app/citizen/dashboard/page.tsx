"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

const wasteStats = [
  { month: "Jan", recycled: 45, waste: 24 },
  { month: "Feb", recycled: 52, waste: 28 },
  { month: "Mar", recycled: 48, waste: 22 },
  { month: "Apr", recycled: 61, waste: 25 },
  { month: "May", recycled: 55, waste: 21 },
  { month: "Jun", recycled: 67, waste: 19 },
]

const nextCollections = [
  { id: 1, zone: "Downtown District", date: "2025-12-03", time: "09:00 AM", status: "upcoming" },
  { id: 2, zone: "Residential Area A", date: "2025-12-05", time: "02:00 PM", status: "upcoming" },
  { id: 3, zone: "Downtown District", date: "2025-12-10", time: "09:00 AM", status: "upcoming" },
]

const nearbyPoints = [
  { id: 1, name: "Main Street Collection", distance: 0.3, status: "empty" as const },
  { id: 2, name: "Park Avenue Point", distance: 0.5, status: "partial" as const },
  { id: 3, name: "Central Hub", distance: 0.8, status: "full" as const },
]

export default function CitizenDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
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
            <p className="text-xs text-foreground/60 mt-1">↓ 12% from last month</p>
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
            <div className="text-3xl font-bold text-primary">Zone A</div>
            <p className="text-xs text-foreground/60 mt-1">Downtown District</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Eco Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">8.5/10</div>
            <p className="text-xs text-foreground/60 mt-1">Great contributor</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Alert className="border-accent/20 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription>
          Collection point near you (Main Street) is full. Please use alternate locations temporarily.
        </AlertDescription>
      </Alert>

      {/* Next Collections */}
      <Card>
        <CardHeader>
          <CardTitle>Next Collections</CardTitle>
          <CardDescription>Scheduled waste collection in your zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextCollections.map((collection) => (
              <div
                key={collection.id}
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
        </CardContent>
      </Card>

      {/* Nearby Collection Points */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Collection Points</CardTitle>
          <CardDescription>Container status near your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyPoints.map((point) => (
              <div key={point.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{point.name}</p>
                    <p className="text-sm text-foreground/60">{point.distance} km away</p>
                  </div>
                </div>
                <StatusBadge status={point.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Waste Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Contribution</CardTitle>
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
