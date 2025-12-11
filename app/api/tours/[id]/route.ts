import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await XMLStorage.read("tours", id)

    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    const tour = await XMLConverter.collectTourFromXML(result.data)

    return NextResponse.json({
      success: true,
      data: tour,
    })
  } catch (error) {
    console.error("Tour GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tour" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if tour exists
    const existing = await XMLStorage.read("tours", id)
    if (!existing.success) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    // Parse existing tour and merge with updates
    const existingTour = await XMLConverter.collectTourFromXML(existing.data!)
    const updatedTour = {
      ...existingTour,
      ...body,
      idTour: id, // Ensure ID doesn't change
    }

    // Convert to XML and save
    const xml = XMLConverter.collectTourToXML(updatedTour)
    const saveResult = await XMLStorage.save("tours", id, xml, "CollectTour")

    if (!saveResult.success) {
      return NextResponse.json({ success: false, error: saveResult.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    })
  } catch (error) {
    console.error("Tour PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update tour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check if tour exists
    const existing = await XMLStorage.read("tours", id)
    if (!existing.success) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    const deletedTour = await XMLConverter.collectTourFromXML(existing.data!)

    // Delete the tour
    const deleteResult = await XMLStorage.delete("tours", id)

    if (!deleteResult.success) {
      return NextResponse.json({ success: false, error: deleteResult.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
      data: deletedTour,
    })
  } catch (error) {
    console.error("Tour DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete tour" }, { status: 500 })
  }
}
