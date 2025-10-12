"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, MapPin, Send } from "lucide-react"
import MangaloreMap from "@/components/mangalore-map"
import ChatbotButton from "@/components/chatbot-button"

interface Issue {
  id: number
  title: string
  description: string
  photos?: string[]
  location?: string
  coordinates?: { lat: number; lng: number }
}

export default function ReportIssuePage() {
  const router = useRouter()
  const [issue, setIssue] = useState<Issue>({
    id: Date.now(),
    title: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // You can later connect this to your backend or localStorage
    console.log("Issue reported:", issue)

    alert("Your issue has been reported successfully!")
    router.push("/citizen/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* 🧾 Report an Issue Card */}
      <Card className="max-w-3xl mx-auto shadow-md border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="w-5 h-5 text-blue-600" />
            Report an Issue
          </CardTitle>
          <CardDescription>Provide details about the issue you want to report.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Issue Title</label>
              <Input
                placeholder="e.g., Pothole near Kadri Temple"
                value={issue.title}
                onChange={(e) => setIssue({ ...issue, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the issue briefly..."
                value={issue.description}
                onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Upload Photo (optional)</label>
              <div className="flex items-center gap-2 mt-1">
                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload
                </Button>
                <span className="text-xs text-gray-500">JPEG, PNG up to 5MB</span>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Send className="w-4 h-4 mr-2" /> Submit Issue
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🗺️ Interactive Map Below */}
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <MangaloreMap userType="citizen" />
      </div>

      <ChatbotButton userType="citizen" />
    </div>
  )
}
