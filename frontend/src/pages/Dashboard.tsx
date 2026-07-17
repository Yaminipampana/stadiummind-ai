import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiActivity,
  FiClock,
  FiAlertTriangle,
  FiRadio,
  FiCheckCircle,
  FiMapPin,
  FiHeart,
  FiTrash2,
  FiPlay,
  FiShield,
  FiGlobe,
  FiRefreshCw,
  FiPause,
  FiDownload,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useLanguage } from "../store/LanguageContext";
import { useTheme } from "../store/ThemeContext";
import { useAlert } from "../store/AlertContext";
import { crowdService, SimulationZone, OperationalInsight } from "../services/crowdService";
import { queueService, QueuePrediction } from "../services/queueService";

export const Dashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { theme } = useTheme();
  const { alerts, addAlert, acknowledgeAlert } = useAlert();

  const [zones, setZones] = useState<SimulationZone[]>([]);
  const [insights, setInsights] = useState<OperationalInsight[]>([]);
  const [queues, setQueues] = useState<QueuePrediction[]>([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [overallDensity, setOverallDensity] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const [isPaused, setIsPaused] = useState(() => {
    return localStorage.getItem("stadiummind_sim_paused") === "true";
  });

  useEffect(() => {
    localStorage.setItem("stadiummind_sim_paused", String(isPaused));
  }, [isPaused]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "stadiummind_sim_paused") {
        setIsPaused(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Mock match trend data
  const flowTrendData = [
    { time: "12:00 PM", ingress: 5200, egress: 120, density: 10 },
    { time: "01:00 PM", ingress: 12400, egress: 240, density: 25 },
    { time: "02:00 PM", ingress: 28900, egress: 450, density: 58 },
    { time: "03:00 PM", ingress: 47200, egress: 820, density: 94 }, // peak
    { time: "04:00 PM", ingress: 1800, egress: 1500, density: 98 },
    { time: "05:00 PM", ingress: 1500, egress: 4200, density: 99 }, // Halftime
    { time: "06:00 PM", ingress: 300, egress: 1200, density: 98 },
    { time: "07:00 PM", ingress: 100, egress: 8500, density: 97 },
    { time: "08:00 PM", ingress: 50, egress: 24000, density: 70 }, // Match finishes
  ];

  const fetchOperationsTelemetry = async () => {
    try {
      const [resSim, resIns, resQueues] = await Promise.all([
        crowdService.getCrowdSimulation(),
        crowdService.getSimulationInsights(),
        queueService.getQueuePredictions()
      ]);

      if (resSim.data) {
        setZones(resSim.data.zones);
        setTotalAttendance(resSim.data.totalAttendance);
        setOverallDensity(resSim.data.overallDensityIndex);
        setCriticalCount(resSim.data.criticalCount);
      }
      if (resIns.data) {
        setInsights(resIns.data.insights.slice(0, 3)); // show top 3 recommendations
      }
      if (resQueues.data) {
        setQueues(resQueues.data);
      }
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to synchronise operations telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const exportChartCSV = () => {
    const headers = "Time,Ingress,Egress\n";
    const rows = flowTrendData
      .map(d => `${d.time},${d.ingress},${d.egress}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ingress_egress_timeline_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isPaused) return;
    fetchOperationsTelemetry();
    const interval = setInterval(fetchOperationsTelemetry, 10000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const totalWaitTime = queues.reduce((sum, q) => sum + q.currentWaitMinutes, 0);
  const avgWaitTime = queues.length > 0 ? Math.round(totalWaitTime / queues.length) : 0;

  // Active alerts list from context
  const activeAlerts = alerts.filter(a => !a.acknowledged).slice(0, 4);

  // Dispatch manual quick-actions
  const runQuickAction = (action: string) => {
    switch (action) {
      case "marshal":
        addAlert(
          "Volunteers Dispatched",
          "15 volunteer crowd marshals deployed to relieve Food Court A lines.",
          "info"
        );
        break;
      case "medical":
        addAlert(
          "First Aid Team Dispatched",
          "Medical Response Unit 3 dispatched to Gate B first-aid room.",
          "info"
        );
        break;
      case "gate":
        addAlert(
          "Reserved Gates Opened",
          "Reserved Ingress Gates 9 and 10 opened to clear entrance bottleneck.",
          "info"
        );
        break;
      case "reroute":
        addAlert(
          "Route Rerouted",
          "East bypass walkways activated. Concourses navigation routes updated.",
          "info"
        );
        break;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/15 border-red-500/30 text-red-500";
      case "error": return "bg-orange-500/15 border-orange-500/30 text-orange-500";
      case "warning": return "bg-amber-500/15 border-amber-500/30 text-amber-500";
      default: return "bg-fifa-blue/15 border-fifa-blue/30 text-fifa-blue";
    }
  };

  const isDark = theme === "dark";
  const textClr = isDark ? "#94a3b8" : "#64748b";
  const gridClr = isDark ? "#1e293b" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#cbd5e1";

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text transition-colors duration-200" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Upper header section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiShield className="text-fifa-blue animate-pulse" /> Executive Operations Cockpit
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            StadiumMind AI enterprise monitoring, volunteer deployments, and event safety index metrics.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={isPaused ? "warning" : "success"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase animate-pulse"
          >
            {isPaused ? <FiPause /> : <FiPlay />}
            {isPaused ? "Simulation Paused" : "Simulation Active"}
          </Badge>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 text-xs font-black uppercase border"
          >
            {isPaused ? <FiPlay /> : <FiPause />}
            {isPaused ? "Resume" : "Pause"}
          </Button>

          <Badge
            variant="blue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase animate-pulse bg-fifa-pitch/10 border border-fifa-pitch/30 text-fifa-pitch"
          >
            <FiRadio />
            Tournament Mode Active
          </Badge>
          <span className="text-[10px] text-light-muted dark:text-dark-muted flex items-center gap-1">
            <FiRefreshCw className={isPaused ? "" : "animate-spin"} /> Live sync: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {loading && <p className="text-center py-12 text-xs text-light-muted">Synchronising command metrics...</p>}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-6 text-xs">
          <FiAlertTriangle size={18} className="flex-shrink-0" />
          <span>Telemetry connection interrupted: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          
          {/* Executive 8 KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* KPI 1: Total Attendance */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-fifa-blue/15 text-fifa-blue rounded-xl">
                  <FiUsers size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Scanned Tickets</span>
                  <h3 className="text-2xl font-black mt-0.5">{totalAttendance.toLocaleString()}</h3>
                  <span className="text-[9px] text-fifa-pitch font-bold block">Cap: 60,000 max</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Active Occupants */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-fifa-pitch/15 text-fifa-pitch rounded-xl">
                  <FiActivity size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Active Visitors</span>
                  <h3 className="text-2xl font-black mt-0.5">{Math.round(totalAttendance * 0.94).toLocaleString()}</h3>
                  <span className="text-[9px] text-light-muted block">Inside gates</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 3: Average Wait Time */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-500/15 text-amber-500 rounded-xl">
                  <FiClock size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Avg Wait Delay</span>
                  <h3 className="text-2xl font-black mt-0.5">{avgWaitTime} Mins</h3>
                  <span className="text-[9px] text-light-muted block">Turnstiles & concessions</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 4: Congested Zones */}
            <Card hoverEffect className={criticalCount > 0 ? "border-l-4 border-red-500" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-500/15 text-red-500 rounded-xl">
                  <FiAlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Congested Zones</span>
                  <h3 className="text-2xl font-black mt-0.5 text-red-500">{criticalCount} Areas</h3>
                  <span className="text-[9px] text-light-muted block">Density &gt; 80%</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 5: Emergency Incidents */}
            <Card hoverEffect className={alerts.filter(a => a.severity === "critical" && !a.acknowledged).length > 0 ? "border-l-4 border-red-500 animate-pulse" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-500/15 text-red-500 rounded-xl">
                  <FiShield size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Emergency Cases</span>
                  <h3 className="text-2xl font-black mt-0.5">{alerts.filter(a => a.severity === "critical" && !a.acknowledged).length} Open</h3>
                  <span className="text-[9px] text-light-muted block">First responders standby</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 6: Available Parking */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/15 text-indigo-500 rounded-xl">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Available Parking</span>
                  <h3 className="text-2xl font-black mt-0.5">850 Slots</h3>
                  <span className="text-[9px] text-light-muted block">Parking Zone D active</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 7: Volunteer Deployments */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-xl">
                  <FiHeart size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Volunteer Alignment</span>
                  <h3 className="text-2xl font-black mt-0.5">182 / 200</h3>
                  <span className="text-[9px] text-emerald-500 font-bold block">Marshals on standby</span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 8: Sustainability Score */}
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-fifa-pitch/15 text-fifa-pitch rounded-xl">
                  <FiGlobe size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Eco Score Index</span>
                  <h3 className="text-2xl font-black mt-0.5">86%</h3>
                  <span className="text-[9px] text-fifa-pitch font-bold block">Waste diversion rate</span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Dual Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Timeline Inflow Chart */}
            <Card>
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20 flex justify-between items-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                   Concourse Ingress vs Egress Profile
                </h3>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={exportChartCSV}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase py-1 px-2 border"
                >
                  <FiDownload /> Export CSV
                </Button>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={flowTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridClr} />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke={textClr} />
                    <YAxis tick={{ fontSize: 9 }} stroke={textClr} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Area name="Ingress flow rate" type="monotone" dataKey="ingress" stroke="#3b82f6" fill="url(#colIngress)" fillOpacity={0.1} />
                    <Area name="Egress flow rate" type="monotone" dataKey="egress" stroke="#ef4444" fill="url(#colEgress)" fillOpacity={0.1} />
                    <defs>
                      <linearGradient id="colIngress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colEgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Live zone comparison chart */}
            <Card>
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Live Zone Comparison Density (%)
                </h3>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zones}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridClr} />
                    <XAxis dataKey="name" tick={{ fontSize: 8 }} stroke={textClr} />
                    <YAxis tick={{ fontSize: 9 }} stroke={textClr} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                    <Bar name="Occupancy load" dataKey="density" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          {/* Lower layout: recent alerts + AI recommendation + quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent alerts ticket ticker */}
            <Card className="flex flex-col h-[350px]">
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <FiAlertTriangle className="text-red-500 animate-pulse" /> Active Operations Alerts
                </h3>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                <AnimatePresence>
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded-lg border flex flex-col ${getSeverityStyle(alert.severity)}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black truncate max-w-[170px]">{alert.title}</h4>
                          <span className="text-[8px] font-black uppercase">{alert.severity}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed truncate">{alert.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center py-16 text-xs text-light-muted dark:text-dark-muted">
                      No active operational alerts. Check simulation alerts log.
                    </p>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* AI operational recommendation cards */}
            <Card className="flex flex-col h-[350px]">
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <FiActivity className="text-fifa-blue" /> AI Operations Assistant
                </h3>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                {insights.length > 0 ? (
                  insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-3 rounded-lg border border-light-border/60 bg-slate-50/50 dark:bg-fifa-navy/5"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-black truncate max-w-[160px]">{insight.title}</h4>
                        <span className="text-[8px] font-bold text-fifa-blue">AI Confidence: {Math.round(insight.confidenceScore * 100)}%</span>
                      </div>
                      <p className="text-[10px] text-light-muted dark:text-dark-muted leading-relaxed">
                        {insight.recommendation}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-16 text-xs text-light-muted">No pending AI suggestions.</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Console */}
            <Card className="flex flex-col h-[350px]">
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                   Operations Quick Dispatch
                </h3>
              </CardHeader>
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[10px] text-light-muted dark:text-dark-muted block mb-2">
                  Dispatch backup teams or trigger alarms instantly across tournament concourses.
                </span>
                
                <div className="space-y-2 flex-1 overflow-y-auto">
                  <Button
                    variant="secondary"
                    onClick={() => runQuickAction("marshal")}
                    className="w-full text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-fifa-blue/5 hover:border-fifa-blue/20"
                  >
                    Deploy Kiosk Marshals
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => runQuickAction("medical")}
                    className="w-full text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-fifa-blue/5 hover:border-fifa-blue/20"
                  >
                    Dispatch Medical Unit
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => runQuickAction("gate")}
                    className="w-full text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-fifa-blue/5 hover:border-fifa-blue/20"
                  >
                    Open Reserved Gates
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => runQuickAction("reroute")}
                    className="w-full text-xs font-bold p-3 border border-light-border dark:border-fifa-border hover:bg-fifa-blue/5 hover:border-fifa-blue/20"
                  >
                    Activate Bypass Walkways
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;
