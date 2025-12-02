"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"

const vehicles = [
  {
    id: "V-001",
    model: "Mercedes Actros",
    fuel: "Diesel",
    status: "operational" as const,
    utilization: 92,
    emissions: 2.4,
  },
  { id: "V-002", model: "Volvo FH16", fuel: "Diesel", status: "operational" as const, utilization: 88, emissions: 2.6 },
  {
    id: "V-003",
    model: "Scania R440",
    fuel: "Diesel",
    status: "operational" as const,
    utilization: 85,
    emissions: 2.3,
  },
  { id: "V-004", model: "MAN TGX", fuel: "Diesel", status: "maintenance" as const, utilization: 0, emissions: 0 },
  {
    id: "V-005",
    model: "Iveco Stralis",
    fuel: "Diesel",
    status: "operational" as const,
    utilization: 91,
    emissions: 2.5,
  },
  { id: "V-006", model: "DAF XF", fuel: "Electric", status: "operational" as const, utilization: 76, emissions: 0.3 },
]

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Fleet</h1>
          <p className="text-foreground/60">Monitor vehicle status and performance</p>
        </div>
        <Button>Add Vehicle</Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter((v) => v.status === "operational").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Vehicle ID</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Fuel Type</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Utilization</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">Emissions (kg)</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-border hover:bg-secondary/5">
                    <td className="py-3 px-4 font-medium">{vehicle.id}</td>
                    <td className="py-3 px-4">{vehicle.model}</td>
                    <td className="py-3 px-4">{vehicle.fuel}</td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={vehicle.status === "operational" ? "empty" : "full"}
                        label={vehicle.status === "operational" ? "Operational" : "Maintenance"}
                      />
                    </td>
                    <td className="py-3 px-4">{vehicle.utilization}%</td>
                    <td className="py-3 px-4">{vehicle.emissions.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
