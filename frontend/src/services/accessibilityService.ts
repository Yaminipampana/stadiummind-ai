import apiClient, { APIResponse } from "./apiClient";

export interface AccessibilityIncident {
  id: string;
  facilityName: string;
  type: "elevator" | "ramp" | "tactile-path" | "sensory-room";
  status: "operational" | "maintenance" | "closed";
  reportedReason?: string;
  alternativeRouteInstructions?: string;
}

export interface WheelchairRequest {
  id: string;
  userLocation: string;
  userPhone: string;
  status: "requested" | "dispatched" | "arrived" | "completed";
  assignedVolunteerId?: string;
}

export const accessibilityService = {
  getFacilityStatus: async (): Promise<APIResponse<AccessibilityIncident[]>> => {
    return apiClient.get<AccessibilityIncident[]>("/accessibility/facilities");
  },

  requestWheelchairAssistance: async (payload: {
    locationName: string;
    contactPhone: string;
    specialNotes?: string;
  }): Promise<APIResponse<WheelchairRequest>> => {
    return apiClient.post<WheelchairRequest>("/accessibility/wheelchair-request", payload);
  },

  getWheelchairRequestStatus: async (requestId: string): Promise<APIResponse<WheelchairRequest>> => {
    return apiClient.get<WheelchairRequest>(`/accessibility/wheelchair-request/${requestId}`);
  },
};

export default accessibilityService;
