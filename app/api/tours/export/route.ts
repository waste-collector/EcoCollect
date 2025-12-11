import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"

const RESOURCE_NAME = "tours"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get("ids")?.split(",")

    let toursToExport: { id: string, content: string }[] = []

    if (ids && ids.length > 0) {
      // Export specific tours
      for (const id of ids) {
        const result = await XMLStorage.read(RESOURCE_NAME, id)
        if (result.success) {
          toursToExport.push({ id, content: result.data! })
        }
      }
    } else {
      // Export all tours
      const result = await XMLStorage.readAll(RESOURCE_NAME)
      if (result.success) {
        toursToExport = result.data!
      }
    }

    if (toursToExport.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No tours found to export"
      }, { status: 404 })
    }

    // Generate XML collection
    const tourXMLs = toursToExport.map(t => t.content.replace(/<\?xml[^?]*\?>/g, "").trim()).join("\n  ")
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<CollectTours exportedAt="${new Date().toISOString()}">
  ${tourXMLs}
</CollectTours>`

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="tours-export-${Date.now()}.xml"`
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export tours",
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

    let toursToExport: { id: string, content: string }[] = []

    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Export specific tours
      for (const id of ids) {
        const result = await XMLStorage.read(RESOURCE_NAME, id)
        if (result.success) {
          toursToExport.push({ id, content: result.data! })
        }
      }
    } else {
      // Export all tours
      const result = await XMLStorage.readAll(RESOURCE_NAME)
      if (result.success) {
        toursToExport = result.data!
      }
    }

    if (toursToExport.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No tours found to export"
      }, { status: 404 })
    }

    // Generate XML collection
    const tourXMLs = toursToExport.map(t => t.content.replace(/<\?xml[^?]*\?>/g, "").trim()).join("\n  ")
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<CollectTours exportedAt="${new Date().toISOString()}">
  ${tourXMLs}
</CollectTours>`

    return NextResponse.json({
      success: true,
      message: `Successfully exported ${toursToExport.length} tour(s)`,
      xml: xmlContent,
      count: toursToExport.length
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export tours",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
