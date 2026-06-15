import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Cache invalidation comment to trigger recompile
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    // Perform a ping command to ensure connection is live
    await db.command({ ping: 1 })
    return NextResponse.json({ status: "connected", database: db.databaseName })
  } catch (error) {
    console.error("MongoDB connection check failed:", error)
    return NextResponse.json(
      { status: "disconnected", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
