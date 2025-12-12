"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { MapPin, Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { fetchCollectionPoints, createCollectionPoint, updateCollectionPoint, deleteCollectionPoint } from "@/lib/api-client"
import type { CollectPoint } from "@/lib/types"
import CollectionPointMapPicker from "@/components/collection-point-map-picker";

export default function CollectionPointsPage() {
    const [points, setPoints] = useState<CollectPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<CollectPoint | null>(null)
    const [formData, setFormData] = useState({
        nameCP: "",
        adressCP: "",
        latitudeGPS: 36.8065,
        longitudeGPS: 10.1815,
        capacityCP: 500,
        fillLevel: 0,
        wasteType: "mixed",
        priorityCP: 1,
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const loadCollectionPoints = async () => {
        setLoading(true)
        try {
            const result = await fetchCollectionPoints()
            if (result.success && result.data) {
                setPoints(result.data)
            }
        } catch (error) {
            console.error("Failed to load collection points:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCollectionPoints()
    }, [])

    const resetForm = () => {
        setFormData({
            nameCP: "",
            adressCP: "",
            latitudeGPS: 36.8065,
            longitudeGPS: 10.1815,
            capacityCP: 500,
            fillLevel: 0,
            wasteType: "mixed",
            priorityCP: 1,
        })
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const result = await createCollectionPoint({
                nameCP: formData.nameCP,
                adressCP: formData.adressCP,
                latitudeGPS: formData.latitudeGPS,
                longitudeGPS: formData.longitudeGPS,
                capacityCP: formData.capacityCP,
                fillLevel: formData.fillLevel,
                wasteType: formData.wasteType,
                priorityCP: formData.priorityCP,
            })

            if (result.success) {
                setDialogOpen(false)
                resetForm()
                loadCollectionPoints()
            } else {
                setError(result.error || "Failed to create collection point")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (point: CollectPoint) => {
        setSelectedPoint(point)
        setFormData({
            nameCP: point.nameCP || "",
            adressCP: point.adressCP || "",
            latitudeGPS: point.latitudeGPS || 36.8065,
            longitudeGPS: point.longitudeGPS || 10.1815,
            capacityCP: point.capacityCP || 500,
            fillLevel: point.fillLevel || 0,
            wasteType: point.wasteType || "mixed",
            priorityCP: point.priorityCP || 1,
        })
        setEditDialogOpen(true)
        setError("")
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPoint) return

        setSubmitting(true)
        setError("")

        try {
            const result = await updateCollectionPoint(selectedPoint.idCP, {
                nameCP: formData.nameCP,
                adressCP: formData.adressCP,
                latitudeGPS: formData.latitudeGPS,
                longitudeGPS: formData.longitudeGPS,
                capacityCP: formData.capacityCP,
                fillLevel: formData.fillLevel,
                wasteType: formData.wasteType,
                priorityCP: formData.priorityCP,
            })

            if (result.success) {
                setEditDialogOpen(false)
                setSelectedPoint(null)
                resetForm()
                loadCollectionPoints()
            } else {
                setError(result.error || "Failed to update collection point")
            }
        } catch (err) {
            setError("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (idCP: string) => {
        if (!confirm("Are you sure you want to delete this collection point?")) return

        try {
            const result = await deleteCollectionPoint(idCP)
            if (result.success) {
                loadCollectionPoints()
            } else {
                alert(result.error || "Failed to delete collection point")
            }
        } catch (err) {
            console.error("Failed to delete collection point:", err)
        }
    }

    const getStatus = (fillLevel: number): "empty" | "partial" | "full" => {
        if (fillLevel >= 80) return "full"
        if (fillLevel >= 40) return "partial"
        return "empty"
    }

    // Inline form JSX to avoid focus loss issue (component re-creation on each render)
    const renderCollectionPointForm = (onSubmit: (e: React.FormEvent) => Promise<void>, isEdit: boolean = false) => (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                    value={formData.nameCP}
                    onChange={(e) => setFormData({ ...formData, nameCP: e.target.value })}
                    placeholder="Main Street Collection Point"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                    value={formData.adressCP}
                    onChange={(e) => setFormData({ ...formData, adressCP: e.target.value })}
                    placeholder="123 Main Street, Tunis"
                    required
                />
            </div>
            <div>
                <CollectionPointMapPicker 
                    handleMapClick={(lat, lng) => { setFormData({ ...formData, latitudeGPS: lat, longitudeGPS: lng }) }}
                    lat={formData.latitudeGPS}
                    lng={formData.longitudeGPS}

                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Capacity (L)</label>
                    <Input
                        type="number"
                        value={formData.capacityCP}
                        onChange={(e) => setFormData({ ...formData, capacityCP: Number(e.target.value) })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fill Level (%)</label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.fillLevel}
                        onChange={(e) => setFormData({ ...formData, fillLevel: Number(e.target.value) })}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Waste Type</label>
                    <select
                        value={formData.wasteType}
                        onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    >
                        <option value="mixed">Mixed</option>
                        <option value="recyclable">Recyclable</option>
                        <option value="organic">Organic</option>
                        <option value="glass">Glass</option>
                        <option value="paper">Paper</option>
                        <option value="plastic">Plastic</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority (1-5)</label>
                    <Input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.priorityCP}
                        onChange={(e) => setFormData({ ...formData, priorityCP: Number(e.target.value) })}
                        required
                    />
                </div>
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
                    {submitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Point")}
                </Button>
            </div>
        </form>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Collection Points</h1>
                    <p className="text-foreground/60">Monitor waste container status</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Collection Point
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Collection Point</DialogTitle>
                        </DialogHeader>
                        {renderCollectionPointForm(handleSubmit)}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{points.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Critical (Full)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {points.filter((p) => p.fillLevel >= 80).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Optimal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {points.filter((p) => p.fillLevel < 40).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Collection Points Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : points.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <MapPin className="w-12 h-12 mx-auto text-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Collection Points Yet</h3>
                        <p className="text-foreground/60 mb-4">Add your first collection point to get started</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Collection Point
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {points.map((point) => {
                        const status = getStatus(point.fillLevel)
                        return (
                            <Card key={point.idCP}>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{point.nameCP}</h3>
                                                <p className="text-sm text-foreground/60">{point.adressCP}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={status} />
                                    </div>

                                    {/* Fill Level Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground/60">Fill Level</span>
                                            <span className="font-medium text-foreground">
                                                {point.fillLevel}% ({point.wasteType})
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${point.fillLevel >= 80 ? "bg-red-500" : 
                                                    point.fillLevel >= 40 ? "bg-yellow-500" : "bg-green-500"
                                                    }`}
                                                style={{ width: `${point.fillLevel}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Capacity</span>
                                            <span className="font-medium">{point.capacityCP}L</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Priority</span>
                                            <span className="font-medium">{point.priorityCP}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Last collected</span>
                                            <span className="font-medium">{point.lastCollectDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Coordinates</span>
                                            <span className="font-medium text-xs">{Number(point.latitudeGPS)?.toFixed(4)}, {Number(point.longitudeGPS)?.toFixed(4)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(point)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(point.idCP)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) { setSelectedPoint(null); resetForm(); } }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Collection Point</DialogTitle>
                    </DialogHeader>
                    {renderCollectionPointForm(handleEditSubmit, true)}
                </DialogContent>
            </Dialog>
        </div>
    )
}
