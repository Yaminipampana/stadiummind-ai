import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiBell,
  FiCheck,
  FiAlertOctagon,
  FiInfo,
  FiSearch,
  FiSliders,
  FiPlay,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAlert, SystemAlert, AlertSeverity } from "../store/AlertContext";
import { useLanguage } from "../store/LanguageContext";

export const AlertCenter: React.FC = () => {
  const { isRtl } = useLanguage();
  const { alerts, addAlert, acknowledgeAlert, clearAlerts } = useAlert();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | AlertSeverity>("all");

  // Filter calculations
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const activeAlerts = filteredAlerts.filter((a) => !a.acknowledged);
  const acknowledgedHistory = filteredAlerts.filter((a) => a.acknowledged);

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return {
          icon: <FiAlertOctagon className="text-red-500 animate-bounce" size={20} />,
          badge: "bg-red-500/10 border-red-500/20 text-red-500",
          cardBorder: "border-l-4 border-l-red-500",
        };
      case "error":
        return {
          icon: <FiAlertTriangle className="text-orange-500" size={20} />,
          badge: "bg-orange-500/10 border-orange-500/20 text-orange-500",
          cardBorder: "border-l-4 border-l-orange-500",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="text-amber-500" size={20} />,
          badge: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          cardBorder: "border-l-4 border-l-amber-500",
        };
      default:
        return {
          icon: <FiInfo className="text-fifa-blue" size={20} />,
          badge: "bg-fifa-blue/10 border-fifa-blue/20 text-fifa-blue",
          cardBorder: "border-l-4 border-l-fifa-blue",
        };
    }
  };

  // Manual Trigger Simulation functions
  const triggerSimulation = (type: "crowd" | "queue" | "emergency" | "route" | "parking") => {
    switch (type) {
      case "crowd":
        addAlert(
          "Crowd Limit Exceeded: Stand B",
          "Occupancy at Concourse Stand B reached 92%, exceeding the recommended safety margin of 85%.",
          "error"
        );
        break;
      case "queue":
        addAlert(
          "Queue Delay: North Turnstiles",
          "Average waiting delay at the North gate turnstiles exceeded 15 minutes.",
          "warning"
        );
        break;
      case "emergency":
        addAlert(
          "Emergency: Medical Call Sector 108",
          "Heat stroke emergency reported in Sector 108. Paramedic responders dispatched.",
          "critical"
        );
        break;
      case "route":
        addAlert(
          "Access Route Blocked: Ramp 4",
          "Step-free wheelchair ramp 4 blocked due to minor barrier damage. Rerouting active.",
          "critical"
        );
        break;
      case "parking":
        addAlert(
          "Parking Capacity Met: Zone C",
          "Parking Area Zone C is 100% full. Redirecting incoming vehicles to Zone D.",
          "info"
        );
        break;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header section with live alert badges */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiBell className="text-fifa-blue animate-pulse" /> Operations Alert Center
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            Track, filter, and resolve security alerts, crowd blockages, and venue capacity events in real-time.
          </p>
        </div>

        {/* Dismiss and notifications metrics */}
        <div className="flex items-center gap-3">
          <Badge variant="red" className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1">
            {alerts.filter(a => !a.acknowledged).length} Active Alerts
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={clearAlerts}
            className="flex items-center gap-1.5 text-xs font-black uppercase"
          >
            <FiTrash2 />
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Control filters bar */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-3 text-light-muted dark:text-dark-muted" size={14} />
            <input
              type="text"
              placeholder="Search alert log content..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-light-border rounded-xl text-xs focus:outline-none focus:border-fifa-blue dark:bg-fifa-navy dark:border-fifa-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FiSliders className="text-light-muted hidden md:inline" />
            <span className="text-[10px] font-black uppercase text-light-muted mr-1">Filter Severity:</span>
            {["all", "info", "warning", "error", "critical"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev as any)}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
                  selectedSeverity === sev
                    ? "bg-fifa-blue border-fifa-blue text-white"
                    : "bg-slate-50 dark:bg-fifa-navy border-light-border dark:border-fifa-border text-light-muted dark:text-dark-muted hover:border-fifa-blue"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Active Alerts Lists */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                Active Alerts Log ({activeAlerts.length})
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <AnimatePresence>
                {activeAlerts.length > 0 ? (
                  activeAlerts.map((alert) => {
                    const styles = getSeverityStyle(alert.severity);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-xl border bg-white dark:bg-fifa-navy/5 border-light-border dark:border-fifa-border flex items-start gap-4 ${styles.cardBorder}`}
                      >
                        <div className="mt-0.5">{styles.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs font-black truncate">{alert.title}</h4>
                            <Badge className={`uppercase text-[8px] font-black border ${styles.badge}`}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                            {alert.message}
                          </p>
                          <span className="text-[9px] text-light-muted block mt-2">
                            Triggered: {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center gap-1 text-[10px] font-black uppercase py-1 px-2.5 rounded-lg border"
                        >
                          <FiCheck /> Resolve
                        </Button>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-center py-12 text-xs text-light-muted dark:text-dark-muted">
                    No active alerts matching current filters.
                  </p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Control triggers and historical resolved list */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Simulated Alerts Trigger Pad */}
          <Card>
            <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FiPlay className="text-fifa-blue" /> Alert Simulation Pad
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <span className="text-[10px] text-light-muted dark:text-dark-muted block mb-2">
                Click any mock condition to inject a new alert into the context pipeline.
              </span>
              
              <Button
                variant="secondary"
                onClick={() => triggerSimulation("crowd")}
                className="w-full text-left flex justify-between items-center text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-slate-50 dark:hover:bg-fifa-navy"
              >
                <span>Crowd Exceeds Limit</span>
                <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px]">ERROR</Badge>
              </Button>

              <Button
                variant="secondary"
                onClick={() => triggerSimulation("queue")}
                className="w-full text-left flex justify-between items-center text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-slate-50 dark:hover:bg-fifa-navy"
              >
                <span>Queue Too Long</span>
                <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px]">WARNING</Badge>
              </Button>

              <Button
                variant="secondary"
                onClick={() => triggerSimulation("emergency")}
                className="w-full text-left flex justify-between items-center text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-slate-50 dark:hover:bg-fifa-navy"
              >
                <span>Emergency Occurred</span>
                <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px]">CRITICAL</Badge>
              </Button>

              <Button
                variant="secondary"
                onClick={() => triggerSimulation("route")}
                className="w-full text-left flex justify-between items-center text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-slate-50 dark:hover:bg-fifa-navy"
              >
                <span>Access Route Blocked</span>
                <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px]">CRITICAL</Badge>
              </Button>

              <Button
                variant="secondary"
                onClick={() => triggerSimulation("parking")}
                className="w-full text-left flex justify-between items-center text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-slate-50 dark:hover:bg-fifa-navy"
              >
                <span>Parking Areas Full</span>
                <Badge className="bg-fifa-blue/10 text-fifa-blue border border-fifa-blue/20 text-[9px]">INFO</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Historical resolved logs */}
          <Card className="flex-1">
            <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FiFileText /> Acknowledged History ({acknowledgedHistory.length})
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                <AnimatePresence>
                  {acknowledgedHistory.length > 0 ? (
                    acknowledgedHistory.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-lg border border-light-border/60 bg-slate-50/50 dark:bg-fifa-navy/5 text-light-muted dark:text-dark-muted flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-bold line-through truncate max-w-[150px]">{alert.title}</h4>
                          <span className="text-[8px] font-black uppercase text-emerald-500">Resolved</span>
                        </div>
                        <p className="text-[11px] leading-relaxed truncate">{alert.message}</p>
                        <span className="text-[8px] mt-1 text-light-muted">
                          Archived: {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs text-light-muted dark:text-dark-muted">
                      No resolved alerts in history log.
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default AlertCenter;
