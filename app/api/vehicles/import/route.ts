import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLValidator } from "@/lib/xml-validator"
import { XMLConverter } from "@/lib/xml-converter"

const RESOURCE_NAME = "vehicles"
const SCHEMA_NAME = "Vehicule"

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

    // Check if it's a single vehicle or collection of vehicles
    const isSingleVehicle = xmlContent.includes("<Vehicule") && !xmlContent.includes("<Vehicules")
    const isMultipleVehicles = xmlContent.includes("<Vehicules") || xmlContent.includes("<vehicles")

    if (!isSingleVehicle && !isMultipleVehicles) {
      return NextResponse.json(
        { success: false, error: "Invalid XML format. Expected Vehicule or Vehicules root element" },
        { status: 400 }
      )
    }

    const importedVehicles: any[] = []
    const errors: string[] = []

    if (isSingleVehicle) {
      // Single vehicle import
      const validation = XMLValidator.validate(xmlContent, SCHEMA_NAME)
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validation.errors },
          { status: 400 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const vehicle = jsonData.Vehicule
      const id = vehicle.immatV

      if (!id) {
        return NextResponse.json(
          { success: false, error: "Vehicle registration (immatV) is required" },
          { status: 400 }
        )
      }

      // Check if exists
      const exists = await XMLStorage.exists(RESOURCE_NAME, id)
      if (exists) {
        return NextResponse.json(
          { success: false, error: `Vehicle with registration ${id} already exists` },
          { status: 409 }
        )
      }

      // Save vehicle
      const saveResult = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)
      if (saveResult.success) {
        importedVehicles.push({ ...vehicle, immatV: id })
      } else {
        errors.push(`Failed to save vehicle ${id}: ${saveResult.error}`)
      }
    } else {
      // Multiple vehicles import
      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const vehiclesRoot = jsonData.Vehicules || jsonData.vehicles
      let vehicles = vehiclesRoot?.Vehicule || vehiclesRoot?.vehicle
      
      if (!vehicles) {
        return NextResponse.json(
          { success: false, error: "No vehicles found in XML" },
          { status: 400 }
        )
      }

      vehicles = Array.isArray(vehicles) ? vehicles : [vehicles]

      for (const vehicle of vehicles) {
        const id = vehicle.immatV || vehicle.id || vehicle.immat
        
        if (!id) {
          errors.push("Vehicle missing registration number - skipped")
          continue
        }

        // Check if exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (exists) {
          errors.push(`Vehicle with registration ${id} already exists - skipped`)
          continue
        }

        // Create XML for this vehicle
        const singleVehicleXML = XMLConverter.vehiculeToXML({
          immatV: id,
          typeV: vehicle.typeV || vehicle.type,
          capacityV: vehicle.capacityV || vehicle.capacity,
          stateV: vehicle.stateV || vehicle.state || "operational",
          fuelLevelV: vehicle.fuelLevelV || vehicle.fuelLevel || 100,
          typeFuelV: vehicle.typeFuelV || vehicle.fuelType || "Diesel",
          emissionCO2: vehicle.emissionCO2 || 0,
          dateLastMaintenance: vehicle.dateLastMaintenance || new Date().toISOString().split("T")[0]
        })

        // Save vehicle
        const saveResult = await XMLStorage.save(RESOURCE_NAME, id, singleVehicleXML, SCHEMA_NAME)
        if (saveResult.success) {
          importedVehicles.push({ ...vehicle, immatV: id })
        } else {
          errors.push(`Failed to save vehicle ${id}: ${saveResult.error}`)
        }
      }
    }

    return NextResponse.json({
      success: importedVehicles.length > 0,
      message: `Successfully imported ${importedVehicles.length} vehicle(s)`,
      data: importedVehicles,
      count: importedVehicles.length,
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
