"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Trash2, Pencil } from "lucide-react"
import { fetchAgents, createAgent, updateAgent, deleteAgent } from "@/lib/api-client"
import type { CollectAgent } from "@/lib/types"

export default function AgentsPage() {
  const [agents, setAgents] = useState<CollectAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<CollectAgent | null>(null)
  const [formData, setFormData] = useState({
    nameU: "",
    emailU: "",
    telEmp: "",
    pwdU: "",
    roleAgent: "collector",
    disponibility: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAgents()
  }, [])

  async function loadAgents() {
    setLoading(true)
    try {
      const result = await fetchAgents()
      if (result.success && result.data) {
        setAgents(result.data)
      }
    } catch (err) {
      console.error("Failed to load agents:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nameU: "",
      emailU: "",
      telEmp: "",
      pwdU: "",
      roleAgent: "collector",
      disponibility: true,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const result = await createAgent({
        nameU: formData.nameU,
        emailU: formData.emailU,
        telEmp: formData.telEmp,
        pwdU: formData.pwdU,
        roleAgent: formData.roleAgent,
        disponibility: formData.disponibility,
      })

      if (result.success) {
        setDialogOpen(false)
        resetForm()
        loadAgents()
      } else {
        setError(result.error || "Failed to create agent")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (agent: CollectAgent) => {
    setSelectedAgent(agent)
    setFormData({
      nameU: agent.nameU || "",
      emailU: agent.emailU || "",
      telEmp: agent.telEmp || "",
      pwdU: "",
      roleAgent: agent.roleAgent || "collector",
      disponibility: agent.disponibility === true || agent.disponibility === "true" as unknown as boolean,
    })
    setEditDialogOpen(true)
    setError("")
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAgent) return

    setSubmitting(true)
    setError("")

    try {
      const updateData: any = {
        nameU: formData.nameU,
        emailU: formData.emailU,
        telEmp: formData.telEmp,
        roleAgent: formData.roleAgent,
        disponibility: formData.disponibility,
      }
      
      // Only include password if it was changed
      if (formData.pwdU) {
        updateData.pwdU = formData.pwdU
      }

      const result = await updateAgent(selectedAgent.idUser, updateData)

      if (result.success) {
        setEditDialogOpen(false)
        setSelectedAgent(null)
        resetForm()
        loadAgents()
      } else {
        setError(result.error || "Failed to update agent")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idUser: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const result = await deleteAgent(idUser)
      if (result.success) {
        loadAgents()
      }
    } catch (err) {
      console.error("Failed to delete agent:", err)
    }
  }

  const activeAgents = agents.filter((a) => a.disponibility === true || a.disponibility === "true" as unknown as boolean)

  // Inline form JSX to avoid focus loss issue (component re-creation on each render)
  const renderAgentForm = (onSubmit: (e: React.FormEvent) => Promise<void>, isEdit: boolean = false) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          value={formData.nameU}
          onChange={(e) => setFormData({ ...formData, nameU: e.target.value })}
          placeholder="John Smith"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.emailU}
          onChange={(e) => setFormData({ ...formData, emailU: e.target.value })}
          placeholder="agent@ecocollect.io"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={formData.telEmp}
          onChange={(e) => setFormData({ ...formData, telEmp: e.target.value })}
          placeholder="+216 71 123 456"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{isEdit ? "Password (leave blank to keep current)" : "Password"}</label>
        <Input
          type="password"
          value={formData.pwdU}
          onChange={(e) => setFormData({ ...formData, pwdU: e.target.value })}
          placeholder="********"
          required={!isEdit}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <select
          value={formData.roleAgent}
          onChange={(e) => setFormData({ ...formData, roleAgent: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="collector">Collector</option>
          <option value="driver">Driver</option>
          <option value="supervisor">Supervisor</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Availability</label>
        <select
          value={formData.disponibility ? "true" : "false"}
          onChange={(e) => setFormData({ ...formData, disponibility: e.target.value === "true" })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            isEdit ? setEditDialogOpen(false) : setDialogOpen(false)
            resetForm()
          }} 
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Agent")}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collection Agents</h1>
          <p className="text-foreground/60">Manage collection team members</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>
            {renderAgentForm(handleSubmit)}
          </DialogContent>
        </Dialog>
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
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAgents.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agents Yet</h3>
            <p className="text-foreground/60 mb-4">Add your first collection agent to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Agents Grid */
        <div className="grid md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Card key={agent.idUser}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.nameU}</h3>
                      <p className="text-sm text-foreground/60">{agent.telEmp}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      agent.disponibility === true || agent.disponibility === "true" as unknown as boolean
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {agent.disponibility === true || agent.disponibility === "true" as unknown as boolean ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Email</span>
                    <span className="font-medium">{agent.emailU}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Role</span>
                    <span className="font-medium capitalize">{agent.roleAgent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Recruited</span>
                    <span className="font-medium">{agent.recruitmentDateEmp}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(agent)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(agent.idUser)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) { setSelectedAgent(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          {renderAgentForm(handleEditSubmit, true)}
        </DialogContent>
      </Dialog>
    </div>
  )
}
