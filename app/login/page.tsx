"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

const USER_ROLES = {
  CITIZEN: "citizen",
  AGENT: "agent",
  ADMIN: "admin",
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(USER_ROLES.CITIZEN)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock redirect based on role
    const redirects: Record<string, string> = {
      [USER_ROLES.CITIZEN]: "/citizen/dashboard",
      [USER_ROLES.AGENT]: "/agent/dashboard",
      [USER_ROLES.ADMIN]: "/admin/dashboard",
    }

    window.location.href = redirects[role]
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">EcoCollect</h1>
          <p className="text-foreground/60">Waste Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your EcoCollect account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={USER_ROLES.CITIZEN}>Citizen</option>
                  <option value={USER_ROLES.AGENT}>Collection Agent</option>
                  <option value={USER_ROLES.ADMIN}>Administrator</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">Demo Credentials:</p>
              <p className="text-xs text-foreground/60">Email: demo@ecocollect.io</p>
              <p className="text-xs text-foreground/60">Password: demo123</p>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-foreground/80">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
