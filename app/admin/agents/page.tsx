"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

const agents = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    zone: "Downtown District",
    toursCompleted: 48,
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    zone: "Residential Area A",
    toursCompleted: 52,
    status: "active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    phone: "+1 (555) 345-6789",
    zone: "Downtown District",
    toursCompleted: 45,
    status: "active",
  },
  {
    id: 4,
    name: "Emily Brown",
    phone: "+1 (555) 456-7890",
    zone: "Residential Area B",
    toursCompleted: 38,
    status: "on-leave",
  },
  {
    id: 5,
    name: "David Garcia",
    phone: "+1 (555) 567-8901",
    zone: "Residential Area A",
    toursCompleted: 50,
    status: "active",
  },
]

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collection Agents</h1>
          <p className="text-foreground/60">Manage collection team members</p>
        </div>
        <Button>Add Agent</Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agents.filter((a) => a.status === "active").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    <p className="text-sm text-foreground/60">{agent.phone}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${agent.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"}`}
                >
                  {agent.status === "active" ? "Active" : "On Leave"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Zone</span>
                  <span className="font-medium">{agent.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Tours Completed</span>
                  <span className="font-medium">{agent.toursCompleted}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
