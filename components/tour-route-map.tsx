"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RoutePoint {
  name: string
  latitude: number
  longitude: number
  collected: boolean
}

interface TourRouteMapProps {
  points: RoutePoint[]
  distance: number
  duration: string
  title?: string
}

export function TourRouteMap({ points, distance, duration, title = "Tour Route" }: TourRouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Draw background
    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Convert points to canvas coordinates
    const margin = 40
    const width = canvas.offsetWidth - 2 * margin
    const height = canvas.offsetHeight - 2 * margin

    const latitudes = points.map((p) => p.latitude)
    const longitudes = points.map((p) => p.longitude)
    const minLat = Math.min(...latitudes)
    const maxLat = Math.max(...latitudes)
    const minLng = Math.min(...longitudes)
    const maxLng = Math.max(...longitudes)

    const latRange = maxLat - minLat || 0.01
    const lngRange = maxLng - minLng || 0.01

    const toCanvasCoords = (lat: number, lng: number) => {
      const x = margin + ((lng - minLng) / lngRange) * width
      const y = margin + ((maxLat - lat) / latRange) * height
      return { x, y }
    }

    // Draw route line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()

    points.forEach((point, index) => {
      const { x, y } = toCanvasCoords(point.latitude, point.longitude)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    points.forEach((point, index) => {
      const { x, y } = toCanvasCoords(point.latitude, point.longitude)

      if (point.collected) {
        // Completed point - green circle
        ctx.fillStyle = "#16a34a"
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Check mark
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - 3, y)
        ctx.lineTo(x - 1, y + 2)
        ctx.lineTo(x + 3, y - 2)
        ctx.stroke()
      } else {
        // Pending point - yellow circle
        ctx.fillStyle = "#eab308"
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Circle number
        ctx.fillStyle = "white"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(String(index + 1), x, y)
      }

      // Border
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Draw start point
    const startCoords = toCanvasCoords(points[0].latitude, points[0].longitude)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(startCoords.x, startCoords.y, 12, 0, Math.PI * 2)
    ctx.fill()

    // Draw end point
    const endCoords = toCanvasCoords(points[points.length - 1].latitude, points[points.length - 1].longitude)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.rect(endCoords.x - 10, endCoords.y - 10, 20, 20)
    ctx.fill()
  }, [points])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Distance: {distance} km • Duration: {duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full border border-border rounded-lg bg-white"
          style={{ height: "350px" }}
        />
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black" />
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-black" />
            <span>End</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
