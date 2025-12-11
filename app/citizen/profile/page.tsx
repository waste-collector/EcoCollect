"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { getCurrentUser, updateUser, logout } from "@/lib/api-client"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  zone: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
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
      const userRes = await getCurrentUser()
      let userData = null
      
      if (userRes.success && userRes.data) {
        userData = userRes.data
      } else {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          userData = JSON.parse(storedUser)
        }
      }

      if (userData) {
        setUser({
          id: userData.id || userData.idUser || "",
          name: userData.name || userData.nameUser || "Citizen",
          email: userData.email || userData.emailUser || "",
          phone: userData.phone || userData.phoneUser || "",
          zone: userData.zone || userData.address || userData.addressCitizen || "Not Set"
        })
        setFormData({
          name: userData.name || userData.nameUser || "",
          email: userData.email || userData.emailUser || "",
          phone: userData.phone || userData.phoneUser || ""
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

  async function handleLogout() {
    try {
      await logout()
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("user")
      router.push("/login")
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
        <p className="text-foreground/60">Manage your account information</p>
      </div>


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
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
