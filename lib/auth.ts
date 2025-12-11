import { XMLStorage } from "./xml-storage"
import { XMLConverter } from "./xml-converter"
import { XMLValidator } from "./xml-validator"
import { randomUUID } from "crypto"

// Simple hash function for passwords (for demo/college project)
// In production, use bcrypt or argon2
export function hashPassword(password: string): string {
    // Simple hash using base64 encoding with a salt prefix
    const salt = "ecocollect_salt_"
    const combined = salt + password
    return Buffer.from(combined).toString("base64")
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
    console.log(password, hashedPassword)
    if (password === hashedPassword) return true
    const salt = "ecocollect_salt_"
    const combined = salt + password
    const hash = Buffer.from(combined).toString("base64")
    return hash === hashedPassword
}

export function generateSessionToken(): string {
    return randomUUID()
}

export function generateUserId(): string {
    return `user_${randomUUID().replace(/-/g, "").substring(0, 12)}`
}

// Session duration: 24 hours
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

export interface UserData {
    idUser: string
    emailU: string
    nameU: string
    pwdU: string
    role: "citizen" | "agent" | "admin"
    // Citizen fields
    adressCit?: string
    phoneCit?: string
    zoneCit?: string
    // Employee fields (agent/admin)
    recruitmentDateEmp?: string
    salaryEmp?: number
    telEmp?: string
    // Agent specific
    disponibility?: boolean
    roleAgent?: string
    // Admin specific
    functionAdmin?: string
    // Timestamps
    createdAt?: string
    updatedAt?: string
}

export interface SessionData {
    sessionId: string
    userId: string
    userRole: string
    createdAt: string
    expiresAt: string
}

export class AuthService {
    private static USERS_RESOURCE = "users"
    private static SESSIONS_RESOURCE = "sessions"

    /**
     * Find user by email
     */
    static async findUserByEmail(email: string): Promise<UserData | null> {
        const result = await XMLStorage.readAll(this.USERS_RESOURCE)
        if (!result.success || !result.data) return null

        for (const file of result.data) {
            try {
                const parsed = await XMLValidator.parseXMLToJSON(file.content)
                // Handle different root elements based on user type
                const userData = parsed.User || parsed.Citizen || parsed.Administrator || parsed.CollectAgent
                if (userData && userData.emailU === email) {
                    return {
                        idUser: userData.idUser,
                        emailU: userData.emailU,
                        nameU: userData.nameU,
                        pwdU: userData.pwdU,
                        role: userData.role,
                        adressCit: userData.adressCit,
                        phoneCit: userData.phoneCit,
                        zoneCit: userData.zoneCit,
                        recruitmentDateEmp: userData.recruitmentDateEmp,
                        salaryEmp: userData.salaryEmp,
                        telEmp: userData.telEmp,
                        disponibility: userData.disponibility,
                        roleAgent: userData.roleAgent,
                        functionAdmin: userData.functionAdmin,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt
                    }
                }
            } catch (e) {
                // Skip invalid files
                continue
            }
        }
        return null
    }

    /**
     * Find user by ID
     */
    static async findUserById(userId: string): Promise<UserData | null> {
        const result = await XMLStorage.read(this.USERS_RESOURCE, userId)
        if (!result.success || !result.data) return null

        try {
            const parsed = await XMLValidator.parseXMLToJSON(result.data)
            const userData = parsed.User || parsed.Citizen || parsed.Administrator || parsed.CollectAgent
            if (userData) {
                return {
                    idUser: userData.idUser,
                    emailU: userData.emailU,
                    nameU: userData.nameU,
                    pwdU: userData.pwdU,
                    role: userData.role,
                    adressCit: userData.adressCit,
                    phoneCit: userData.phoneCit,
                    zoneCit: userData.zoneCit,
                    recruitmentDateEmp: userData.recruitmentDateEmp,
                    salaryEmp: userData.salaryEmp,
                    telEmp: userData.telEmp,
                    disponibility: userData.disponibility,
                    roleAgent: userData.roleAgent,
                    functionAdmin: userData.functionAdmin,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt
                }
            }
        } catch (e) {
            return null
        }
        return null
    }

    /**
     * Create a new user
     */
    static async createUser(userData: Omit<UserData, "idUser" | "createdAt" | "updatedAt">): Promise<{ success: boolean; user?: UserData; error?: string }> {
        // Check if email already exists
        const existingUser = await this.findUserByEmail(userData.emailU)
        if (existingUser) {
            return { success: false, error: "Email already registered" }
        }

        const userId = generateUserId()
        const now = new Date().toISOString()
    
        const newUser: UserData = {
            ...userData,
            idUser: userId,
            pwdU: hashPassword(userData.pwdU),
            createdAt: now,
            updatedAt: now
        }

        // Determine schema based on role
        let schemaName: string
        let xml: string

        switch (userData.role) {
            case "citizen":
                schemaName = "Citizen"
                xml = XMLConverter.citizenToXML(newUser)
                break
            case "agent":
                schemaName = "CollectAgent"
                xml = XMLConverter.collectAgentToXML(newUser)
                break
            case "admin":
                schemaName = "Administrator"
                xml = XMLConverter.administratorToXML(newUser)
                break
            default:
                schemaName = "User"
                xml = XMLConverter.userToXML(newUser)
        }

        const result = await XMLStorage.save(this.USERS_RESOURCE, userId, xml, schemaName)
        if (!result.success) {
            return { success: false, error: result.error }
        }

        // Return user without password
        const { pwdU, ...safeUser } = newUser
        return { success: true, user: { ...safeUser, pwdU: "" } as UserData }
    }

