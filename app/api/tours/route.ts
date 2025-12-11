import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"
import { XMLValidator } from "@/lib/xml-validator"

const RESOURCE_NAME = "tours"
const SCHEMA_NAME = "CollectTour"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const format = searchParams.get("format") || "json"

    // Get single tour
    if (id) {
      const result = await XMLStorage.read(RESOURCE_NAME, id)
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        )
      }

      if (format === "xml") {
        return new NextResponse(result.data, {
          headers: { "Content-Type": "application/xml" }
        })
      }

      const jsonData = await XMLValidator.parseXMLToJSON(result.data!)
      return NextResponse.json({
        success: true,
        data: jsonData.CollectTour
      })
    }

    // Get all tours
    const result = await XMLStorage.readAll(RESOURCE_NAME)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    if (format === "xml") {
      // Return all tours as XML collection
      const toursXML = result.data!.map(item => item.content).join("\n")
      const wrappedXML = `<?xml version="1.0" encoding="utf-8"?>\n<CollectTours>\n${toursXML}\n</CollectTours>`
      return new NextResponse(wrappedXML, {
        headers: { "Content-Type": "application/xml" }
      })
    }

    const tours = await Promise.all(
      result.data!.map(async (item) => {
        const jsonData = await XMLValidator.parseXMLToJSON(item.content)
        return jsonData.CollectTour
      })
    )

    return NextResponse.json({
      success: true,
      data: tours,
      total: tours.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch tours",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.dateTour && !body.date) {
      return NextResponse.json(
        { success: false, error: "Missing required field: date" },
        { status: 400 }
      )
    }

    // Generate ID if not provided
    const id = body.idTour || body.id || uuidv4()

    // Check if already exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Tour with this ID already exists" },
        { status: 409 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectTourToXML({ ...body, id })

    // Save to storage (includes validation)
    const result = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Parse back to JSON for response
    const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)

    return NextResponse.json(
      {
        success: true,
        message: "Tour created successfully",
        data: jsonData.CollectTour
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create tour",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.idTour || body.id

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required field: id" },
        { status: 400 }
      )
    }

    // Check if exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (!exists) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectTourToXML({ ...body, id })

    // Update in storage (includes validation)
    const result = await XMLStorage.update(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Parse back to JSON for response
    const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)

    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
      data: jsonData.CollectTour
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update tour",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: id" },
        { status: 400 }
      )
    }

    const result = await XMLStorage.delete(RESOURCE_NAME, id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete tour",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
