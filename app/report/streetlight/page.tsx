"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { MapPin, ArrowLeft, Cloud } from "lucide-react"

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
  const [weather, setWeather] = useState({
    temp: "...",
    condition: "...",
    humidity: "...",
    windSpeed: "..."
  })

  useEffect(() => {
    async function fetchWeather() {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "6244b6aa16bc4ac20725f1f5d04fd885"
        const city = "Mangalore"
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await res.json()
        if (data && data.main) {
          setWeather({
            temp: `${Math.round(data.main.temp)}°C`,
            condition: data.weather?.[0]?.main || "...",
            humidity: `${data.main.humidity}%`,
            windSpeed: `${data.wind?.speed ?? "..."} m/s`
          })
        }
      } catch (err) {
        console.error("Error fetching weather for streetlight report:", err)
      }
    }
    fetchWeather()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!issueType || !lightsAffected || !landmark || !brief) {
      toast.error("⚠️ Please fill in all required fields correctly.")
      return
    }

    const newIssue = {
      id: Date.now(),
      title: `Streetlight: ${issueType.replace("_", " ")} - ${lightsAffected} affected`,
      status: "Pending",
      priority: "Medium",
      location: location,
      gps: gps,
      landmark: landmark,
      brief: brief,
      description: details || brief,
      reportedBy: "Citizen Priya Shetty",
      date: new Date().toLocaleDateString("en-GB"),
      weather: `${weather.temp} ${weather.condition}`
    }

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIssue)
      })

      if (!res.ok) throw new Error("Failed to save to database")
      toast.success("✅ Streetlight issue reported successfully!")
    } catch (err) {
      console.error(err)
      const savedIssues = typeof window !== "undefined" ? localStorage.getItem("citizenIssues") : null
      const issues = savedIssues ? JSON.parse(savedIssues) : []
      issues.push(newIssue)
      localStorage.setItem("citizenIssues", JSON.stringify(issues))
      toast.success("✅ Streetlight issue reported successfully (local storage fallback)!")
    }

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
      {/* Report Box */}
      <Card className="w-full max-w-md shadow-lg bg-white flex flex-col">
        <CardHeader className="relative flex flex-col items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/citizen/dashboard")}
            className="absolute left-4 top-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <CardTitle className="text-center text-lg font-bold text-blue-600 pt-6">
            Report New Issue
          </CardTitle>
        </CardHeader>

        {/* Scrollable Form */}
        <CardContent className="flex-1 overflow-y-auto max-h-[70vh]">
          <div className="mb-4 space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" /> Location (Editable)
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm"
            />
            <div className="text-sm text-gray-500">GPS: {gps}</div>
          </div>

          {/* Weather Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500 animate-pulse" />
              <div>
                <div className="text-xs text-blue-600 font-semibold">Real-time Weather</div>
                <div className="text-sm font-bold text-blue-900">{weather.temp} - {weather.condition}</div>
              </div>
            </div>
            <div className="text-xs text-blue-700 text-right">
              <div>Humidity: {weather.humidity}</div>
              <div>Wind: {weather.windSpeed}</div>
            </div>
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