    /**
     * Update user
     */
    static async updateUser(userId: string, updates: Partial<UserData>): Promise<{ success: boolean; user?: UserData; error?: string }> {
        const existingUser = await this.findUserById(userId)
        if (!existingUser) {
            return { success: false, error: "User not found" }
        }

        const updatedUser: UserData = {
            ...existingUser,
            ...updates,
            idUser: userId, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        }

        // If password is being updated, hash it
        if (updates.pwdU && updates.pwdU !== existingUser.pwdU) {
            updatedUser.pwdU = hashPassword(updates.pwdU)
        }

        let schemaName: string
        let xml: string

        switch (updatedUser.role) {
            case "citizen":
                schemaName = "Citizen"
                xml = XMLConverter.citizenToXML(updatedUser)
                break
            case "agent":
                schemaName = "CollectAgent"
                xml = XMLConverter.collectAgentToXML(updatedUser)
                break
            case "admin":
                schemaName = "Administrator"
                xml = XMLConverter.administratorToXML(updatedUser)
                break
            default:
                schemaName = "User"
                xml = XMLConverter.userToXML(updatedUser)
        }

        const result = await XMLStorage.save(this.USERS_RESOURCE, userId, xml, schemaName)
        if (!result.success) {
            return { success: false, error: result.error }
        }

        const { pwdU, ...safeUser } = updatedUser
        return { success: true, user: { ...safeUser, pwdU: "" } as UserData }
    }

    /**
     * Authenticate user and create session
     */
    static async login(email: string, password: string): Promise<{ success: boolean; session?: SessionData; user?: UserData; error?: string }> {
        const user = await this.findUserByEmail(email)
        console.log("User", user)
        if (!user) {
            return { success: false, error: "Invalid email or password" }
        }

        if (!verifyPassword(password, user.pwdU)) {
            return { success: false, error: "Invalid email or password" }
        }

        // Create session
        const session = await this.createSession(user.idUser, user.role)
        if (!session.success) {
            return { success: false, error: session.error }
        }

        // Return user without password
        const { pwdU, ...safeUser } = user
        return { 
            success: true, 
            session: session.session, 
            user: { ...safeUser, pwdU: "" } as UserData 
        }
    }

    /**
     * Create a new session
     */
    static async createSession(userId: string, userRole: string): Promise<{ success: boolean; session?: SessionData; error?: string }> {
        const sessionId = generateSessionToken()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS)

        const sessionData: SessionData = {
            sessionId,
            userId,
            userRole,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString()
        }

        const xml = XMLConverter.sessionToXML(sessionData)
        const result = await XMLStorage.save(this.SESSIONS_RESOURCE, sessionId, xml, "Session")
    
        if (!result.success) {
            return { success: false, error: result.error }
        }

        return { success: true, session: sessionData }
    }

    /**
     * Validate session and return user
     */
    static async validateSession(sessionId: string): Promise<{ valid: boolean; user?: UserData; session?: SessionData; error?: string }> {
        const result = await XMLStorage.read(this.SESSIONS_RESOURCE, sessionId)
        if (!result.success || !result.data) {
            return { valid: false, error: "Session not found" }
        }

        try {
            const parsed = await XMLValidator.parseXMLToJSON(result.data)
            const sessionData = parsed.Session as SessionData

            // Check if session is expired
            const expiresAt = new Date(sessionData.expiresAt)
            if (expiresAt < new Date()) {
                // Delete expired session
                await XMLStorage.delete(this.SESSIONS_RESOURCE, sessionId)
                return { valid: false, error: "Session expired" }
            }

            // Get user data
            const user = await this.findUserById(sessionData.userId)
            if (!user) {
                return { valid: false, error: "User not found" }
            }

            const { pwdU, ...safeUser } = user
            return { 
                valid: true, 
                user: { ...safeUser, pwdU: "" } as UserData,
                session: sessionData
            }
        } catch (e) {
            return { valid: false, error: "Invalid session data" }
        }
    }

    /**
     * Delete session (logout)
     */
    static async deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
        const result = await XMLStorage.delete(this.SESSIONS_RESOURCE, sessionId)
        return { success: result.success, error: result.error }
    }

    /**
     * Get all users (admin only)
     */
    static async getAllUsers(): Promise<UserData[]> {
        const result = await XMLStorage.readAll(this.USERS_RESOURCE)
        if (!result.success || !result.data) return []

        const users: UserData[] = []
        for (const file of result.data) {
            try {
                const parsed = await XMLValidator.parseXMLToJSON(file.content)
                const userData = parsed.User || parsed.Citizen || parsed.Administrator || parsed.CollectAgent
                if (userData) {
                    users.push({
                        idUser: userData.idUser,
                        emailU: userData.emailU,
                        nameU: userData.nameU,
                        pwdU: "", // Don't expose password
                        role: userData.role,
                        adressCit: userData.adressCit,
                        phoneCit: userData.phoneCit,
                        zoneCit: userData.zoneCit,
                        recruitmentDateEmp: userData.recruitmentDateEmp,
                        salaryEmp: userData.salaryEmp,
                        telEmp: userData.telEmp,
                        disponibility: userData.disponibility,
                        roleAgent: userData.roleAgent,
                        functionAdmin: userData.functionAdmin,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt
                    })
                }
            } catch (e) {
                continue
            }
        }
        return users
    }

    /**
     * Delete user
     */
    static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
        const result = await XMLStorage.delete(this.USERS_RESOURCE, userId)
        return { success: result.success, error: result.error }
    }
}
