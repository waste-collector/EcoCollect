"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CollectionPoint {
  id: number
  name: string
  latitude: number
  longitude: number
  status: "empty" | "partial" | "full"
  fillLevel: number
}

interface CollectionMapProps {
  points: CollectionPoint[]
  center?: { lat: number; lng: number }
  title?: string
  showLegend?: boolean
}

export function CollectionMap({
  points,
  center = { lat: 40.7128, lng: -74.006 },
  title = "Collection Points Map",
  showLegend = true,
}: CollectionMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(13)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Draw background
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    const gridSize = 50
    for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.offsetHeight)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.offsetWidth, y)
      ctx.stroke()
    }

    // Draw collection points
    points.forEach((point) => {
      // Convert lat/lng to canvas coordinates (simple projection)
      const x = ((point.longitude + 74.006) / 0.05) % canvas.offsetWidth
      const y = ((40.7128 - point.latitude) / 0.05) % canvas.offsetHeight

      // Determine color based on status
      const colorMap: Record<string, string> = {
        empty: "#16a34a",
        partial: "#eab308",
        full: "#ef4444",
      }

      // Draw circle
      const radius = 15
      ctx.fillStyle = colorMap[point.status]
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw fill level indicator
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${point.fillLevel}%`, x, y)
    })

    // Draw center point
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(canvas.offsetWidth / 2, canvas.offsetHeight / 2, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.stroke()
  }, [points, zoom])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Real-time collection point status visualization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas
          ref={canvasRef}
          className="w-full border border-border rounded-lg bg-white"
          style={{ height: "400px" }}
        />

        {showLegend && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm text-foreground/60">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400" />
              <span className="text-sm text-foreground/60">Partial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-foreground/60">Full</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
