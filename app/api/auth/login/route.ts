import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            console.log("NOT FOUND ")
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            )
        }

        const result = await AuthService.login(email, password)
        console.log(result)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 401 }
            )
        }

        // Create response with session cookie
        const response = NextResponse.json({
            success: true,
            user: result.user,
            session: {
                sessionId: result.session?.sessionId,
                expiresAt: result.session?.expiresAt
            }
        })

        // Set session cookie
        response.cookies.set("session_id", result.session!.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60, // 24 hours
            path: "/"
        })

        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}
