"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, ArrowLeft, Camera, Upload, Crosshair } from "lucide-react"
import { useRouter } from "next/navigation"

interface Issue {
  id: number
  title: string
  description: string
  detailedDescription: string
  photos?: string[]
  location: string
  gps: { lat: number; lng: number }
}

export default function MangaloreMap() {
  const [showReportForm, setShowReportForm] = useState(false)
  const [location, setLocation] = useState("MG Road, Mangalore - 575001")
  const [gps, setGps] = useState<{ lat: number; lng: number }>({ lat: 12.8731, lng: 74.843 })
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
  })
  const [photos, setPhotos] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch GPS location and reverse geocode
  const fetchLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported")

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setGps({ lat: latitude, lng: longitude })

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const address = data.display_name || "Unknown Location"
          setLocation(address)
        } catch (err) {
          console.error("Reverse geocoding failed:", err)
          setLocation("Location unavailable")
        }

        setShowReportForm(true)
      },
      (err) => {
        console.error(err)
        alert("Failed to get GPS location. Make sure location access is allowed.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Handle file uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const urls = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
    setPhotos([...photos, ...urls])
  }

  // Open camera
  const openCamera = async () => {
    setShowCamera(true)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.error(err)
        alert("Cannot access camera")
      }
    } else {
      alert("Camera not supported")
    }
  }

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext("2d")
    if (!context) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvasRef.current.toDataURL("image/png")
    setPhotos([...photos, dataUrl])
    stopCamera()
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  // Submit report
  const handleReportSubmit = () => {
    if (!formData.title || !formData.detailedDescription)
      return alert("Please fill all required fields")

    const newIssue: Issue = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      detailedDescription: formData.detailedDescription,
      photos,
      location,
      gps,
    }

    console.log("Submitted Issue:", newIssue)
    alert("Issue submitted successfully!")

    // Reset form
    setFormData({ title: "", description: "", detailedDescription: "" })
    setPhotos([])
    setShowReportForm(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-bold text-lg text-purple-700">Mangalore Interactive Map</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchLocation}
            className="gradient-bg hover:opacity-90 text-white flex items-center gap-2"
          >
            <Crosshair className="w-4 h-4" />
            Use GPS
          </Button>
          <Button
            onClick={() => setShowReportForm(true)}
            className="gradient-bg hover:opacity-90 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Report Issue
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d74.6821139!3d12.9229922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe64!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1692345678901!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="absolute inset-0"
        />
      </div>

      {/* Report Form Dialog */}
      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Report New Issue</DialogTitle>
          </DialogHeader>

          {/* Location */}
          <div className="mb-4">
            <Label>Location</Label>
            <Input value={location} readOnly className="mb-2" />
            <div className="text-sm text-gray-600">
              GPS: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}
            </div>
          </div>

          {/* Issue Title */}
          <div className="mb-4">
            <Label>Brief description of the issue</Label>
            <Input
              placeholder="Issue title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Detailed Description */}
          <div className="mb-4">
            <Label>Detailed description of the issue</Label>
            <Textarea
              placeholder="Explain the issue in detail..."
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
            />
          </div>

          {/* Photo Upload / Camera */}
          <div className="mb-4 flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gradient-bg hover:opacity-90 text-white flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <Button
              onClick={openCamera}
              className="gradient-bg hover:opacity-90 text-white flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Camera Preview */}
          {showCamera && (
            <div className="mb-4 flex flex-col items-center">
              <video ref={videoRef} autoPlay className="w-full rounded-md border mb-2" />
              <div className="flex gap-2">
                <Button onClick={capturePhoto}>Capture</Button>
                <Button variant="secondary" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Display selected photos */}
          <div className="flex flex-wrap gap-2 mb-4">
            {photos.map((p, i) => (
              <img key={i} src={p} alt="photo" className="w-16 h-16 object-cover rounded-md border" />
            ))}
          </div>

          {/* Submit / Cancel */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowReportForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportSubmit}>Submit Report</Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
