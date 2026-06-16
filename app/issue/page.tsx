// app/issue/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { ArrowLeft, MapPin, Loader2, Truck, List, Check, Clock, LocateFixed, Users, User, ArrowRight } from "lucide-react"

// --- 1. DUMMY DATA AND TYPES ---

const MANGALORE_REGIONS = ["All Regions", "Kadri", "Bejai", "Surathkal", "Bunder", "Kottara"];

const DUMMY_WORKERS = ["Unassigned", "Ramesh S.", "Priya K.", "Sunil V.", "Geeta M."];

interface TruckLocation {
  id: string;
  region: string; 
  status: "In Route" | "At Dump" | "Complete";
  lastUpdated: string;
  route: string;
}

const DUMMY_TRUCK_LOCATIONS: TruckLocation[] = [
  { id: "MNG-T001", region: "Kadri", status: "In Route", lastUpdated: "5 mins ago", route: "Kadri Route" },
  { id: "MNG-T002", region: "Bunder", status: "At Dump", lastUpdated: "10 mins ago", route: "Central Market" },
  { id: "MNG-T003", region: "Surathkal", status: "Complete", lastUpdated: "2 hrs ago", route: "Surathkal Route" },
  { id: "MNG-T004", region: "Kadri", status: "In Route", lastUpdated: "2 mins ago", route: "Kadri Route" },
  { id: "MNG-T005", region: "Kottara", status: "In Route", lastUpdated: "8 mins ago", route: "Kottara Route" },
];

interface GarbageStats {
    totalIssues: number;
    resolvedToday: number;
    inRouteTrucks: number;
}

const DUMMY_GARBAGE_STATS: Record<string, GarbageStats> = {
    "All Regions": { totalIssues: 25, resolvedToday: 5, inRouteTrucks: 8 },
    "Kadri": { totalIssues: 7, resolvedToday: 2, inRouteTrucks: 2 },
    "Bejai": { totalIssues: 5, resolvedToday: 1, inRouteTrucks: 1 },
    "Surathkal": { totalIssues: 4, resolvedToday: 1, inRouteTrucks: 1 },
    "Bunder": { totalIssues: 6, resolvedToday: 1, inRouteTrucks: 2 },
    "Kottara": { totalIssues: 3, resolvedToday: 0, inRouteTrucks: 2 },
};

type IssueStatus = "Pending" | "In Progress" | "Resolved";

interface Issue {
  id: number
  title: string
  status: IssueStatus
  date: string
  location?: string
  description?: string
  region?: string 
  assignedWorker: string 
}

// Initial Garbage-specific issues data
const INITIAL_GARBAGE_ISSUES: Issue[] = [
  { id: 102, title: "Garbage spilled near market", status: "In Progress", date: "2024-10-19", location: "Central Market", region: "Bunder", description: "Overflowing waste bins.", assignedWorker: "Ramesh S." },
  { id: 104, title: "Waste collection delay", status: "Pending", date: "2024-10-21", location: "Kadri Road", region: "Kadri", description: "Waste has not been collected for 3 days.", assignedWorker: "Unassigned" },
  { id: 107, title: "Large waste heap near school", status: "Pending", date: "2024-10-22", location: "Surathkal Main", region: "Surathkal", description: "A large pile of garbage needs immediate removal.", assignedWorker: "Unassigned" },
  { id: 108, title: "Illegal dumping site", status: "Resolved", date: "2024-10-23", location: "Bejai Side Road", region: "Bejai", description: "Construction debris dumped overnight.", assignedWorker: "Priya K." },
  { id: 109, title: "Bin missing from corner", status: "Pending", date: "2024-10-23", location: "Kottara Main", region: "Kottara", description: "Community bin has been removed.", assignedWorker: "Unassigned" },
];

// --- 2. HELPER FUNCTIONS & STYLING ---

const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "Resolved": return "bg-green-600 text-white"
      case "In Progress": return "bg-blue-500 text-white"
      case "Pending": return "bg-yellow-500 text-gray-900"
      default: return "bg-gray-400 text-white"
    }
}

const getTruckStatusColor = (status: string) => {
    switch (status) {
        case "In Route": return "border-blue-500 text-blue-800 bg-blue-50";
        case "At Dump": return "border-yellow-500 text-yellow-800 bg-yellow-50";
        case "Complete": return "border-green-500 text-green-800 bg-green-50";
        default: return "border-gray-500 text-gray-800 bg-gray-50";
    }
};

