import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { postId, content, reports } = data

    // Create a simple notification string
    const message = `🚨 Post "${content.substring(0, 30)}..." has reached ${reports} reports!`

    console.log("Saving MCC Notification:", message)

    const client = await clientPromise
    const db = client.db()

    const newNotification = {
      id: Date.now(),
      type: "critical_report",
      title: "Critical Community Report Escalated",
      message: message,
      timestamp: new Date().toISOString(),
      issueId: postId || null,
      read: false,
      userType: "mcc"
    }

    await db.collection("notifications").insertOne(newNotification)

    // Send the message back (for dashboard polling)
    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("❌ Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}