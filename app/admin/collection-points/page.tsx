"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { MapPin, Loader2 } from "lucide-react"
import { AddCollectionPointDialog } from "@/components/add-collection-point-dialog"
import { CollectionPointDetailsDialog } from "@/components/collection-point-details-dialog"
import { fetchCollectionPoints } from "@/lib/api-client"
import type { CollectPoint } from "@/lib/types"

export default function CollectionPointsPage() {
    const [points, setPoints] = useState<CollectPoint[]>([])
    const [loading, setLoading] = useState(true)

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

    const getStatus = (fillLevel: number): "empty" | "partial" | "full" => {
        if (fillLevel >= 80) return "full"
        if (fillLevel >= 40) return "partial"
        return "empty"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Collection Points</h1>
                    <p className="text-foreground/60">Monitor waste container status</p>
                </div>
                <AddCollectionPointDialog onSuccess={loadCollectionPoints} />
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
                    <p className="text-foreground/60">No collection points yet. Click "Add Collection Point" to create one.</p>
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
                                                className={`h-full transition-all ${
                                                    point.fillLevel >= 80 ? "bg-red-500" : 
                                                    point.fillLevel >= 40 ? "bg-yellow-500" : "bg-green-500"
                                                }`}
                                                style={{ width: `${point.fillLevel}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-sm text-foreground/60">
                                        <span>Last collected: {point.lastCollectDate}</span>
                                    </div>

                                    <CollectionPointDetailsDialog point={{
                                        id: parseInt(point.idCP.replace(/\D/g, "")) || 0,
                                        name: point.nameCP,
                                        zone: point.adressCP,
                                        latitude: point.latitudeGPS,
                                        longitude: point.longitudeGPS,
                                        capacity: point.capacityCP,
                                        fillLevel: point.fillLevel,
                                        status: status,
                                        lastUpdated: point.lastCollectDate
                                    }} />
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
