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
        newIssues.map((issue) => ({ id: issue.id, title: issue.title })),
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
    setSelectedCategory(category);
    setIsCategoryListOpen(true);
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

    // Filters the main `issues` array in the MCC Dashboard
    return issues.filter(issue => 
        keywords.some(keyword => 
            (issue.title?.toLowerCase().includes(keyword) || issue.description?.toLowerCase().includes(keyword))
        )
    );
};


  return (
    
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-0 gradient-accent opacity-5 -z-10" />

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

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-700">MCC Dashboard</h1>
                <p className="text-sm text-muted-foreground">Issue Management System</p>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{stats.totalIssues}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingIssues}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Department-wise Issue Summary */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
  {/* Electricity Department */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Electricity Department</p>
          <p className="text-2xl font-bold text-yellow-600">
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
        <Shield className="w-8 h-8 text-yellow-500" />
      </div>
    </CardContent>
  </Card>

  {/* Waste Department */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Waste Department</p>
          <p className="text-2xl font-bold text-green-600">
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
        <Trash2 className="w-8 h-8 text-green-500" />
      </div>
    </CardContent>
  </Card>

  {/* Roads Department */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Roads Department</p>
          <p className="text-2xl font-bold text-blue-600">
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
        <MapPin className="w-8 h-8 text-blue-500" />
      </div>
    </CardContent>
  </Card>
</div>
            {/* <Card>
              
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Potholes", desc: " road issues", img: "/pothole.jpg" },
                    { label: "Garbage", desc: " garbage issues", img: "/garbage.jpg" },
                    { label: "Streetlights", desc: " lighting issues", img: "/streetlight.jpg" },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      className="h-32 relative overflow-hidden rounded-lg text-white flex items-end p-4"
                      
                      style={{
                       
                        backgroundImage: `url('${item.img}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        
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
            </Card> */}

           

<CardContent>
    <div className="grid sm:grid-cols-3 gap-4">
        {[
            { 
                label: "Potholes", 
                desc: " road issues", 
                img: "/pothole.jpg", 
                bgClass: "bg-gray-900", // Solid Dark Background
            },
            { 
                label: "Garbage", 
                desc: " garbage issues", 
                img: "/garbage.jpg", 
                bgClass: "bg-gradient-to-br from-indigo-600 to-purple-600", // Blue/Purple gradient
            },
            { 
                label: "Streetlights", 
                desc: "lighting issues", 
                img: "/streetlight.jpg", 
                bgClass: "bg-gradient-to-br from-purple-600 to-pink-500", // Purple/Pink gradient
            },
        ].map((item) => (
            <Button
                key={item.label}
                // Apply height, overflow, and use flex to manage internal layout
                // ADDED `active:scale-95` and `active:opacity-80` for visual feedback instead of black flash
                className={`h-32 relative overflow-hidden rounded-xl text-white shadow-lg 
                            flex w-full transition-all duration-150 ease-in-out hover:scale-[1.02] 
                            active:scale-[0.98] active:opacity-90 ${item.bgClass}`}
                 onClick={() => openCategoryDialog(item.label)} 
            >
                {/* Left side: Text content */}
                <div className="flex flex-col justify-center items-start p-4 w-2/3">
                    <div className="font-semibold text-white text-lg text-left">{item.label}</div>
                    <div className="text-sm text-white opacity-90 text-left">{item.desc}</div>
                </div>

                {/* Right side: Image */} 
                <div 
                    className="w-1/3 h-full overflow-hidden"
                    style={{
                        backgroundImage: `url('${item.img}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        // Match outer border radius only on the right side
                        borderTopRightRadius: '0.75rem',
                        borderBottomRightRadius: '0.75rem',
                    }}
                >
                    {/* Dark gradient overlay on image for contrast, applied to the image section itself */}
                    <div className="absolute inset-0 bg-black opacity-30"></div> 
                </div>
            </Button>
        ))}
    </div>
</CardContent>





        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Issue Management</CardTitle>
                <CardDescription>Manage and assign civic issues to workers</CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleViewMap}>
                <MapPin className="w-4 h-4 mr-2" />
                View Map
              </Button>
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
            {/* ... other descriptive text ... */}
        </DialogHeader>

        <div className="space-y-4 pt-4">
            {selectedCategory && (
                <>
                    {/* Maps over the filtered issues using getFilteredIssuesByCategory */}
                    {getFilteredIssuesByCategory(selectedCategory).map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                            {/* ... Issue details (Title, Ticket ID, Location, Status) ... */}
                            <Button onClick={() => handleViewDetails(issue)}>
                                View Details
                            </Button>
                        </div>
                    ))}
                    {/* ... Empty state message ... */}
                </>
            )}
        </div>
    </DialogContent>
</Dialog>
    </div>
  )
}
