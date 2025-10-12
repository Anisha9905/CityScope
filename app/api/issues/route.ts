import { NextResponse } from "next/server"

// Temporary in-memory store
let issues = [
  {
    id: 1,
    user: "John Doe",
    avatar: "/avatars/john.jpg",
    issue: "Pothole on MG Road",
    image: "/issues/pothole1.jpg",
    likes: 5,
    comments: [
      { user: "Alice", text: "Same issue here!" },
      { user: "Bob", text: "Needs urgent repair." }
    ],
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    user: "Mary Jane",
    avatar: "/avatars/mary.jpg",
    issue: "Streetlight not working",
    image: "/issues/streetlight.jpg",
    likes: 3,
    comments: [{ user: "John", text: "Reported this yesterday." }],
    timestamp: new Date().toISOString()
  }
]

export async function GET() {
  return NextResponse.json(issues)
}

export async function POST(req: Request) {
  const { type, issueId, user, text } = await req.json()

  if (type === "like") {
    issues = issues.map((i) => (i.id === issueId ? { ...i, likes: i.likes + 1 } : i))
  } else if (type === "comment") {
    issues = issues.map((i) =>
      i.id === issueId ? { ...i, comments: [...i.comments, { user, text }] } : i
    )
  }

  return NextResponse.json({ success: true })
}
