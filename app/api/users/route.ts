import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

// Helper to get current user from session
async function getCurrentUser(request: NextRequest) {
  let sessionId = request.cookies.get("session_id")?.value
  if (!sessionId) {
    const authHeader = request.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7)
    }
  }
  if (!sessionId) return null
  
  const result = await AuthService.validateSession(sessionId)
  return result.valid ? result.user : null
}

// GET /api/users - Get all users (admin only) or current user profile
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    // If specific user ID is requested
    if (userId) {
      // Users can only view their own profile, admins can view any
      if (currentUser.idUser !== userId && currentUser.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Access denied" },
          { status: 403 }
        )
      }

      const user = await AuthService.findUserById(userId)
      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      }

      // Don't expose password
      const { pwdU, ...safeUser } = user
      return NextResponse.json({ success: true, data: { ...safeUser, pwdU: "" } })
    }

    // If admin, return all users
    if (currentUser.role === "admin") {
      const users = await AuthService.getAllUsers()
      return NextResponse.json({ success: true, data: users })
    }

    // Otherwise return current user's profile
    const { pwdU, ...safeUser } = currentUser
    return NextResponse.json({ success: true, data: { ...safeUser, pwdU: "" } })
  } catch (error) {
    console.error("Users GET error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    // Determine which user to update
    const targetUserId = id || currentUser.idUser

    // Only admins can update other users
    if (targetUserId !== currentUser.idUser && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      )
    }

    // Prevent role escalation by non-admins
    if (updates.role && currentUser.role !== "admin") {
      delete updates.role
    }

    const result = await AuthService.updateUser(targetUserId, updates)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: result.user })
  } catch (error) {
    console.error("Users PUT error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Only admins can delete users (or users can delete themselves)
    if (userId !== currentUser.idUser && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      )
    }

    const result = await AuthService.deleteUser(userId)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Users DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
