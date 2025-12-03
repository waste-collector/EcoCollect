import React, { useState, useEffect, useRef } from "react"

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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update iframe when coordinates change
  useEffect(() => {
    if (iframeRef.current) {
      const bbox = `${selectedLng - 0.01},${selectedLat - 0.01},${selectedLng + 0.01},${selectedLat + 0.01}`
      iframeRef.current.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${selectedLat},${selectedLng}`
    }
  }, [selectedLat, selectedLng])

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
        📍 Sfax, Tunisia
      </p>

      {/* OpenStreetMap with marker */}
      <div style={{ 
        border: '3px solid #cbd5e1', 
        borderRadius: '16px', 
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="500"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLng - 0.01},${selectedLat - 0.01},${selectedLng + 0.01},${selectedLat + 0.01}&layer=mapnik&marker=${selectedLat},${selectedLng}`}
          style={{ border: 'none' }}
        />
        <div style={{
          padding: '12px 16px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '13px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          <a 
            href={`https://www.openstreetmap.org/?mlat=${selectedLat}&mlon=${selectedLng}#map=15/${selectedLat}/${selectedLng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
          >
            View Larger Map
          </a>
        </div>
      </div>

      {/* Manual Coordinate Input */}
      <div style={{
        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
          Adjust Coordinates
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '8px',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={selectedLat}
              onChange={(e) => setSelectedLat(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          <div>
            <label style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '8px',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={selectedLng}
              onChange={(e) => setSelectedLng(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: '600',
                color: '#1e293b',
                transition: 'all 0.2s',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
        </div>

        {/* Quick location buttons */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Locations
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
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
              📍 Sfax Center
            </button>
            <button
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
              🏛️ Medina
            </button>
            <button
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
              🏢 Downtown
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.5)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 12px -1px rgb(59 130 246 / 0.5)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(59 130 246 / 0.5)'
          }}
        >
          ✓ Confirm Location
        </button>
      </div>

      {/* Status Display */}
      <div style={{
        padding: '20px',
        background: confirmedLat === selectedLat && confirmedLng === selectedLng ? 
          'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' : 
          'linear-gradient(to bottom right, #fef3c7, #fde68a)',
        borderRadius: '12px',
        border: `3px solid ${confirmedLat === selectedLat && confirmedLng === selectedLng ? '#86efac' : '#fcd34d'}`,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
            fontSize: '20px'
          }}>
            {confirmedLat === selectedLat && confirmedLng === selectedLng ? '✓' : '⚠️'}
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
              {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
            </p>
          </div>
        </div>
        {confirmedLat !== selectedLat || confirmedLng !== selectedLng ? (
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontWeight: '600' }}>
            ⚠️ Click "Confirm Location" to save your changes
          </p>
        ) : (
          <p style={{ fontSize: '14px', color: '#166534', margin: 0, fontWeight: '600' }}>
            ✓ Location has been confirmed and saved
          </p>
        )}
      </div>
    </div>
  )
}

export default CollectionPointMapPicker