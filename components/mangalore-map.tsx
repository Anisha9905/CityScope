"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Navigation,
  Camera,
  Upload,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  ArrowLeft,
  Trash2,
  Crosshair,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  gpsCoordinates?: { lat: number; lng: number }
}

interface MangaloreMapProps {
  userType: "citizen" | "mcc"
  onClose?: () => void
  onIssueSubmitted?: (issue: Issue) => void
}

export default function MangaloreMap({ userType, onClose, onIssueSubmitted }: MangaloreMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [newIssueLocation, setNewIssueLocation] = useState<{ x: number; y: number } | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ x: number; y: number } | null>(null)
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [locationAddress, setLocationAddress] = useState<string>("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  })
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [photoOption, setPhotoOption] = useState<"camera" | "upload" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "Pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
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

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (userType !== "citizen") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const clickedLocation = getLocationFromCoordinates(x, y)

    setNewIssueLocation({ x, y })
    setLocationAddress(clickedLocation.address)
    setGpsCoordinates(clickedLocation.coordinates)

    console.log("[v0] Clicked location:", clickedLocation.name, "at coordinates:", { x, y })

    setShowReportForm(true)
  }

  const getLocationFromCoordinates = (x: number, y: number) => {
    // Define areas based on map layout
    const locations = [
      {
        name: "Car Street",
        address: "Car Street, Mangalore - 575001",
        coordinates: { lat: 12.8697, lng: 74.842 },
        bounds: { minX: 25, maxX: 45, minY: 35, maxY: 55 },
      },
      {
        name: "MG Road",
        address: "MG Road, Mangalore - 575001",
        coordinates: { lat: 12.8731, lng: 74.843 },
        bounds: { minX: 45, maxX: 65, minY: 35, maxY: 55 },
      },
      {
        name: "Bejai",
        address: "Bejai, Mangalore - 575004",
        coordinates: { lat: 12.8644, lng: 74.856 },
        bounds: { minX: 55, maxX: 75, minY: 45, maxY: 65 },
      },
      {
        name: "Kadri",
        address: "Kadri, Mangalore - 575002",
        coordinates: { lat: 12.8987, lng: 74.8421 },
        bounds: { minX: 25, maxX: 45, minY: 25, maxY: 45 },
      },
      {
        name: "Lalbagh",
        address: "Lalbagh, Mangalore - 575003",
        coordinates: { lat: 12.8521, lng: 74.8343 },
        bounds: { minX: 30, maxX: 50, minY: 60, maxY: 80 },
      },
    ]

    // Find which location area was clicked
    for (const location of locations) {
      if (
        x >= location.bounds.minX &&
        x <= location.bounds.maxX &&
        y >= location.bounds.minY &&
        y <= location.bounds.maxY
      ) {
        return location
      }
    }

    // Default fallback location
    return {
      name: "Mangalore City",
      address: "Mangalore, Karnataka - 575001",
      coordinates: { lat: 12.8731, lng: 74.843 },
    }
  }

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" })
      if (permission.state === "denied") {
        alert(
          "Location access is denied. Please enable location permissions in your browser settings to use GPS functionality.",
        )
        return false
      }
      return true
    } catch (error) {
      console.log("[v0] Permission API not supported, proceeding with geolocation request")
      return true
    }
  }

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: "camera" as PermissionName })
      if (permission.state === "denied") {
        alert("Camera access is denied. Please enable camera permissions in your browser settings to take photos.")
        return false
      }
      return true
    } catch (error) {
      console.log("[v0] Permission API not supported, proceeding with camera request")
      return true
    }
  }

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission()
    if (!hasPermission) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("[v0] Latitude:", position.coords.latitude)
          console.log("[v0] Longitude:", position.coords.longitude)

          const { latitude, longitude } = position.coords
          setGpsCoordinates({ lat: latitude, lng: longitude })

          const mockLocation = {
            x: 50 + (longitude - 74.856) * 100,
            y: 50 + (12.9141 - latitude) * 100,
          }

          setCurrentLocation(mockLocation)
          setNewIssueLocation(mockLocation)

          const addresses = [
            "MG Road, Mangalore - 575001",
            "Car Street, Mangalore - 575001",
            "Kadri, Mangalore - 575002",
            "Bejai, Mangalore - 575004",
            "Lalbagh, Mangalore - 575003",
          ]
          const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
          setLocationAddress(randomAddress)

          setIsGettingLocation(false)
          setShowReportForm(true)

          console.log("[v0] GPS Location captured:", { latitude, longitude, address: randomAddress })
        },
        (error) => {
          console.error("[v0] Error getting location:", error)
          setIsGettingLocation(false)
          let errorMessage = "Error getting location. Please try again or select location manually on map."

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions and try again."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please try again."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again."
              break
          }
          alert(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    } else {
      console.log("[v0] Geolocation not supported by this browser.")
      alert("Geolocation not supported by this browser.")
    }
  }

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsGettingLocation(true)
    await getLocation()
  }

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
        console.log("[v0] Camera opened successfully")
      }
    } catch (err) {
      console.error("[v0] Error accessing camera:", err)
      let errorMessage = "Unable to access camera. Please check permissions or try uploading a file instead."

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera access denied. Please enable camera permissions in your browser settings."
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device."
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera is already in use by another application."
        }
      }

      alert(errorMessage)
      setPhotoOption(null)
    }
  }

  const handlePhotoOption = (option: "camera" | "upload") => {
    setPhotoOption(option)
    if (option === "camera") {
      openCamera()
    } else {
      fileInputRef.current?.click()
    }
  }

  const startCamera = async () => {
    await openCamera()
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
        setCapturedPhotos((prev) => [...prev, photoDataUrl])
        stopCamera()
        console.log("[v0] Photo captured successfully")
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
    setPhotoOption(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setCapturedPhotos((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
      console.log("[v0] Files uploaded:", files.length)
    }
    setPhotoOption(null)
  }

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReportSubmit = () => {
    if (!formData.title || !formData.category || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    const newIssue: Issue = {
      id: Date.now(),
      title: formData.title,
      status: "Pending",
      priority: formData.category === "roads" ? "High" : "Medium",
      location: locationAddress || "Current Location, Mangalore",
      coordinates: newIssueLocation || { x: 50, y: 50 },
      reportedBy: "You",
      date: new Date().toISOString().split("T")[0],
      description: formData.description,
      photos: capturedPhotos,
      gpsCoordinates: gpsCoordinates || undefined,
    }

    if (onIssueSubmitted) {
      onIssueSubmitted(newIssue)
      console.log("[v0] Issue submitted and saved to citizen dashboard:", newIssue)
    }

    console.log("[v0] NOTIFICATION SENT TO MCC: New issue reported")
    console.log("[v0] Issue Details:", {
      ticketId: newIssue.id,
      title: newIssue.title,
      category: formData.category,
      location: newIssue.location,
      priority: newIssue.priority,
      hasPhotos: capturedPhotos.length > 0,
      hasGPS: !!gpsCoordinates,
    })

    try {
      const existingIssues = JSON.parse(localStorage.getItem("citizenIssues") || "[]")
      const updatedIssues = [newIssue, ...existingIssues]
      localStorage.setItem("citizenIssues", JSON.stringify(updatedIssues))
      console.log("[v0] Issue saved to localStorage for persistence")

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
      console.error("[v0] Error saving to localStorage:", error)
    }

    // Reset form
    setFormData({ title: "", category: "", description: "" })
    setCapturedPhotos([])
    setShowReportForm(false)
    setNewIssueLocation(null)
    setGpsCoordinates(null)
    setLocationAddress("")
    setPhotoOption(null)

    alert(
      `Issue reported successfully! 
      
Ticket #${newIssue.id} created
Location: ${newIssue.location}
Priority: ${newIssue.priority}

You will receive notifications about updates. The MCC has been notified and will assign a worker soon.`,
    )
  }

  const handleBackNavigation = () => {
    console.log("[v0] Back button clicked, onClose prop:", !!onClose)

    if (onClose) {
      console.log("[v0] Using onClose callback")
      onClose()
    } else {
      console.log("[v0] Using router.back()")
      router.back()
    }
  }

  const issues = [
    {
      id: 1,
      title: "Pothole on Car Street",
      status: "Pending",
      priority: "High",
      location: "Car Street, Mangalore",
      coordinates: { x: 45, y: 60 },
      reportedBy: "Citizen #1234",
      date: "2024-01-15",
      description: "Large pothole causing traffic issues",
    },
    {
      id: 2,
      title: "Street Light Not Working",
      status: "In Progress",
      priority: "Medium",
      location: "MG Road, Mangalore",
      coordinates: { x: 55, y: 45 },
      reportedBy: "Citizen #5678",
      date: "2024-01-14",
      description: "Street light has been out for 3 days",
    },
    {
      id: 3,
      title: "Garbage Collection Delay",
      status: "Resolved",
      priority: "Low",
      location: "Kadri, Mangalore",
      coordinates: { x: 35, y: 35 },
      reportedBy: "Citizen #9012",
      date: "2024-01-12",
      description: "Garbage not collected for 2 days",
    },
    {
      id: 4,
      title: "Water Logging Issue",
      status: "Pending",
      priority: "High",
      location: "Bejai, Mangalore",
      coordinates: { x: 65, y: 55 },
      reportedBy: "Citizen #3456",
      date: "2024-01-16",
      description: "Water logging during rain",
    },
    {
      id: 5,
      title: "Broken Footpath",
      status: "In Progress",
      priority: "Medium",
      location: "Lalbagh, Mangalore",
      coordinates: { x: 40, y: 70 },
      reportedBy: "Citizen #7890",
      date: "2024-01-13",
      description: "Footpath tiles are broken and dangerous",
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackNavigation}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold gradient-text">Mangalore Interactive Map</h2>
            <p className="text-sm text-muted-foreground">
              {userType === "citizen" ? "Click anywhere to report an issue" : "View and manage all issues"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userType === "citizen" && (
            <Button
              onClick={getCurrentLocation}
              className="gradient-bg hover:opacity-90 text-white"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <Crosshair className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Use GPS
                </>
              )}
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Google Maps Embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d74.6821139!3d12.9229922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe64!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1692345678901!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, zIndex: 1 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />

        {/* Interactive overlay for issue reporting */}
        <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={handleMapClick} style={{ zIndex: 5 }}>
          {/* Issue markers overlay */}
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${issue.coordinates.x}%`,
                top: `${issue.coordinates.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIssue(issue)
              }}
            >
              <div
                className={`w-8 h-8 rounded-full border-3 border-white shadow-lg ${getStatusColor(
                  issue.status,
                )} hover:scale-110 transition-transform flex items-center justify-center`}
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">{issue.id}</span>
                </div>
              </div>
              {issue.priority === "High" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              )}
            </div>
          ))}

          {/* Current location marker */}
          {currentLocation && (
            <div
              className="absolute w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg animate-pulse z-20"
              style={{
                left: `${currentLocation.x}%`,
                top: `${currentLocation.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          )}

          {/* New issue location marker */}
          {newIssueLocation && (
            <div
              className="absolute w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg animate-bounce z-20"
              style={{
                left: `${newIssueLocation.x}%`,
                top: `${newIssueLocation.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Plus className="w-5 h-5 text-white absolute inset-0 m-auto" />
            </div>
          )}
        </div>

        {/* Map controls overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">🏙️ Mangalore City</span>
          </div>
          <p className="text-xs text-gray-600">
            {userType === "citizen" ? "Click anywhere to report an issue" : "View and manage all issues"}
          </p>
        </div>
      </div>

      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Report New Issue
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {locationAddress && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Location:</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">{locationAddress}</p>
                {gpsCoordinates && (
                  <p className="text-xs text-blue-600 mt-1">
                    GPS: {gpsCoordinates.lat.toFixed(6)}, {gpsCoordinates.lng.toFixed(6)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue Title *</Label>
              <Input
                id="issue-title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="lighting">Street Lighting</SelectItem>
                  <SelectItem value="water">Water Supply</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-description">Description *</Label>
              <Textarea
                id="issue-description"
                placeholder="Detailed description of the issue"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Attach Photos</Label>
              <div className="space-y-3">
                {!showCamera && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePhotoOption("camera")}
                      className="flex-1 bg-transparent"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePhotoOption("upload")}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                )}

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
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {capturedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {capturedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Captured ${index + 1}`}
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
            <div className="flex gap-2">
              <Button onClick={handleReportSubmit} className="flex-1 gradient-bg hover:opacity-90 text-white">
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setShowReportForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />

      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIssue && getStatusIcon(selectedIssue.status)}
              {selectedIssue?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedIssue.priority)}>{selectedIssue.priority}</Badge>
                <Badge variant="outline">{selectedIssue.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Location:</span> {selectedIssue.location}
                </div>
                <div>
                  <span className="font-medium">Reported by:</span> {selectedIssue.reportedBy}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {selectedIssue.date}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {selectedIssue.description}
                </div>
              </div>
              {userType === "mcc" && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Assign Worker
                  </Button>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
