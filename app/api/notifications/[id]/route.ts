import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PUT: Update read status of a specific notification
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { id: id }, { id: Number(id) }] }
      : { $or: [{ id: id }, { id: Number(id) }] }

    const result = await db.collection("notifications").updateOne(query, {
      $set: {
        read: data.read ?? true,
        updatedAt: new Date().toISOString()
      }
    })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, updated: result.modifiedCount })
  } catch (error) {
    console.error("Database error in PUT /api/notifications/[id]:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
