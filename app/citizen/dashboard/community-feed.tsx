"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle } from "lucide-react"

interface Comment {
  user: string
  text: string
}

interface Issue {
  id: number
  user: string
  avatar: string
  issue: string
  image?: string
  likes: number
  comments: Comment[]
  timestamp: string
}

export default function CommunityFeed() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})

  // Fetch issues every 5 sec for "real-time"
  useEffect(() => {
    const fetchIssues = async () => {
      const res = await fetch("/api/issues")
      const data = await res.json()
      setIssues(data)
    }
    fetchIssues()
    const interval = setInterval(fetchIssues, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLike = async (id: number) => {
    await fetch("/api/issues", {
      method: "POST",
      body: JSON.stringify({ type: "like", issueId: id }),
      headers: { "Content-Type": "application/json" }
    })
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i))
    )
  }

  const handleComment = async (id: number) => {
    const text = commentInputs[id]
    if (!text) return
    await fetch("/api/issues", {
      method: "POST",
      body: JSON.stringify({ type: "comment", issueId: id, user: "You", text }),
      headers: { "Content-Type": "application/json" }
    })
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, comments: [...i.comments, { user: "You", text }] } : i
      )
    )
    setCommentInputs((prev) => ({ ...prev, [id]: "" }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {issues.map((issue) => (
        <div key={issue.id} className="border rounded-lg bg-white shadow-sm">
          {/* User Info */}
          <div className="flex items-center p-3 gap-3">
            <img src={issue.avatar} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{issue.user}</p>
              <p className="text-gray-500 text-sm">
                {new Date(issue.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Issue Text */}
          <div className="px-3 pb-3">
            <p>{issue.issue}</p>
            {issue.image && <img src={issue.image} className="mt-2 rounded-lg w-full" />}
          </div>

          {/* Actions */}
          <div className="flex items-center px-3 gap-4 py-2 border-t">
            <button
              onClick={() => handleLike(issue.id)}
              className="flex items-center gap-1 text-red-500"
            >
              <Heart className="w-5 h-5" /> {issue.likes}
            </button>
            <button className="flex items-center gap-1 text-gray-600">
              <MessageCircle className="w-5 h-5" /> {issue.comments.length}
            </button>
          </div>

          {/* Comments */}
          <div className="px-4 pb-3 space-y-1">
            {issue.comments.map((c, idx) => (
              <p key={idx}>
                <span className="font-semibold">{c.user}: </span> {c.text}
              </p>
            ))}

            {/* Add comment */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[issue.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [issue.id]: e.target.value }))
                }
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                onClick={() => handleComment(issue.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
