"use client"

import { CollectionMap } from "@/components/collection-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const nearbyPoints = [
  {
    id: 1,
    name: "Main Street Collection",
    latitude: 40.7128,
    longitude: -74.006,
    status: "full" as const,
    fillLevel: 95,
  },
  {
    id: 2,
    name: "Park Avenue Point",
    latitude: 40.7135,
    longitude: -74.0022,
    status: "partial" as const,
    fillLevel: 60,
  },
  { id: 3, name: "Central Hub", latitude: 40.714, longitude: -74.0089, status: "empty" as const, fillLevel: 25 },
]

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nearby Collection Points</h1>
        <p className="text-foreground/60">Find waste containers near you</p>
      </div>

      {/* Map */}
      <CollectionMap points={nearbyPoints} title="Collection Points in Your Area" />

      {/* Nearby Points List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Points Details</CardTitle>
          <CardDescription>Information about nearby waste containers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {nearbyPoints.map((point) => (
            <div key={point.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{point.name}</h3>
                <p className="text-sm text-foreground/60 mt-1">Fill Level: {point.fillLevel}%</p>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all ${
                      point.fillLevel > 90 ? "bg-red-500" : point.fillLevel > 60 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${point.fillLevel}%` }}
                  />
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  point.status === "full"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : point.status === "partial"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
