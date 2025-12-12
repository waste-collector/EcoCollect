"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { toFixed } from "@/lib/utils"
import { Button } from "./ui/button";

// Dynamically import the map component with no SSR
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void
    initialLat?: number
    initialLng?: number
}

export function CollectionPointMapPicker({
    onLocationSelect,
    initialLat = 34.7406,
    initialLng = 10.7603,
}: MapPickerProps) {
    const [selectedLat, setSelectedLat] = useState(initialLat)
    const [selectedLng, setSelectedLng] = useState(initialLng)
    const [confirmedLat, setConfirmedLat] = useState(initialLat)
    const [confirmedLng, setConfirmedLng] = useState(initialLng)

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLat(lat)
        setSelectedLng(lng)
    }

    const handleConfirm = () => {
        setConfirmedLat(selectedLat)
        setConfirmedLng(selectedLng)
        onLocationSelect(selectedLat, selectedLng)
    }

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
                    lat={selectedLat} 
                    lng={selectedLng} 
                    onMapClick={handleMapClick}
                />
            </div>

            {/* Quick location buttons */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Locations in Sfax
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedLat(34.7406)
                            setSelectedLng(10.7603)
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#e2e8f0'
                            e.currentTarget.style.borderColor = '#94a3b8'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f1f5f9'
                            e.currentTarget.style.borderColor = '#cbd5e1'
                        }}
                    >
                        Sfax Center
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedLat(34.7298)
                            setSelectedLng(10.7595)
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#e2e8f0'
                            e.currentTarget.style.borderColor = '#94a3b8'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f1f5f9'
                            e.currentTarget.style.borderColor = '#cbd5e1'
                        }}
                    >
                        Medina
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedLat(34.7456)
                            setSelectedLng(10.7625)
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#e2e8f0'
                            e.currentTarget.style.borderColor = '#94a3b8'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f1f5f9'
                            e.currentTarget.style.borderColor = '#cbd5e1'
                        }}
                    >
                        Downtown
                    </button>
                </div>
            </div>

            {/* Status Display */}
            <div style={{
                padding: '20px',
                background: confirmedLat === selectedLat && confirmedLng === selectedLng ? 
                    'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' : 
                    'linear-gradient(to bottom right, #fef3c7, #fde68a)',
                borderRadius: '12px',
                border: `3px solid ${confirmedLat === selectedLat && confirmedLng === selectedLng ? '#86efac' : '#fcd34d'}`,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: confirmedLat === selectedLat && confirmedLng === selectedLng ? '#22c55e' : '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: 'white'
                    }}>
                        {confirmedLat === selectedLat && confirmedLng === selectedLng ? '✓' : '!'}
                    </div>
                    <div>
                        <p style={{ 
                            fontSize: '13px', 
                            color: '#475569', 
                            margin: 0,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Current Selection
                        </p>
                        <p style={{ 
                            fontSize: '20px', 
                            color: '#1e293b',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            margin: '4px 0 0 0'
                        }}>
                            {toFixed(selectedLat, 6)}, {toFixed(selectedLng, 6)}
                        </p>
                    </div>
                </div>
                {confirmedLat !== selectedLat || confirmedLng !== selectedLng ? (
                    <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontWeight: '600' }}>
                        Click "Confirm Location" to save your changes
                    </p>
                ) : (
                    <p style={{ fontSize: '14px', color: '#166534', margin: 0, fontWeight: '600' }}>
                        Location has been confirmed and saved
                    </p>
                )}
            </div>

            {/* Confirm Button */}
            <Button
                type="button"
                className="w-full"
                onClick={handleConfirm}
            >
                Confirm Location
            </Button>
        </div>
    )
}

export default CollectionPointMapPicker
