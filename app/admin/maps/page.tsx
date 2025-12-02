"use client"

import { CollectionMap } from "@/components/collection-map"
import { TourRouteMap } from "@/components/tour-route-map"
import { EfficiencyGauge } from "@/components/efficiency-gauge"
import { WasteCompositionChart } from "@/components/waste-composition-chart"

const samplePoints = [
  { id: 1, name: "Main Street", latitude: 40.7128, longitude: -74.006, status: "full" as const, fillLevel: 95 },
  { id: 2, name: "Park Avenue", latitude: 40.7135, longitude: -74.0022, status: "partial" as const, fillLevel: 60 },
  { id: 3, name: "Central Hub", latitude: 40.714, longitude: -74.0089, status: "empty" as const, fillLevel: 25 },
  { id: 4, name: "North Point", latitude: 40.718, longitude: -74.005, status: "partial" as const, fillLevel: 70 },
]

const sampleRoute = [
  { name: "Point 1", latitude: 40.7128, longitude: -74.006, collected: true },
  { name: "Point 2", latitude: 40.7135, longitude: -74.0022, collected: true },
  { name: "Point 3", latitude: 40.714, longitude: -74.0089, collected: false },
  { name: "Point 4", latitude: 40.718, longitude: -74.005, collected: false },
]

const wasteData = [
  { name: "Organic", percentage: 45, color: "#16a34a" },
  { name: "Recyclable", percentage: 30, color: "#3b82f6" },
  { name: "General Waste", percentage: 20, color: "#ef4444" },
  { name: "Hazardous", percentage: 5, color: "#f59e0b" },
]

export default function MapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maps & Analytics</h1>
        <p className="text-foreground/60">Real-time visualization of collection operations</p>
      </div>

      {/* Collection Points Map */}
      <CollectionMap points={samplePoints} title="Active Collection Points" />

      {/* Route Map and Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <TourRouteMap points={sampleRoute} distance={12.5} duration="2h 30m" title="Current Tour Route" />

        <div className="space-y-6">
          <EfficiencyGauge value={92} label="System Efficiency" description="Current operational performance" />
        </div>
      </div>

      {/* Waste Composition */}
      <div className="grid md:grid-cols-2 gap-6">
        <WasteCompositionChart data={wasteData} title="Weekly Waste Breakdown" />

        <div className="space-y-6">
          <EfficiencyGauge value={78} label="Recycling Rate" description="Percentage of waste recycled" />
        </div>
      </div>
    </div>
  )
}
