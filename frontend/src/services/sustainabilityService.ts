import apiClient, { APIResponse } from "./apiClient";

export interface WasteBinStatus {
  binId: string;
  type: "recycling" | "compost" | "landfill";
  fillPercentage: number;
  locationDescription: string;
}

export interface TransitAlternative {
  routeNumber: string;
  destination: string;
  type: "subway" | "bus" | "light-rail" | "shuttle";
  nextDepartureMinutes: number;
  status: "on-time" | "delayed" | "crowded";
}

export interface SustainabilityReport {
  co2SavedKg: number;
  cleanEnergyPercentage: number;
  recycledTons: number;
  greenTransitUsageRate: number; // percentage
  wasteBins: WasteBinStatus[];
  transit: TransitAlternative[];
}

export const sustainabilityService = {
  getReport: async (): Promise<APIResponse<SustainabilityReport>> => {
    return apiClient.get<SustainabilityReport>("/sustainability/report");
  },

  logRecycleAction: async (payload: {
    userId: string;
    itemType: "bottle" | "can" | "cardboard";
    count: number;
  }): Promise<APIResponse<{ success: boolean; rewardPoints: number }>> => {
    return apiClient.post<{ success: boolean; rewardPoints: number }>(
      "/sustainability/recycle",
      payload
    );
  },
};

export default sustainabilityService;
