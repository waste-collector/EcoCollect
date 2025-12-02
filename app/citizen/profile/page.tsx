"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, MapPin, Phone } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-foreground/60">Manage your account information</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input type="email" defaultValue="john@example.com" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <Input defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Zone
              </label>
              <Input defaultValue="Downtown District" disabled />
            </div>
          </div>
          <Button className="w-full md:w-auto">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Notification and communication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-foreground/60">Receive updates about collections and reports</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-foreground">SMS Alerts</p>
                <p className="text-sm text-foreground/60">Get important alerts via text message</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5">
              <input type="checkbox" className="w-4 h-4" />
              <div>
                <p className="font-medium text-foreground">Marketing Communications</p>
                <p className="text-sm text-foreground/60">Receive news about EcoCollect updates</p>
              </div>
            </label>
          </div>
          <Button className="w-full md:w-auto">Update Preferences</Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline">Change Password</Button>
          <Button
            variant="outline"
            className="border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
