"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Calendar, MapPin } from "lucide-react"

const schedules = [
  {
    id: 1,
    zone: "Downtown District",
    dayOfWeek: "Monday & Thursday",
    time: "09:00 AM - 11:00 AM",
    nextDate: "2025-12-03",
    lastCollection: "2025-11-28",
    containerType: "Mixed Waste",
  },
  {
    id: 2,
    zone: "Residential Area A",
    dayOfWeek: "Wednesday & Saturday",
    time: "02:00 PM - 04:00 PM",
    nextDate: "2025-12-05",
    lastCollection: "2025-11-29",
    containerType: "Mixed Waste",
  },
  {
    id: 3,
    zone: "Downtown District",
    dayOfWeek: "Tuesday & Friday",
    time: "10:00 AM - 12:00 PM",
    nextDate: "2025-12-02",
    lastCollection: "2025-11-28",
    containerType: "Recyclable",
  },
  {
    id: 4,
    zone: "Residential Area B",
    dayOfWeek: "Every Sunday",
    time: "08:00 AM - 10:00 AM",
    nextDate: "2025-12-07",
    lastCollection: "2025-11-30",
    containerType: "Organic",
  },
]

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Collection Schedules</h1>
        <p className="text-foreground/60">Planned collections in your zones</p>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {schedule.zone}
                  </CardTitle>
                  <CardDescription>{schedule.containerType}</CardDescription>
                </div>
                <StatusBadge status="empty" label="Scheduled" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/60">Collection Days</p>
                  <p className="font-medium text-foreground">{schedule.dayOfWeek}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Time Window</p>
                  <p className="font-medium text-foreground">{schedule.time}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Next Collection</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {schedule.nextDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Last Collection</p>
                  <p className="font-medium text-foreground">{schedule.lastCollection}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-foreground/60">
                  Ensure containers are ready before scheduled time. Missed collections? Report issues in your reports
                  section.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
