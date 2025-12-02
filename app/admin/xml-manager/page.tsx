"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

interface XMLOperation {
  id: number
  type: "import" | "export"
  entity: string
  status: "success" | "pending" | "error"
  timestamp: string
  records: number
}

const operations: XMLOperation[] = [
  { id: 1, type: "export", entity: "Tours", status: "success", timestamp: "2025-12-02 10:30", records: 25 },
  { id: 2, type: "import", entity: "Vehicles", status: "success", timestamp: "2025-12-02 09:15", records: 6 },
  {
    id: 3,
    type: "export",
    entity: "Collection Points",
    status: "success",
    timestamp: "2025-12-01 16:45",
    records: 156,
  },
  { id: 4, type: "import", entity: "Agents", status: "error", timestamp: "2025-12-01 14:20", records: 0 },
]

export default function XMLManagerPage() {
  const [xmlInput, setXmlInput] = useState("")
  const [selectedEntity, setSelectedEntity] = useState("tours")

  const handleExport = (entity: string) => {
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<${entity}>
  <${entity.slice(0, -1)}>
    <id>1</id>
    <name>Sample ${entity}</name>
    <status>active</status>
  </${entity.slice(0, -1)}>
</${entity}>`

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(sampleXML))
    element.setAttribute("download", `${entity}_export.xml`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">XML Data Manager</h1>
        <p className="text-foreground/60">Import/Export XML files for system data</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Export data entities as XML files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {["Tours", "Vehicles", "Agents", "Collection Points"].map((entity) => (
              <Button
                key={entity}
                variant="outline"
                onClick={() => handleExport(entity.toLowerCase())}
                className="flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {entity}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* XML Editor */}
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
              onChange={(e) => setSelectedEntity(e.target.value)}
            >
              <option value="tours">Tours</option>
              <option value="vehicles">Vehicles</option>
              <option value="agents">Agents</option>
              <option value="collection-points">Collection Points</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">XML Content</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={8}
              placeholder='<?xml version="1.0" encoding="UTF-8"?>
<tours>
  <tour>
    <id>TOUR-001</id>
    <name>Route Name</name>
    ...
  </tour>
</tours>'
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => alert("XML import would process: " + selectedEntity)}>
              <Upload className="w-4 h-4 mr-2" />
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
          <div className="space-y-3">
            {operations.map((op) => (
              <div key={op.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${op.type === "export" ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900"}`}
                  >
                    {op.type === "export" ? (
                      <Download className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Upload className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {op.type === "export" ? "Export" : "Import"}: {op.entity}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {op.timestamp} • {op.records} records
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${op.status === "success" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : op.status === "error" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"}`}
                >
                  {op.status.charAt(0).toUpperCase() + op.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
