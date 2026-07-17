import apiClient, { APIResponse } from "./apiClient";

export interface POI {
  id: string;
  name: string;
  type: "gate" | "concession" | "restroom" | "first-aid" | "sensory-room" | "elevator" | "transit";
  lat: number;
  lng: number;
  level: number; // Floor level: 1, 2, 3
  isAccessible: boolean;
  status: "open" | "closed" | "busy";
}

export interface RouteSegment {
  lat: number;
  lng: number;
}

export interface StadiumRoute {
  sourceId: string;
  destId: string;
  points: RouteSegment[];
  distanceMeters: number;
  estimatedSeconds: number;
  isAccessibleRoute: boolean;
  instructions: string[];
}

export const navigationService = {
  getPOIs: async (type?: string): Promise<APIResponse<POI[]>> => {
    const endpoint = type ? `/navigation/pois?type=${type}` : "/navigation/pois";
    return apiClient.get<POI[]>(endpoint);
  },

  calculateRoute: async (
    sourceId: string,
    destId: string,
    accessibleOnly: boolean = false
  ): Promise<APIResponse<StadiumRoute>> => {
    return apiClient.post<StadiumRoute>("/navigation/route", {
      source_id: sourceId,
      dest_id: destId,
      accessible_only: accessibleOnly,
    });
  },
};

export default navigationService;
