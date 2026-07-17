import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export type UserRole = "user" | "volunteer" | "admin";

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: UserState;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  checkAuthStatus: () => Promise<void>;
  loading: boolean;
}

const initialUserState: UserState = {
  id: "",
  name: "",
  email: "",
  role: "user",
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem("stadiummind-user");
    return saved ? JSON.parse(saved) : initialUserState;
  });
  const [loading, setLoading] = useState(true);

  // Authenticate token session on mount
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("stadiummind_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getProfile();
      if (response.data?.success) {
        const u = response.data.user;
        const updatedState: UserState = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isAuthenticated: true,
        };
        setUser(updatedState);
        localStorage.setItem("stadiummind-user", JSON.stringify(updatedState));
      } else {
        // Clear invalid token session
        logout();
      }
    } catch {
      // Network issues or backend down: preserve local storage state as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (email: string, token: string) => {
    localStorage.setItem("stadiummind_token", token);
    
    // Set a preliminary session state
    const cleanName = email.includes("@") ? email.split("@")[0] : email;
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    const newState: UserState = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: formattedName,
      email: email.includes("@") ? email : `${email}@stadiummind.ai`,
      role: "user",
      isAuthenticated: true,
    };
    
    setUser(newState);
    localStorage.setItem("stadiummind-user", JSON.stringify(newState));
  };

  const setRole = (role: UserRole) => {
    setUser((prev) => {
      const updated = { ...prev, role };
      localStorage.setItem("stadiummind-user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("stadiummind_token");
    localStorage.removeItem("stadiummind-user");
    setUser(initialUserState);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user.isAuthenticated,
        login,
        logout,
        setRole,
        checkAuthStatus,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
