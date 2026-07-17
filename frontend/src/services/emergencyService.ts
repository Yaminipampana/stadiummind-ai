import apiClient, { APIResponse } from "./apiClient";
import { SystemAlert } from "../store/AlertContext";

export interface SOSRequest {
  id: string;
  reporterName: string;
  type: "medical" | "security" | "fire" | "structural";
  locationDescription: string;
  lat: number;
  lng: number;
  status: "active" | "dispatched" | "resolved";
  createdAt: string;
}

export interface EvacuationRoute {
  sourceZone: string;
  exitGateId: string;
  exitGateName: string;
  recommendedPathInstructions: string[];
  mapOverlayGeoJSON?: string;
}

export const emergencyService = {
  triggerSOS: async (payload: {
    type: "medical" | "security" | "fire" | "structural";
    locationDescription: string;
    contactPhone?: string;
    lat?: number;
    lng?: number;
  }): Promise<APIResponse<SOSRequest>> => {
    return apiClient.post<SOSRequest>("/emergency/sos", payload);
  },

  getActiveAlerts: async (): Promise<APIResponse<SystemAlert[]>> => {
    return apiClient.get<SystemAlert[]>("/emergency/active");
  },

  getEvacuationPlan: async (currentZone: string): Promise<APIResponse<EvacuationRoute>> => {
    return apiClient.get<EvacuationRoute>(`/emergency/evacuate/${currentZone}`);
  },
};

export default emergencyService;
