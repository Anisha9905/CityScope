"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Building, FileText, ArrowLeft, Search, MapPin, Calendar, AlertCircle } from "lucide-react"

// Sample construction companies data
const constructionCompanies = [
  {
    id: 1,
    name: "BuildWell Constructions Pvt Ltd",
    registrationNumber: "KARN/2018/12345",
    contactPerson: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "contact@buildwell.com",
    projects: [
      { region: "MG Road", workType: "Road Construction", completionDate: "2023-08-15", length: "2.5 km" },
      { region: "Hampankatta", workType: "Road Resurfacing", completionDate: "2024-01-20", length: "1.2 km" }
    ]
  },
  {
    id: 2,
    name: "Coastal Infrastructure Solutions",
    registrationNumber: "KARN/2019/67890",
    contactPerson: "Suresh Shetty",
    phone: "+91 98456 78901",
    email: "info@coastalinfra.com",
    projects: [
      { region: "Kadri", workType: "Road Development", completionDate: "2023-11-10", length: "3.1 km" },
      { region: "Balmatta Road", workType: "Road Construction", completionDate: "2024-02-05", length: "1.8 km" }
    ]
  },
  {
    id: 3,
    name: "Mangalore Road Developers",
    registrationNumber: "KARN/2020/24680",
    contactPerson: "Prakash Rai",
    phone: "+91 99160 12345",
    email: "contact@mrdevelopers.com",
    projects: [
      { region: "Bejai", workType: "Road Construction", completionDate: "2023-09-25", length: "2.0 km" },
      { region: "Kankanady", workType: "Road Widening", completionDate: "2024-03-12", length: "1.5 km" }
    ]
  },
  {
    id: 4,
    name: "Karnataka Highway Contractors",
    registrationNumber: "KARN/2017/13579",
    contactPerson: "Manjunath Gowda",
    phone: "+91 97418 56789",
    email: "khc@highways.com",
    projects: [
      { region: "Pandeshwar", workType: "Highway Development", completionDate: "2023-10-30", length: "4.2 km" },
      { region: "Surathkal", workType: "Road Construction", completionDate: "2024-01-15", length: "2.8 km" }
    ]
  },
  {
    id: 5,
    name: "Premier Construction Company",
    registrationNumber: "KARN/2021/98765",
    contactPerson: "Ashok Shenoy",
    phone: "+91 98450 98765",
    email: "premier@construction.com",
    projects: [
      { region: "Bunts Hostel Road", workType: "Road Resurfacing", completionDate: "2023-12-20", length: "1.0 km" },
      { region: "Lalbagh", workType: "Road Development", completionDate: "2024-02-28", length: "1.6 km" }
    ]
  }
]

