import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { xmlContent } = body

    if (!xmlContent) {
      return NextResponse.json({ success: false, error: "XML content is required" }, { status: 400 })
    }

    // Parse XML content
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml")

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      return NextResponse.json({ success: false, error: "Invalid XML format" }, { status: 400 })
    }

    const tourElements = xmlDoc.getElementsByTagName("tour")
    const importedTours = Array.from(tourElements).map((el) => ({
      id: el.getElementsByTagName("id")[0]?.textContent || "",
      name: el.getElementsByTagName("name")[0]?.textContent || "",
      zone: el.getElementsByTagName("zone")[0]?.textContent || "",
      agent: el.getElementsByTagName("agent")[0]?.textContent || "",
      vehicle: el.getElementsByTagName("vehicle")[0]?.textContent || "",
      distance: Number.parseFloat(el.getElementsByTagName("distance")[0]?.textContent || "0"),
      duration: el.getElementsByTagName("duration")[0]?.textContent || "",
      status: el.getElementsByTagName("status")[0]?.textContent || "pending",
      date: el.getElementsByTagName("date")[0]?.textContent || "",
      importedAt: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedTours.length} tours`,
      data: importedTours,
      count: importedTours.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to import XML: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
