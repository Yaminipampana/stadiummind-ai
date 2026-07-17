import apiClient, { APIResponse } from "./apiClient";

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  assignedToId?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatusUpdate {
  status: "in-progress" | "completed" | "cancelled";
  notes?: string;
}

export const volunteerService = {
  getTasks: async (): Promise<APIResponse<VolunteerTask[]>> => {
    return apiClient.get<VolunteerTask[]>("/volunteer/tasks");
  },

  claimTask: async (taskId: string, volunteerId: string): Promise<APIResponse<VolunteerTask>> => {
    return apiClient.post<VolunteerTask>(`/volunteer/tasks/${taskId}/claim`, { volunteer_id: volunteerId });
  },

  updateTaskStatus: async (
    taskId: string,
    payload: TaskStatusUpdate
  ): Promise<APIResponse<VolunteerTask>> => {
    return apiClient.put<VolunteerTask>(`/volunteer/tasks/${taskId}/status`, payload);
  },

  reportCrowdIssue: async (payload: {
    locationName: string;
    description: string;
    severity: string;
  }): Promise<APIResponse<{ success: boolean; issueId: string }>> => {
    return apiClient.post<{ success: boolean; issueId: string }>("/volunteer/report", payload);
  },
};

export default volunteerService;
