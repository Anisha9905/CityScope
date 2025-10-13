// app/data/predictiveData.ts

// --- Garbage Hotspot Data ---
export interface GarbageHotspotData {
  zoneId: string;
  populationDensity: number;
  avgDailyReports: number;
  lastPickupDelay: number; // in hours
  accumulationScore: number; // Target variable (0-10)
}

export const DUMMY_GARBAGE_HOTSPOT_DATA: GarbageHotspotData[] = [
  // High Risk Zones
  { zoneId: "KAD01", populationDensity: 8200, avgDailyReports: 5.1, lastPickupDelay: 12, accumulationScore: 9.5 },
  { zoneId: "BUN03", populationDensity: 7500, avgDailyReports: 4.5, lastPickupDelay: 0, accumulationScore: 8.8 },
  // Medium Risk Zones
  { zoneId: "SUR05", populationDensity: 5100, avgDailyReports: 2.0, lastPickupDelay: 8, accumulationScore: 5.5 },
  { zoneId: "BEJ02", populationDensity: 4200, avgDailyReports: 1.5, lastPickupDelay: 0, accumulationScore: 3.2 },
  // Low Risk Zones
  { zoneId: "KOT07", populationDensity: 3500, avgDailyReports: 0.5, lastPickupDelay: 0, accumulationScore: 1.1 },
];

// app/data/predictiveData.ts (continued)

// --- Pothole Prediction Data ---
export interface PotholePredictionData {
  roadSegmentId: string;
  avgDailyTraffic: number; // vehicles/day
  annualRainfall: number; // in mm
  lastPotholeCount: number; // last 12 months
  potholeLikelihood: number; // Target variable (0-10)
}

export const DUMMY_POTHOLE_DATA: PotholePredictionData[] = [
  // High Risk Roads
  { roadSegmentId: "MG01A", avgDailyTraffic: 25000, annualRainfall: 4200, lastPotholeCount: 15, potholeLikelihood: 9.2 },
  { roadSegmentId: "RN01C", avgDailyTraffic: 18000, annualRainfall: 3800, lastPotholeCount: 8, potholeLikelihood: 8.5 },
  // Medium Risk Roads
  { roadSegmentId: "KDR12B", avgDailyTraffic: 10000, annualRainfall: 3500, lastPotholeCount: 3, potholeLikelihood: 5.1 },
  // Low Risk Roads
  { roadSegmentId: "BUN21D", avgDailyTraffic: 4000, annualRainfall: 3000, lastPotholeCount: 0, potholeLikelihood: 1.5 },
];