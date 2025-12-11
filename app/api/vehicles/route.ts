import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"
import { XMLValidator } from "@/lib/xml-validator"

const RESOURCE_NAME = "vehicles"
const SCHEMA_NAME = "Vehicule"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        // Get single vehicle
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
                data: jsonData.Vehicule
            })
        }

        // Get all vehicles
        const result = await XMLStorage.readAll(RESOURCE_NAME)
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        const vehicles = await Promise.all(
            result.data!.map(async (item) => {
                const jsonData = await XMLValidator.parseXMLToJSON(item.content)
                return jsonData.Vehicule
            })
        )

        return NextResponse.json({
            success: true,
            data: vehicles,
            total: vehicles.length
        })
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to fetch vehicles",
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
        if (!body.immatV && !body.id && !body.immat) {
            return NextResponse.json(
                { success: false, error: "Missing required field: immat (vehicle registration)" },
                { status: 400 }
            )
        }

        if (!body.typeV && !body.type) {
            return NextResponse.json(
                { success: false, error: "Missing required field: type" },
                { status: 400 }
            )
        }

        // Use immat as ID
        const id = body.immatV || body.id || body.immat

        // Check if already exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (exists) {
            return NextResponse.json(
                { success: false, error: "Vehicle with this registration already exists" },
                { status: 409 }
            )
        }

        // Convert JSON to XML using XSD field names
        const xmlContent = XMLConverter.vehiculeToXML({
            immatV: id,
            typeV: body.typeV || body.type,
            capacityV: body.capacityV || body.capacity,
            stateV: body.stateV || body.state || "operational",
            fuelLevelV: body.fuelLevelV || body.fuelLevel || 100,
            typeFuelV: body.typeFuelV || body.fuelType || "Diesel",
            emissionCO2: body.emissionCO2 || 0,
            dateLastMaintenance: body.dateLastMaintenance || new Date().toISOString().split("T")[0]
        })

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
                message: "Vehicle created successfully",
                data: jsonData.Vehicule
            },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to create vehicle",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const id = body.immatV || body.id || body.immat

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing required field: immat" },
                { status: 400 }
            )
        }

        // Check if exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (!exists) {
            return NextResponse.json(
                { success: false, error: "Vehicle not found" },
                { status: 404 }
            )
        }

        // Convert JSON to XML using XSD field names
        const xmlContent = XMLConverter.vehiculeToXML({
            immatV: id,
            typeV: body.typeV || body.type,
            capacityV: body.capacityV || body.capacity,
            stateV: body.stateV || body.state || "operational",
            fuelLevelV: body.fuelLevelV || body.fuelLevel || 100,
            typeFuelV: body.typeFuelV || body.fuelType || "Diesel",
            emissionCO2: body.emissionCO2 || 0,
            dateLastMaintenance: body.dateLastMaintenance || new Date().toISOString().split("T")[0]
        })

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
            message: "Vehicle updated successfully",
            data: jsonData.Vehicule
        })
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to update vehicle",
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
        console.log("Delete", "ID", id, "result", result)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Vehicle deleted successfully"
        })
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to delete vehicle",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}
