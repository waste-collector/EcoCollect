import { type NextRequest, NextResponse } from "next/server"

const agentsData: any[] = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    zone: "Downtown District",
    toursCompleted: 48,
    status: "active",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    zone: "Residential Area A",
    toursCompleted: 52,
    status: "active",
    email: "sarah@example.com",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zone = searchParams.get("zone")

    let filtered = agentsData

    if (zone) {
      filtered = agentsData.filter((a) => a.zone === zone)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.zone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newAgent = {
      id: Math.max(...agentsData.map((a) => a.id), 0) + 1,
      name: body.name,
      phone: body.phone || "",
      zone: body.zone,
      toursCompleted: 0,
      status: body.status || "active",
      email: body.email,
    }

    agentsData.push(newAgent)

    return NextResponse.json(
      {
        success: true,
        message: "Agent created successfully",
        data: newAgent,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 })
  }
}
