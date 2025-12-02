import { type NextRequest, NextResponse } from "next/server"

// In-memory storage reference
const toursData: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tour = toursData.find((t) => t.id === params.id)

    if (!tour) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: tour,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tour" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const index = toursData.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    const updatedTour = {
      ...toursData[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    toursData[index] = updatedTour

    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update tour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const index = toursData.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 })
    }

    const deletedTour = toursData.splice(index, 1)[0]

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
      data: deletedTour,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete tour" }, { status: 500 })
  }
}
