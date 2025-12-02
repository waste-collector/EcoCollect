"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, Briefcase } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-foreground/60">Manage your agent account information</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <Input defaultValue="Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input type="email" defaultValue="sarah@example.com" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <Input defaultValue="+1 (555) 234-5678" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Employee ID
              </label>
              <Input defaultValue="AGENT-0042" disabled />
            </div>
          </div>
          <Button className="w-full md:w-auto">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Work Information */}
      <Card>
        <CardHeader>
          <CardTitle>Work Information</CardTitle>
          <CardDescription>Your assignment and performance details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-foreground/60">Assigned Zone</p>
              <p className="font-medium text-foreground">Residential Area A</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Tours Completed (Month)</p>
              <p className="font-medium text-foreground">52</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Average Collections/Day</p>
              <p className="font-medium text-foreground">12.5</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Efficiency Rating</p>
              <p className="font-medium text-foreground text-primary">92%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">Tour Assignments</p>
              <p className="text-sm text-foreground/60">Receive notifications for new tour assignments</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">Incident Updates</p>
              <p className="text-sm text-foreground/60">Get updates on reported incidents</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
            <input type="checkbox" className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">Marketing</p>
              <p className="text-sm text-foreground/60">Receive news about system updates</p>
            </div>
          </label>
          <Button className="w-full md:w-auto">Update Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
