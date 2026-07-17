import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// 1. Create Axios Instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Add Request Interceptor to dynamically attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("stadiummind_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Class abstraction to maintain backward compatibility with existing services
class APIClient {
  private async execute<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      let response: AxiosResponse<T>;
      
      switch (method) {
        case "GET":
          response = await axiosInstance.get<T>(url, config);
          break;
        case "POST":
          response = await axiosInstance.post<T>(url, data, config);
          break;
        case "PUT":
          response = await axiosInstance.put<T>(url, data, config);
          break;
        case "DELETE":
          response = await axiosInstance.delete<T>(url, config);
          break;
      }

      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (err: any) {
      let errorMsg = "Network communication failure";
      let status = 0;

      if (err.response) {
        status = err.response.status;
        errorMsg = err.response.data?.detail || err.response.data?.message || `HTTP Error: ${status}`;
      } else if (err.message) {
        errorMsg = err.message;
      }

      return {
        data: null,
        error: errorMsg,
        status,
      };
    }
  }

  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return this.execute<T>("GET", endpoint, undefined, config);
  }

  public async post<T>(
    endpoint: string,
    body: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.execute<T>("POST", endpoint, body, config);
  }

  public async put<T>(
    endpoint: string,
    body: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.execute<T>("PUT", endpoint, body, config);
  }

  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return this.execute<T>("DELETE", endpoint, undefined, config);
  }
}

export const apiClient = new APIClient();
export default apiClient;
