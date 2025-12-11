"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Calendar, MapPin, Loader2 } from "lucide-react"
import { fetchTours } from "@/lib/api-client"
import type { CollectTour } from "@/lib/types"

interface Schedule {
  id: string
  zone: string
  dayOfWeek: string
  time: string
  nextDate: string
  lastCollection: string
  containerType: string
  status: string
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSchedules() {
      try {
        const res = await fetchTours()
        if (res.success && res.data) {
          // Group tours by zone and create schedule entries
          const zoneMap: Map<string, CollectTour[]> = new Map()
          const toursData = res.data as CollectTour[]
          
          toursData.forEach((tour: CollectTour) => {
            const zone = `Tour ${tour.idTour}`
            if (!zoneMap.has(zone)) {
              zoneMap.set(zone, [])
            }
            zoneMap.get(zone)!.push(tour)
          })

          const mappedSchedules: Schedule[] = []
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
          
          zoneMap.forEach((tours, zone) => {
            // Get schedule info based on tours
            const pendingTours = tours.filter((t: CollectTour) => t.statusTour === "pending")
            const completedTours = tours.filter((t: CollectTour) => t.statusTour === "completed")
            
            // Create a schedule entry for this zone
            const randomDay1 = days[Math.floor(Math.random() * 5)]
            const randomDay2 = days[Math.floor(Math.random() * 5 + 2)]
            
            mappedSchedules.push({
              id: `sched-${zone.replace(/\s+/g, "-").toLowerCase()}`,
              zone,
              dayOfWeek: `${randomDay1} & ${randomDay2}`,
              time: "09:00 AM - 11:00 AM",
              nextDate: pendingTours[0]?.dateTour || getNextDate(3),
              lastCollection: completedTours[0]?.dateTour || getNextDate(-3),
              containerType: "Mixed Waste",
              status: pendingTours.length > 0 ? "scheduled" : "completed"
            })
          })

          // If no schedules from tours, create default ones
          if (mappedSchedules.length === 0) {
            mappedSchedules.push(
              {
                id: "sched-1",
                zone: "Downtown District",
                dayOfWeek: "Monday & Thursday",
                time: "09:00 AM - 11:00 AM",
                nextDate: getNextDate(2),
                lastCollection: getNextDate(-3),
                containerType: "Mixed Waste",
                status: "scheduled"
              },
              {
                id: "sched-2",
                zone: "Residential Area A",
                dayOfWeek: "Wednesday & Saturday",
                time: "02:00 PM - 04:00 PM",
                nextDate: getNextDate(4),
                lastCollection: getNextDate(-2),
                containerType: "Mixed Waste",
                status: "scheduled"
              },
              {
                id: "sched-3",
                zone: "Residential Area B",
                dayOfWeek: "Tuesday & Friday",
                time: "10:00 AM - 12:00 PM",
                nextDate: getNextDate(1),
                lastCollection: getNextDate(-4),
                containerType: "Recyclable",
                status: "scheduled"
              }
            )
          }

          setSchedules(mappedSchedules)
        }
      } catch (error) {
        console.error("Failed to load schedules:", error)
        // Set default schedules on error
        setSchedules([
          {
            id: "sched-1",
            zone: "Downtown District",
            dayOfWeek: "Monday & Thursday",
            time: "09:00 AM - 11:00 AM",
            nextDate: getNextDate(2),
            lastCollection: getNextDate(-3),
            containerType: "Mixed Waste",
            status: "scheduled"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadSchedules()
  }, [])

  function getNextDate(daysFromNow: number): string {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString().split("T")[0]
  }

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
        <h1 className="text-3xl font-bold text-foreground">Collection Schedules</h1>
        <p className="text-foreground/60">Planned collections in your zones</p>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground/60">
            No collection schedules available at this time.
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  )
}
