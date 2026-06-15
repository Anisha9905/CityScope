import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Retrieve a single issue by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const client = await clientPromise
    const db = client.db()

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { id: id }, { id: Number(id) }] }
      : { $or: [{ id: id }, { id: Number(id) }] }

    const issue = await db.collection("issues").findOne(query)
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...issue,
      id: issue.id || issue._id.toString()
    })
  } catch (error) {
    console.error("Database error in GET /api/issues/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 })
  }
}

// PUT: Update an issue by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { id: id }, { id: Number(id) }] }
      : { $or: [{ id: id }, { id: Number(id) }] }

    // Strip fields we don't want to update directly
    const { _id, id: _, ...updateFields } = data

    const result = await db.collection("issues").updateOne(query, {
      $set: {
        ...updateFields,
        updatedAt: new Date().toISOString()
      }
    })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, updated: result.modifiedCount })
  } catch (error) {
    console.error("Database error in PUT /api/issues/[id]:", error)
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 })
  }
}
