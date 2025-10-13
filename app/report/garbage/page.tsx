"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { MapPin, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function ReportGarbagePage() {
  const router = useRouter()

  const [issueType, setIssueType] = useState("")
  const [binsAffected, setBinsAffected] = useState("")
  const [landmark, setLandmark] = useState("")
  const [brief, setBrief] = useState("")
  const [details, setDetails] = useState("")
  const [contact, setContact] = useState("")
  const [location, setLocation] = useState("Fetching location...")
  const [gps, setGps] = useState("...")
  const [photo, setPhoto] = useState<File | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toFixed(6)
          const long = pos.coords.longitude.toFixed(6)
          setGps(`${lat}, ${long}`)

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`)
            const data = await res.json()
            const street = data.address.road || data.address.neighbourhood || "Unknown street"
            const city = data.address.city || data.address.town || data.address.village || "Unknown city"
            const postcode = data.address.postcode || "Unknown postcode"
            setLocation(`${street}, ${city} - ${postcode}`)
          } catch {
            setLocation("Unable to fetch address")
          }
        },
        () => {
          setGps("Unavailable")
          setLocation("Location permission denied")
        }
      )
    } else {
      setGps("Not supported")
      setLocation("Not supported")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!issueType || !binsAffected || !landmark || !brief) {
      toast.error("⚠️ Please fill in all required fields correctly.")
      return
    }

    // Generate new issue
    const id = Date.now()
    const date = new Date().toLocaleDateString("en-GB")
    const imageUrl = photo ? URL.createObjectURL(photo) : null
    const title = `${issueType} - ${binsAffected}`

    const newIssue = {
      id,
      title,
      status: "Pending",
      date,
      location,
      gps,
      landmark,
      brief,
      details,
      contact,
      photo: imageUrl,
    }

    // 1️⃣ Save to Citizen Dashboard (My Reported Issues)
    const savedIssues = JSON.parse(localStorage.getItem("citizenIssues") || "[]")
    savedIssues.push(newIssue)
    localStorage.setItem("citizenIssues", JSON.stringify(savedIssues))

    // 2️⃣ Also Save to Community Feed
    const savedPosts = JSON.parse(localStorage.getItem("communityPosts") || "[]")
    savedPosts.push({
      id,
      user: "You",
      content: title,
      image: imageUrl,
      likes: 0,
      reposts: 0,
      reports: 0,
      comments: [],
    })
    localStorage.setItem("communityPosts", JSON.stringify(savedPosts))

    toast.success("✅ Issue added to My Reports and Community Feed!")

    // 3️⃣ Redirect to Community Page
    router.push("/citizen/community")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 pt-6"
      style={{
        backgroundImage: "url('/garbagereport.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => router.push("/citizen/dashboard")}>
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
      </div>

      {/* Form Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md h-[85vh] overflow-y-auto"
      >
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold text-green-600">
              Report New Garbage Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Location */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
                <MapPin className="w-5 h-5" />
                <span>{location}</span>
              </div>
              <div className="text-sm text-gray-500">GPS: {gps}</div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Type of Issue</label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Garbage not collected">Garbage not collected</SelectItem>
                    <SelectItem value="Overflowing bins">Overflowing bins</SelectItem>
                    <SelectItem value="Illegal dumping / littering">Illegal dumping / littering</SelectItem>
                    <SelectItem value="Hazardous / bio-waste">Hazardous / bio-waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Number of Bins / Area</label>
                <Input
                  type="text"
                  placeholder="e.g., 2 bins or entire street"
                  value={binsAffected}
                  onChange={(e) => setBinsAffected(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nearest Landmark</label>
                <Input
                  type="text"
                  placeholder="e.g., Opposite City Park"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Brief Description</label>
                <Input
                  type="text"
                  placeholder="Short summary"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Detailed Description (optional)</label>
                <Textarea
                  placeholder="Add more details..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contact Info (optional)</label>
                <Input
                  type="text"
                  placeholder="Phone or Email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Upload Photo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/citizen/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gradient-bg text-white">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
