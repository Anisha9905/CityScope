import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { postId, content, reports } = data

    // Create a simple notification string
    const message = `🚨 Post "${content.substring(0, 30)}..." has reached ${reports} reports!`

    console.log(message) // Just to see it in server logs

    // Send the message back (for dashboard polling)
    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("❌ Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}