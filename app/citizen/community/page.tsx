"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Post {
  id: number
  user: string
  avatar?: string
  image?: string
  content: string
  likes: number
  comments: { user: string; text: string }[]
  reposts: number
  reports: number
  userLiked?: boolean
  userReposted?: boolean
  userReported?: boolean
  notificationSent?: boolean
}

export default function CommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  // Track which posts have already triggered notifications
  const [notifiedPosts, setNotifiedPosts] = useState<Set<number>>(new Set())

  // Initial mock posts
  useEffect(() => {
    const initialPosts: Post[] = [
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
    setPosts(initialPosts)
  }, [])

  // Like a post - user can only like once
  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id && !p.userLiked) {
          return { ...p, likes: p.likes + 1, userLiked: true }
        }
        return p
      })
    )
  }

  // Repost a post - user can only repost once
  const handleRepost = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id && !p.userReposted) {
          return { ...p, reposts: p.reposts + 1, userReposted: true }
        }
        return p
      })
    )
  }

  // Report a post - user can only report once per post
  const handleReport = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id && !p.userReported) {
          const newReportCount = p.reports + 1
          const updatedPost = { 
            ...p, 
            reports: newReportCount, 
            userReported: true 
          }

          // Send notification when reports reach 50 and notification hasn't been sent
          if (newReportCount >= 50 && !notifiedPosts.has(id)) {
            sendMccNotification(updatedPost)
            setNotifiedPosts(prev => new Set(prev).add(id))
          }

          return updatedPost
        }
        return p
      })
    )
  }

  // Add a comment - user can add unlimited comments
  const handleAddComment = (id: number, text: string) => {
    if (!text.trim()) return
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { user: "You", text }] }
          : p
      )
    )
  }

  // Send notification to MCC
  const sendMccNotification = async (post: Post) => {
    try {
      const response = await fetch("/api/mcc/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          user: post.user,
          content: post.content,
          reports: post.reports,
          image: post.image,
          timestamp: new Date().toISOString(),
          priority: "HIGH"
        })
      })
      
      if (response.ok) {
        console.log("MCC notification sent for post:", post.id)
        // Update post to mark notification as sent
        setPosts(prev =>
          prev.map(p =>
            p.id === post.id
              ? { ...p, notificationSent: true }
              : p
          )
        )
        
        // Show success message
        alert(`🚨 Post "${post.content.substring(0, 30)}..." has reached ${post.reports} reports and has been escalated to MCC authorities!`)
      } else {
        console.error("Failed to send MCC notification")
      }
    } catch (error) {
      console.error("Failed to send MCC notification:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold gradient-text">Community</h1>
        <Button variant="ghost" onClick={() => router.push("/citizen/dashboard")}>
          Back
        </Button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="rounded-xl shadow-md overflow-hidden">
                <CardHeader className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.user}</h3>
                    <p className="text-xs text-muted-foreground">Posted just now</p>
                  </div>
                </CardHeader>

                {post.image && (
                  <div className="w-full h-64 overflow-hidden relative">
                    <img src={post.image} alt="post image" className="w-full h-full object-cover" />
                  </div>
                )}

                <CardContent className="p-4">
                  <p className="mb-3">{post.content}</p>
                  
                  {/* Report status indicator */}
                  {post.reports >= 50 && (
                    <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-red-700 text-sm font-medium flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {notifiedPosts.has(post.id) 
                          ? "This post has been escalated to MCC authorities"
                          : "This post has reached critical report count"
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-2">
                    {/* Like Button */}
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1 ${post.userLiked ? "text-red-500 font-bold" : "text-gray-500"}`}
                      onClick={() => handleLike(post.id)}
                      disabled={post.userLiked}
                    >
                      <Heart className="w-4 h-4" /> 
                      {post.likes}
                    </Button>

                    {/* Comment Button */}
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-gray-500"
                    >
                      <MessageCircle className="w-4 h-4" /> 
                      {post.comments.length}
                    </Button>

                    {/* Repost Button */}
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1 ${post.userReposted ? "text-green-500 font-bold" : "text-gray-500"}`}
                      onClick={() => handleRepost(post.id)}
                      disabled={post.userReposted}
                    >
                      <Repeat className="w-4 h-4" /> 
                      {post.reposts}
                    </Button>

                    {/* Report Button */}
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1 ${post.userReported ? "text-yellow-600 font-bold" : "text-gray-500"}`}
                      onClick={() => handleReport(post.id)}
                      disabled={post.userReported}
                    >
                      <AlertTriangle className="w-4 h-4" /> 
                      {post.reports}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-2">
                    {post.comments.map((c, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="font-semibold">{c.user}:</span>
                        <span className="text-sm">{c.text}</span>
                      </div>
                    ))}

                    {/* Add comment box */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const target = e.target as HTMLFormElement
                        const commentInput = target.elements.namedItem('comment') as HTMLInputElement
                        handleAddComment(post.id, commentInput.value)
                        commentInput.value = ""
                      }}
                      className="flex gap-2 mt-1"
                    >
                      <input
                        name="comment"
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-200"
                      />
                      <Button type="submit" size="sm">
                        Post
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}