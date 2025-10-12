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

export default function ReportNewIssuePage() {
  const router = useRouter()

  const [issueType, setIssueType] = useState("")
  const [lightsAffected, setLightsAffected] = useState("")
  const [landmark, setLandmark] = useState("")
  const [brief, setBrief] = useState("")
  const [details, setDetails] = useState("")
  const [location, setLocation] = useState("Fetching location...")
  const [gps, setGps] = useState("...")
  const [photo, setPhoto] = useState<File | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(6)
          const long = position.coords.longitude.toFixed(6)
          setGps(`${lat}, ${long}`)

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
            )
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

    if (!issueType || !lightsAffected || !landmark || !brief) {
      toast.error("⚠️ Please fill in all required fields correctly.")
      return
    }

    // Save submitted issue in localStorage
    const savedIssues = typeof window !== "undefined" ? localStorage.getItem("citizenIssues") : null
    const issues = savedIssues ? JSON.parse(savedIssues) : []
    const newIssue = {
      id: issues.length + 1,
      title: `${issueType} - ${lightsAffected} affected`,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    }
    issues.push(newIssue)
    localStorage.setItem("citizenIssues", JSON.stringify(issues))

    toast.success("✅ Streetlight issue reported successfully!")

    // Reset form
    setIssueType("")
    setLightsAffected("")
    setLandmark("")
    setBrief("")
    setDetails("")
    setPhoto(null)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 pt-6"
      style={{ backgroundImage: "url('/streetlightreport.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => router.push("/citizen/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      {/* Report Box */}
      <Card className="w-full max-w-md shadow-lg bg-white flex flex-col">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold text-blue-600">
            Report New Issue
          </CardTitle>
        </CardHeader>

        {/* Scrollable Form */}
        <CardContent className="flex-1 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
              <MapPin className="w-5 h-5" />
              <span>{location}</span>
            </div>
            <div className="text-sm text-gray-500">GPS: {gps}</div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Type of Issue</label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_working">Streetlight not working</SelectItem>
                  <SelectItem value="flickering">Light flickering</SelectItem>
                  <SelectItem value="daytime">Light on during daytime</SelectItem>
                  <SelectItem value="damaged">Broken pole / damaged wiring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Number of Streetlights Affected</label>
              <Input
                type="text"
                placeholder="e.g., 1, 2 or Entire street"
                value={lightsAffected}
                onChange={(e) => setLightsAffected(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nearest Landmark</label>
              <Input
                type="text"
                placeholder="e.g., Near City Hospital"
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

            {/* Photo / Upload */}
            <div>
              <label className="text-sm font-medium">Take Photo / Upload File</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              />
            </div>

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
    </div>
  )
}
