"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WasteType {
  name: string
  percentage: number
  color: string
}

interface WasteCompositionChartProps {
  data: WasteType[]
  title?: string
}

export function WasteCompositionChart({ data, title = "Waste Composition" }: WasteCompositionChartProps) {
  const total = data.reduce((sum, item) => sum + item.percentage, 0)
  let currentOffset = 0

  const segments = data.map((item, index) => {
    const slicePercentage = item.percentage / total
    const startAngle = (currentOffset / total) * 360
    const endAngle = ((currentOffset + item.percentage) / total) * 360

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 50 + 45 * Math.cos(startRad)
    const y1 = 50 + 45 * Math.sin(startRad)
    const x2 = 50 + 45 * Math.cos(endRad)
    const y2 = 50 + 45 * Math.sin(endRad)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 45 45 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ")

    currentOffset += item.percentage

    return <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="2" />
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Waste breakdown by type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <svg viewBox="0 0 100 100" className="w-64 h-64">
            {segments}
            <circle cx="50" cy="50" r="25" fill="white" stroke="white" strokeWidth="2" />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-4xl font-bold"
              fill="#1f2937"
            >
              {total}%
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="text-sm">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-foreground/60">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
