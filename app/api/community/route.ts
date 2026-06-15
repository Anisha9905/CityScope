import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const initialPosts = [
  {
    id: 1,
    user: "Priya Shetty",
    image: "/pothole.webp",
    content: "Huge pothole on Car Street! Be careful.",
    likes: 12,
    comments: [{ user: "Rahul", text: "Yes! It's dangerous" }],
    reposts: 2,
    reports: 49,
    userLiked: false,
    userReposted: false,
    userReported: false,
    notificationSent: false
  },
  {
    id: 2,
    user: "Rahul Kumar",
    image: "/garbage.png",
    content: "Garbage collection delayed in Kadri area.",
    likes: 8,
    comments: [],
    reposts: 1,
    reports: 0,
    userLiked: false,
    userReposted: false,
    userReported: false,
    notificationSent: false
  },
  {
    id: 3,
    user: "You",
    image: "/streetlight.png",
    content: "Streetlight not working near my home.",
    likes: 5,
    comments: [],
    reposts: 0,
    reports: 0,
    userLiked: false,
    userReposted: false,
    userReported: false,
    notificationSent: false
  }
]

// GET: Fetch all posts from MongoDB
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Check if collection is empty
    const count = await db.collection("posts").countDocuments()
    if (count === 0) {
      await db.collection("posts").insertMany(initialPosts)
    }

    const posts = await db.collection("posts").find({}).sort({ _id: -1 }).toArray()
    
    const formattedPosts = posts.map(post => ({
      ...post,
      id: post.id || post._id.toString()
    }))

    return NextResponse.json(formattedPosts)
  } catch (error) {
    console.error("Database error in GET /api/community:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST: Save a new post to MongoDB
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()

    const newPost = {
      id: data.id || Date.now(),
      user: data.user || "Citizen",
      image: data.image || null,
      content: data.content || "",
      likes: data.likes || 0,
      comments: data.comments || [],
      reposts: data.reposts || 0,
      reports: data.reports || 0,
      userLiked: false,
      userReposted: false,
      userReported: false,
      notificationSent: false,
      timestamp: new Date().toISOString()
    }

    const result = await db.collection("posts").insertOne(newPost)
    return NextResponse.json({ success: true, id: newPost.id, _id: result.insertedId })
  } catch (error) {
    console.error("Database error in POST /api/community:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
