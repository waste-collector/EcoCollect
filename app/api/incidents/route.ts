import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"
import { XMLValidator } from "@/lib/xml-validator"

const RESOURCE_NAME = "incidents"
const SCHEMA_NAME = "IncidentReport"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Get single incident report
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
        data: jsonData.IncidentReport
      })
    }

    // Get all incident reports
    const result = await XMLStorage.readAll(RESOURCE_NAME)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const incidents = await Promise.all(
      result.data!.map(async (item) => {
        const jsonData = await XMLValidator.parseXMLToJSON(item.content)
        return jsonData.IncidentReport
      })
    )

    return NextResponse.json({
      success: true,
      data: incidents,
      total: incidents.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch incident reports",
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
    if (!body.typeIR && !body.type) {
      return NextResponse.json(
        { success: false, error: "Missing required field: type" },
        { status: 400 }
      )
    }

    if (!body.descIR && !body.description) {
      return NextResponse.json(
        { success: false, error: "Missing required field: description" },
        { status: 400 }
      )
    }

    // Generate ID if not provided
    const id = body.idIR || body.id || uuidv4()

    // Check if already exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Incident report with this ID already exists" },
        { status: 409 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.incidentReportToXML({ ...body, id })

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
        message: "Incident report created successfully",
        data: jsonData.IncidentReport
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create incident report",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.idIR || body.id

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
        { success: false, error: "Incident report not found" },
        { status: 404 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.incidentReportToXML({ ...body, id })

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
      message: "Incident report updated successfully",
      data: jsonData.IncidentReport
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update incident report",
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
      message: "Incident report deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete incident report",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
