import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (would be database in production)
const toursData: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    if (format === "xml") {
      // Generate XML response
      const xmlContent = generateToursXML(toursData)
      return new NextResponse(xmlContent, {
        headers: { "Content-Type": "application/xml" },
      })
    }

    // JSON response
    return NextResponse.json({
      success: true,
      data: toursData,
      total: toursData.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tours" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.zone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newTour = {
      id: `TOUR-${String(toursData.length + 1).padStart(3, "0")}`,
      name: body.name,
      zone: body.zone,
      agent: body.agent,
      vehicle: body.vehicle,
      distance: body.distance,
      duration: body.duration || "2h 0m",
      status: body.status || "pending",
      date: body.date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }

    toursData.push(newTour)

    return NextResponse.json(
      {
        success: true,
        message: "Tour created successfully",
        data: newTour,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create tour" }, { status: 500 })
  }
}

function generateToursXML(tours: any[]): string {
  const tourElements = tours
    .map(
      (tour) => `
  <tour>
    <id>${tour.id}</id>
    <name>${escapeXML(tour.name)}</name>
    <zone>${escapeXML(tour.zone)}</zone>
    <agent>${escapeXML(tour.agent)}</agent>
    <vehicle>${tour.vehicle}</vehicle>
    <distance>${tour.distance}</distance>
    <duration>${tour.duration}</duration>
    <status>${tour.status}</status>
    <date>${tour.date}</date>
    <createdAt>${tour.createdAt}</createdAt>
  </tour>
    `,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<tours>
${tourElements}
</tours>`
}

function escapeXML(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}
