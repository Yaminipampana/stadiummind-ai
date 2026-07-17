import { apiClient, APIResponse } from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "volunteer" | "admin";
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  /** Logs in user with credentials and returns signature token */
  login: async (email: string, password: string): Promise<APIResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>("/auth/login", { email, password });
  },

  /** Creates new volunteer/admin account ticket */
  register: async (name: string, email: string, password: string): Promise<APIResponse<RegisterResponse>> => {
    return apiClient.post<RegisterResponse>("/auth/register", { name, email, password });
  },

  /** Retrieves profile based on decoded auth session token */
  getProfile: async (): Promise<APIResponse<{ success: boolean; user: AuthUser }>> => {
    return apiClient.get<{ success: boolean; user: AuthUser }>("/auth/me");
  },
};

export default authService;
