"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, Loader2, CheckCircle, XCircle } from "lucide-react"
import { 
  fetchTours, 
  fetchVehicles, 
  fetchAgents, 
  fetchCollectionPoints,
  importToursXML,
  importVehiclesXML,
  importAgentsXML,
  importCollectionPointsXML
} from "@/lib/api-client"

interface XMLOperation {
  id: number
  type: "import" | "export"
  entity: string
  status: "success" | "pending" | "error"
  timestamp: string
  records: number
  message?: string
}

type EntityType = "tours" | "vehicles" | "agents" | "collection-points"

export default function XMLManagerPage() {
  const [xmlInput, setXmlInput] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<EntityType>("tours")
  const [operations, setOperations] = useState<XMLOperation[]>([])
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState<string | null>(null)

  // Convert JSON data to XML format
  const jsonToXml = (data: any[], entityName: string, singularName: string): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${entityName}>\n`
    
    data.forEach(item => {
      xml += `  <${singularName}>\n`
      Object.entries(item).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && !Array.isArray(value)) {
            xml += `    <${key}>\n`
            Object.entries(value as object).forEach(([subKey, subValue]) => {
              xml += `      <${subKey}>${escapeXml(String(subValue))}</${subKey}>\n`
            })
            xml += `    </${key}>\n`
          } else if (Array.isArray(value)) {
            xml += `    <${key}>\n`
            value.forEach((arrItem, index) => {
              if (typeof arrItem === "object") {
                xml += `      <item>\n`
                Object.entries(arrItem as object).forEach(([subKey, subValue]) => {
                  xml += `        <${subKey}>${escapeXml(String(subValue))}</${subKey}>\n`
                })
                xml += `      </item>\n`
              } else {
                xml += `      <item>${escapeXml(String(arrItem))}</item>\n`
              }
            })
            xml += `    </${key}>\n`
          } else {
            xml += `    <${key}>${escapeXml(String(value))}</${key}>\n`
          }
        }
      })
      xml += `  </${singularName}>\n`
    })
    
    xml += `</${entityName}>`
    return xml
  }

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  const handleExport = async (entity: EntityType) => {
    setExportLoading(entity)
    const timestamp = new Date().toLocaleString()
    
    try {
      let data: any[] = []
      let entityName: string = entity
      let singularName = entity.slice(0, -1)
      
      switch (entity) {
        case "tours":
          const toursRes = await fetchTours()
          data = toursRes.data || []
          singularName = "tour"
          break
        case "vehicles":
          const vehiclesRes = await fetchVehicles()
          data = vehiclesRes.data || []
          singularName = "vehicle"
          break
        case "agents":
          const agentsRes = await fetchAgents()
          data = agentsRes.data || []
          singularName = "agent"
          break
        case "collection-points":
          const pointsRes = await fetchCollectionPoints()
          data = pointsRes.data || []
          entityName = "collectionPoints"
          singularName = "collectionPoint"
          break
      }

      if (data.length === 0) {
        addOperation({
          type: "export",
          entity: entity,
          status: "error",
          timestamp,
          records: 0,
          message: "No data to export"
        })
        return
      }

      const xml = jsonToXml(data, entityName, singularName)
      
      // Download the XML file
      const blob = new Blob([xml], { type: "text/xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${entity}_export_${Date.now()}.xml`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      addOperation({
        type: "export",
        entity: entity,
        status: "success",
        timestamp,
        records: data.length
      })
    } catch (error) {
      console.error("Export failed:", error)
      addOperation({
        type: "export",
        entity: entity,
        status: "error",
        timestamp,
        records: 0,
        message: error instanceof Error ? error.message : "Export failed"
      })
    } finally {
      setExportLoading(null)
    }
  }

  const handleImport = async () => {
    if (!xmlInput.trim()) {
      alert("Please enter XML content to import")
      return
    }

    setLoading(true)
    const timestamp = new Date().toLocaleString()

    try {
      let result: any

      switch (selectedEntity) {
        case "tours":
          result = await importToursXML(xmlInput)
          break
        case "vehicles":
          result = await importVehiclesXML(xmlInput)
          break
        case "agents":
          result = await importAgentsXML(xmlInput)
          break
        case "collection-points":
          result = await importCollectionPointsXML(xmlInput)
          break
      }

      if (result.success) {
        addOperation({
          type: "import",
          entity: selectedEntity,
          status: "success",
          timestamp,
          records: result.count || 1
        })
        setXmlInput("")
        alert(`Successfully imported ${result.count || 1} ${selectedEntity}`)
      } else {
        addOperation({
          type: "import",
          entity: selectedEntity,
          status: "error",
          timestamp,
          records: 0,
          message: result.error || "Import failed"
        })
        alert(`Import failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Import failed:", error)
      addOperation({
        type: "import",
        entity: selectedEntity,
        status: "error",
        timestamp,
        records: 0,
        message: error instanceof Error ? error.message : "Import failed"
      })
      alert(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const addOperation = (op: Omit<XMLOperation, "id">) => {
    setOperations(prev => [
      { ...op, id: Date.now() },
      ...prev.slice(0, 9) // Keep last 10 operations
    ])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setXmlInput(content)
      }
      reader.readAsText(file)
    }
  }

  const getEntityDisplayName = (entity: string): string => {
    switch (entity) {
      case "tours": return "Tours"
      case "vehicles": return "Vehicles"
      case "agents": return "Agents"
      case "collection-points": return "Collection Points"
      default: return entity
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">XML Data Manager</h1>
        <p className="text-foreground/60">Import/Export XML files for system data</p>
      </div>

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Export data entities as XML files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {(["tours", "vehicles", "agents", "collection-points"] as EntityType[]).map((entity) => (
              <Button
                key={entity}
                variant="outline"
                onClick={() => handleExport(entity)}
                disabled={exportLoading === entity}
                className="flex items-center justify-center gap-2"
              >
                {exportLoading === entity ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {getEntityDisplayName(entity)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* XML Import */}
      <Card>
        <CardHeader>
          <CardTitle>Import XML Data</CardTitle>
          <CardDescription>Paste or upload XML content to import data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Entity Type</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value as EntityType)}
            >
              <option value="tours">Tours</option>
              <option value="vehicles">Vehicles</option>
              <option value="agents">Agents</option>
              <option value="collection-points">Collection Points</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">XML Content</label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-sm text-primary hover:underline">Upload XML file</span>
              </label>
            </div>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={10}
              placeholder={`<?xml version="1.0" encoding="UTF-8"?>
<tours>
  <tour>
    <id>TOUR-001</id>
    <name>Route Name</name>
    <status>pending</status>
    ...
  </tour>
</tours>`}
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={loading || !xmlInput.trim()}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Import Data
            </Button>
            <Button variant="outline" onClick={() => setXmlInput("")}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operation History */}
      <Card>
        <CardHeader>
          <CardTitle>Operation History</CardTitle>
          <CardDescription>Recent import/export operations</CardDescription>
        </CardHeader>
        <CardContent>
          {operations.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">
              No operations yet. Export or import data to see history.
            </div>
          ) : (
            <div className="space-y-3">
              {operations.map((op) => (
                <div key={op.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        op.type === "export" 
                          ? "bg-blue-100 dark:bg-blue-900" 
                          : "bg-green-100 dark:bg-green-900"
                      }`}
                    >
                      {op.type === "export" ? (
                        <Download className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Upload className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {op.type === "export" ? "Export" : "Import"}: {getEntityDisplayName(op.entity)}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {op.timestamp} • {op.records} records
                        {op.message && ` • ${op.message}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {op.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : op.status === "error" ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        op.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : op.status === "error"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {op.status.charAt(0).toUpperCase() + op.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
