import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, userType, address, phone, zone } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Determine role (default to citizen for self-registration)
    // Agents and admins should be created by admin only
    const role = userType === "citizen" ? "citizen" : userType || "citizen"

    // For agent/admin registration, we could add admin verification here
    // For now, allowing all registrations for demo purposes

    const userData: any = {
      emailU: email,
      nameU: name,
      pwdU: password,
      role
    }

    // Add role-specific fields
    if (role === "citizen") {
      userData.adressCit = address || ""
      userData.phoneCit = phone || ""
      userData.zoneCit = zone || "Downtown District"
    } else if (role === "agent") {
      userData.telEmp = phone || ""
      userData.disponibility = true
      userData.roleAgent = "collector"
      userData.salaryEmp = 0
      userData.recruitmentDateEmp = new Date().toISOString().split("T")[0]
    } else if (role === "admin") {
      userData.telEmp = phone || ""
      userData.functionAdmin = "Administrator"
      userData.salaryEmp = 0
      userData.recruitmentDateEmp = new Date().toISOString().split("T")[0]
    }

    const result = await AuthService.createUser(userData)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: "Account created successfully"
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
