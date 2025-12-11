"use client"

import { useEffect, useState } from "react"
import { CollectionMap } from "@/components/collection-map"
import { TourRouteMap } from "@/components/tour-route-map"
import { EfficiencyGauge } from "@/components/efficiency-gauge"
import { WasteCompositionChart } from "@/components/waste-composition-chart"
import { Loader2 } from "lucide-react"
import { fetchCollectionPoints, fetchTours, fetchStats } from "@/lib/api-client"

interface CollectionPoint {
  id: string | number
  name: string
  latitude: number
  longitude: number
  status: "full" | "partial" | "empty"
  fillLevel: number
}

interface RoutePoint {
  name: string
  latitude: number
  longitude: number
  collected: boolean
}

const wasteData = [
  { name: "Organic", percentage: 45, color: "#16a34a" },
  { name: "Recyclable", percentage: 30, color: "#3b82f6" },
  { name: "General Waste", percentage: 20, color: "#ef4444" },
  { name: "Hazardous", percentage: 5, color: "#f59e0b" },
]

export default function MapsPage() {
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [efficiency, setEfficiency] = useState(0)
  const [recyclingRate, setRecyclingRate] = useState(0)
  const [tourDistance, setTourDistance] = useState(0)
  const [tourDuration, setTourDuration] = useState("0h 0m")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMapData() {
      try {
        const [pointsRes, toursRes, statsRes] = await Promise.all([
          fetchCollectionPoints(),
          fetchTours(),
          fetchStats()
        ])

        // Process collection points
        if (pointsRes.success && pointsRes.data) {
          const mappedPoints: CollectionPoint[] = pointsRes.data.map((p: any) => {
            const fillLevel = p.fillLevel || Math.floor(Math.random() * 100)
            let status: "full" | "partial" | "empty" = "empty"
            if (fillLevel >= 80) status = "full"
            else if (fillLevel >= 40) status = "partial"
            
            return {
              id: p.id || p.idCollectP,
              name: p.name || p.addressCollectP || `Point ${p.id || p.idCollectP}`,
              latitude: parseFloat(p.latitude || p.latitudeCollectP) || 36.8065,
              longitude: parseFloat(p.longitude || p.longitudeCollectP) || 10.1815,
              status,
              fillLevel
            }
          })
          setPoints(mappedPoints)
        }

        // Process tours for route display (show first in-progress tour)
        if (toursRes.success && toursRes.data) {
          const inProgressTour = toursRes.data.find(
            (t: any) => t.status === "in-progress" || t.statusTour === "in-progress"
          ) || toursRes.data[0]

          if (inProgressTour) {
            // Parse collection points from the tour
            const tourPoints = inProgressTour.collectionPoints || inProgressTour.collectPoints || []
            const mappedRoutePoints: RoutePoint[] = tourPoints.map((tp: any, index: number) => ({
              name: tp.name || tp.addressCollectP || `Stop ${index + 1}`,
              latitude: parseFloat(tp.latitude || tp.latitudeCollectP) || 36.8065 + (index * 0.005),
              longitude: parseFloat(tp.longitude || tp.longitudeCollectP) || 10.1815 + (index * 0.005),
              collected: tp.collected || false
            }))
            setRoutePoints(mappedRoutePoints)
            
            // Calculate distance and duration from tour data
            const distance = inProgressTour.distance || inProgressTour.distanceTour || 0
            setTourDistance(distance)
            
            const duration = inProgressTour.duration || inProgressTour.durationTour || 0
            const hours = Math.floor(duration / 60)
            const mins = duration % 60
            setTourDuration(`${hours}h ${mins}m`)
          }
        }

        // Calculate efficiency metrics
        if (statsRes.success && statsRes.data) {
          const { completedTours, totalTours, totalCollectionPoints, criticalPoints } = statsRes.data
          
          // System efficiency = completed tours percentage + non-critical points percentage
          const tourEfficiency = totalTours > 0 ? (completedTours / totalTours) * 50 : 50
          const pointEfficiency = totalCollectionPoints > 0 
            ? ((totalCollectionPoints - criticalPoints) / totalCollectionPoints) * 50 
            : 50
          setEfficiency(Math.round(tourEfficiency + pointEfficiency))
          
          // Mock recycling rate (would need actual waste type data)
          setRecyclingRate(75)
        }
      } catch (error) {
        console.error("Failed to load map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
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
        <h1 className="text-3xl font-bold text-foreground">Maps & Analytics</h1>
        <p className="text-foreground/60">Real-time visualization of collection operations</p>
      </div>

      {/* Collection Points Map */}
      <CollectionMap 
        points={points.length > 0 ? points : [
          { id: 1, name: "No data", latitude: 36.8065, longitude: 10.1815, status: "empty" as const, fillLevel: 0 }
        ]} 
        title="Active Collection Points" 
      />

      {/* Route Map and Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <TourRouteMap 
          points={routePoints.length > 0 ? routePoints : [
            { name: "Start", latitude: 36.8065, longitude: 10.1815, collected: false }
          ]} 
          distance={tourDistance} 
          duration={tourDuration} 
          title="Current Tour Route" 
        />

        <div className="space-y-6">
          <EfficiencyGauge 
            value={efficiency} 
            label="System Efficiency" 
            description="Current operational performance" 
          />
        </div>
      </div>

      {/* Waste Composition */}
      <div className="grid md:grid-cols-2 gap-6">
        <WasteCompositionChart data={wasteData} title="Weekly Waste Breakdown" />

        <div className="space-y-6">
          <EfficiencyGauge 
            value={recyclingRate} 
            label="Recycling Rate" 
            description="Percentage of waste recycled" 
          />
        </div>
      </div>
    </div>
  )
}
