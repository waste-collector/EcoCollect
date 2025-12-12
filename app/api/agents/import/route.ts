import { type NextRequest, NextResponse } from "next/server"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLValidator } from "@/lib/xml-validator"
import { XMLConverter } from "@/lib/xml-converter"
import { v4 as uuidv4 } from "uuid"

const RESOURCE_NAME = "agents"
const SCHEMA_NAME = "CollectAgent"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { xmlContent } = body

    if (!xmlContent) {
      return NextResponse.json(
        { success: false, error: "XML content is required" },
        { status: 400 }
      )
    }

    // Check if it's a single agent or collection of agents
    const isSingleAgent = xmlContent.includes("<CollectAgent") && !xmlContent.includes("<CollectAgents")
    const isMultipleAgents = xmlContent.includes("<CollectAgents") || xmlContent.includes("<agents")

    if (!isSingleAgent && !isMultipleAgents) {
      return NextResponse.json(
        { success: false, error: "Invalid XML format. Expected CollectAgent or CollectAgents root element" },
        { status: 400 }
      )
    }

    const importedAgents: any[] = []
    const errors: string[] = []

    if (isSingleAgent) {
      // Single agent import
      const validation = XMLValidator.validate(xmlContent, SCHEMA_NAME)
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validation.errors },
          { status: 400 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const agent = jsonData.CollectAgent
      const id = agent.idUser || uuidv4()

      // Check if exists
      const exists = await XMLStorage.exists(RESOURCE_NAME, id)
      if (exists) {
        return NextResponse.json(
          { success: false, error: `Agent with ID ${id} already exists` },
          { status: 409 }
        )
      }

      // Save agent
      const saveResult = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)
      if (saveResult.success) {
        // Also create a user record so the agent can log in
        const userXmlContent = XMLConverter.userToXML({
          idUser: id,
          emailU: agent.emailU,
          nameU: agent.nameU,
          pwdU: agent.pwdU || "",
          role: "agent",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        await XMLStorage.save("users", id, userXmlContent, "User")
        
        importedAgents.push({ ...agent, idUser: id })
      } else {
        errors.push(`Failed to save agent ${id}: ${saveResult.error}`)
      }
    } else {
      // Multiple agents import
      const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)
      const agentsRoot = jsonData.CollectAgents || jsonData.agents
      let agents = agentsRoot?.CollectAgent || agentsRoot?.agent
      
      if (!agents) {
        return NextResponse.json(
          { success: false, error: "No agents found in XML" },
          { status: 400 }
        )
      }

      agents = Array.isArray(agents) ? agents : [agents]

      for (const agent of agents) {
        const id = agent.idUser || agent.id || uuidv4()
        
        // Check if exists
        const exists = await XMLStorage.exists(RESOURCE_NAME, id)
        if (exists) {
          errors.push(`Agent with ID ${id} already exists - skipped`)
          continue
        }

        // Create XML for this agent
        const singleAgentXML = XMLConverter.collectAgentToXML({
          idUser: id,
          emailU: agent.emailU || agent.email,
          nameU: agent.nameU || agent.name,
          pwdU: agent.pwdU || agent.password || "",
          role: "agent",
          recruitmentDateEmp: agent.recruitmentDateEmp || new Date().toISOString().split("T")[0],
          salaryEmp: agent.salaryEmp || 0,
          telEmp: agent.telEmp || agent.phone || "",
          disponibility: agent.disponibility ?? true,
          roleAgent: agent.roleAgent || "collector"
        })

        // Save agent
        const saveResult = await XMLStorage.save(RESOURCE_NAME, id, singleAgentXML, SCHEMA_NAME)
        if (saveResult.success) {
          // Also create a user record so the agent can log in
          const userXmlContent = XMLConverter.userToXML({
            idUser: id,
            emailU: agent.emailU || agent.email,
            nameU: agent.nameU || agent.name,
            pwdU: agent.pwdU || agent.password || "",
            role: "agent",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          await XMLStorage.save("users", id, userXmlContent, "User")
          
          importedAgents.push({ ...agent, idUser: id })
        } else {
          errors.push(`Failed to save agent ${id}: ${saveResult.error}`)
        }
      }
    }

    return NextResponse.json({
      success: importedAgents.length > 0,
      message: `Successfully imported ${importedAgents.length} agent(s)`,
      data: importedAgents,
      count: importedAgents.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import XML",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
