import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"

const RESOURCE_NAME = "collection-points"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get("ids")?.split(",")

    let pointsToExport: { id: string, content: string }[] = []

    if (ids && ids.length > 0) {
      // Export specific collection points
      for (const id of ids) {
        const result = await XMLStorage.read(RESOURCE_NAME, id)
        if (result.success) {
          pointsToExport.push({ id, content: result.data! })
        }
      }
    } else {
      // Export all collection points
      const result = await XMLStorage.readAll(RESOURCE_NAME)
      if (result.success) {
        pointsToExport = result.data!
      }
    }

    if (pointsToExport.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No collection points found to export"
      }, { status: 404 })
    }

    // Generate XML collection
    const pointXMLs = pointsToExport.map(p => p.content.replace(/<\?xml[^?]*\?>/g, "").trim()).join("\n  ")
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<CollectPoints exportedAt="${new Date().toISOString()}">
  ${pointXMLs}
</CollectPoints>`

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="collection-points-export-${Date.now()}.xml"`
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export collection points",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    let pointsToExport: { id: string, content: string }[] = []

    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Export specific collection points
      for (const id of ids) {
        const result = await XMLStorage.read(RESOURCE_NAME, id)
        if (result.success) {
          pointsToExport.push({ id, content: result.data! })
        }
      }
    } else {
      // Export all collection points
      const result = await XMLStorage.readAll(RESOURCE_NAME)
      if (result.success) {
        pointsToExport = result.data!
      }
    }

    if (pointsToExport.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No collection points found to export"
      }, { status: 404 })
    }

    // Generate XML collection
    const pointXMLs = pointsToExport.map(p => p.content.replace(/<\?xml[^?]*\?>/g, "").trim()).join("\n  ")
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<CollectPoints exportedAt="${new Date().toISOString()}">
  ${pointXMLs}
</CollectPoints>`

    return NextResponse.json({
      success: true,
      message: `Successfully exported ${pointsToExport.length} collection point(s)`,
      xml: xmlContent,
      count: pointsToExport.length
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export collection points",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
