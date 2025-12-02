"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapPin } from "lucide-react"
import Link from "next/link"

const performanceData = [
  { day: "Mon", collections: 12, incidents: 0 },
  { day: "Tue", collections: 14, incidents: 1 },
  { day: "Wed", collections: 11, incidents: 0 },
  { day: "Thu", collections: 15, incidents: 1 },
  { day: "Fri", collections: 13, incidents: 0 },
  { day: "Sat", collections: 9, incidents: 0 },
]

const todaysTours = [
  { id: 1, zone: "Downtown District", status: "completed", collections: 12, distance: 8.5 },
  { id: 2, zone: "Residential Area A", status: "in-progress", collections: 8, distance: 5.2 },
  { id: 3, zone: "Residential Area B", status: "pending", collections: 10, distance: 6.8 },
]

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, Collection Agent!</h1>
        <p className="text-foreground/60">December 2, 2025 - Your daily overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12</div>
            <p className="text-xs text-foreground/60 mt-1">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distance Traveled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">8.5 km</div>
            <p className="text-xs text-foreground/60 mt-1">Current tour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">1</div>
            <p className="text-xs text-foreground/60 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">92%</div>
            <p className="text-xs text-foreground/60 mt-1">↑ 5% vs last week</p>
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
          {todaysTours.map((tour) => (
            <div key={tour.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{tour.zone}</p>
                  <p className="text-sm text-foreground/60">
                    {tour.collections} collections • {tour.distance} km
                  </p>
                </div>
              </div>
              <StatusBadge
                status={tour.status === "completed" ? "empty" : tour.status === "in-progress" ? "partial" : "full"}
                label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              />
            </div>
          ))}
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
