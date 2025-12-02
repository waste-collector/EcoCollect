"use client"

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
import { AlertCircle } from "lucide-react"

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

const tourPerformance = [
  { status: "Completed", value: 285 },
  { status: "In Progress", value: 42 },
  { status: "Pending", value: 18 },
]

export default function AdminDashboard() {
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
            <div className="text-3xl font-bold text-primary">345</div>
            <p className="text-xs text-foreground/60 mt-1">↑ 12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">42</div>
            <p className="text-xs text-foreground/60 mt-1">All operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved (Tons)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">825</div>
            <p className="text-xs text-foreground/60 mt-1">↓ 15% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">156</div>
            <p className="text-xs text-foreground/60 mt-1">8 requiring attention</p>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            <div className="flex items-start gap-3 p-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Critical: 3 overflowing containers</p>
                <p className="text-sm text-red-700 dark:text-red-200">Immediate collection needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Warning: Vehicle 08 maintenance due</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">Schedule service this week</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Notice: 5 tours behind schedule</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">Review route optimization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
