"use client"
import MangaloreMap from "@/components/mangalore-map"
import ChatbotButton from "@/components/chatbot-button"
import { useRouter } from "next/navigation"

interface Issue {
  id: number
  title: string
  status: "Pending" | "In Progress" | "Resolved"
  priority: "High" | "Medium" | "Low"
  location: string
  coordinates: { x: number; y: number }
  reportedBy: string
  date: string
  description: string
  photos?: string[]
}

export default function MapPage() {
  const router = useRouter()

  const handleIssueSubmitted = (newIssue: Issue) => {
    // In a real app, this would save to database and send notifications
    console.log("[v0] Issue submitted, redirecting to dashboard:", newIssue)

    // Simulate MCC notification
    setTimeout(() => {
      alert("MCC has been notified of your issue. You will receive updates via notifications.")
      router.push("/citizen/dashboard")
    }, 1000)
  }

  const handleClose = () => {
    router.push("/citizen/dashboard")
  }

  return (
    <div className="h-screen">
      <MangaloreMap userType="citizen" onIssueSubmitted={handleIssueSubmitted} onClose={handleClose} />
      <ChatbotButton userType="citizen" />
    </div>
  )
}
