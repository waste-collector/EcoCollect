import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { XMLStorage } from "@/lib/xml-storage"
import { XMLConverter } from "@/lib/xml-converter"
import { XMLValidator } from "@/lib/xml-validator"

const RESOURCE_NAME = "agents"
const SCHEMA_NAME = "CollectAgent"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Get single agent
    if (id) {
      const result = await XMLStorage.read(RESOURCE_NAME, id)
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        )
      }

      const jsonData = await XMLValidator.parseXMLToJSON(result.data!)
      return NextResponse.json({
        success: true,
        data: jsonData.CollectAgent
      })
    }

    // Get all agents
    const result = await XMLStorage.readAll(RESOURCE_NAME)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const agents = await Promise.all(
      result.data!.map(async (item) => {
        const jsonData = await XMLValidator.parseXMLToJSON(item.content)
        return jsonData.CollectAgent
      })
    )

    return NextResponse.json({
      success: true,
      data: agents,
      total: agents.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch agents",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.nameU && !body.name) {
      return NextResponse.json(
        { success: false, error: "Missing required field: name" },
        { status: 400 }
      )
    }

    if (!body.emailU && !body.email) {
      return NextResponse.json(
        { success: false, error: "Missing required field: email" },
        { status: 400 }
      )
    }

    // Generate ID if not provided
    const id = body.idUser || body.id || uuidv4()

    // Check if already exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Agent with this ID already exists" },
        { status: 409 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectAgentToXML({ ...body, id })

    // Save to storage (includes validation)
    const result = await XMLStorage.save(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Also create a user record so the agent can log in
    const userXmlContent = XMLConverter.userToXML({
      idUser: id,
      emailU: body.emailU || body.email,
      nameU: body.nameU || body.name,
      pwdU: body.pwdU || body.password || "",
      role: "agent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    const userResult = await XMLStorage.save("users", id, userXmlContent, "User")
    if (!userResult.success) {
      // Rollback: delete the agent if user creation fails
      await XMLStorage.delete(RESOURCE_NAME, id)
      return NextResponse.json(
        { success: false, error: `Failed to create user record: ${userResult.error}` },
        { status: 400 }
      )
    }

    // Parse back to JSON for response
    const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)

    return NextResponse.json(
      {
        success: true,
        message: "Agent created successfully",
        data: jsonData.CollectAgent
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create agent",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.idUser || body.id

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required field: id" },
        { status: 400 }
      )
    }

    // Check if exists
    const exists = await XMLStorage.exists(RESOURCE_NAME, id)
    if (!exists) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    // Convert JSON to XML
    const xmlContent = XMLConverter.collectAgentToXML({ ...body, id })

    // Update in storage (includes validation)
    const result = await XMLStorage.update(RESOURCE_NAME, id, xmlContent, SCHEMA_NAME)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Also update the user record if it exists
    const userExists = await XMLStorage.exists("users", id)
    if (userExists) {
      const userXmlContent = XMLConverter.userToXML({
        idUser: id,
        emailU: body.emailU || body.email,
        nameU: body.nameU || body.name,
        pwdU: body.pwdU || body.password || "",
        role: "agent",
        updatedAt: new Date().toISOString()
      })
      await XMLStorage.update("users", id, userXmlContent, "User")
    }

    // Parse back to JSON for response
    const jsonData = await XMLValidator.parseXMLToJSON(xmlContent)

    return NextResponse.json({
      success: true,
      message: "Agent updated successfully",
      data: jsonData.CollectAgent
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update agent",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: id" },
        { status: 400 }
      )
    }

    const result = await XMLStorage.delete(RESOURCE_NAME, id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      )
    }

    // Also delete the corresponding user record if it exists
    const userExists = await XMLStorage.exists("users", id)
    if (userExists) {
      await XMLStorage.delete("users", id)
    }

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete agent",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
