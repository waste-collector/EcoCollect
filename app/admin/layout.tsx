"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut, Menu, BarChart3, Truck, MapPin, Users } from "lucide-react"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "block" : "hidden"} md:block w-64 bg-card border-r border-border p-6 space-y-6 overflow-y-auto`}
      >
        <div className="flex items-center gap-2">
          <img src="/favicon-32x32.png" alt="logo" className="w-6 h-6 text-primary" />
          <span className="font-bold text-primary text-lg">EcoCollect</span>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/tours"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Tours Management
          </Link>
          <Link
            href="/admin/collection-points"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Collection Points
          </Link>
          <Link
            href="/admin/vehicles"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Vehicles
          </Link>
          <Link
            href="/admin/agents"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Agents
          </Link>
          <Link
            href="/admin/xml-manager"
            className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            XML Manager
          </Link>
        </nav>

        <div className="border-t border-border pt-6 space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href="/">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/favicon-32x32.png" alt="logo" className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary">EcoCollect</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

import { FileText } from "lucide-react"
