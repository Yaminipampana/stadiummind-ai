import apiClient, { APIResponse } from "./apiClient";

export interface CrowdHeatpoint {
  lat: number;
  lng: number;
  intensity: number; // Scale of 0.0 to 1.0
  section: string;
}

export interface GateThroughput {
  gateId: string;
  gateName: string;
  currentFlow: number; // People per minute
  capacity: number;
  status: "clear" | "busy" | "overloaded";
}

export interface CrowdStatsResponse {
  timestamp: string;
  totalAttendance: number;
  overallDensityIndex: number; // 0-100
  heatpoints: CrowdHeatpoint[];
  gates: GateThroughput[];
}

export interface CrowdInsight {
  id: string;
  type: "warning" | "info" | "success" | "recommendation";
  title: string;
  message: string;
  timestamp: string;
}

export interface CrowdInsightsResponse {
  insights: CrowdInsight[];
}

export interface SimulationZone {
  id: string;
  name: string;
  category: string;
  density: number;
  people: number;
  lastUpdated: string;
  xPos: string;
  yPos: string;
}

export interface CrowdSimulationResponse {
  totalAttendance: number;
  overallDensityIndex: number;
  criticalCount: number;
  zones: SimulationZone[];
}

export interface OperationalInsight {
  id: string;
  title: string;
  recommendation: string;
  category: "gate" | "volunteer" | "redirection" | "congestion" | "security" | "route";
  priority: "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  timestamp: string;
}

export interface OperationalInsightsResponse {
  insights: OperationalInsight[];
}

export const crowdService = {
  getCrowdStats: async (): Promise<APIResponse<CrowdStatsResponse>> => {
    return apiClient.get<CrowdStatsResponse>("/crowd");
  },
  
  getZoneDensity: async (zoneId: string): Promise<APIResponse<{ densityIndex: number }>> => {
    return apiClient.get<{ densityIndex: number }>(`/crowd/zone/${zoneId}`);
  },

  getCrowdInsights: async (): Promise<APIResponse<CrowdInsightsResponse>> => {
    return apiClient.get<CrowdInsightsResponse>("/crowd/insights");
  },

  getCrowdSimulation: async (): Promise<APIResponse<CrowdSimulationResponse>> => {
    return apiClient.get<CrowdSimulationResponse>("/crowd/simulation");
  },

  getSimulationInsights: async (): Promise<APIResponse<OperationalInsightsResponse>> => {
    return apiClient.get<OperationalInsightsResponse>("/crowd/simulation/insights");
  }
};

export default crowdService;
