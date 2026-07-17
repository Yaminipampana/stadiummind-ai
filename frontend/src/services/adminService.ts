import apiClient, { APIResponse } from "./apiClient";

export interface SystemConfig {
  stadiumName: string;
  currentEvent: string;
  totalCapacity: number;
  aiMode: "autonomous" | "moderated" | "off";
  activeGates: string[];
}

export interface AdminStats {
  activeVolunteers: number;
  openTasks: number;
  activeIncidents: number;
  sustainabilityIndex: number; // 0-100
  gateThroughputRate: number; // overall people/min
}

export const adminService = {
  getSystemConfig: async (): Promise<APIResponse<SystemConfig>> => {
    return apiClient.get<SystemConfig>("/admin/config");
  },

  updateSystemConfig: async (config: Partial<SystemConfig>): Promise<APIResponse<SystemConfig>> => {
    return apiClient.put<SystemConfig>("/admin/config", config);
  },

  getAdminStats: async (): Promise<APIResponse<AdminStats>> => {
    return apiClient.get<AdminStats>("/admin/stats");
  },

  broadcastAlert: async (payload: {
    title: string;
    message: string;
    severity: "info" | "warning" | "error" | "critical";
  }): Promise<APIResponse<{ success: boolean; alertId: string }>> => {
    return apiClient.post<{ success: boolean; alertId: string }>("/admin/broadcast", payload);
  },
};

export default adminService;
