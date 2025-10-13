"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import pothole from "@/public/pothole.webp"
import garbage from "@/public/garbage.png"
import streetlight from "@/public/streetlight.png"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  LogOut,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Eye,
  Edit,
  UserCheck,
  User,
  Phone,
  Mail,
  Building,
  TrendingUp ,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import NotificationBell from "@/components/notification-bell"
import ChatbotButton from "@/components/chatbot-button"

export default function MCCDashboard() {
  const [issues, setIssues] = useState<any[]>([])
  const [newIssueNotifications, setNewIssueNotifications] = useState<any[]>([])
  const [showNewIssueAlert, setShowNewIssueAlert] = useState(false)
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const [selectedWorker, setSelectedWorker] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // Filter for quick-type cards
const [issueFilter, setIssueFilter] = useState<string>("")
const [activeFilter, setActiveFilter] = useState<string>("")

const handleFilterByKeyword = (keyword: string) => {
  setIssueFilter(keyword.toLowerCase())
  setActiveFilter(keyword)
}

const clearIssueFilter = () => {
  setIssueFilter("")
  setActiveFilter("")
}


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCompletionPhotos((prev) => [...prev, photoDataUrl])
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setCompletionPhotos((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhoto = (index: number) => {
    setCompletionPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleViewDetails = (issue: any) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleUpdateStatus = (issue: any) => {
    setSelectedIssue(issue)
    if (issue.status === "In Progress") {
      setShowCompletionModal(true)
    } else {
      setShowUpdateModal(true)
    }
  }

  const handleAssignWorker = (issue: any) => {
    setSelectedIssue(issue)
    setSelectedWorker("")
    setShowAssignModal(true)
  }

  const handleConfirmAssignment = () => {
    if (!selectedWorker) {
      alert("Please select a worker team")
      return
    }

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === selectedIssue.id ? { ...issue, assignedTo: selectedWorker, status: "In Progress" } : issue,
      ),
    )

    const citizenNotification = {
      id: Date.now(),
      type: "assignment",
      title: "Worker Assigned to Your Issue",
      message: `Your issue "${selectedIssue.title}" has been assigned to ${selectedWorker}. Work will begin soon.`,
      timestamp: new Date().toISOString(),
      issueId: selectedIssue.id,
      read: false,
    }

    const existingNotifications = JSON.parse(localStorage.getItem("citizenNotifications") || "[]")
    existingNotifications.push(citizenNotification)
    localStorage.setItem("citizenNotifications", JSON.stringify(existingNotifications))

    const citizenIssues = JSON.parse(localStorage.getItem("citizenIssues") || "[]")
    const updatedCitizenIssues = citizenIssues.map((issue: any) =>
      issue.id === selectedIssue.id ? { ...issue, assignedTo: selectedWorker, status: "In Progress" } : issue,
    )
    localStorage.setItem("citizenIssues", JSON.stringify(updatedCitizenIssues))

    alert(`Issue assigned to ${selectedWorker}! Worker team and citizen have been notified.`)
    setShowAssignModal(false)
    setSelectedIssue(null)
    setSelectedWorker("")
  }

  const handleCompleteIssue = () => {
    if (selectedIssue && completionPhotos.length > 0) {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === selectedIssue.id
            ? {
                ...issue,
                completionPhotos: completionPhotos,
                status: "Resolved",
                completionNotes: completionNotes,
                completedDate: new Date().toLocaleDateString(),
              }
            : issue,
        ),
      )

      const citizenNotification = {
        id: Date.now(),
        type: "completion",
        title: "Issue Resolved!",
        message: `Your issue "${selectedIssue.title}" has been resolved. Check the completion photos and details.`,
        timestamp: new Date().toISOString(),
        issueId: selectedIssue.id,
        completionPhotos: completionPhotos,
        completionNotes: completionNotes,
        read: false,
      }

      const existingNotifications = JSON.parse(localStorage.getItem("citizenNotifications") || "[]")
      existingNotifications.push(citizenNotification)
      localStorage.setItem("citizenNotifications", JSON.stringify(existingNotifications))

      const citizenIssues = JSON.parse(localStorage.getItem("citizenIssues") || "[]")
      const updatedCitizenIssues = citizenIssues.map((issue: any) =>
        issue.id === selectedIssue.id
          ? {
              ...issue,
              status: "Resolved",
              completionPhotos: completionPhotos,
              completionNotes: completionNotes,
              completedDate: new Date().toLocaleDateString(),
            }
          : issue,
      )
      localStorage.setItem("citizenIssues", JSON.stringify(updatedCitizenIssues))

      alert("Issue marked as completed! Citizen has been notified with completion photos.")
      setShowCompletionModal(false)
      setCompletionPhotos([])
      setCompletionNotes("")
    } else {
      alert("Please upload at least one completion photo before marking as completed.")
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleViewMap = () => {
    router.push("/mcc/map")
  }

  const handleConstructionList = () => {
    router.push("/mcc/construction_companies")
  }
  const handleMakeProject = () => {
    router.push("/mcc/project_report")
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-orange-100 text-orange-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const dismissNewIssueAlert = () => {
    setShowNewIssueAlert(false)
    setNewIssueNotifications([])
  }

  const loadAndSyncIssues = () => {
    const citizenIssues = JSON.parse(localStorage.getItem("citizenIssues") || "[]")
    const lastCheckedTime = localStorage.getItem("mccLastChecked") || "0"
    const currentTime = Date.now().toString()

    console.log("[v0] Loading citizen issues from localStorage:", citizenIssues.length)
    console.log("[v0] Last checked time:", lastCheckedTime)

    const newIssues = citizenIssues.filter((issue: any) => {
      const issueTimestamp = issue.id || 0
      const lastChecked = Number.parseInt(lastCheckedTime)
      console.log(`[v0] Checking issue ${issue.title}: timestamp=${issueTimestamp}, lastChecked=${lastChecked}`)
      return issueTimestamp > lastChecked
    })

    console.log("[v0] New issues found:", newIssues.length)

    if (newIssues.length > 0) {
      console.log("[v0] Found new issues:", newIssues.length)
      console.log(
        "[v0] New issues details:",
        newIssues.map((issue: { id: any; title: any }) => ({ id: issue.id, title: issue.title })),
      )
      setNewIssueNotifications(newIssues)
      setShowNewIssueAlert(true)

      newIssues.forEach((issue: any) => {
        console.log(`[v0] New issue reported: ${issue.title} by ${issue.reportedBy}`)
      })
    } else {
      console.log("[v0] No new issues found")
    }

    const mccFormattedIssues = citizenIssues.map((issue: any, index: number) => ({
      id: issue.id || Date.now() + index,
      title: issue.title,
      status: issue.status || "Pending",
      priority: issue.priority,
      location: issue.location,
      reportedBy: issue.reportedBy,
      date: issue.date,
      assignedTo: issue.assignedTo || "Unassigned",
      description: issue.description,
      photos: issue.photos || [],
      completionPhotos: issue.completionPhotos || [],
    }))

    const defaultIssues = [
      {
        id: 999,
        title: "Street Light Not Working",
        status: "In Progress",
        priority: "Medium",
        location: "MG Road, Mangalore",
        reportedBy: "Citizen #5678",
        date: "2024-01-14",
        assignedTo: "Worker Team A",
        description: "Street light has been out for 3 days, causing safety concerns",
        photos: ["/broken-street-light.png"],
      },
    ]

    const allIssues = [...mccFormattedIssues, ...defaultIssues]
    console.log("[v0] Total issues loaded:", allIssues.length)
    setIssues(allIssues)

    const totalIssues = allIssues.length
    const pendingIssues = allIssues.filter((issue) => issue.status === "Pending").length
    const inProgress = allIssues.filter((issue) => issue.status === "In Progress").length
    const resolved = allIssues.filter((issue) => issue.status === "Resolved").length

    setStats({
      totalIssues,
      pendingIssues,
      inProgress,
      resolved,
    })

    localStorage.setItem("mccLastChecked", currentTime)
  }

  useEffect(() => {
    loadAndSyncIssues()

    const interval = setInterval(() => {
      console.log("[v0] Checking for new issues...")
      loadAndSyncIssues()
    }, 5000)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "citizenIssues" || e.key === "mccNotifications") {
        console.log("[v0] Storage changed, reloading issues...")
        loadAndSyncIssues()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])
  // Derived list that respects the quick card filter
const visibleIssues = issues.filter((issue) => {
  if (!issueFilter) return true
  const text = `${issue.title || ""} ${issue.description || ""} ${issue.location || ""}`.toLowerCase()
  return text.includes(issueFilter)
})

// Inside MCCDashboard functional component:

const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("");

// Function to open the dialog
const openCategoryDialog = (category: string) => {
  const urlCategory = encodeURIComponent(category);
    if (category === "Potholes") {
        router.push("/mcc/potholes");
    } 
    else if (category === "Garbage" ) {
        router.push(`/issue?category=${urlCategory}`);
    }else {
        setSelectedCategory(category);
        setIsCategoryListOpen(true);
    }
    
};
const handlePredictiveClick = () => {
      router.push(`/Predictive-analysis`);
  };

// Function to filter issues based on the card's label (Potholes, Garbage, Streetlights)
const getFilteredIssuesByCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    let keywords: string[] = [];
    if (categoryLower.includes("pothole")) {
        keywords = ["pothole", "road", "street"];
    } else if (categoryLower.includes("garbage")) {
        keywords = ["garbage", "waste", "trash"];
    } else if (categoryLower.includes("streetlight")) {
        keywords = ["light", "streetlight", "lamp", "electric"];
    }

    // Filters the main issues array in the MCC Dashboard
    return issues.filter(issue => 
        keywords.some(keyword => 
            (issue.title?.toLowerCase().includes(keyword) || issue.description?.toLowerCase().includes(keyword))
        )
    );
};


  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-indigo-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {showNewIssueAlert && newIssueNotifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold mb-1">New Issues Reported!</h4>
              <p className="text-sm opacity-90">
                {newIssueNotifications.length} new issue{newIssueNotifications.length > 1 ? "s" : ""} reported by
                citizens
              </p>
              <div className="mt-2 space-y-1">
                {newIssueNotifications.slice(0, 2).map((issue, index) => (
                  <div key={index} className="text-xs opacity-80">
                    • {issue.title} - {issue.location}
                  </div>
                ))}
                {newIssueNotifications.length > 2 && (
                  <div className="text-xs opacity-80">• And {newIssueNotifications.length - 2} more...</div>
                )}
              </div>
            </div>
            <button onClick={dismissNewIssueAlert} className="text-white hover:text-gray-200 ml-2">
              ✕
            </button>
          </div>
        </div>
      )}

      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">MCC Dashboard</h1>
                <p className="text-sm text-gray-600">Issue Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell userType="mcc" />
              <Avatar
                className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
                onClick={() => setShowProfileModal(true)}
              >
                <AvatarFallback className="bg-purple-600 text-white text-sm">M</AvatarFallback>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">Total Issues</p>
        <p className="text-2xl font-bold text-blue-900">{stats.totalIssues}</p>
      </div>
      <Users className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>

          <Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">Pending</p>
        <p className="text-2xl font-bold text-blue-900">{stats.pendingIssues}</p>
      </div>
      <Clock className="w-8 h-8 text-yellow-600" />
    </div>
  </CardContent>
</Card>

          <Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">In Progress</p>
        <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
      </div>
      <AlertTriangle className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>

          <Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">Resolved</p>
        <p className="text-2xl font-bold text-blue-900">{stats.resolved}</p>
      </div>
      <CheckCircle className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>

        </div>

        {/* Department-wise Issue Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
  
{/* Electricity Department */}
{/* Electricity Department */}
<Card className="shadow-xl bg-blue-200 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text- blue-700">Electricity Department</p>
        <p className="text-2xl font-bold text-blue-900">
          {
            issues.filter(
              (issue) =>
                issue.title.toLowerCase().includes("light") ||
                issue.title.toLowerCase().includes("lamp") ||
                issue.title.toLowerCase().includes("electric")
            ).length
          }
        </p>
      </div>
      <Shield className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>




  {/* Waste Department */}
<Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">Waste Department</p>
        <p className="text-2xl font-bold text-green-900">
          {
            issues.filter(
              (issue) =>
                issue.title.toLowerCase().includes("garbage") ||
                issue.title.toLowerCase().includes("waste") ||
                issue.title.toLowerCase().includes("trash")
            ).length
          }
        </p>
      </div>
      <Trash2 className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>


  {/* Roads Department */}
<Card className="shadow-xl bg-blue-100 rounded-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-700">Roads Department</p>
        <p className="text-2xl font-bold text-blue-900">
          {
            issues.filter(
              (issue) =>
                issue.title.toLowerCase().includes("road") ||
                issue.title.toLowerCase().includes("pothole") ||
                issue.title.toLowerCase().includes("street")
            ).length
          }
        </p>
      </div>
      <MapPin className="w-8 h-8 text-purple-600" />
    </div>
  </CardContent>
</Card>

</div>

        {/* Category Quick Access Section */}
        {/* Category Quick Access Section */}
<Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <MapPin className="w-5 h-5 text-purple-600" />
      Quick Access Categories
    </CardTitle>
    <CardDescription className="text-gray-600">
      Click on any category to view related issues
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid sm:grid-cols-3 gap-6">
      {[
        { 
          label: "Potholes", 
          desc: "Road issues", 
          img: "/pothole.webp", 
          count: issues.filter(issue => 
            issue.title?.toLowerCase().includes("pothole") || 
            issue.title?.toLowerCase().includes("road") ||
            issue.title?.toLowerCase().includes("street")
          ).length
        },
        { 
          label: "Garbage", 
          desc: "Waste management", 
          img: "/garbage.png", 
          count: issues.filter(issue => 
            issue.title?.toLowerCase().includes("garbage") || 
            issue.title?.toLowerCase().includes("waste") ||
            issue.title?.toLowerCase().includes("trash")
          ).length
        },
        { 
          label: "Streetlights", 
          desc: "Lighting issues", 
          img: "/streetlight.png", 
          count: issues.filter(issue => 
            issue.title?.toLowerCase().includes("light") || 
            issue.title?.toLowerCase().includes("streetlight") ||
            issue.title?.toLowerCase().includes("lamp")
          ).length
        },
      ].map((item) => (
        <Button
          key={item.label}
          className="h-36 relative overflow-hidden rounded-2xl text-white shadow-xl flex flex-col w-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl active:scale-95 group cursor-pointer"
          onClick={() => openCategoryDialog(item.label)}
        >
          {/* Background Image */}
          <img
            src={item.img}
            alt={item.label}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80"
          />

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl mb-1">{item.label}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            </div>
            <div className="text-xs opacity-75 mt-4">Click to view issues</div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      ))}
      <button
        key="PredictiveMaintenance"
        onClick={handlePredictiveClick}
        // This is the key change: on small screens and up, start at column 2 and end at column 3, centering it in the 3-column grid space.
       className="sm:col-start-2 sm:col-end-3 flex flex-col items-start p-6 rounded-xl text-left bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-xl transform transition-transform duration-200 hover:scale-[1.02]"

    >
        <TrendingUp className="w-10 h-10 mb-2 text-purple-200" />
        <h3 className="text-2xl font-bold">Predictive Analytics</h3>
        <p className="text-sm text-purple-100 mt-1">Hotspot Forecasting & Proactive Maintenance</p>
    </button>
    </div>
  </CardContent>
</Card>


        {/* Issue Management Section */}
        <Card className="shadow-xl border-0 bg-blue-100/80 backdrop-blur-sm rounded-xl transition-all hover:shadow-2xl hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Issue Management</CardTitle>
                <CardDescription className="text-gray-600">Manage and assign civic issues to workers</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleMakeProject}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Make a Project
                </Button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white" 
                  onClick={handleConstructionList}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Construction List
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleViewMap}>
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input placeholder="Search issues..." className="max-w-sm" />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {issues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No issues reported yet</p>
                </div>
              ) : (
                issues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{issue.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {issue.location}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Reported by:</span>
                        <div className="font-medium">{issue.reportedBy}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <div className="font-medium">{issue.date}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned to:</span>
                        <div className="font-medium">{issue.assignedTo}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignWorker(issue)}
                        className={
                          issue.assignedTo !== "Unassigned" ? "bg-green-50 text-green-700 border-green-200" : ""
                        }
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        {issue.assignedTo !== "Unassigned" ? "Assigned" : "Assign Worker"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(issue)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(issue)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Issue Details
            </DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedIssue.priority)}>{selectedIssue.priority}</Badge>
                <Badge className={getStatusColor(selectedIssue.status)}>{selectedIssue.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Title:</strong> {selectedIssue.title}
                </div>
                <div>
                  <strong>Location:</strong> {selectedIssue.location}
                </div>
                <div>
                  <strong>Reported by:</strong> {selectedIssue.reportedBy}
                </div>
                <div>
                  <strong>Date:</strong> {selectedIssue.date}
                </div>
                <div>
                  <strong>Assigned to:</strong> {selectedIssue.assignedTo}
                </div>
                <div>
                  <strong>Status:</strong> {selectedIssue.status}
                </div>
              </div>

              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-sm text-muted-foreground">{selectedIssue.description}</p>
              </div>

              {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                <div>
                  <strong>Issue Photos:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedIssue.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Issue ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedIssue.completionPhotos && selectedIssue.completionPhotos.length > 0 && (
                <div>
                  <strong>Completion Photos:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedIssue.completionPhotos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Completion ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Assign Worker
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Worker Team</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose worker team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Worker Team A">Worker Team A</SelectItem>
                  <SelectItem value="Worker Team B">Worker Team B</SelectItem>
                  <SelectItem value="Sanitation Department">Sanitation Department</SelectItem>
                  <SelectItem value="Electrical Team">Electrical Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleConfirmAssignment}
                disabled={!selectedWorker}
              >
                Assign Worker
              </Button>
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Mark Issue as Completed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Required:</strong> Upload at least one photo showing the completed work before marking as
                resolved.
              </p>
            </div>

            <div>
              <Label>Upload Completion Photos *</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={startCamera} className="flex-1 bg-transparent">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {showCamera && (
                  <div className="space-y-2">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} className="flex-1 gradient-bg text-white">
                        Capture
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {completionPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {completionPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Completion ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 w-6 h-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Completion Notes</Label>
              <Textarea
                placeholder="Describe the work completed, materials used, or any additional details..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCompleteIssue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={completionPhotos.length === 0}
              >
                Complete & Notify Citizen
              </Button>
              <Button variant="outline" onClick={() => setShowCompletionModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              MCC Staff Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-purple-600 text-white text-xl">M</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">Manjunath Rao</h3>
                <p className="text-sm text-muted-foreground">Senior MCC Officer</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-600" />
                <span className="text-sm">manjunath.rao@mcc.gov.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Mangalore City Corporation</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Employee ID: MCC2024001</span>
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

      <canvas ref={canvasRef} className="hidden" />
      <ChatbotButton userType="mcc" />

      <Dialog open={isCategoryListOpen} onOpenChange={setIsCategoryListOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-700">
              Active Reports: {selectedCategory}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {selectedCategory && (
              <>
                {getFilteredIssuesByCategory(selectedCategory).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{issue.title}</h3>
                      <p className="text-sm text-gray-600">Location: {issue.location}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                      </div>
                    </div>
                    <Button onClick={() => handleViewDetails(issue)}>
                      View Details
                    </Button>
                  </div>
                ))}
                {getFilteredIssuesByCategory(selectedCategory).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No issues found for {selectedCategory}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}