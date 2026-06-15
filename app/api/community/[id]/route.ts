import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PUT: Perform interactions on a post (like, repost, report, comment)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { action, commentText, user } = await req.json()
    const client = await clientPromise
    const db = client.db()

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { id: id }, { id: Number(id) }] }
      : { $or: [{ id: id }, { id: Number(id) }] }

    let update = {}
    if (action === "like") {
      update = { $inc: { likes: 1 }, $set: { userLiked: true } }
    } else if (action === "repost") {
      update = { $inc: { reposts: 1 }, $set: { userReposted: true } }
    } else if (action === "report") {
      update = { $inc: { reports: 1 }, $set: { userReported: true } }
    } else if (action === "comment") {
      update = {
        $push: {
          comments: {
            user: user || "You",
            text: commentText,
            timestamp: new Date().toISOString()
          }
        }
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await db.collection("posts").updateOne(query, update)
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Retrieve the updated post to check report counts
    const updatedPost = await db.collection("posts").findOne(query)

    return NextResponse.json({ success: true, post: updatedPost })
  } catch (error) {
    console.error("Database error in PUT /api/community/[id]:", error)
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}
