"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

export function CollectionPointMapPicker({
  onLocationSelect,
  initialLat = 40.7128,
  initialLng = -74.006,
}: MapPickerProps) {
  const [lat, setLat] = useState(initialLat)
  const [lng, setLng] = useState(initialLng)
  const [selectedLat, setSelectedLat] = useState(lat)
  const [selectedLng, setSelectedLng] = useState(lng)

  // Handle map click - simple grid-based approximation
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert pixel position to lat/lng (normalized grid)
    const newLat = 40.7 + (y / rect.height - 0.5) * 0.1
    const newLng = -74.0 + (x / rect.width - 0.5) * 0.1

    setSelectedLat(Number(newLat.toFixed(4)))
    setSelectedLng(Number(newLng.toFixed(4)))
  }

  const handleConfirm = () => {
    setLat(selectedLat)
    setLng(selectedLng)
    onLocationSelect(selectedLat, selectedLng)
  }

  return (
    <div className="space-y-4">
      {/* Map Display */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div
          onClick={handleMapClick}
          className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative cursor-crosshair flex items-center justify-center"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Current selection marker */}
          <div
            className="absolute w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg pointer-events-none transform -translate-x-3 -translate-y-3"
            style={{
              left: `${((selectedLng - (-74.0 - 0.05)) / 0.1) * 100}%`,
              top: `${((40.7 + 0.05 - selectedLat) / 0.1) * 100}%`,
            }}
          />

          <p className="text-sm text-foreground/50 relative z-10">Click to select location</p>
        </div>
      </Card>

      {/* Coordinate Input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={selectedLat}
            onChange={(e) => setSelectedLat(Number(e.target.value))}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={selectedLng}
            onChange={(e) => setSelectedLng(Number(e.target.value))}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Confirm Button */}
      <Button onClick={handleConfirm} className="w-full">
        Confirm Location
      </Button>

      {/* Current Selection Display */}
      <div className="text-sm text-foreground/70 p-3 bg-muted rounded-md">
        <p>
          Selected: {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
        </p>
        {lat !== selectedLat || lng !== selectedLng ? (
          <p className="text-yellow-600 font-medium">Click Confirm Location to apply changes</p>
        ) : (
          <p className="text-green-600 font-medium">Location confirmed</p>
        )}
      </div>
    </div>
  )
}
