import React, { createContext, useContext, useState, useEffect } from "react";

export type AlertSeverity = "info" | "warning" | "error" | "critical";

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertContextType {
  alerts: SystemAlert[];
  activeCriticalAlert: SystemAlert | null;
  addAlert: (title: string, message: string, severity: AlertSeverity) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem("stadiummind_alerts");
    return saved ? JSON.parse(saved) : [];
  });

  // Periodically checks for active critical alerts
  const activeCriticalAlert = alerts.find(a => a.severity === "critical" && !a.acknowledged) || null;

  const addAlert = (title: string, message: string, severity: AlertSeverity) => {
    const newAlert: SystemAlert = {
      id: "alt_" + Math.random().toString(36).substr(2, 9),
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    );
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("stadiummind_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Add a default welcome message if storage is empty
  useEffect(() => {
    const saved = localStorage.getItem("stadiummind_alerts");
    if (!saved || JSON.parse(saved).length === 0) {
      addAlert(
        "StadiumMind AI Active",
        "Welcome to StadiumMind AI. Live security, crowd navigation, and crowd queues are actively monitoring current stadium status.",
        "info"
      );
    }
  }, []);

  return (
    <AlertContext.Provider
      value={{ alerts, activeCriticalAlert, addAlert, acknowledgeAlert, clearAlerts }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
