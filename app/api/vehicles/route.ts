import { type NextRequest, NextResponse } from "next/server"

const vehiclesData: any[] = [
  {
    id: "V-001",
    model: "Mercedes Actros",
    fuel: "Diesel",
    status: "operational",
    utilization: 92,
    emissions: 2.4,
    capacity: 25000,
    currentLoad: 18500,
  },
  {
    id: "V-002",
    model: "Volvo FH16",
    fuel: "Diesel",
    status: "operational",
    utilization: 88,
    emissions: 2.6,
    capacity: 22000,
    currentLoad: 19360,
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: vehiclesData,
      total: vehiclesData.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id || !body.model) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newVehicle = {
      id: body.id,
      model: body.model,
      fuel: body.fuel || "Diesel",
      status: body.status || "operational",
      utilization: body.utilization || 0,
      emissions: body.emissions || 0,
      capacity: body.capacity || 20000,
      currentLoad: body.currentLoad || 0,
    }

    vehiclesData.push(newVehicle)

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle created successfully",
        data: newVehicle,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create vehicle" }, { status: 500 })
  }
}