// Function to filter by region
const getFilteredIssuesByRegion = (issues: Issue[], selectedRegion: string): Issue[] => {
    if (selectedRegion === "All Regions") {
        return issues;
    }
    return issues.filter(issue => issue.region === selectedRegion);
};

const getFilteredTrucksByRegion = (selectedRegion: string): TruckLocation[] => {
    if (selectedRegion === "All Regions") {
        return DUMMY_TRUCK_LOCATIONS;
    }
    return DUMMY_TRUCK_LOCATIONS.filter(truck => truck.region === selectedRegion);
};


// --- 3. COMPONENTS FOR GARBAGE VIEW (Stats & Tracker) ---

interface StatProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatProps> = ({ title, value, icon: Icon, color }) => (
    <Card className={`border-l-4 ${color} shadow-xl transform hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
            </div>
        </CardContent>
    </Card>
);

const RegionalStatsCard: React.FC<{ issues: Issue[]; trucks: TruckLocation[] }> = ({ issues, trucks }) => {
  // Compute dynamic stats based on passed-in arrays
  const totalOpen = issues.length;
  // Count resolved issues from the current issues array so the stat syncs with status updates
  const resolvedToday = issues.filter(i => i.status === 'Resolved').length;
  const inRouteTrucks = trucks.filter(t => t.status === 'In Route').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Open Reports" 
        value={totalOpen} 
        icon={List} 
        color="border-purple-600 text-purple-600" 
      />
      <StatCard 
        title="Resolved Today" 
        value={resolvedToday} 
        icon={Check} 
        color="border-green-600 text-green-600" 
      />
      <StatCard 
        title="Trucks In Route" 
        value={inRouteTrucks} 
        icon={Truck} 
        color="border-blue-600 text-blue-600" 
      />
    </div>
  );
};

const GarbageTruckTracker: React.FC<{ filteredTrucks: TruckLocation[] }> = ({ filteredTrucks }) => {
  return (
    <Card className="shadow-2xl bg-white mb-8 border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Truck className="w-6 h-6 text-green-600" /> Live Garbage Truck Status
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-sm text-green-600 hover:bg-green-50">
            <MapPin className="w-4 h-4 mr-1" /> View Live Map <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {filteredTrucks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No trucks currently tracked in this region.</p>
          ) : (
            filteredTrucks.map((truck) => (
              <div key={truck.id} className={`flex items-center justify-between p-4 border rounded-xl shadow-md transition-all ${getTruckStatusColor(truck.status)}`}>
                <div className="flex items-center gap-4">
                  <Truck className="w-6 h-6 text-gray-600" />
                  <div>
                    <h4 className="font-bold text-base">{truck.id}</h4>
                    <p className="text-xs text-gray-600">{truck.route} Route</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <Badge className={`w-fit font-semibold text-xs border-0 py-1 ${getTruckStatusColor(truck.status).replace('border', 'bg').replace('text', 'text').replace('bg-50', 'bg-100')}`}>
                    {truck.status === "Complete" ? <Check className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1" />}
                    {truck.status}
                  </Badge>
                    <span className="text-sm text-gray-700 flex items-center">
                        <LocateFixed className="w-4 h-4 mr-1 text-green-600" /> <span className="font-medium">{truck.region}</span>
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};


// --- 4. MAIN PAGE COMPONENT ---

function IssuePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const category = searchParams.get('category') || "Garbage"; 
  
  const [selectedRegion, setSelectedRegion] = useState("All Regions"); 
  const [issuesData, setIssuesData] = useState<Issue[]>(INITIAL_GARBAGE_ISSUES);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<TruckLocation[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle worker assignment
  const handleAssignWorker = (issueId: number, workerName: string) => {
    setIssuesData(prevIssues => 
        prevIssues.map(issue => 
            issue.id === issueId 
                ? { 
                    ...issue, 
                    assignedWorker: workerName,
                    // If assigning, change status to In Progress unless it's already resolved
                    status: (issue.status === "Pending" && workerName !== "Unassigned") ? "In Progress" : issue.status,
                }
                : issue
        )
    );
  };

  // Function to handle status update
  const handleUpdateStatus = (issueId: number, newStatus: IssueStatus) => {
    setIssuesData(prevIssues => 
        prevIssues.map(issue => 
            issue.id === issueId 
                ? { 
                    ...issue, 
                    status: newStatus,
                    // If setting to resolved, worker should stay assigned (historical) but we can update logic if needed
                }
                : issue
        )
    );
  };


  // Effect to run filtering when region or issuesData changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate data fetch delay
    setTimeout(() => {
        // Filter issues by region (using the current issuesData state)
        const issueResults = getFilteredIssuesByRegion(issuesData, selectedRegion);
        setFilteredIssues(issueResults);

        // Filter trucks by region
        const truckResults = getFilteredTrucksByRegion(selectedRegion);
        setFilteredTrucks(truckResults);
        
        setIsLoading(false);
    }, 300); // Shorter delay for better UX
  }, [selectedRegion, issuesData]); // Depend on issuesData to update list after assignment/status change

  const handleBack = () => {
  if (window.history.length > 1) {
    router.back(); // Go to previous page if there is history
  } else {
    router.push("/mcc-dashboard"); // Fallback if no history
  }
};


  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <span className="ml-2 text-lg text-purple-600 mt-3">Loading *{category}* reports for {selectedRegion}...</span>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <Button 
  onClick={handleBack} 
  variant="outline" 
  className="text-purple-600 hover:bg-purple-50 transition-colors border-purple-200"
>
  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
</Button>

      <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-orange-400">
        Garbage Management Portal
      </h1>
            <div>{/* Spacer */}</div>
        </header>

        {/* --- REGIONAL FILTER & TRUCK STATUS SUMMARY --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">
                Active Region: <span className="text-purple-600">{selectedRegion}</span>
            </h2>
            <div className="flex items-center mt-3 sm:mt-0">
                <label htmlFor="region-select" className="mr-3 font-medium text-gray-700">Change Region:</label>
                <Select onValueChange={setSelectedRegion} defaultValue={selectedRegion}>
                    <SelectTrigger className="w-[180px] bg-white border-purple-300">
                        <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                        {MANGALORE_REGIONS.map(region => (
                            <SelectItem key={region} value={region} className="font-medium">{region}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

    {/* --- STATS & TRACKER --- */}
  <RegionalStatsCard issues={filteredIssues} trucks={filteredTrucks} />
  <GarbageTruckTracker filteredTrucks={filteredTrucks} />


        <Card className="shadow-2xl border border-gray-100 mt-8">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                <List className="w-5 h-5 mr-2 text-purple-600"/>
                {filteredIssues.length} Active Garbage Reports in <span className="text-purple-600 font-medium">{selectedRegion}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                  <p className="text-lg">No <span className="font-semibold">Garbage</span> issues found for <span className="font-medium">{selectedRegion}</span>. Great job!</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div key={issue.id} className="grid grid-cols-1 lg:grid-cols-10 gap-4 p-5 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow duration-200">
                    
                    {/* ISSUE INFO (COL 1-4) */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold text-xl text-gray-800 flex items-center">{issue.title}</h4>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-500" /> Location: <span className="font-medium">{issue.region || issue.location}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Reported: {issue.date} | Ticket <span className="font-mono text-xs text-gray-600">#{issue.id}</span></p>
                    </div>

                    {/* STATUS (COL 5) */}
                    <div className="lg:col-span-1 flex flex-col justify-center">
                        <Badge className={`w-fit font-bold shadow-md ${getStatusColor(issue.status)}`}>{issue.status}</Badge>
                    </div>

                    {/* ASSIGNED WORKER (COL 6-7) */}
                    <div className="lg:col-span-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500"/>
                        <Select 
                            onValueChange={(worker) => handleAssignWorker(issue.id, worker)} 
                            defaultValue={issue.assignedWorker}
                            disabled={issue.status === 'Resolved'}
                        >
                            <SelectTrigger className="w-[180px] text-sm bg-gray-50 border-gray-300">
                                <SelectValue placeholder="Assign Worker" />
                            </SelectTrigger>
                            <SelectContent>
                                {DUMMY_WORKERS.map(worker => (
                                    <SelectItem key={worker} value={worker}>{worker}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* STATUS ACTIONS (COL 8-10) */}
                    <div className="lg:col-span-2 flex items-center justify-end gap-2">
                        <Select 
                            onValueChange={(status) => handleUpdateStatus(issue.id, status as IssueStatus)} 
                            defaultValue={issue.status}
                        >
                            <SelectTrigger className="w-[120px] text-sm font-semibold border-purple-400 bg-purple-50">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending" className="text-yellow-600">Pending</SelectItem>
                                <SelectItem value="In Progress" className="text-blue-600">In Progress</SelectItem>
                                <SelectItem value="Resolved" className="text-green-600">Resolved</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button 
                            onClick={() => alert(`Opening details for issue ${issue.id}`)} 
                            variant="default"
                            size="icon"
                            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}

export default function IssuePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="ml-2 text-lg text-purple-600 mt-3">Loading portal...</span>
      </div>
    }>
      <IssuePageContent />
    </Suspense>
  );
}