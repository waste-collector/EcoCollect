"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { Plus, Trash2, Truck, Pencil } from "lucide-react"
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/api-client"
import type { Vehicule } from "@/lib/types"

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicule[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicule | null>(null)
    const [formData, setFormData] = useState({
        immatV: "",
        typeV: "Truck",
        capacityV: 5000,
        typeFuelV: "Diesel",
        fuelLevelV: 100,
        stateV: "operational",
        emissionCO2: 0,
        dateLastMaintenance: new Date().toISOString().split("T")[0],
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        loadVehicles()
    }, [])

    async function loadVehicles() {
        setLoading(true)
        try {
            const result = await fetchVehicles()
            if (result.success && result.data) {
                setVehicles(result.data)
            }
        } catch (err) {
            console.error("Failed to load vehicles:", err)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            immatV: "",
            typeV: "Truck",
            capacityV: 5000,
            typeFuelV: "Diesel",
            fuelLevelV: 100,
            stateV: "operational",
            emissionCO2: 0,
            dateLastMaintenance: new Date().toISOString().split("T")[0],
        })
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const result = await createVehicle({
                immatV: formData.immatV,
                typeV: formData.typeV,
                capacityV: formData.capacityV,
                typeFuelV: formData.typeFuelV,
                fuelLevelV: formData.fuelLevelV,
                stateV: formData.stateV,
                emissionCO2: formData.emissionCO2,
                dateLastMaintenance: formData.dateLastMaintenance,
            })

            if (result.success) {
                setDialogOpen(false)
                resetForm()
                loadVehicles()
            } else {
                setError(result.error || "Failed to create vehicle")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (vehicle: Vehicule) => {
        setSelectedVehicle(vehicle)
        setFormData({
            immatV: vehicle.immatV || "",
            typeV: vehicle.typeV || "Truck",
            capacityV: vehicle.capacityV || 5000,
            typeFuelV: vehicle.typeFuelV || "Diesel",
            fuelLevelV: vehicle.fuelLevelV || 100,
            stateV: vehicle.stateV || "operational",
            emissionCO2: vehicle.emissionCO2 || 0,
            dateLastMaintenance: vehicle.dateLastMaintenance || new Date().toISOString().split("T")[0],
        })
        setEditDialogOpen(true)
        setError("")
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedVehicle) return

        setSubmitting(true)
        setError("")

        try {
            const result = await updateVehicle(selectedVehicle.immatV, {
                typeV: formData.typeV,
                capacityV: formData.capacityV,
                typeFuelV: formData.typeFuelV,
                fuelLevelV: formData.fuelLevelV,
                stateV: formData.stateV,
                emissionCO2: formData.emissionCO2,
                dateLastMaintenance: formData.dateLastMaintenance,
            })

            if (result.success) {
                setEditDialogOpen(false)
                setSelectedVehicle(null)
                resetForm()
                loadVehicles()
            } else {
                setError(result.error || "Failed to update vehicle")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (immatV: string) => {
        if (!confirm("Are you sure you want to delete this vehicle?")) return

        try {
            const result = await deleteVehicle(immatV)
            if (result.success) {
                loadVehicles()
            }
        } catch (err) {
            console.error("Failed to delete vehicle:", err)
        }
    }

    const operationalVehicles = vehicles.filter((v) => v.stateV === "operational")
    const maintenanceVehicles = vehicles.filter((v) => v.stateV === "maintenance")

    // Inline form JSX to avoid focus loss issue (component re-creation on each render)
    const renderVehicleForm = (onSubmit: (e: React.FormEvent) => Promise<void>, isEdit: boolean = false) => (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium">Registration Number</label>
                <Input
                    value={formData.immatV}
                    onChange={(e) => setFormData({ ...formData, immatV: e.target.value })}
                    placeholder="VEH-007"
                    required
                    disabled={isEdit}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Type/Model</label>
                <Input
                    value={formData.typeV}
                    onChange={(e) => setFormData({ ...formData, typeV: e.target.value })}
                    placeholder="Mercedes Actros"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Capacity (kg)</label>
                <Input
                    type="number"
                    value={formData.capacityV}
                    onChange={(e) => setFormData({ ...formData, capacityV: Number(e.target.value) })}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <select
                    value={formData.typeFuelV}
                    onChange={(e) => setFormData({ ...formData, typeFuelV: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Level (%)</label>
                <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.fuelLevelV}
                    onChange={(e) => setFormData({ ...formData, fuelLevelV: Number(e.target.value) })}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                    value={formData.stateV}
                    onChange={(e) => setFormData({ ...formData, stateV: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-service">Out of Service</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">CO2 Emission</label>
                <Input
                    type="number"
                    min="0"
                    value={formData.emissionCO2}
                    onChange={(e) => setFormData({ ...formData, emissionCO2: Number(e.target.value) })}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Last Maintenance Date</label>
                <Input
                    type="date"
                    value={formData.dateLastMaintenance}
                    onChange={(e) => setFormData({ ...formData, dateLastMaintenance: e.target.value })}
                />
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
                    {submitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Vehicle")}
                </Button>
            </div>
        </form>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Vehicle Fleet</h1>
                    <p className="text-foreground/60">Monitor vehicle status and performance</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vehicle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Vehicle</DialogTitle>
                        </DialogHeader>
                        {renderVehicleForm(handleSubmit)}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehicles.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Operational</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{operationalVehicles.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{maintenanceVehicles.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : vehicles.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Truck className="w-12 h-12 mx-auto text-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Vehicles Yet</h3>
                        <p className="text-foreground/60 mb-4">Add your first vehicle to get started</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vehicle
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                /* Vehicles Table */
                <Card>
                    <CardHeader>
                        <CardTitle>Fleet Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Vehicle ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Fuel Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Fuel Level</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Capacity (kg)</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/80">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => {
                                        const isOperational = vehicle.stateV === "operational"
                                        return (
                                            <tr key={vehicle.immatV} className="border-b border-border hover:bg-secondary/5">
                                                <td className="py-3 px-4 font-medium">{vehicle.immatV}</td>
                                                <td className="py-3 px-4">{vehicle.typeV}</td>
                                                <td className="py-3 px-4">{vehicle.typeFuelV}</td>
                                                <td className="py-3 px-4">
                                                    <StatusBadge
                                                        status={isOperational ? "empty" : "full"}
                                                        label={isOperational ? "Operational" : "Maintenance"}
                                                    />
                                                </td>
                                                <td className="py-3 px-4">{vehicle.fuelLevelV}%</td>
                                                <td className="py-3 px-4">{vehicle.capacityV}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(vehicle)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(vehicle.immatV)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) { setSelectedVehicle(null); resetForm(); } }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                    </DialogHeader>
                    {renderVehicleForm(handleEditSubmit, true)}
                </DialogContent>
            </Dialog>
        </div>
    )
}
