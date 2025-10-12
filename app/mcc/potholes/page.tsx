"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, MapPin, Users, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"

// Dummy data for 10 regions of Mangalore (all values under 100)
const potholeData = {
  "30days": {
    regions: [
      { name: "Kadri", cases: 45, reportedBy: 32, fixed: 28, pending: 12, inProgress: 5, riskLevel: "High" },
      { name: "Hampankatta", cases: 38, reportedBy: 28, fixed: 25, pending: 8, inProgress: 5, riskLevel: "High" },
      { name: "Pumpwell", cases: 52, reportedBy: 41, fixed: 35, pending: 12, inProgress: 5, riskLevel: "Very High" },
      { name: "Kankanady", cases: 29, reportedBy: 22, fixed: 18, pending: 7, inProgress: 4, riskLevel: "Medium" },
      { name: "Mangaladevi", cases: 33, reportedBy: 25, fixed: 20, pending: 8, inProgress: 5, riskLevel: "High" },
      { name: "Bendoorwell", cases: 41, reportedBy: 35, fixed: 28, pending: 9, inProgress: 4, riskLevel: "High" },
      { name: "Attavar", cases: 26, reportedBy: 19, fixed: 16, pending: 6, inProgress: 4, riskLevel: "Medium" },
      { name: "Kodialbail", cases: 35, reportedBy: 28, fixed: 22, pending: 8, inProgress: 5, riskLevel: "High" },
      { name: "Bejai", cases: 31, reportedBy: 24, fixed: 19, pending: 7, inProgress: 5, riskLevel: "Medium" },
      { name: "Kulur", cases: 22, reportedBy: 17, fixed: 14, pending: 5, inProgress: 3, riskLevel: "Low" }
    ]
  },
  "7days": {
    regions: [
      { name: "Kadri", cases: 12, reportedBy: 9, fixed: 8, pending: 3, inProgress: 1, riskLevel: "High" },
      { name: "Hampankatta", cases: 8, reportedBy: 6, fixed: 5, pending: 2, inProgress: 1, riskLevel: "Medium" },
      { name: "Pumpwell", cases: 15, reportedBy: 12, fixed: 10, pending: 3, inProgress: 2, riskLevel: "Very High" },
      { name: "Kankanady", cases: 6, reportedBy: 4, fixed: 3, pending: 2, inProgress: 1, riskLevel: "Low" },
      { name: "Mangaladevi", cases: 9, reportedBy: 7, fixed: 6, pending: 2, inProgress: 1, riskLevel: "Medium" },
      { name: "Bendoorwell", cases: 11, reportedBy: 8, fixed: 7, pending: 2, inProgress: 2, riskLevel: "High" },
      { name: "Attavar", cases: 5, reportedBy: 4, fixed: 3, pending: 1, inProgress: 1, riskLevel: "Low" },
      { name: "Kodialbail", cases: 7, reportedBy: 5, fixed: 4, pending: 2, inProgress: 1, riskLevel: "Medium" },
      { name: "Bejai", cases: 8, reportedBy: 6, fixed: 5, pending: 2, inProgress: 1, riskLevel: "Medium" },
      { name: "Kulur", cases: 4, reportedBy: 3, fixed: 2, pending: 1, inProgress: 1, riskLevel: "Low" }
    ]
  },
  "6months": {
    regions: [
      { name: "Kadri", cases: 85, reportedBy: 65, fixed: 55, pending: 20, inProgress: 10, riskLevel: "High" },
      { name: "Hampankatta", cases: 78, reportedBy: 62, fixed: 52, pending: 18, inProgress: 8, riskLevel: "High" },
      { name: "Pumpwell", cases: 95, reportedBy: 78, fixed: 65, pending: 22, inProgress: 8, riskLevel: "Very High" },
      { name: "Kankanady", cases: 58, reportedBy: 45, fixed: 38, pending: 12, inProgress: 8, riskLevel: "Medium" },
      { name: "Mangaladevi", cases: 72, reportedBy: 58, fixed: 48, pending: 16, inProgress: 8, riskLevel: "High" },
      { name: "Bendoorwell", cases: 82, reportedBy: 68, fixed: 55, pending: 18, inProgress: 9, riskLevel: "High" },
      { name: "Attavar", cases: 48, reportedBy: 38, fixed: 32, pending: 10, inProgress: 6, riskLevel: "Medium" },
      { name: "Kodialbail", cases: 68, reportedBy: 55, fixed: 45, pending: 15, inProgress: 8, riskLevel: "High" },
      { name: "Bejai", cases: 62, reportedBy: 48, fixed: 40, pending: 14, inProgress: 8, riskLevel: "Medium" },
      { name: "Kulur", cases: 42, reportedBy: 32, fixed: 28, pending: 8, inProgress: 6, riskLevel: "Low" }
    ]
  }
}

const riskAnalysis = {
  "Very High": {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    description: "Critical infrastructure damage, immediate attention required",
    precautions: ["Emergency road repairs", "Traffic diversion", "Heavy machinery deployment", "24/7 monitoring"]
  },
  "High": {
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    description: "Significant road deterioration, scheduled repairs needed",
    precautions: ["Priority road maintenance", "Regular inspections", "Preventive measures", "Community awareness"]
  },
  "Medium": {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    description: "Moderate wear and tear, routine maintenance required",
    precautions: ["Scheduled maintenance", "Quality material usage", "Drainage improvement", "Regular monitoring"]
  },
  "Low": {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    description: "Minimal damage, preventive maintenance sufficient",
    precautions: ["Preventive maintenance", "Quality construction", "Proper drainage", "Regular inspections"]
  }
}

