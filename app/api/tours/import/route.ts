import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLValidator } from "@/lib/xml-validator"
import { v4 as uuidv4 } from "uuid"

const RESOURCE_NAME = "tours"
const SCHEMA_NAME = "CollectTour"

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

    // Check if it's a single tour or collection of tours
    const isSingleTour = xmlContent.includes("<CollectTour")
    const isMultipleTours = xmlContent.includes("<CollectTours")

    if (!isSingleTour && !isMultipleTours) {
      return NextResponse.json(
        { success: false, error: "Invalid XML format. Expected CollectTour or CollectTours root element" },
        { status: 400 }
      )
    }

    const importedTours: any[] = []
    const errors: string[] = []

    if (isSingleTour) {
      // Single tour import
      const validation = XMLValidator.validate(xmlContent, SCHEMA_NAME)
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validation.errors },
          { status: 400 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const tour = jsonData.CollectTour
      const id = tour.idTour || uuidv4()

      // Check if exists
      const exists = await XMLStorage.exists(RESOURCE_NAME, id)
      if (exists) {
        return NextResponse.json(
          { success: false, error: `Tour with ID ${id} already exists` },
          { status: 409 }
        )
      }

      // Save tour
      const saveResult = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)
      if (saveResult.success) {
        importedTours.push({ ...tour, idTour: id })
      } else {
        errors.push(`Failed to save tour ${id}: ${saveResult.error}`)
      }
    } else {
      // Multiple tours import
      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const tours = Array.isArray(jsonData.CollectTours.CollectTour)
        ? jsonData.CollectTours.CollectTour
        : [jsonData.CollectTours.CollectTour]

      for (const tour of tours) {
        const id = tour.idTour || uuidv4()
        
        // Check if exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (exists) {
          errors.push(`Tour with ID ${id} already exists - skipped`)
          continue
        }

        // Create XML for this tour
        const singleTourXML = `<?xml version="1.0" encoding="utf-8"?>\n<CollectTour>${Object.entries(tour).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return `<${key}>${Object.entries(value).map(([k, v]) => `<${k}>${v}</${k}>`).join('')}</${key}>`
          }
          return `<${key}>${value}</${key}>`
        }).join('')}</CollectTour>`

        // Save tour
        const saveResult = await XMLStorage.save(RESOURCE_NAME, id, singleTourXML, SCHEMA_NAME)
        if (saveResult.success) {
          importedTours.push({ ...tour, idTour: id })
        } else {
          errors.push(`Failed to save tour ${id}: ${saveResult.error}`)
        }
      }
    }

    return NextResponse.json({
      success: importedTours.length > 0,
      message: `Successfully imported ${importedTours.length} tour(s)`,
      data: importedTours,
      count: importedTours.length,
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
