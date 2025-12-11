"use client"

import { useEffect, useState } from "react"
import { CollectionMap } from "@/components/collection-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { fetchCollectionPoints } from "@/lib/api-client"
import type { CollectPoint } from "@/lib/types"

interface DisplayPoint {
  id: string | number
  name: string
  latitude: number
  longitude: number
  status: "full" | "partial" | "empty"
  fillLevel: number
}

export default function MapPage() {
  const [points, setPoints] = useState<DisplayPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPoints() {
      try {
        const res = await fetchCollectionPoints()
        if (res.success && res.data) {
          const mappedPoints: DisplayPoint[] = res.data.map((p: CollectPoint) => {
            const fillLevel = p.fillLevel || 0
            let status: "full" | "partial" | "empty" = "empty"
            if (fillLevel >= 80) status = "full"
            else if (fillLevel >= 40) status = "partial"
            
            return {
              id: p.idCP,
              name: p.nameCP || p.adressCP,
              latitude: p.latitudeGPS || 36.8065,
              longitude: p.longitudeGPS || 10.1815,
              status,
              fillLevel
            }
          })
          setPoints(mappedPoints)
        }
      } catch (error) {
        console.error("Failed to load collection points:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPoints()
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
        <h1 className="text-3xl font-bold text-foreground">Nearby Collection Points</h1>
        <p className="text-foreground/60">Find waste containers near you</p>
      </div>

      {/* Map */}
      <CollectionMap 
        points={points.length > 0 ? points : [
          { id: 1, name: "Default Point", latitude: 36.8065, longitude: 10.1815, status: "empty" as const, fillLevel: 0 }
        ]} 
        title="Collection Points in Your Area" 
      />

      {/* Nearby Points List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Points Details</CardTitle>
          <CardDescription>Information about nearby waste containers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {points.length === 0 ? (
            <div className="text-center py-6 text-foreground/60">
              No collection points found in your area
            </div>
          ) : (
            points.map((point) => (
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
