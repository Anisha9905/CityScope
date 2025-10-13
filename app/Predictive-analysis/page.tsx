"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';






// FIX: Replaced 'Road' with 'PencilRuler' as 'Road' is not a valid Lucide export.
import { ArrowLeft, Trash2, PencilRuler, Gauge, TrendingUp, AlertTriangle } from 'lucide-react';

// --- Utility Components (Simplified UI for Single File Mandate) ---
const Button = ({ onClick, children, className = "", variant = "default" }) => {
    let baseStyle = "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center";
    if (variant === "outline") {
        baseStyle += " bg-white border border-gray-300 text-gray-700 hover:bg-gray-100";
    } else {
        baseStyle += " bg-purple-600 text-white hover:bg-purple-700";
    }
    return <button onClick={onClick} className={`${baseStyle} ${className}`}>{children}</button>;
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "" }) => (
    <div className={`p-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "" }) => (
    <h2 className={`text-xl font-bold ${className}`}>
        {children}
    </h2>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

// --- Data Models and Dummy Data (Unchanged) ---
export interface GarbageHotspotData {
  zoneId: string;
  populationDensity: number;
  avgDailyReports: number;
  lastPickupDelay: number; // in hours
  accumulationScore: number; // Target variable (0-10)
}

export interface PotholePredictionData {
  roadSegmentId: string;
  avgDailyTraffic: number; // vehicles/day
  annualRainfall: number; // in mm
  lastPotholeCount: number; // last 12 months
  potholeLikelihood: number; // Target variable (0-10)
}

export const DUMMY_GARBAGE_HOTSPOT_DATA: GarbageHotspotData[] = [
  { zoneId: "KADRI", populationDensity: 8200, avgDailyReports: 5.1, lastPickupDelay: 12, accumulationScore: 9.5 },
  { zoneId: "BUNDER", populationDensity: 7500, avgDailyReports: 4.5, lastPickupDelay: 0, accumulationScore: 8.8 },
  { zoneId: "SURATHKAL", populationDensity: 5100, avgDailyReports: 2.0, lastPickupDelay: 8, accumulationScore: 5.5 },
  { zoneId: "BEJAI", populationDensity: 4200, avgDailyReports: 1.5, lastPickupDelay: 0, accumulationScore: 3.2 },
  { zoneId: "KOTTARA", populationDensity: 3500, avgDailyReports: 0.5, lastPickupDelay: 0, accumulationScore: 1.1 },
];

export const DUMMY_POTHOLE_DATA: PotholePredictionData[] = [
  { roadSegmentId: "PUMPWELL", avgDailyTraffic: 25000, annualRainfall: 4200, lastPotholeCount: 15, potholeLikelihood: 9.2 },
  { roadSegmentId: "PADIL", avgDailyTraffic: 18000, annualRainfall: 3800, lastPotholeCount: 8, potholeLikelihood: 8.5 },
  { roadSegmentId: "THOKKOTU", avgDailyTraffic: 10000, annualRainfall: 3500, lastPotholeCount: 3, potholeLikelihood: 5.1 },
  { roadSegmentId: "JEPPINAMUGER", avgDailyTraffic: 4000, annualRainfall: 3000, lastPotholeCount: 0, potholeLikelihood: 1.5 },
];

// --- Prediction Logic (Unchanged) ---

export const predictGarbageHotspot = (data: Omit<GarbageHotspotData, 'accumulationScore'>): number => {
    const popWeight = 0.0005; 
    const reportWeight = 1.2; 
    const delayWeight = 0.2; 
    let score = (data.populationDensity * popWeight) + 
                (data.avgDailyReports * reportWeight) +
                (data.lastPickupDelay * delayWeight);
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
};

export const predictPotholeLikelihood = (data: Omit<PotholePredictionData, 'potholeLikelihood'>): number => {
    const trafficWeight = 0.0002; 
    const rainfallWeight = 0.001; 
    const countWeight = 0.4; 
    let score = (data.avgDailyTraffic * trafficWeight) + 
                (data.annualRainfall * rainfallWeight) +
                (data.lastPotholeCount * countWeight);
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
};

// --- Utility Functions for Charts ---

const getRiskColor = (score: number, type: 'tailwind'): string => {
    // Red-600
    if (score > 8) return "hsl(0 84.2% 60.2%)"; 
    // Yellow-500
    if (score > 5) return "hsl(48 95.7% 63.7%)"; 
    // Green-600
    return "hsl(142.1 70.6% 45.3%)"; 
};

// --- Custom SVG Bar Chart Component (Unchanged) ---

const CustomBarChart = ({ data, dataKey, nameKey, type }) => {
    // Show only top 5 entries
    const chartData = data.slice(0, 5).map(d => ({
        ...d,
        name: d[nameKey],
        score: d[dataKey],
        fillColor: getRiskColor(d[dataKey], 'tailwind')
    }));

    const MARGIN = { top: 30, right: 30, bottom: 20, left: 100 };
    const WIDTH = 650;
    const HEIGHT = 300;
    const CHART_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
    const CHART_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

    const maxScore = 10;
    const barSpacing = 10;
    const barCount = chartData.length;
    const totalSpacing = barSpacing * (barCount + 1);
    const barHeight = (CHART_HEIGHT - totalSpacing) / barCount;
    
    if (barCount === 0) return <p className="text-gray-500 text-center pt-8">No data to display.</p>

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT} className="font-sans">
            {/* Chart Area Group */}
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                
                {/* Background Grid Lines (Simplified) */}
                <line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke="#e0e7ff" strokeWidth="1" />
                
                {/* Bars, Labels, and Tooltips */}
                {chartData.map((d, index) => {
                    const y = index * (barHeight + barSpacing);
                    const barWidth = (d.score / maxScore) * CHART_WIDTH;
                    const textY = y + barHeight / 2 + 3;

                    return (
                        <g key={d.name} className="group cursor-pointer">
                            {/* Y-Axis Label (Name/ID) */}
                            <text x={-5} y={textY} textAnchor="end" className="text-sm fill-gray-800 font-medium">
                                {d.name}
                            </text>
                            
                            {/* Bar */}
                            <rect
                                x={0}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={d.fillColor}
                                rx={6}
                                ry={6}
                                className="transition-all duration-300 transform group-hover:scale-x-[1.01] group-hover:shadow-lg"
                                style={{ transformOrigin: 'left' }}
                            />

                            {/* Score Text */}
                            <text 
                                x={barWidth + 8} 
                                y={textY} 
                                textAnchor="start" 
                                className="text-sm font-extrabold fill-gray-900"
                            >
                                {d.score.toFixed(1)}
                            </text>

                            {/* Tooltip Overlay (Simple Text Box - HTML-like, positioned near bar) */}
                            <foreignObject x={barWidth + 20} y={y - 10} width="200" height="100" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-xs text-gray-700">
                                    <p className="font-bold mb-0.5">{type === 'Garbage' ? `Zone: ${d.zoneId} `: `Road: ${d.roadSegmentId}`}</p>
                                    <p>Score: {d.score.toFixed(1)}/10</p>
                                    <p>{type === 'Garbage' ? `Reports: ${d.avgDailyReports}` : `Traffic: ${d.avgDailyTraffic}`}</p>
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}

                {/* X-Axis Ticks (0, 5, 10) */}
                <line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke="#9ca3af" strokeWidth="1" />
                {[0, 2.5, 5, 7.5, 10].map(tick => (
                    <g key={tick} transform={`translate(${(tick / maxScore) * CHART_WIDTH}, ${CHART_HEIGHT})`}>
                        <line y2="5" stroke="#9ca3af" />
                        <text y="18" textAnchor="middle" className="text-xs fill-gray-600">
                            {tick}
                        </text>
                    </g>
                ))}
                <text x={CHART_WIDTH / 2} y={CHART_HEIGHT + 40} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                    Risk Score (0-10)
                </text>
            </g>
        </svg>
    );
};

// --- Chart Wrapper Components (Now calling CustomBarChart) ---
const GarbageHotspotChart = ({ data }) => (
    <CustomBarChart data={data} dataKey="accumulationScore" nameKey="zoneId" type="Garbage" />
);

const PotholeLikelihoodChart = ({ data }) => (
    <CustomBarChart data={data} dataKey="potholeLikelihood" nameKey="roadSegmentId" type="Pothole" />
);

// --- New Component: Priority Queue Table ---
const PriorityQueueTable = ({ garbage, potholes }) => {
    // 1. Filter for High Risk (Score > 8) and unify the structure
    const highRiskGarbage = garbage
        .filter(g => g.accumulationScore > 8)
        .map(g => ({
            id: g.zoneId,
            score: g.accumulationScore,
            type: 'Garbage Hotspot',
            details: `Density: ${g.populationDensity}, Delay: ${g.lastPickupDelay}h`,
            icon: Trash2,
            color: 'text-green-700'
        }));

    const highRiskPotholes = potholes
        .filter(p => p.potholeLikelihood > 8)
        .map(p => ({
            id: p.roadSegmentId,
            score: p.potholeLikelihood,
            type: 'Pothole Likelihood',
            details: `Traffic: ${p.avgDailyTraffic}, Rainfall: ${p.annualRainfall}mm`,
            icon: PencilRuler,
            color: 'text-red-700'
        }));

    // 2. Combine and sort by score descending
    const queueData = [...highRiskGarbage, ...highRiskPotholes]
        .sort((a, b) => b.score - a.score);

    if (queueData.length === 0) {
        // FIX: Escaping the '>' character for JSX compliance
        return <p className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-inner my-6">No areas currently meet the High Risk threshold (Score {'>'} 8).</p>;
    }

    // 3. Render Table
    return (
        <Card className="shadow-2xl mb-8">
            <CardHeader>
                {/* FIX: Escaping the '>' character for JSX compliance */}
                <CardTitle className="text-purple-700">Maintenance Priority Queue (Score {'>'} 8)</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {queueData.map((item, index) => (
                            <tr key={`${item.type}-${item.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                    <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
                                    {item.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-lg font-extrabold text-red-600">
                                        {item.score.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


// --- Main Dashboard Component ---

export default function PredictiveDashboard() {
    const router = useRouter();
    const handleBack = () => router.push('/mcc/dashboard');

    // State to hold predictions
    const [garbagePredictions, setGarbagePredictions] = useState<GarbageHotspotData[]>([]);
    const [potholePredictions, setPotholePredictions] = useState<PotholePredictionData[]>([]);
    // New state for toggling the Priority Queue
    const [showQueue, setShowQueue] = useState(false);

    useEffect(() => {
        // --- 1. Run Garbage Prediction ---
        const predictedGarbage = DUMMY_GARBAGE_HOTSPOT_DATA.map(zone => {
            const { accumulationScore: actual, ...features } = zone;
            const predictedScore = predictGarbageHotspot(features);
            return { ...zone, accumulationScore: predictedScore };
        });
        // Sort to display highest risk first in the chart
        setGarbagePredictions(predictedGarbage.sort((a, b) => b.accumulationScore - a.accumulationScore));

        // --- 2. Run Pothole Prediction ---
        const predictedPotholes = DUMMY_POTHOLE_DATA.map(road => {
            const { potholeLikelihood: actual, ...features } = road;
            const predictedScore = predictPotholeLikelihood(features);
            return { ...road, potholeLikelihood: predictedScore };
        });
        // Sort to display highest risk first in the chart
        setPotholePredictions(predictedPotholes.sort((a, b) => b.potholeLikelihood - a.potholeLikelihood));
        
    }, []);
    
    const totalHighRisk = useMemo(() => (
        garbagePredictions.filter(p => p.accumulationScore > 8).length + 
        potholePredictions.filter(p => p.potholeLikelihood > 8).length
    ), [garbagePredictions, potholePredictions]);


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
            <div className="container mx-auto max-w-7xl px-0 sm:px-4">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b-2 border-purple-300">
                    <Button onClick={handleBack} variant="outline" className="text-purple-600 hover:bg-purple-50 transition-colors border-purple-300 mb-4 sm:mb-0">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3 text-center w-full sm:w-auto">
                        <TrendingUp className="w-8 h-8 text-purple-600" /> Predictive Maintenance Dashboard
                    </h1>
                    <div className="w-0 sm:w-auto">{/* Spacer */}</div>
                </header>

                {/* --- Summary Card --- */}
                <Card className="shadow-2xl border-l-8 border-purple-600 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-4 text-center sm:text-left mb-4 sm:mb-0">
                            <AlertTriangle className="w-8 h-8 text-purple-600 min-w-8" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Proactive Maintenance Priority</h2>
                                <p className="text-gray-600 mt-1">Total {totalHighRisk} areas predicted to be High Risk (Score {'>'} 8) in the next quarter.</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setShowQueue(!showQueue)} 
                            className={`shadow-xl transition-all ${showQueue ? 'bg-gray-400 hover:bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            <Gauge className="w-4 h-4 mr-2" /> {showQueue ? 'Hide Priority Queue' : 'View Priority Queue'}
                        </Button>
                    </CardContent>
                </Card>
                
                {/* --- Priority Queue Section (Toggled by Button) --- */}
                {showQueue && (
                    <PriorityQueueTable 
                        garbage={garbagePredictions} 
                        potholes={potholePredictions} 
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- Garbage Hotspot Prediction Chart --- */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-green-50 rounded-t-xl">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-700">
                                <Trash2 className="w-5 h-5" /> Top Garbage Accumulation Hotspot Forecast
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 min-h-[350px] flex items-center justify-center">
                            {garbagePredictions.length > 0 ? (
                                <GarbageHotspotChart data={garbagePredictions} />
                            ) : (
                                <p className="text-gray-500">Loading prediction data...</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* --- Pothole Prediction Chart --- */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-red-50 rounded-t-xl">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-700">
                                <PencilRuler className="w-5 h-5" /> Pothole Development Likelihood Forecast
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 min-h-[350px] flex items-center justify-center">
                            {potholePredictions.length > 0 ? (
                                <PotholeLikelihoodChart data={potholePredictions} />
                            ) : (
                                <p className="text-gray-500">Loading prediction data...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}