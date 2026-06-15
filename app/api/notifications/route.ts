import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Fetch notifications from MongoDB (supports query by userType)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userType = searchParams.get("userType") // 'citizen' or 'mcc'

    const client = await clientPromise
    const db = client.db()

    const query = userType ? { userType } : {}
    const notifications = await db
      .collection("notifications")
      .find(query)
      .sort({ _id: -1 })
      .toArray()

    const formattedNotifications = notifications.map(n => ({
      ...n,
      id: n.id || n._id.toString()
    }))

    return NextResponse.json(formattedNotifications)
  } catch (error) {
    console.error("Database error in GET /api/notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

// POST: Add a new notification to MongoDB
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()

    const newNotification = {
      id: data.id || Date.now(),
      type: data.type || "alert",
      title: data.title || "New Notification",
      message: data.message || "",
      timestamp: data.timestamp || new Date().toISOString(),
      issueId: data.issueId || null,
      read: data.read ?? false,
      userType: data.userType || "citizen", // 'citizen' or 'mcc'
    }

    const result = await db.collection("notifications").insertOne(newNotification)
    return NextResponse.json({ success: true, id: newNotification.id, _id: result.insertedId })
  } catch (error) {
    console.error("Database error in POST /api/notifications:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
