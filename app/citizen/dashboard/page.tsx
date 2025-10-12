"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Plus,
  LogOut,
  Cloud,
  Wind,
  Eye,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Home
} from "lucide-react"
import { useRouter } from "next/navigation"
import NotificationBell from "@/components/notification-bell"
import ChatbotButton from "@/components/chatbot-button"
import { motion } from "framer-motion"

interface Issue {
  id: number
  title: string
  status: "Pending" | "In Progress" | "Resolved"
  date: string
  photos?: string[]
  location?: string
}

export default function CitizenDashboard() {
  const router = useRouter()
  const [weather, setWeather] = useState({
    temp: "...",
    condition: "...",
    humidity: "...",
    windSpeed: "..."
    windSpeed: "...",
  })

  const [news] = useState([
    { id: 1, title: "New Bus Route Added to Kadri-Bejai", time: "2 hours ago" },
    { id: 2, title: "Road Maintenance Work on MG Road", time: "5 hours ago" },
    { id: 3, title: "Water Supply Disruption Notice", time: "1 day ago" }
  ])

  const [issues, setIssues] = useState<Issue[]>(() => {
    if (typeof window !== "undefined") {
      const savedIssues = localStorage.getItem("citizenIssues")
      if (savedIssues) return JSON.parse(savedIssues)
    }
    return [
      { id: 1, title: "Pothole on Car Street", status: "In Progress", date: "2024-01-15" },
      { id: 2, title: "Street Light Not Working", status: "Resolved", date: "2024-01-12" },
      { id: 3, title: "Garbage Collection Delay", status: "Pending", date: "2024-01-10" }
    ]
  })
  // Default issues for SSR-safe render
  const [issues, setIssues] = useState<Issue[]>([
    { id: 1, title: "Pothole on Car Street", status: "In Progress", date: "2024-01-15" },
    { id: 2, title: "Street Light Not Working", status: "Resolved", date: "2024-01-12" },
    { id: 3, title: "Garbage Collection Delay", status: "Pending", date: "2024-01-10" },
  ])

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const handleLogout = () => router.push("/")
  const handleReportIssue = () => router.push("/map")

  // -------------------- LIVE WEATHER --------------------
  useEffect(() => {
    async function fetchWeather() {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        const city = "Mangalore"
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await res.json()
        setWeather({
          temp: `${Math.round(data.main.temp)}°C`,
          condition: data.weather[0].main,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} m/s`
        })
      } catch (error) {
        console.error("Error fetching weather:", error)
      }
    }
    fetchWeather()
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  // Load issues from localStorage **only on client**
  useEffect(() => {
    const savedIssues = localStorage.getItem("citizenIssues")
    if (savedIssues) setIssues(JSON.parse(savedIssues))
  }, [])

  const handleLogout = () => router.push("/")
  const handleReportIssue = () => router.push("/map")

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

  // -------------------- LIVE WEATHER --------------------
  useEffect(() => {
    async function fetchWeather() {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
        const city = "Mangalore"
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await res.json()
        setWeather({
          temp: `${Math.round(data.main.temp)}°C`,
          condition: data.weather[0].main,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} m/s`,
        })
      } catch (error) {
        console.error("Error fetching weather:", error)
      }
    }
    fetchWeather()
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // -------------------- Scroll to bottom detection --------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.body.offsetHeight
      setShowBanner(scrollTop + windowHeight >= docHeight - 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="min-h-screen bg-gray-50 relative">
      <div className="fixed inset-0 gradient-bg opacity-5 -z-10" />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
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
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Report issues and access services
                </CardTitle>
                <CardDescription>Select a category to Report an issue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Potholes", desc: "Report road issues", img: "/pothole.webp" },
                    { label: "Garbage", desc: "Report garbage issues", img: "/garbage.png" },
                    { label: "Streetlights", desc: "Report lighting issues", img: "/streetlight.png" }
                    { label: "Streetlights", desc: "Report lighting issues", img: "/streetlight.png" },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      className="h-32 relative overflow-hidden rounded-lg text-white flex items-end p-4"
                      onClick={handleReportIssue}
                      style={{
                        backgroundImage: `url('${item.img}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      onClick={() => {
                        if (item.label === "Potholes") router.push("/map")
                        else if (item.label === "Garbage") router.push("/report/garbage")
                        else if (item.label === "Streetlights") router.push("/report/streetlight")
                      }}
                      style={{
                        backgroundImage: `url('${item.img}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
>>>>>>> 32f7b27 (feat:fixed citizen chatbot and category)
                      }}
                    >
                      <div className="bg-black bg-opacity-50 w-full p-2 rounded">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-sm opacity-90">{item.desc}</div>
                      </div>
                    </Button>
                  ))}
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
                            <Calendar className="w-4 h-4" /> {issue.date}{" "}
                            <Calendar className="w-4 h-4" /> {issue.date}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Ticket #{issue.id}
                            </span>
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

          {/* Sidebar - Weather & News */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="w-5 h-5" /> Mangalore Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{weather.temp}</div>
                  <div className="text-muted-foreground">{weather.condition}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" /> {weather.humidity}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" /> {weather.windSpeed}
                  </div>
                </div>
              </CardContent>
            </Card>

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
                        <Clock className="w-3 h-3" /> {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Citizen Profile
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
                <Phone className="w-4 h-4 text-blue-600" /> <span className="text-sm">+91 98765 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" /> <span className="text-sm">priya.shetty@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-blue-600" /> <span className="text-sm">Kadri, Mangalore - 575002</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-blue-600" /> <span className="text-sm">Citizen ID: CIT2024567</span>
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

      {/* MCC Helpline Banner */}
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 w-full bg-blue-50 border-t z-40"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-center items-center gap-2 text-center">
            <h3 className="font-semibold text-blue-700">MCC Helpline</h3>
            <p className="text-sm text-blue-600">
              Contact: +91 824 222 0000 | Email: help@mangalorecity.gov.in
            </p>
          </div>
        </motion.div>
      )}

      {/* Chatbot button */}
      <ChatbotButton userType="citizen" className="fixed bottom-16 right-6 z-50" />
    </div>
  )
}