export default function ConstructionCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const filteredCompanies = constructionCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.projects.some(p => p.region.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const generateComplaintReport = (company: any, project: any) => {
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
    
    const reportContent = `MANGALORE CITY CORPORATION
Office of the Municipal Commissioner
Lalbagh, Mangalore - 575003, Karnataka
Phone: 0824-2441615 | Email: commissioner@mcc.gov.in

Date: ${currentDate}
Ref No: MCC/INFRA/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}

To,
${company.name}
Contact Person: ${company.contactPerson}
Phone: ${company.phone}
Email: ${company.email}
Registration No: ${company.registrationNumber}

Subject: Notice Regarding Poor Road Quality and Pothole Formation - ${project.region}, Mangalore

Dear Sir/Madam,

RE: COMPLAINT REGARDING SUBSTANDARD ROAD CONSTRUCTION WORK

This is with reference to the road construction/development work executed by your esteemed company in ${project.region}, Mangalore, which was completed on ${project.completionDate}.

DETAILS OF THE PROJECT:
- Location: ${project.region}, Mangalore
- Work Type: ${project.workType}
- Length: ${project.length}
- Completion Date: ${project.completionDate}
- Company: ${company.name}
- Registration Number: ${company.registrationNumber}

NATURE OF COMPLAINT:

It has come to our notice through multiple citizen complaints and our own inspection that the road constructed by your company in ${project.region} has developed severe potholes and structural defects within a short period after completion. This is causing significant inconvenience to the public and poses serious safety hazards to commuters.

The following issues have been observed:
1. Formation of multiple deep potholes across the road surface
2. Poor quality of materials used in construction
3. Inadequate drainage leading to water accumulation
4. Premature deterioration of road surface
5. Non-compliance with municipal construction standards

LEGAL IMPLICATIONS:

As per the contract terms and the Karnataka Municipal Corporation Act, your company is responsible for:
- Ensuring quality construction as per approved specifications
- Providing maintenance warranty for the stipulated period
- Using materials conforming to IS standards
- Following proper construction methodology

REQUIRED ACTION:

You are hereby directed to:

1. Submit a detailed technical explanation regarding the causes of premature road deterioration within 7 (SEVEN) DAYS from the receipt of this notice.

2. Provide a comprehensive action plan for rectification of all defects, including:
   - Timeline for repair work
   - Materials to be used
   - Quality assurance measures
   - Traffic management plan during repairs

3. Commence rectification work within 14 (FOURTEEN) DAYS of submitting the action plan.

4. Bear all costs associated with the repair and restoration work.

CONSEQUENCES OF NON-COMPLIANCE:

Failure to respond to this notice or take appropriate corrective action within the stipulated timeframe will result in:

1. Blacklisting of your company from future MCC projects
2. Recovery of repair costs from your performance bank guarantee
3. Penalty as per contract terms and conditions
4. Legal action under relevant sections of Karnataka Municipal Corporation Act
5. Cancellation of your company's registration with MCC
6. Reporting to State Government authorities for suspension of contracting license

We expect your immediate attention to this matter and prompt action to resolve the issues. The quality of public infrastructure is of paramount importance, and we cannot compromise on the safety and convenience of our citizens.

Please acknowledge receipt of this notice and submit your response to the undersigned within the specified timeframe.

For any clarification, you may contact:
Engineering Department
Mangalore City Corporation
Phone: 0824-2441615
Email: engineering@mcc.gov.in

Yours faithfully,

_______________________
Municipal Commissioner
Mangalore City Corporation

CC:
1. Chief Engineer, MCC
2. Executive Engineer (Roads), MCC
3. Assistant Commissioner (Legal), MCC
4. File

---
Note: This is an official communication from Mangalore City Corporation. Any delay or non-compliance will be viewed seriously and appropriate legal action will be initiated.`

    // Create CSV content
    const csvContent = reportContent

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download',`MCC_Complaint_${company.name.replace(/\s+/g, '_')}_${project.region.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert(`Complaint report generated successfully for ${company.name} - ${project.region}`)
  }

  const handleViewDetails = (company: any) => {
    setSelectedCompany(company)
    setShowDetailsModal(true)
  }

  const handleBackToDashboard = () => {
    // This would typically use window.history.back() or navigate to /mcc
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/mcc'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
      </div>

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
              <Building className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Construction Companies
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by company name or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Badge variant="outline" className="text-sm">
                {filteredCompanies.length} Companies
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      {company.name}
                    </CardTitle>
                    <CardDescription className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Reg. No:</span>
                        <span>{company.registrationNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Contact:</span>
                        <span>{company.contactPerson} | {company.phone}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(company)}
                    className="ml-4"
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Projects in Mangalore ({company.projects.length})
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {company.projects.map((project, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">{project.region}</h5>
                            <p className="text-sm text-gray-600">{project.workType}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.length}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Calendar className="w-3 h-3" />
                          Completed: {project.completionDate}
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            setSelectedProject(project)
                            generateComplaintReport(company, project)
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Complaint Report
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No construction companies found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Company Details
            </DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Company Name:</span>
                  <p className="mt-1">{selectedCompany.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Registration Number:</span>
                  <p className="mt-1">{selectedCompany.registrationNumber}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Contact Person:</span>
                  <p className="mt-1">{selectedCompany.contactPerson}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Phone:</span>
                  <p className="mt-1">{selectedCompany.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <p className="mt-1">{selectedCompany.email}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Projects ({selectedCompany.projects.length})</h4>
                <div className="space-y-3">
                  {selectedCompany.projects.map((project: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-800">{project.region}</h5>
                          <p className="text-sm text-gray-600 mt-1">{project.workType}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Length: {project.length} | Completed: {project.completionDate}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            generateComplaintReport(selectedCompany, project)
                            setShowDetailsModal(false)
                          }}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}