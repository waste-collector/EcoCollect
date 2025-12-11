"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"
import { MapPin, Droplet, Box } from "lucide-react"
import { toFixed } from "@/lib/utils";

interface CollectionPoint {
    id: number
    name: string
    zone: string
    latitude: number
    longitude: number
    capacity: number
    fillLevel: number
    status: "empty" | "partial" | "full"
    lastUpdated: string
}

interface CollectionPointDetailsDialogProps {
    point: CollectionPoint
}

export function CollectionPointDetailsDialog({ point }: CollectionPointDetailsDialogProps) {
    const [open, setOpen] = useState(false)
    const fillPercentage = (point.fillLevel / point.capacity) * 100

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{point.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Status Section */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Status</h3>
                            <StatusBadge status={point.status} />
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full transition-all ${point.fillLevel > 90 ? "bg-red-500" : point.fillLevel > 60 ? "bg-yellow-500" : "bg-green-500"
                                    }`}
                                style={{ width: `${fillPercentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-foreground/60">Capacity Used</span>
                            <span className="font-medium text-foreground">
                                {fillPercentage.toFixed(1)}% ({point.fillLevel}L / {point.capacity}L)
                            </span>
                        </div>
                    </Card>

                    {/* Location Information */}
                    <Card className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm text-foreground mb-1">Location</h3>
                                <p className="text-sm text-foreground/70">{point.zone}</p>
                                <p className="text-xs text-foreground/50 font-mono">
                                    {toFixed(point.latitude, 4)}, {toFixed(point.longitude, 4)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Specifications */}
                    <Card className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Box className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-sm text-foreground/60">Container Capacity</p>
                                <p className="font-semibold text-foreground">{point.capacity} Liters</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Droplet className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-sm text-foreground/60">Current Level</p>
                                <p className="font-semibold text-foreground">{point.fillLevel} Liters</p>
                            </div>
                        </div>
                    </Card>

                    {/* Metadata */}
                    <div className="text-xs text-foreground/50 p-3 bg-muted rounded-md">
                        <p>Last Updated: {new Date(point.lastUpdated).toLocaleString()}</p>
                        <p>Point ID: {point.id}</p>
                    </div>

                    <Button onClick={() => setOpen(false)} className="w-full">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
