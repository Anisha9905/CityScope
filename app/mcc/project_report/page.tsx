"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarIcon, FileText, Download, Building, MapPin, Clock, DollarSign, AlertTriangle, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ProjectReportPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectName: "",
    roadName: "",
    expectedBudget: "",
    projectNeed: "",
    technicalFeasibility: "",
    projectDescription: "",
    location: "",
    scopeOfWork: "",
    materialsRequired: "",
    timeline: "",
    safetyRequirements: ""
  })
  const [deadline, setDeadline] = useState<Date>()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBackToDashboard = () => {
    router.push('/mcc/dashboard') // Fixed path
  }

  const generatePDF = async () => {
    if (!formData.projectName || !formData.roadName || !formData.expectedBudget || !deadline) {
      alert("Please fill all required fields: Project Name, Road Name, Expected Budget, and Deadline")
      return
    }

    setIsGenerating(true)

    // Create PDF content
    const pdfContent = `
      MANGALORE CITY CORPORATION
      OFFICE OF THE MUNICIPAL COMMISSIONER
      Lalbagh, Mangalore - 575003, Karnataka
      Phone: 0824-2441615 | Email: commissioner@mcc.gov.in
      Website: www.mangalorecity.gov.in

      =================================================================
                          INVITATION FOR BIDS
      =================================================================

      IFB No: MCC/PWD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}
      Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

      SUBJECT: Invitation for Bids for ${formData.projectName}

      1. The Mangalore City Corporation (MCC) invites sealed bids from eligible and qualified 
      contractors registered with Government of Karnataka/Public Works Department for the 
      following work:

      PROJECT TITLE: ${formData.projectName}
      ROAD NAME: ${formData.roadName}
      LOCATION: ${formData.location || "Mangalore City"}
      
      ESTIMATED COST: ₹${parseInt(formData.expectedBudget).toLocaleString('en-IN')}/-
      BID SUBMISSION DEADLINE: ${deadline ? format(deadline, 'dd MMMM yyyy') : 'Not specified'}

      2. PROJECT DETAILS:
      ${formData.projectDescription}

      3. SCOPE OF WORK:
      ${formData.scopeOfWork || "Complete road construction/repair as per MCC specifications"}

      4. TECHNICAL FEASIBILITY:
      ${formData.technicalFeasibility || "Project has been technically vetted and found feasible"}

      5. PROJECT NEED & JUSTIFICATION:
      ${formData.projectNeed === "Public Safety" ? "URGENT - Public Safety Concern: This project addresses critical safety issues affecting citizens." :
        formData.projectNeed === "Infrastructure Condition" ? "Infrastructure Condition: Existing infrastructure has deteriorated beyond repair and requires immediate attention." :
        formData.projectNeed === "Community Impact" ? "Community Impact: Project will significantly improve quality of life for residents in the area." :
        formData.projectNeed === "Economic Development" ? "Economic Development: Project will stimulate local economic growth and development." :
        "Essential infrastructure improvement project."}

      6. MATERIALS REQUIREMENTS:
      ${formData.materialsRequired || "All materials must conform to IS standards and MCC specifications"}

      7. TIMELINE:
      ${formData.timeline || "Project to be completed within 90 days from issuance of work order"}

      8. SAFETY REQUIREMENTS:
      ${formData.safetyRequirements || "Contractor must comply with all safety standards and regulations"}

      9. BID DOCUMENTS:
      Bid documents can be obtained from the Office of the Executive Engineer (Roads), 
      Mangalore City Corporation, Lalbagh, Mangalore between 10:00 AM to 5:00 PM on 
      all working days on payment of ₹1000/- (Non-refundable).

      10. EARNEST MONEY DEPOSIT (EMD):
      Bidders shall submit an Earnest Money Deposit of 2% of the estimated cost 
      (₹${(parseInt(formData.expectedBudget) * 0.02).toLocaleString('en-IN')}/-) along with their bids.

      11. BID SUBMISSION:
      Sealed bids should be submitted in two separate sealed covers (Technical Bid & Financial Bid) 
      super-scribing "BID FOR ${formData.projectName.toUpperCase()}" to the Office of the 
      Municipal Commissioner on or before ${deadline ? format(deadline, 'dd/MM/yyyy') : 'specified date'} 
      up to 3:00 PM.

      12. BID OPENING:
      Technical bids will be opened on ${deadline ? format(new Date(deadline.getTime() + 24 * 60 * 60 * 1000), 'dd MMMM yyyy') : 'next working day'} 
      at 4:00 PM in the presence of bidders who choose to attend.

      13. ELIGIBILITY CRITERIA:
      - Contractor must be registered with Class-A/Class-1 license
      - Minimum 5 years experience in similar works
      - Annual turnover of at least 30% of project cost
      - Valid GST registration
      - No blacklisting by any government department

      14. EVALUATION CRITERIA:
      Bids will be evaluated based on:
      - Technical capability (40%)
      - Financial bid (40%)
      - Past performance (20%)

      15. CONTACT INFORMATION:
      For any clarification, contact:
      Executive Engineer (Roads)
      Mangalore City Corporation
      Phone: 0824-2441615
      Email: ee.roads@mcc.gov.in

      16. IMPORTANT NOTES:
      - Late bids will be rejected
      - MCC reserves the right to accept or reject any bid without assigning reasons
      - The decision of the Municipal Commissioner shall be final and binding

      =================================================================
      Municipal Commissioner,
      Mangalore City Corporation
      =================================================================

      Copy to:
      1. Chief Engineer, MCC
      2. Executive Engineer (Roads), MCC
      3. Accounts Officer, MCC
      4. File
    `

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `MCC_Bidding_${formData.projectName.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsGenerating(false)
    alert(`Bidding document generated successfully for ${formData.projectName}!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                Project Bidding Proposal
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Project Information Card */}
          <Card className="mb-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building className="w-6 h-6" />
                New Project Bidding Proposal
              </CardTitle>
              <CardDescription className="text-blue-100">
                Fill in the project details to generate a professional bidding document
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Project Name *
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Enter project title"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Road Name */}
                <div className="space-y-2">
                  <Label htmlFor="roadName" className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Road/Location Name *
                  </Label>
                  <Input
                    id="roadName"
                    placeholder="Enter road or location name"
                    value={formData.roadName}
                    onChange={(e) => handleInputChange('roadName', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Expected Budget */}
                <div className="space-y-2">
                  <Label htmlFor="expectedBudget" className="flex items-center gap-2 text-sm font-semibold">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Expected Budget (₹) *
                  </Label>
                  <Input
                    id="expectedBudget"
                    type="number"
                    placeholder="Enter estimated budget"
                    value={formData.expectedBudget}
                    onChange={(e) => handleInputChange('expectedBudget', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Project Need */}
                <div className="space-y-2">
                  <Label htmlFor="projectNeed" className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Project Need *
                  </Label>
                  <Select value={formData.projectNeed} onValueChange={(value) => handleInputChange('projectNeed', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project need" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public Safety">Public Safety</SelectItem>
                      <SelectItem value="Infrastructure Condition">Infrastructure Condition</SelectItem>
                      <SelectItem value="Community Impact">Community Impact</SelectItem>
                      <SelectItem value="Economic Development">Economic Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarIcon className="w-4 h-4 text-red-600" />
                    Bid Submission Deadline *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "Select deadline date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Project Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter specific location details"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2 mt-6">
                <Label htmlFor="projectDescription" className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Project Description *
                </Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Detailed description of the project, objectives, and requirements..."
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Technical Feasibility */}
              <div className="space-y-2 mt-6">
                <Label htmlFor="technicalFeasibility" className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Technical Feasibility Assessment
                </Label>
                <Textarea
                  id="technicalFeasibility"
                  placeholder="Technical feasibility analysis, site conditions, challenges..."
                  value={formData.technicalFeasibility}
                  onChange={(e) => handleInputChange('technicalFeasibility', e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Additional Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Scope of Work */}
                <div className="space-y-2">
                  <Label htmlFor="scopeOfWork" className="text-sm font-semibold">
                    Scope of Work
                  </Label>
                  <Textarea
                    id="scopeOfWork"
                    placeholder="Detailed scope of work, deliverables, specifications..."
                    value={formData.scopeOfWork}
                    onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Materials Required */}
                <div className="space-y-2">
                  <Label htmlFor="materialsRequired" className="text-sm font-semibold">
                    Materials Requirements
                  </Label>
                  <Textarea
                    id="materialsRequired"
                    placeholder="Required materials, quality standards, specifications..."
                    value={formData.materialsRequired}
                    onChange={(e) => handleInputChange('materialsRequired', e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Project Timeline
                  </Label>
                  <Textarea
                    id="timeline"
                    placeholder="Project schedule, milestones, completion timeline..."
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Safety Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="safetyRequirements" className="text-sm font-semibold">
                    Safety Requirements
                  </Label>
                  <Textarea
                    id="safetyRequirements"
                    placeholder="Safety protocols, compliance requirements, precautions..."
                    value={formData.safetyRequirements}
                    onChange={(e) => handleInputChange('safetyRequirements', e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  {isGenerating ? (
                    <>Generating PDF...</>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Generate Bidding Document
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="py-3 text-lg"
                >
                  Cancel
                </Button>
              </div>

              {/* Requirements Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Required Information for Bidding Document</h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">1</Badge>
                        <span>Project Name & Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">2</Badge>
                        <span>Budget Estimate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">3</Badge>
                        <span>Project Need & Justification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">4</Badge>
                        <span>Bid Submission Deadline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-purple-600" />
                Bidding Document Preview
              </CardTitle>
              <CardDescription>
                Professional bidding document will be generated with all required government formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-bold text-lg">MANGALORE CITY CORPORATION</h3>
                  <p className="text-sm text-gray-600">INVITATION FOR BIDS</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Project:</span>
                    <span>{formData.projectName || "Project Name"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Location:</span>
                    <span>{formData.roadName || "Road/Location"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Budget:</span>
                    <span>₹{formData.expectedBudget ? parseInt(formData.expectedBudget).toLocaleString('en-IN') : "0"}/-</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Deadline:</span>
                    <span>{deadline ? format(deadline, 'dd/MM/yyyy') : "Not set"}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center mt-4">
                  The complete bidding document will include: Project details, scope of work, technical specifications, 
                  eligibility criteria, bid submission guidelines, and contract terms as per government standards.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}