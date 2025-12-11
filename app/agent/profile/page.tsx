"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, Briefcase, Loader2 } from "lucide-react"
import { getCurrentUser, updateUser, fetchTours } from "@/lib/api-client"
import type { CollectTour, CollectAgent } from "@/lib/types"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  zone: string
}

interface WorkStats {
  toursCompleted: number
  avgCollections: number
  efficiency: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [workStats, setWorkStats] = useState<WorkStats>({
    toursCompleted: 0,
    avgCollections: 0,
    efficiency: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      // Get current user
      const userRes = await getCurrentUser()
      let userData = null
      
      if (userRes.success && userRes.data) {
        userData = userRes.data
      } else {
        // Try localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          userData = JSON.parse(storedUser)
        }
      }

      if (userData) {
        setUser({
          id: userData.id || userData.idUser || "",
          name: userData.name || userData.nameUser || "Collection Agent",
          email: userData.email || userData.emailUser || "",
          phone: userData.phone || userData.phoneUser || "",
          zone: userData.zone || userData.zoneAgent || "Not Assigned"
        })
        setFormData({
          name: userData.name || userData.nameUser || "",
          email: userData.email || userData.emailUser || "",
          phone: userData.phone || userData.phoneUser || ""
        })
      }

      // Load work stats from tours
      const toursRes = await fetchTours()
      if (toursRes.success && toursRes.data) {
        const tours = toursRes.data as CollectTour[]
        const completedTours = tours.filter((t: CollectTour) => 
          t.statusTour === "completed"
        )
        
        const totalCollections = completedTours.reduce((sum: number, t: CollectTour) => {
          const cpIds = t.idCPs?.idCP
          const points = Array.isArray(cpIds) ? cpIds.length : cpIds ? 1 : 0
          return sum + points
        }, 0)

        const avgCollections = completedTours.length > 0 
          ? (totalCollections / completedTours.length).toFixed(1)
          : "0"

        const efficiency = tours.length > 0
          ? Math.round((completedTours.length / tours.length) * 100)
          : 0

        setWorkStats({
          toursCompleted: completedTours.length,
          avgCollections: parseFloat(avgCollections),
          efficiency
        })
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile() {
    if (!user) return
    setSaving(true)

    try {
      const res = await updateUser(user.id, {
        name: formData.name,
        nameUser: formData.name,
        email: formData.email,
        emailUser: formData.email,
        phone: formData.phone,
        phoneUser: formData.phone
      })

      if (res.success) {
        setUser(prev => prev ? {
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        } : null)
        
        // Update localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          localStorage.setItem("user", JSON.stringify({
            ...parsed,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }))
        }

        alert("Profile updated successfully!")
      } else {
        alert(`Failed to update profile: ${res.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Agent ID
              </label>
              <Input value={user?.id || "N/A"} disabled />
            </div>
          </div>
          <Button 
            className="w-full md:w-auto"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
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
              <p className="font-medium text-foreground">{user?.zone || "Not Assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Tours Completed (Total)</p>
              <p className="font-medium text-foreground">{workStats.toursCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Average Collections/Tour</p>
              <p className="font-medium text-foreground">{workStats.avgCollections}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Efficiency Rating</p>
              <p className="font-medium text-foreground text-primary">{workStats.efficiency}%</p>
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
              <p className="font-medium text-foreground">System Updates</p>
              <p className="text-sm text-foreground/60">Receive news about system updates</p>
            </div>
          </label>
        </CardContent>
      </Card>
    </div>
  )
}
