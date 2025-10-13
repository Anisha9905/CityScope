
import { GarbageHotspotData, PotholePredictionData } from "../data/predictivedata";

/**
 * Simulates a Garbage Accumulation Prediction Model (Regression)
 * Prediction Logic: Score is influenced heavily by Population Density and Reports.
 */
export const predictGarbageHotspot = (data: Omit<GarbageHotspotData, 'accumulationScore'>): number => {
    // A simplified linear model: W1*X1 + W2*X2 + W3*X3
    const popWeight = 0.0005; // Weight for population density
    const reportWeight = 1.2; // Weight for reports
    const delayWeight = 0.2;  // Weight for pickup delay

    let score = (data.populationDensity * popWeight) + 
                (data.avgDailyReports * reportWeight) +
                (data.lastPickupDelay * delayWeight);

    // Clamp the score between 0 and 10 and return
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
};


/**
 * Simulates a Pothole Likelihood Prediction Model (Regression)
 * Prediction Logic: Score is influenced heavily by Traffic and past Potholes.
 */
export const predictPotholeLikelihood = (data: Omit<PotholePredictionData, 'potholeLikelihood'>): number => {
    // A simplified linear model: W1*X1 + W2*X2 + W3*X3
    const trafficWeight = 0.0002; // Weight for traffic
    const rainfallWeight = 0.001; // Weight for rainfall
    const countWeight = 0.4;     // Weight for past count

    let score = (data.avgDailyTraffic * trafficWeight) + 
                (data.annualRainfall * rainfallWeight) +
                (data.lastPotholeCount * countWeight);

    // Clamp the score between 0 and 10 and return
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
};