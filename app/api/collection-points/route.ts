import { type NextRequest, NextResponse } from "next/server"

const collectionPointsData: any[] = [
  {
    id: 1,
    name: "Main Street Collection",
    zone: "Downtown District",
    latitude: 40.7128,
    longitude: -74.006,
    capacity: 100,
    fillLevel: 95,
    status: "full",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Park Avenue Point",
    zone: "Downtown District",
    latitude: 40.7135,
    longitude: -74.0022,
    capacity: 100,
    fillLevel: 60,
    status: "partial",
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zone = searchParams.get("zone")

    let filtered = collectionPointsData

    if (zone) {
      filtered = collectionPointsData.filter((p) => p.zone === zone)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch collection points" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.zone || !body.latitude || !body.longitude) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newPoint = {
      id: Math.max(...collectionPointsData.map((p) => p.id), 0) + 1,
      name: body.name,
      zone: body.zone,
      latitude: body.latitude,
      longitude: body.longitude,
      capacity: body.capacity || 100,
      fillLevel: body.fillLevel || 0,
      status: body.fillLevel === 0 ? "empty" : body.fillLevel > 90 ? "full" : "partial",
      lastUpdated: new Date().toISOString(),
    }

    collectionPointsData.push(newPoint)

    return NextResponse.json(
      {
        success: true,
        message: "Collection point created successfully",
        data: newPoint,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create collection point" }, { status: 500 })
  }
}
