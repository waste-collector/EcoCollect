import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get("session_id")?.value

    if (sessionId) {
      // Delete the session from storage
      await AuthService.deleteSession(sessionId)
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    })

    // Clear session cookie
    response.cookies.set("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
