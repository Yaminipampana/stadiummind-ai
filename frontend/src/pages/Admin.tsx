import React, { useEffect, useState } from "react";
import { FiSettings, FiSliders, FiRadio, FiAlertCircle } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../store/AuthContext";
import { useAlert } from "../store/AlertContext";
import { adminService, SystemConfig, AdminStats } from "../services/adminService";

export const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addAlert } = useAlert();
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Broadcast Alert Form State
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"info" | "warning" | "error" | "critical">("info");
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const [configRes, statsRes] = await Promise.all([
        adminService.getSystemConfig(),
        adminService.getAdminStats(),
      ]);
      if (configRes.data) setConfig(configRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchAdminDetails();
    }
  }, [isAuthenticated, user]);

  const handleBroadcast = async () => {
    if (!alertTitle || !alertMessage) return;
    const res = await adminService.broadcastAlert({
      title: alertTitle,
      message: alertMessage,
      severity: alertSeverity,
    });
    if (res.data?.success) {
      // Log alert globally in app state
      addAlert(alertTitle, alertMessage, alertSeverity);
      setBroadcastMessage("Alert broadcasted successfully to all fans!");
      setAlertTitle("");
      setAlertMessage("");
      setTimeout(() => setBroadcastMessage(null), 3000);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiAlertCircle size={48} className="mx-auto text-brand-rose mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto">
          Please log in using the "Mock Admin" button in the navigation header to view this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Command Dashboard</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Stadium Control Room Console. Broadcast alerts, monitor volunteers, and edit AI model parameters.
        </p>
      </div>

      {loading ? (
        <p>Loading command metrics...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metrics summary */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">Active Volunteers</h4>
                <div className="text-3xl font-bold mt-1 text-brand-blue">{stats.activeVolunteers}</div>
              </Card>
              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">Open Tasks</h4>
                <div className="text-3xl font-bold mt-1 text-brand-gold">{stats.openTasks}</div>
              </Card>
              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">Active Incidents</h4>
                <div className="text-3xl font-bold mt-1 text-brand-rose">{stats.activeIncidents}</div>
              </Card>
              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">Sustainability Index</h4>
                <div className="text-3xl font-bold mt-1 text-brand-emerald">{stats.sustainabilityIndex}%</div>
              </Card>
            </div>
          )}

          {/* Broadcast alert panel */}
          <Card className="h-fit">
            <CardHeader>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiRadio className="text-brand-rose" /> Emergency Broadcast
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Alert Title"
                placeholder="e.g. Weather Delay, Inclement Gate Conditions"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
              />
              <div>
                <label className="block text-sm font-semibold mb-1">Severity</label>
                <select
                  value={alertSeverity}
                  onChange={(e: any) => setAlertSeverity(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
                >
                  <option value="info">Info - Event Update</option>
                  <option value="warning">Warning - High Crowds</option>
                  <option value="error">Error - Sector Maintenance</option>
                  <option value="critical">Critical - Emergency Evac</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Message Detail</label>
                <textarea
                  rows={3}
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Evacuate Gate 2 immediately, use sensory pathways..."
                  className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
                />
              </div>
              <Button variant="danger" fullWidth onClick={handleBroadcast}>
                Issue Broadcaster Signal
              </Button>
              {broadcastMessage && (
                <p className="text-xs text-brand-emerald text-center font-bold">{broadcastMessage}</p>
              )}
            </CardContent>
          </Card>

          {/* Settings panel */}
          {config && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiSettings className="text-light-text dark:text-dark-text" /> System Configurator
                </h3>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-sm">Venue / Match Information</h4>
                  <p className="text-sm mt-1">{config.stadiumName}</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Active Event: {config.currentEvent}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">AI Agent Logic</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2.5 py-1 bg-brand-blue text-white rounded-full font-bold">
                      Mode: {config.aiMode}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Gate Availability</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                    {config.activeGates.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
