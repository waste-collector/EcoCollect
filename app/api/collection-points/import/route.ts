import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLValidator } from "@/lib/xml-validator"
import { XMLConverter } from "@/lib/xml-converter"
import { v4 as uuidv4 } from "uuid"

const RESOURCE_NAME = "collection-points"
const SCHEMA_NAME = "CollectPoint"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { xmlContent } = body

    if (!xmlContent) {
      return NextResponse.json(
        { success: false, error: "XML content is required" },
        { status: 400 }
      )
    }

    // Check if it's a single collection point or collection of points
    const isSinglePoint = xmlContent.includes("<CollectPoint") && !xmlContent.includes("<CollectPoints")
    const isMultiplePoints = xmlContent.includes("<CollectPoints") || xmlContent.includes("<collectionPoints")

    if (!isSinglePoint && !isMultiplePoints) {
      return NextResponse.json(
        { success: false, error: "Invalid XML format. Expected CollectPoint or CollectPoints root element" },
        { status: 400 }
      )
    }

    const importedPoints: any[] = []
    const errors: string[] = []

    if (isSinglePoint) {
      // Single collection point import
      const validation = XMLValidator.validate(xmlContent, SCHEMA_NAME)
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validation.errors },
          { status: 400 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const point = jsonData.CollectPoint
      const id = point.idCP || uuidv4()

      // Check if exists
      const exists = await XMLStorage.exists(RESOURCE_NAME, id)
      if (exists) {
        return NextResponse.json(
          { success: false, error: `Collection point with ID ${id} already exists` },
          { status: 409 }
        )
      }

      // Save collection point
      const saveResult = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)
      if (saveResult.success) {
        importedPoints.push({ ...point, idCP: id })
      } else {
        errors.push(`Failed to save collection point ${id}: ${saveResult.error}`)
      }
    } else {
      // Multiple collection points import
      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const pointsRoot = jsonData.CollectPoints || jsonData.collectionPoints
      let points = pointsRoot?.CollectPoint || pointsRoot?.collectionPoint
      
      if (!points) {
        return NextResponse.json(
          { success: false, error: "No collection points found in XML" },
          { status: 400 }
        )
      }

      points = Array.isArray(points) ? points : [points]

      for (const point of points) {
        const id = point.idCP || point.id || uuidv4()
        
        // Check if exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (exists) {
          errors.push(`Collection point with ID ${id} already exists - skipped`)
          continue
        }

        // Create XML for this collection point
        const singlePointXML = XMLConverter.collectionPointToXML({
          idCP: id,
          nameCP: point.nameCP || point.name,
          adressCP: point.adressCP || point.address || "",
          latitudeGPS: point.latitudeGPS || point.latitude,
          longitudeGPS: point.longitudeGPS || point.longitude,
          capacityCP: point.capacityCP || point.capacity || 500,
          fillLevel: point.fillLevel || 0,
          wasteType: point.wasteType || "mixed",
          priorityCP: point.priorityCP || point.priority || 1,
          lastCollectDate: point.lastCollectDate || new Date().toISOString().split("T")[0]
        })

        // Save collection point
        const saveResult = await XMLStorage.save(RESOURCE_NAME, id, singlePointXML, SCHEMA_NAME)
        if (saveResult.success) {
          importedPoints.push({ ...point, idCP: id })
        } else {
          errors.push(`Failed to save collection point ${id}: ${saveResult.error}`)
        }
      }
    }

    return NextResponse.json({
      success: importedPoints.length > 0,
      message: `Successfully imported ${importedPoints.length} collection point(s)`,
      data: importedPoints,
      count: importedPoints.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import XML",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
