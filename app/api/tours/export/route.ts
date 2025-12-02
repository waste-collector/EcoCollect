import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tours } = body

    if (!Array.isArray(tours)) {
      return NextResponse.json({ success: false, error: "Tours array is required" }, { status: 400 })
    }

    const xmlContent = generateToursXML(tours)

    return NextResponse.json({
      success: true,
      message: "Tours exported successfully",
      xml: xmlContent,
      count: tours.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to export tours" }, { status: 500 })
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
  </tour>
    `,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<tours exportedAt="${new Date().toISOString()}">
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
