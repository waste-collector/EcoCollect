"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { toFixed } from "@/lib/utils"
import { Button } from "./ui/button";

// Dynamically import the map component with no SSR
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

interface MapPickerProps {
    lng: number
    lat: number
    handleMapClick: (lat: number, lng: number) => void
}

export function CollectionPointMapPicker({
    lng, lat, handleMapClick

}: MapPickerProps) {



    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
                Select Collection Point
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px' }}>
                Click on the map to select a location
            </p>

            {/* Interactive Leaflet Map */}
            <div style={{ 
                border: '3px solid #cbd5e1', 
                borderRadius: '16px', 
                overflow: 'hidden',
                marginBottom: '24px',
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                height: '500px'
            }}>
                <LeafletMap 
                    lat={lat} 
                    lng={lng} 
                    onMapClick={handleMapClick}
                />
            </div>


            {/* Confirm Button */}
            <Button
                type="button"
                className="w-full"
            >
                Confirm Location
            </Button>
        </div>
    )
}

export default CollectionPointMapPicker
