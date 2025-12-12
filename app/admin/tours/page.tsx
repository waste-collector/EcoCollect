"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { Trash2, Edit, Download, Upload, MapPin, Plus, UserCheck, Truck } from "lucide-react"
import { fetchTours, createTour, updateTour, deleteTour, importToursXML, exportToursXML, fetchVehicles, fetchAgents } from "@/lib/api-client"
import type { CollectTour, Vehicule, CollectAgent } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

export default function ToursPage() {
    const [tours, setTours] = useState<CollectTour[]>([])
    const [vehicles, setVehicles] = useState<Vehicule[]>([])
    const [agents, setAgents] = useState<CollectAgent[]>([])
    const [loading, setLoading] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingTour, setEditingTour] = useState<CollectTour | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Form data for create
    const [createFormData, setCreateFormData] = useState({
        dateTour: new Date().toISOString().split("T")[0],
        distanceTour: "",
        estimedTimeTour: "02:00",
        immatV: "",
        agentIds: [] as string[],
    })

    // Form data for edit
    const [editFormData, setEditFormData] = useState({
        idTour: "",
        dateTour: "",
        statusTour: "",
        distanceTour: "",
        estimedTimeTour: "",
        collectedQuantityTour: "",
        CO2emissionTour: "",
        immatV: "",
        agentIds: [] as string[],
    })

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        try {
            const [toursResult, vehiclesResult, agentsResult] = await Promise.all([
                fetchTours(),
                fetchVehicles(),
                fetchAgents(),
            ])
      
            if (toursResult.success && toursResult.data) {
                setTours(toursResult.data)
            }
            if (vehiclesResult.success && vehiclesResult.data) {
                setVehicles(vehiclesResult.data)
            }
            if (agentsResult.success && agentsResult.data) {
                setAgents(agentsResult.data)
            }
        } catch (err) {
            console.error("Failed to load data:", err)
        } finally {
            setLoading(false)
        }
    }

    async function loadTours() {
        try {
            const result = await fetchTours()
            if (result.success && result.data) {
                setTours(result.data)
            }
        } catch (err) {
            console.error("Failed to load tours:", err)
        }
    }

    const handleCreateTour = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        // Validate required fields
        if (!createFormData.immatV) {
            setError("Please select a vehicle")
            setSubmitting(false)
            return
        }

        if (createFormData.agentIds.length === 0) {
            setError("Please select at least one agent")
            setSubmitting(false)
            return
        }

        try {
            const result = await createTour({
                dateTour: createFormData.dateTour,
                distanceTour: Number.parseFloat(createFormData.distanceTour),
                estimedTimeTour: createFormData.estimedTimeTour,
                statusTour: "pending",
                immatV: createFormData.immatV,
                agentIds: createFormData.agentIds,
                collectedQuantityTour: 0,
                CO2emissionTour: 0,
            })

            if (result.success) {
                setCreateFormData({
                    dateTour: new Date().toISOString().split("T")[0],
                    distanceTour: "",
                    estimedTimeTour: "02:00",
                    immatV: "",
                    agentIds: [],
                })
                setCreateDialogOpen(false)
                loadTours()
            } else {
                setError(result.error || "Failed to create tour")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const openEditDialog = (tour: CollectTour) => {
        setEditingTour(tour)
    
        // Extract agent IDs from the tour
        let agentIds: string[] = []
        if (tour.idClAgents) {
            if (Array.isArray(tour.idClAgents.idClAgent)) {
                agentIds = tour.idClAgents.idClAgent
            } else if (tour.idClAgents.idClAgent) {
                agentIds = [tour.idClAgents.idClAgent]
            }
        }

        setEditFormData({
            idTour: tour.idTour,
            dateTour: tour.dateTour,
            statusTour: tour.statusTour,
            distanceTour: String(tour.distanceTour),
            estimedTimeTour: tour.estimedTimeTour,
            collectedQuantityTour: String(tour.collectedQuantityTour),
            CO2emissionTour: String(tour.CO2emissionTour),
            immatV: tour.immatV || "",
            agentIds: agentIds,
        })
        setError("")
        setEditDialogOpen(true)
    }

    const handleUpdateTour = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTour) return

        setSubmitting(true)
        setError("")

        // Validate required fields
        if (!editFormData.immatV) {
            setError("Please select a vehicle")
            setSubmitting(false)
            return
        }

        if (editFormData.agentIds.length === 0) {
            setError("Please select at least one agent")
            setSubmitting(false)
            return
        }

        try {
            const result = await updateTour(editFormData.idTour, {
                idTour: editFormData.idTour,
                dateTour: editFormData.dateTour,
                statusTour: editFormData.statusTour,
                distanceTour: Number.parseFloat(editFormData.distanceTour),
                estimedTimeTour: editFormData.estimedTimeTour,
                collectedQuantityTour: Number.parseFloat(editFormData.collectedQuantityTour),
                CO2emissionTour: Number.parseFloat(editFormData.CO2emissionTour),
                immatV: editFormData.immatV,
                agentIds: editFormData.agentIds,
                // Preserve existing collection points
                idCPs: editingTour.idCPs,
            })

            if (result.success) {
                setEditDialogOpen(false)
                setEditingTour(null)
                loadTours()
            } else {
                setError(result.error || "Failed to update tour")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteTour = async (idTour: string) => {
        if (!confirm("Are you sure you want to delete this tour?")) return

        try {
            const result = await deleteTour(idTour)
            if (result.success) {
                loadTours()
            }
        } catch (err) {
            console.error("Failed to delete tour:", err)
        }
    }

    const handleExportXML = async () => {
        try {
            const result = await exportToursXML()
            if (result.success && result.xml) {
                const element = document.createElement("a")
                element.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(result.xml))
                element.setAttribute("download", "tours_export.xml")
                element.style.display = "none"
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
            }
        } catch (err) {
            console.error("Failed to export:", err)
        }
    }

    const handleImportXML = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async (event) => {
                try {
                    const xml = event.target?.result as string
                    const result = await importToursXML(xml)
          
                    if (result.success) {
                        alert(`Successfully imported ${result.imported || 0} tours`)
                        loadTours()
                    } else {
                        alert(`Import failed: ${result.error || "Unknown error"}`)
                    }
                } catch (error) {
                    alert("Error importing XML file")
                }
            }
            reader.readAsText(file)
        }
        e.target.value = ""
    }

    const getStatusBadgeType = (status: string): "empty" | "partial" | "full" => {
        if (status === "completed") return "empty"
        if (status === "in-progress") return "partial"
        return "full"
    }

    const toggleAgentSelection = (agentId: string, isCreate: boolean) => {
        if (isCreate) {
            setCreateFormData(prev => ({
                ...prev,
                agentIds: prev.agentIds.includes(agentId)
                    ? prev.agentIds.filter(id => id !== agentId)
                    : [...prev.agentIds, agentId]
            }))
        } else {
            setEditFormData(prev => ({
                ...prev,
                agentIds: prev.agentIds.includes(agentId)
                    ? prev.agentIds.filter(id => id !== agentId)
                    : [...prev.agentIds, agentId]
            }))
        }
    }

    const getVehicleDetails = (immatV?: string) => {
        if (!immatV) return null
        return vehicles.find(v => v.immatV === immatV)
    }

    const getAgentDetails = (agentId: string) => {
        return agents.find(a => a.idUser === agentId)
    }

    const getTourAgents = (tour: CollectTour): CollectAgent[] => {
        if (!tour.idClAgents) return []
    
        const agentIds = Array.isArray(tour.idClAgents.idClAgent)
            ? tour.idClAgents.idClAgent
            : tour.idClAgents.idClAgent ? [tour.idClAgents.idClAgent] : []
    
        return agentIds.map(id => getAgentDetails(id)).filter(Boolean) as CollectAgent[]
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Tours Management</h1>
                    <p className="text-foreground/60">Create and manage collection tours</p>
                </div>
                <div className="flex gap-2">
                    {/* Create Tour Dialog */}
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Tour
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Tour</DialogTitle>
                                <DialogDescription>Add a new collection tour</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTour} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                                        <p className="text-sm text-destructive">{error}</p>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Tour Date</label>
                                    <Input
                                        type="date"
                                        value={createFormData.dateTour}
                                        onChange={(e) => setCreateFormData({ ...createFormData, dateTour: e.target.value })}
                                        required
                                    />
                                </div>
                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Vehicle <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        value={createFormData.immatV}
                                        onChange={(e) => setCreateFormData({ ...createFormData, immatV: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                        required
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehicles.filter(v => v.stateV === "operational").map((vehicle) => (
                                            <option key={vehicle.immatV} value={vehicle.immatV}>
                                                {vehicle.immatV} - {vehicle.typeV} ({vehicle.capacityV}kg)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Agents <span className="text-destructive">*</span> (Select at least one)
                                    </label>
                                    <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                        {agents.filter(a => a.disponibility).length === 0 ? (
                                            <p className="text-sm text-foreground/60">No available agents</p>
                                        ) : (
                                            agents.filter(a => a.disponibility).map((agent) => (
                                                <div key={agent.idUser} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`create-agent-${agent.idUser}`}
                                                        checked={createFormData.agentIds.includes(agent.idUser)}
                                                        onCheckedChange={() => toggleAgentSelection(agent.idUser, true)}
                                                    />
                                                    <label
                                                        htmlFor={`create-agent-${agent.idUser}`}
                                                        className="text-sm cursor-pointer flex-1"
                                                    >
                                                        {agent.nameU} - {agent.roleAgent} ({agent.idUser})
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-xs text-foreground/60">
                                        {createFormData.agentIds.length} agent(s) selected
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Distance (km)</label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 12.5"
                                            value={createFormData.distanceTour}
                                            onChange={(e) => setCreateFormData({ ...createFormData, distanceTour: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Estimated Time</label>
                                        <Input
                                            placeholder="e.g., 02:30"
                                            value={createFormData.estimedTimeTour}
                                            onChange={(e) => setCreateFormData({ ...createFormData, estimedTimeTour: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting ? "Creating..." : "Create Tour"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleExportXML}>
                        <Download className="w-4 h-4 mr-2" />
                        Export XML
                    </Button>
                    <label className="cursor-pointer">
                        <input type="file" accept=".xml" onChange={handleImportXML} className="hidden" />
                        <Button variant="outline" asChild>
                            <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Import XML
                            </span>
                        </Button>
                    </label>
                </div>
            </div>

            {/* Edit Tour Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Tour</DialogTitle>
                        <DialogDescription>Update tour details for {editFormData.idTour}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTour} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Tour Date</label>
                            <Input
                                type="date"
                                value={editFormData.dateTour}
                                onChange={(e) => setEditFormData({ ...editFormData, dateTour: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Status</label>
                            <select
                                value={editFormData.statusTour}
                                onChange={(e) => setEditFormData({ ...editFormData, statusTour: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
            
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Vehicle <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={editFormData.immatV}
                                onChange={(e) => setEditFormData({ ...editFormData, immatV: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                required
                            >
                                <option value="">Select a vehicle</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle.immatV} value={vehicle.immatV}>
                                        {vehicle.immatV} - {vehicle.typeV} ({vehicle.capacityV}kg) - {vehicle.stateV}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Agents <span className="text-destructive">*</span> (Select at least one)
                            </label>
                            <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                {agents.length === 0 ? (
                                    <p className="text-sm text-foreground/60">No agents available</p>
                                ) : (
                                    agents.map((agent) => (
                                        <div key={agent.idUser} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`edit-agent-${agent.idUser}`}
                                                checked={editFormData.agentIds.includes(agent.idUser)}
                                                onCheckedChange={() => toggleAgentSelection(agent.idUser, false)}
                                            />
                                            <label
                                                htmlFor={`edit-agent-${agent.idUser}`}
                                                className="text-sm cursor-pointer flex-1"
                                            >
                                                {agent.nameU} - {agent.roleAgent} ({agent.idUser}) 
                                                {agent.disponibility ? " - Available" : " - Unavailable"}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-foreground/60">
                                {editFormData.agentIds.length} agent(s) selected
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Distance (km)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={editFormData.distanceTour}
                                    onChange={(e) => setEditFormData({ ...editFormData, distanceTour: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Est. Time</label>
                                <Input
                                    placeholder="e.g., 02:30"
                                    value={editFormData.estimedTimeTour}
                                    onChange={(e) => setEditFormData({ ...editFormData, estimedTimeTour: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Collected (kg)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={editFormData.collectedQuantityTour}
                                    onChange={(e) => setEditFormData({ ...editFormData, collectedQuantityTour: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">CO2 (kg)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={editFormData.CO2emissionTour}
                                    onChange={(e) => setEditFormData({ ...editFormData, CO2emissionTour: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setEditDialogOpen(false)} 
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : tours.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MapPin className="w-12 h-12 mx-auto text-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Tours Yet</h3>
                        <p className="text-foreground/60 mb-4">Create your first collection tour to get started</p>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Tour
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                /* Tours List */
                <div className="space-y-3">
                    {tours.map((tour) => {
                        const vehicle = getVehicleDetails(tour.immatV)
                        const tourAgents = getTourAgents(tour)

                        return (
                            <Card key={tour.idTour}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-foreground">
                                                    Tour {tour.idTour}
                                                </h3>
                                                <span className="text-xs bg-muted px-2 py-1 rounded">{tour.dateTour}</span>
                                            </div>
                      
                                            {/* Vehicle Info */}
                                            <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded-lg">
                                                <Truck className="w-4 h-4 text-primary" />
                                                <span className="font-medium">Vehicle:</span>
                                                {vehicle ? (
                                                    <span>
                                                        {vehicle.immatV} - {vehicle.typeV} ({vehicle.capacityV}kg, {vehicle.stateV})
                                                    </span>
                                                ) : (
                                                    <span className="text-destructive">{tour.immatV || "Unassigned"}</span>
                                                )}
                                            </div>

                                            {/* Agents Info */}
                                            <div className="flex items-start gap-2 text-sm bg-muted/50 px-3 py-2 rounded-lg">
                                                <UserCheck className="w-4 h-4 text-primary mt-0.5" />
                                                <div className="flex-1">
                                                    <span className="font-medium">Agents:</span>
                                                    {tourAgents.length > 0 ? (
                                                        <div className="mt-1 space-y-1">
                                                            {tourAgents.map((agent) => (
                                                                <div key={agent.idUser} className="text-xs">
                                                                    {agent.nameU} - {agent.roleAgent} ({agent.idUser})
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-destructive ml-1">No agents assigned</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/60">
                                                <div>Distance: {tour.distanceTour} km</div>
                                                <div>Duration: {tour.estimedTimeTour}</div>
                                                <div>Collected: {tour.collectedQuantityTour} kg</div>
                                                <div>CO2 Emission: {tour.CO2emissionTour} kg</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <StatusBadge
                                                status={getStatusBadgeType(tour.statusTour)}
                                                label={tour.statusTour.charAt(0).toUpperCase() + tour.statusTour.slice(1).replace("-", " ")}
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => openEditDialog(tour)}
                                                title="Edit tour"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDeleteTour(tour.idTour)}
                                                title="Delete tour"
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
