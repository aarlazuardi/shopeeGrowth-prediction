import { create } from "zustand"

export const useGrowthStore = create((set) => ({
  growthData: [],
  setGrowthData: (data) => set({ growthData: data }),

  predictionSettings: {
    method: "linear",
    forecastMonths: 6,
    growthRate: 5,
    seasonality: "moderate",
    retentionImpact: "medium",
  },
  setPredictionSettings: (settings) => set({ predictionSettings: settings }),

  predictedData: [],
  setPredictedData: (data) => set({ predictedData: data }),
}))
