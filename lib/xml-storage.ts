import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, unlinkSync } from "fs"
import path from "path"
import { XMLValidator } from "./xml-validator"

export interface StorageResult<T = any> {
    success: boolean
    data?: T
    error?: string
}

export class XMLStorage {
    private static dataDir = path.join(process.cwd(), "data")

    private static ensureDirectory(dirPath: string): void {
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true })
        }
    }

    static async save(
        resource: string,
        id: string,
        xmlContent: string,
        schemaName: string
    ): Promise<StorageResult> {
        try {
            // Validate XML against schema
            const validation = XMLValidator.validate(xmlContent, schemaName)
            console.log("xml-Validatoin ", "id", id, "resource", resource,
                "xmlContent",
                xmlContent,
                "schemaName",
                schemaName,
            )
            if (!validation.valid) {
                return {
                    success: false,
                    error: `Validation failed: ${validation.errors.join(", ")}`
                }
            }

            // Save to file
            const resourceDir = path.join(this.dataDir, resource)
            this.ensureDirectory(resourceDir)
      
            const filePath = path.join(resourceDir, `${id}.xml`)
            writeFileSync(filePath, xmlContent, "utf-8")

            return { success: true, data: { id, path: filePath } }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }
        }
    }

    static async read(resource: string, id: string): Promise<StorageResult<string>> {
        try {
            const filePath = path.join(this.dataDir, resource, `${id}.xml`)
      
            if (!existsSync(filePath)) {
                return {
                    success: false,
                    error: `Resource not found: ${id}`
                }
            }

            const content = readFileSync(filePath, "utf-8")
            return { success: true, data: content }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }
        }
    }

    static async readAll(resource: string): Promise<StorageResult<{ id: string, content: string }[]>> {
        try {
            const resourceDir = path.join(this.dataDir, resource)
      
            if (!existsSync(resourceDir)) {
                return { success: true, data: [] }
            }

            const files = readdirSync(resourceDir).filter(f => f.endsWith(".xml"))
            const results = files.map(file => {
                const id = file.replace(".xml", "")
                const content = readFileSync(path.join(resourceDir, file), "utf-8")
                return { id, content }
            })

            return { success: true, data: results }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }
        }
    }

    static async delete(resource: string, id: string): Promise<StorageResult> {
        try {
            const filePath = path.join(this.dataDir, resource, `${id}.xml`)
      
            if (!existsSync(filePath)) {
                return {
                    success: false,
                    error: `Resource not found: ${id}`
                }
            }

            unlinkSync(filePath)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }
        }
    }

    static async update(
        resource: string,
        id: string,
        xmlContent: string,
        schemaName: string
    ): Promise<StorageResult> {
        // Check if exists
        const existing = await this.read(resource, id)
        if (!existing.success) {
            return existing
        }

        // Save with validation
        return this.save(resource, id, xmlContent, schemaName)
    }

    static async exists(resource: string, id: string): Promise<boolean> {
        const filePath = path.join(this.dataDir, resource, `${id}.xml`)
        return existsSync(filePath)
    }
}
