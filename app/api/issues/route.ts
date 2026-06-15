import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Fetch all issues from MongoDB
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Check if issues collection is empty, and seed it if so
    const count = await db.collection("issues").countDocuments()
    if (count === 0) {
      const defaultIssues = [
        {
          id: 1,
          title: "Pothole on Car Street",
          description: "Major pothole causing traffic slowdowns near the intersection.",
          status: "In Progress",
          priority: "Medium",
          location: "Car Street, Mangalore - 575001",
          reportedBy: "Citizen Priya Shetty",
          date: "15/01/2024",
          gps: "12.8762, 74.8398",
          photos: ["/pothole.webp"],
          assignedTo: "Worker Team B"
        },
        {
          id: 2,
          title: "Street Light Not Working",
          description: "Streetlight is completely out, making the road dark at night.",
          status: "Resolved",
          priority: "Medium",
          location: "MG Road, Mangalore - 575001",
          reportedBy: "Citizen Priya Shetty",
          date: "12/01/2024",
          gps: "12.8731, 74.8430",
          photos: ["/streetlight.png"],
          assignedTo: "Worker Team A"
        },
        {
          id: 3,
          title: "Garbage Collection Delay",
          description: "Garbage has not been collected for three days, odor is bad.",
          status: "Pending",
          priority: "Medium",
          location: "Kadri, Mangalore - 575002",
          reportedBy: "Citizen Priya Shetty",
          date: "10/01/2024",
          gps: "12.8805, 74.8550",
          photos: ["/garbage.png"],
          assignedTo: "Unassigned"
        }
      ]
      await db.collection("issues").insertMany(defaultIssues)
    }

    const issues = await db.collection("issues").find({}).sort({ _id: -1 }).toArray()
    
    // Map _id to id for frontend compatibility
    const formattedIssues = issues.map(issue => ({
      ...issue,
      id: issue.id || issue._id.toString()
    }))

    return NextResponse.json(formattedIssues)
  } catch (error) {
    console.error("Database error in GET /api/issues:", error)
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 })
  }
}

// POST: Create a new issue in MongoDB
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()

    const newIssue = {
      id: data.id || Date.now(),
      title: data.title || "Untitled Issue",
      status: data.status || "Pending",
      priority: data.priority || "Medium",
      location: data.location || "Unknown Location",
      reportedBy: data.reportedBy || "Citizen",
      date: data.date || new Date().toLocaleDateString("en-GB"),
      assignedTo: data.assignedTo || "Unassigned",
      description: data.description || data.brief || "",
      landmark: data.landmark || "",
      gps: data.gps || "...",
      photos: data.photos || (data.photo ? [data.photo] : []),
      completionPhotos: data.completionPhotos || [],
      completionNotes: data.completionNotes || "",
      completedDate: data.completedDate || ""
    }

    const result = await db.collection("issues").insertOne(newIssue)
    return NextResponse.json({ success: true, id: newIssue.id, _id: result.insertedId })
  } catch (error) {
    console.error("Database error in POST /api/issues:", error)
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 })
  }
}