export default function PotholesAnalysis() {
  const [selectedTimeline, setSelectedTimeline] = useState("30days")
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const router = useRouter()

  const currentData = potholeData[selectedTimeline as keyof typeof potholeData]
  const totalCases = currentData.regions.reduce((sum, region) => sum + region.cases, 0)
  const totalFixed = currentData.regions.reduce((sum, region) => sum + region.fixed, 0)
  const totalPending = currentData.regions.reduce((sum, region) => sum + region.pending, 0)
  const totalInProgress = currentData.regions.reduce((sum, region) => sum + region.inProgress, 0)

  const getRiskLevelCount = (level: string) => {
    return currentData.regions.filter(region => region.riskLevel === level).length
  }

  const getHighRiskZones = () => {
    return currentData.regions
      .filter(region => region.riskLevel === "Very High" || region.riskLevel === "High")
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 3)
  }

  const handleRegionClick = (region: any) => {
    setSelectedRegion(region)
    setShowDetailsModal(true)
  }

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case "7days": return "Past Week"
      case "30days": return "Past 30 Days"
      case "6months": return "Past 6 Months"
      default: return timeline
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Potholes Analysis
                </h1>
                <p className="text-sm text-gray-600">Region-wise Infrastructure Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={selectedTimeline} onValueChange={setSelectedTimeline}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Past Week</SelectItem>
                  <SelectItem value="30days">Past 30 Days</SelectItem>
                  <SelectItem value="6months">Past 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold text-blue-600">{totalCases}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fixed</p>
                  <p className="text-2xl font-bold text-green-600">{totalFixed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalInProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-red-600">{totalPending}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Region Map */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Region-wise Pothole Distribution ({getTimelineLabel(selectedTimeline)})
            </CardTitle>
            <CardDescription className="text-gray-600">
              Click on any region to view detailed information. Hover to see quick stats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentData.regions.map((region, index) => {
                const riskInfo = riskAnalysis[region.riskLevel as keyof typeof riskAnalysis]
                const isHovered = hoveredRegion === region.name
                const maxCases = Math.max(...currentData.regions.map(r => r.cases))
                const intensity = (region.cases / maxCases) * 100

                return (
                  <div
                    key={region.name}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${riskInfo.bgColor} border-2 ${
                      isHovered ? 'border-orange-400 shadow-lg' : 'border-transparent'
                    }`}
                    onClick={() => handleRegionClick(region)}
                    onMouseEnter={() => setHoveredRegion(region.name)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {/* Intensity Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-xl">
                      <div 
                        className={`h-full ${riskInfo.color} transition-all duration-500`}
                        style={{ width: `${intensity}%` }}
                      ></div>
                    </div>

                    <div className="pt-2">
                      <h3 className="font-bold text-sm mb-2 text-gray-800">{region.name}</h3>
                      
                      {isHovered ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cases:</span>
                            <span className="font-semibold">{region.cases}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fixed:</span>
                            <span className="font-semibold text-green-600">{region.fixed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-semibold text-red-600">{region.pending}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{region.cases}</p>
                            <p className="text-xs text-gray-600">Total Cases</p>
                          </div>
                          <Badge className={`${riskInfo.textColor} ${riskInfo.bgColor} border-0`}>
                            {region.riskLevel}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                High Risk Zones Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getHighRiskZones().map((region, index) => {
                  const riskInfo = riskAnalysis[region.riskLevel as keyof typeof riskAnalysis]
                  return (
                    <div key={region.name} className={`p-4 rounded-lg ${riskInfo.bgColor} border-l-4 ${riskInfo.color}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{region.name}</h4>
                        <Badge className={`${riskInfo.textColor} ${riskInfo.bgColor} border-0`}>
                          {region.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{riskInfo.description}</p>
                      <div className="text-xs text-gray-500">
                        {region.cases} cases • {region.pending} pending • {region.fixed} fixed
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                Prevention Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(riskAnalysis).map(([level, info]) => (
                  <div key={level} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                      <h4 className="font-semibold text-gray-800">{level} Risk</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Precautions:</strong> {info.precautions.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution Chart */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">
              Status Distribution Across Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totalFixed}</div>
                      <div className="text-xs text-gray-600">Fixed</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-500 opacity-20"></div>
                </div>
                <p className="text-sm text-gray-600">Completed Repairs</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{totalInProgress}</div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-500 opacity-20"></div>
                </div>
                <p className="text-sm text-gray-600">Ongoing Work</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{totalPending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20"></div>
                </div>
                <p className="text-sm text-gray-600">Awaiting Action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {selectedRegion?.name} - Detailed Analysis
            </DialogTitle>
          </DialogHeader>
          {selectedRegion && (
            <div className="space-y-6">
              {/* Risk Level */}
              <div className={`p-4 rounded-lg ${riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].bgColor} border-l-4 ${riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].color}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Risk Level</h3>
                  <Badge className={`${riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].textColor} ${riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].bgColor} border-0`}>
                    {selectedRegion.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].description}
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedRegion.cases}</div>
                  <div className="text-sm text-gray-600">Total Cases</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedRegion.fixed}</div>
                  <div className="text-sm text-gray-600">Fixed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedRegion.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedRegion.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>

              {/* Citizen Reports */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Citizen Reports
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedRegion.reportedBy} citizens have reported issues in this region
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                  Assign Worker
                </Button>
                <Button variant="outline" className="flex-1">
                  View All Reports
                </Button>
              </div>

              {/* Precautions */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Precautions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {riskAnalysis[selectedRegion.riskLevel as keyof typeof riskAnalysis].precautions.map((precaution, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
