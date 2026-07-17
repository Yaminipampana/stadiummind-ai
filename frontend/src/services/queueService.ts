import apiClient, { APIResponse } from "./apiClient";

export interface QueuePrediction {
  poiId: string;
  poiName: string;
  poiType: "gate" | "concession" | "restroom";
  currentWaitMinutes: number;
  predictedWait15Min: number;
  predictedWait30Min: number;
  trend: "rising" | "stable" | "falling";
  queueLengthCount: number;
  alternatives: {
    poiId: string;
    poiName: string;
    waitMinutes: number;
    distanceMeters: number;
  }[];
}

export const queueService = {
  getQueuePredictions: async (type?: string): Promise<APIResponse<QueuePrediction[]>> => {
    const endpoint = type ? `/queues/predictions?type=${type}` : "/queues/predictions";
    return apiClient.get<QueuePrediction[]>(endpoint);
  },

  getQueueDetails: async (poiId: string): Promise<APIResponse<QueuePrediction>> => {
    return apiClient.get<QueuePrediction>(`/queues/predictions/${poiId}`);
  },
};

export default queueService;
