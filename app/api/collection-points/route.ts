import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"
import { XMLValidator } from "@/lib/xml-validator"

const RESOURCE_NAME = "collection-points"
const SCHEMA_NAME = "CollectPoint"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Get single collection point
    if (id) {
      const result = await XMLStorage.read(RESOURCE_NAME, id)
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(result.data!)
      return NextResponse.json({
        success: true,
        data: jsonData.CollectPoint
      })
    }

    // Get all collection points
    const result = await XMLStorage.readAll(RESOURCE_NAME)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const collectionPoints = await Promise.all(
      result.data!.map(async (item) => {
        const jsonData = await XMLValidator.parseXMLToJSON(item.content)
        return jsonData.CollectPoint
      })
    )

    return NextResponse.json({
      success: true,
      data: collectionPoints,
      total: collectionPoints.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch collection points",
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
    if (!body.nameCP && !body.name) {
      return NextResponse.json(
        { success: false, error: "Missing required field: name" },
        { status: 400 }
      )
    }

    if (!body.latitudeGPS && !body.latitude) {
      return NextResponse.json(
        { success: false, error: "Missing required field: latitude" },
        { status: 400 }
      )
    }

    if (!body.longitudeGPS && !body.longitude) {
      return NextResponse.json(
        { success: false, error: "Missing required field: longitude" },
        { status: 400 }
      )
    }

    // Generate ID if not provided
    const id = body.idCP || body.id || uuidv4()

    // Check if already exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Collection point with this ID already exists" },
        { status: 409 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectionPointToXML({ ...body, id })

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
        message: "Collection point created successfully",
        data: jsonData.CollectPoint
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create collection point",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.idCP || body.id

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
        { success: false, error: "Collection point not found" },
        { status: 404 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectionPointToXML({ ...body, id })

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
      message: "Collection point updated successfully",
      data: jsonData.CollectPoint
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update collection point",
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
      message: "Collection point deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete collection point",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
