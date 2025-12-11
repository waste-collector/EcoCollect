"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { AlertCircle, Loader2 } from "lucide-react"
import { fetchStats, fetchIncidents, fetchCollectionPoints, fetchVehicles } from "@/lib/api-client"

const emissionData = [
  { month: "Jan", emissions: 1200 },
  { month: "Feb", emissions: 1100 },
  { month: "Mar", emissions: 950 },
  { month: "Apr", emissions: 1050 },
  { month: "May", emissions: 900 },
  { month: "Jun", emissions: 850 },
]

const wasteTypeData = [
  { name: "Organic", value: 45, fill: "#16a34a" },
  { name: "Recyclable", value: 30, fill: "#3b82f6" },
  { name: "General Waste", value: 20, fill: "#ef4444" },
  { name: "Hazardous", value: 5, fill: "#f59e0b" },
]

interface Stats {
  totalTours: number
  completedTours: number
  pendingTours: number
  inProgressTours: number
  totalVehicles: number
  operationalVehicles: number
  maintenanceVehicles: number
  totalCollectionPoints: number
  criticalPoints: number
  totalAgents: number
  availableAgents: number
  totalIncidents: number
  openIncidents: number
  resolvedIncidents: number
  co2Saved: number
}

interface Alert {
  type: "critical" | "warning" | "notice"
  title: string
  description: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [tourPerformance, setTourPerformance] = useState([
    { status: "Completed", value: 0 },
    { status: "In Progress", value: 0 },
    { status: "Pending", value: 0 },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, incidentsRes, pointsRes, vehiclesRes] = await Promise.all([
          fetchStats(),
          fetchIncidents(),
          fetchCollectionPoints(),
          fetchVehicles()
        ])

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data)
          setTourPerformance([
            { status: "Completed", value: statsRes.data.completedTours },
            { status: "In Progress", value: statsRes.data.inProgressTours },
            { status: "Pending", value: statsRes.data.pendingTours },
          ])
        }

        // Generate alerts based on real data
        const newAlerts: Alert[] = []
        
        // Check for critical collection points (fill level >= 80%)
        const points = pointsRes.data || []
        const criticalPoints = points.filter((p: any) => (p.fillLevel || 0) >= 80)
        if (criticalPoints.length > 0) {
          newAlerts.push({
            type: "critical",
            title: `Critical: ${criticalPoints.length} overflowing container${criticalPoints.length > 1 ? 's' : ''}`,
            description: "Immediate collection needed"
          })
        }

        // Check for vehicles needing maintenance
        const vehicles = vehiclesRes.data || []
        const maintenanceVehicles = vehicles.filter((v: any) => v.state === "maintenance" || v.stateV === "maintenance")
        if (maintenanceVehicles.length > 0) {
          newAlerts.push({
            type: "warning",
            title: `Warning: ${maintenanceVehicles.length} vehicle${maintenanceVehicles.length > 1 ? 's' : ''} in maintenance`,
            description: "Schedule service this week"
          })
        }

        // Check for open incidents
        const incidents = incidentsRes.data || []
        const openIncidents = incidents.filter((i: any) => i.status === "open" || i.stateIR === "pending")
        if (openIncidents.length > 0) {
          newAlerts.push({
            type: "notice",
            title: `Notice: ${openIncidents.length} open incident${openIncidents.length > 1 ? 's' : ''}`,
            description: "Review and assign for resolution"
          })
        }

        // Check for pending tours
        if (statsRes.data?.pendingTours > 0) {
          newAlerts.push({
            type: "notice",
            title: `Notice: ${statsRes.data.pendingTours} tour${statsRes.data.pendingTours > 1 ? 's' : ''} pending`,
            description: "Review route optimization"
          })
        }

        setAlerts(newAlerts.slice(0, 3)) // Show max 3 alerts
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60">System overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.totalTours || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {stats?.inProgressTours || 0} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.operationalVehicles || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {stats?.maintenanceVehicles || 0} in maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Emissions (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.co2Saved || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">From all tours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.totalCollectionPoints || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {stats?.criticalPoints || 0} requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Emissions Trend</CardTitle>
            <CardDescription>Monthly emissions reduction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="emissions" stroke="#38b000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Composition</CardTitle>
            <CardDescription>Collected waste breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tour Status Overview</CardTitle>
            <CardDescription>Current tour statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tourPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#38b000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-foreground/60">
                <p>No alerts - all systems operational</p>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 border rounded-lg ${
                    alert.type === "critical"
                      ? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950"
                      : alert.type === "warning"
                        ? "border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950"
                        : "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.type === "critical"
                        ? "text-red-600"
                        : alert.type === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-medium ${
                        alert.type === "critical"
                          ? "text-red-900 dark:text-red-100"
                          : alert.type === "warning"
                            ? "text-yellow-900 dark:text-yellow-100"
                            : "text-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {alert.title}
                    </p>
                    <p
                      className={`text-sm ${
                        alert.type === "critical"
                          ? "text-red-700 dark:text-red-200"
                          : alert.type === "warning"
                            ? "text-yellow-700 dark:text-yellow-200"
                            : "text-blue-700 dark:text-blue-200"
                      }`}
                    >
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
