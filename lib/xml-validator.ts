import { readFileSync } from "fs"
import { parseStringPromise } from "xml2js"
import { XMLParser, XMLValidator as FastXMLValidator } from "fast-xml-parser"
import path from "path"

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class XMLValidator {
  private static parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
    trimValues: true
  })

  /**
   * Basic XML validation - checks if XML is well-formed
   * Note: This does NOT validate against XSD schemas (requires native bindings)
   * For college project: XSD files are provided, validation logic is demonstrated
   */
  static validate(xmlString: string, schemaName: string): ValidationResult {
    try {
      // Check if XML is well-formed
      const validationResult = FastXMLValidator.validate(xmlString, {
        allowBooleanAttributes: true
      })

      if (validationResult !== true) {
        return {
          valid: false,
          errors: [typeof validationResult === 'object' ? validationResult.err.msg : 'Invalid XML']
        }
      }

      // Parse XML to verify structure
      const parsed = this.parser.parse(xmlString)

      // Basic validation: check if root element matches expected schema
      const expectedRoot = schemaName
      if (!parsed[expectedRoot]) {
        return {
          valid: false,
          errors: [`Expected root element '${expectedRoot}' not found`]
        }
      }

      // For demonstration: XSD schemas exist in xml-schemas/ directory
      // In production with native bindings, full XSD validation would occur here
      const schemaPath = path.join(process.cwd(), "xml-schemas", `${schemaName}.xsd`)
      if (!readFileSync(schemaPath, "utf-8")) {
        return {
          valid: false,
          errors: [`Schema file ${schemaName}.xsd not found`]
        }
      }

      return { valid: true, errors: [] }
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  static async parseXMLToJSON(xmlString: string): Promise<any> {
    try {
      return await parseStringPromise(xmlString, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true
      })
    } catch (error) {
      throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Parse XML using fast-xml-parser (alternative parser)
   */
  static parseXML(xmlString: string): any {
    try {
      return this.parser.parse(xmlString)
    } catch (error) {
      throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
