"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CollectionPointMapPicker } from "./collection-point-map-picker"
import { createCollectionPoint } from "@/lib/api-client"

interface AddCollectionPointDialogProps {
  onSuccess?: () => void
}

export function AddCollectionPointDialog({ onSuccess }: AddCollectionPointDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"form" | "map">("form")
  const [formData, setFormData] = useState({
    name: "",
    zone: "Downtown District",
    capacity: 100,
    fillLevel: 0,
    latitude: 40.7128,
    longitude: -74.006,
  })

  const zones = ["Downtown District", "Residential Area A", "Residential Area B"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "name" || name === "zone" ? value : Number(value),
    })
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    })
    setActiveTab("form")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createCollectionPoint(formData)
      if (result.success) {
        alert("Collection Point added successfully!")
        setOpen(false)
        setFormData({
          name: "",
          zone: "Downtown District",
          capacity: 100,
          fillLevel: 0,
          latitude: 40.7128,
          longitude: -74.006,
        })
        if (onSuccess) onSuccess()
      } else {
        alert("Error: " + result.error)
      }
    } catch (error) {
      alert("Failed to add collection point")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Collection Point</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Collection Point</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "form" ? "default" : "outline"}
            onClick={() => setActiveTab("form")}
            className="flex-1"
          >
            Form Input
          </Button>
          <Button
            variant={activeTab === "map" ? "default" : "outline"}
            onClick={() => setActiveTab("map")}
            className="flex-1"
          >
            Pick on Map
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "form" ? (
            <>
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Point Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Street Collection"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Zone</label>
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Container Capacity (Liters)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Initial Fill Level */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Initial Fill Level (Liters)</label>
                <input
                  type="number"
                  name="fillLevel"
                  value={formData.fillLevel}
                  onChange={handleInputChange}
                  min="0"
                  max={formData.capacity}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location Coordinates */}
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold text-sm mb-3">Location Coordinates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="0.0001"
                      className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="0.0001"
                      className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <p className="text-xs text-foreground/60 mt-2">
                  Or switch to "Pick on Map" tab to select location interactively
                </p>
              </Card>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Collection Point"}
              </Button>
            </>
          ) : (
            <CollectionPointMapPicker
              onLocationSelect={handleLocationSelect}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
