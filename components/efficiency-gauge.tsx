"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EfficiencyGaugeProps {
  value: number
  label?: string
  description?: string
}

export function EfficiencyGauge({ value, label = "Efficiency", description = "" }: EfficiencyGaugeProps) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (value / 100) * circumference
  const color = value >= 90 ? "#16a34a" : value >= 70 ? "#eab308" : "#ef4444"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold" style={{ color }}>
              {value}%
            </div>
            <div className="text-xs text-foreground/60">Performance</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium" style={{ color }}>
              {value >= 90 ? "Excellent" : value >= 70 ? "Good" : "Needs Improvement"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
