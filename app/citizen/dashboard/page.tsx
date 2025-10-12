"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Plus, LogOut, Cloud, Wind, Eye, Calendar, Clock, User, Phone, Mail, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import NotificationBell from "@/components/notification-bell"
import ChatbotButton from "@/components/chatbot-button"
import pothole from "@/public/pothole.webp"
import garbage from "@/public/garbage.png"
import streetlight from "@/public/streetlight.png"

interface Issue {
  id: number
  title: string
  status: "Pending" | "In Progress" | "Resolved"
  date: string
  photos?: string[]
  location?: string
}

export default function CitizenDashboard() {
  const [weather, setWeather] = useState({
    temp: "28°C",
    condition: "Partly Cloudy",
    humidity: "75%",
    windSpeed: "12 km/h",
  })

  const [news] = useState([
    { id: 1, title: "New Bus Route Added to Kadri-Bejai", time: "2 hours ago" },
    { id: 2, title: "Road Maintenance Work on MG Road", time: "5 hours ago" },
    { id: 3, title: "Water Supply Disruption Notice", time: "1 day ago" },
  ])

  const [issues, setIssues] = useState<Issue[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedIssues = localStorage.getItem("citizenIssues")
        if (savedIssues) {
          const parsedIssues = JSON.parse(savedIssues)
          console.log("[v0] Loaded issues from localStorage:", parsedIssues.length)
          return parsedIssues
        }
      } catch (error) {
        console.error("[v0] Error loading issues from localStorage:", error)
      }
    }

    // Default issues if no saved data
    return [
      { id: 1, title: "Pothole on Car Street", status: "In Progress", date: "2024-01-15" },
      { id: 2, title: "Street Light Not Working", status: "Resolved", date: "2024-01-12" },
      { id: 3, title: "Garbage Collection Delay", status: "Pending", date: "2024-01-10" },
    ]
  })

  const [showProfileModal, setShowProfileModal] = useState(false)

  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const handleViewMap = () => {
    router.push("/map")
  }

  const handleReportIssue = () => {
    router.push("/map")
  }

  const handleNewIssue = (newIssue: Issue) => {
    setIssues((prev) => {
      const updatedIssues = [newIssue, ...prev]

      // Save to localStorage
      try {
        localStorage.setItem("citizenIssues", JSON.stringify(updatedIssues))
        console.log("[v0] Issues updated in localStorage")
      } catch (error) {
        console.error("[v0] Error saving to localStorage:", error)
      }

      return updatedIssues
    })

    console.log("[v0] 🚨 MCC DASHBOARD NOTIFICATION:")
    console.log("[v0] New issue reported by citizen")
    console.log("[v0] Issue details:", {
      ticketId: newIssue.id,
      title: newIssue.title,
      status: newIssue.status,
      location: newIssue.location || "Location not specified",
      reportedAt: new Date().toLocaleString(),
      requiresAssignment: true,
    })

    // Simulate real-time notification to MCC
    if (typeof window !== "undefined") {
      try {
        const mccNotifications = JSON.parse(localStorage.getItem("mccNotifications") || "[]")
        const notification = {
          id: Date.now(),
          type: "new_issue",
          title: "New Issue Reported",
          message: `${newIssue.title} - Ticket #${newIssue.id}`,
          issueId: newIssue.id,
          timestamp: new Date().toISOString(),
          read: false,
        }
        mccNotifications.unshift(notification)
        localStorage.setItem("mccNotifications", JSON.stringify(mccNotifications))
        console.log("[v0] MCC notification saved to localStorage")
      } catch (error) {
        console.error("[v0] Error saving MCC notification:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Background */}
      <div className="fixed inset-0 gradient-bg opacity-5 -z-10" />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Citizen Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell userType="citizen" />
              <Avatar
                className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                onClick={() => setShowProfileModal(true)}
              >
                <AvatarFallback className="gradient-bg text-white text-sm">C</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Report issues and access services
                </CardTitle>
                <CardDescription>Select a category to Report an issue</CardDescription>
              </CardHeader>
              <CardContent>
  <div className="grid sm:grid-cols-3 gap-4">
    <Button
      className="h-32 relative overflow-hidden rounded-lg text-white flex items-end p-4"
      onClick={() => handleReportIssue()}
      style={{
        backgroundImage: "url('/pothole.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-50 w-full p-2 rounded">
        <div className="font-semibold">Potholes</div>
        <div className="text-sm opacity-90">Report road issues</div>
      </div>
    </Button>

    <Button
      className="h-32 relative overflow-hidden rounded-lg text-white flex items-end p-4"
      onClick={() => handleReportIssue()}
      style={{
        backgroundImage: "url('/garbage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-50 w-full p-2 rounded">
        <div className="font-semibold">Garbage</div>
        <div className="text-sm opacity-90">Report garbage issues</div>
      </div>
    </Button>

    <Button
      className="h-32 relative overflow-hidden rounded-lg text-white flex items-end p-4"
      onClick={() => handleReportIssue()}
      style={{
        backgroundImage: "url('/streetlight.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-50 w-full p-2 rounded">
        <div className="font-semibold">Streetlights</div>
        <div className="text-sm opacity-90">Report lighting issues</div>
      </div>
    </Button>
  </div>
</CardContent>

            </Card>

            {/* My Issues */}
            <Card>
              <CardHeader>
                <CardTitle>My Reported Issues ({issues.length})</CardTitle>
                <CardDescription>Track the status of your complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No issues reported yet</p>
                      <Button onClick={handleReportIssue} className="mt-4 gradient-bg text-white">
                        Report Your First Issue
                      </Button>
                    </div>
                  ) : (
                    issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{issue.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {issue.date}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Ticket #{issue.id}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Mangalore Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{weather.temp}</div>
                  <div className="text-muted-foreground">{weather.condition}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>{weather.humidity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span>{weather.windSpeed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local News */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Local Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {news.map((item) => (
                    <div key={item.id} className="border-l-2 border-blue-200 pl-3">
                      <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Citizen Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="gradient-bg text-white text-xl">C</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">Priya Shetty</h3>
                <p className="text-sm text-muted-foreground">Registered Citizen</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm">+91 98765 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm">priya.shetty@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Kadri, Mangalore - 575002</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Citizen ID: CIT2024567</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent">
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChatbotButton userType="citizen" />
    </div>
  )
}
