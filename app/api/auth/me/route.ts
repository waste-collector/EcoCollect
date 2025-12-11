import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie or Authorization header
    let sessionId = request.cookies.get("session_id")?.value

    // Also check Authorization header for API clients
    if (!sessionId) {
      const authHeader = request.headers.get("Authorization")
      if (authHeader?.startsWith("Bearer ")) {
        sessionId = authHeader.substring(7)
      }
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    const result = await AuthService.validateSession(sessionId)

    if (!result.valid) {
      const response = NextResponse.json(
        { success: false, error: result.error || "Invalid session" },
        { status: 401 }
      )
      
      // Clear invalid cookie
      response.cookies.set("session_id", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      })

      return response
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      session: {
        sessionId: result.session?.sessionId,
        expiresAt: result.session?.expiresAt
      }
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
