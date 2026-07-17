import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiActivity,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiSliders,
  FiRefreshCw,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiShield,
  FiKey,
  FiRepeat,
  FiTrendingUp,
  FiCompass,
  FiThumbsUp,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { crowdService, SimulationZone, OperationalInsight } from "../services/crowdService";
import { useLanguage } from "../store/LanguageContext";
import { useTheme } from "../store/ThemeContext";

export const Crowd: React.FC = () => {
  const { isRtl } = useLanguage();
  const { theme } = useTheme();

  const [zones, setZones] = useState<SimulationZone[]>([]);
  const [insights, setInsights] = useState<OperationalInsight[]>([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [overallDensity, setOverallDensity] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "low" | "medium" | "high" | "critical">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "gate" | "food" | "store" | "parking" | "entrance">("all");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Hourly simulated historical load data
  const trendData = [
    { time: "12:00 PM", gates: 18, food: 22, store: 15 },
    { time: "01:00 PM", gates: 42, food: 55, store: 38 },
    { time: "02:00 PM", gates: 68, food: 74, store: 62 },
    { time: "03:00 PM", gates: 85, food: 88, store: 82 },
    { time: "04:00 PM", gates: 30, food: 45, store: 89 },
    { time: "05:00 PM", gates: 75, food: 92, store: 94 },
    { time: "06:00 PM", gates: 40, food: 50, store: 85 },
    { time: "07:00 PM", gates: 92, food: 30, store: 40 },
    { time: "08:00 PM", gates: 15, food: 10, store: 12 },
  ];

  // Fetch simulation data and insights from backend API in parallel
  const fetchSimulation = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [resSim, resIns] = await Promise.all([
        crowdService.getCrowdSimulation(),
        crowdService.getSimulationInsights()
      ]);

      if (resSim.data) {
        setZones(resSim.data.zones);
        setTotalAttendance(resSim.data.totalAttendance);
        setOverallDensity(resSim.data.overallDensityIndex);
        setCriticalCount(resSim.data.criticalCount);
      }
      if (resIns.data) {
        setInsights(resIns.data.insights);
      }
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to connect with simulation server.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial mount load
  useEffect(() => {
    fetchSimulation(true);
  }, []);

  // Interval polling loop (every 10 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      fetchSimulation(false);
    }, 10000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleReset = () => {
    setIsPaused(false);
    fetchSimulation(true);
  };

  const getLevelInfo = (density: number) => {
    if (density <= 30) return { label: "Low", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", fill: "#10b981" };
    if (density <= 60) return { label: "Medium", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", fill: "#f59e0b" };
    if (density <= 80) return { label: "High", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", fill: "#f97316" };
    return { label: "Critical", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", fill: "#ef4444" };
  };

  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/15 border-red-500/30 text-red-500";
      case "high": return "bg-orange-500/15 border-orange-500/30 text-orange-500";
      case "medium": return "bg-amber-500/15 border-amber-500/30 text-amber-500";
      default: return "bg-emerald-500/15 border-emerald-500/30 text-emerald-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gate": return <FiKey size={16} />;
      case "security": return <FiShield size={16} />;
      case "redirection": return <FiRepeat size={16} />;
      case "route": return <FiCompass size={16} />;
      case "volunteer": return <FiUsers size={16} />;
      default: return <FiActivity size={16} />;
    }
  };

  // Filter computations
  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase());
    const levelInfo = getLevelInfo(z.density);
    const matchesLevel = selectedLevel === "all" || levelInfo.label.toLowerCase() === selectedLevel;
    const matchesCategory = selectedCategory === "all" || z.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  const isDark = theme === "dark";
  const textClr = isDark ? "#94a3b8" : "#64748b";
  const gridClr = isDark ? "#1e293b" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#cbd5e1";

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text transition-colors duration-200" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header section with simulation controls */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiActivity className="text-fifa-blue dark:text-fifa-sky animate-pulse" /> Stadium Crowd Simulation
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            Live AI simulated monitoring nodes. Pause, resume, and reset simulation parameters locally.
          </p>
        </div>
        
        {/* Controls Bar */}
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
            className="flex items-center gap-1.5 text-xs font-black uppercase"
          >
            {isPaused ? <FiPlay /> : <FiPause />}
            {isPaused ? "Resume" : "Pause"}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-black uppercase"
          >
            <FiRotateCcw />
            Reset
          </Button>

          <span className="text-[10px] text-light-muted dark:text-dark-muted flex items-center gap-1">
            <FiRefreshCw className={isPaused ? "" : "animate-spin"} /> Sync: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {loading && <p className="text-center py-12 text-xs text-light-muted">Synchronizing simulation indicators...</p>}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-6 text-xs">
          <FiAlertTriangle size={18} className="flex-shrink-0" />
          <span>Failed to connect with simulation server: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-fifa-blue/10 text-fifa-blue rounded-xl">
                  <FiUsers size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Total Attendance</span>
                  <h3 className="text-2xl font-black mt-0.5">{totalAttendance.toLocaleString()}</h3>
                  <span className="text-[10px] text-fifa-pitch font-bold block">Live active occupants</span>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-fifa-pitch/10 text-fifa-pitch rounded-xl">
                  <FiActivity size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Avg Density</span>
                  <h3 className="text-2xl font-black mt-0.5">{overallDensity}%</h3>
                  <span className="text-[10px] text-light-muted block">Normal thresholds</span>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect className={criticalCount > 0 ? "border-l-4 border-red-500" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                  <FiAlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Critical Zones</span>
                  <h3 className="text-2xl font-black mt-0.5 text-red-500">{criticalCount} Areas</h3>
                  <span className="text-[10px] text-light-muted block">Density &gt; 80%</span>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                  <FiClock size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Operations Status</span>
                  <h3 className="text-2xl font-black mt-0.5">{criticalCount > 2 ? "High Alert" : "Stable"}</h3>
                  <span className="text-[10px] text-light-muted block">Dynamic routing active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map + Sidebar filter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual 2D Stadium Map */}
            <div className="lg:col-span-8 space-y-4">
              <Card className="overflow-hidden border border-light-border dark:border-fifa-border rounded-2xl">
                <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border flex justify-between items-center bg-slate-50/50 dark:bg-fifa-navy/20">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Interactive 2D Stadium Heatmap</h3>
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Med</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Critical</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 relative bg-slate-100 dark:bg-fifa-darkNavy h-[400px] flex items-center justify-center">
                  
                  {/* Central pitch graphic */}
                  <div className="w-[60%] h-[50%] border-4 border-slate-300/40 dark:border-slate-800 rounded-3xl relative flex items-center justify-center opacity-40">
                    <div className="w-1/2 h-full border-r-2 border-slate-300/40 dark:border-slate-800" />
                    <div className="w-24 h-24 rounded-full border-2 border-slate-300/40 dark:border-slate-800 absolute" />
                  </div>

                  {/* Overlay Badges */}
                  <AnimatePresence>
                    {zones.map((zone) => {
                      const info = getLevelInfo(zone.density);
                      const isSelected = selectedZoneId === zone.id;

                      return (
                        <motion.button
                          key={zone.id}
                          onClick={() => setSelectedZoneId(zone.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border shadow-lg transition-all flex flex-col items-center ${info.bg} ${
                            isSelected ? "ring-2 ring-fifa-blue dark:ring-fifa-sky scale-110 z-30" : "hover:scale-105 z-20"
                          }`}
                          style={{ left: zone.xPos, top: zone.yPos }}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          <span className="text-[9px] font-black uppercase text-center block truncate max-w-[80px]">
                            {zone.name.replace(" Merchandise Store", " Merch").replace(" Entrance", " Ent")}
                          </span>
                          <strong className={`text-xs font-black block mt-0.5 ${info.color}`}>
                            {zone.density}%
                          </strong>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>

                </CardContent>
              </Card>
            </div>

            {/* Sidebar Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <Card>
                <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                    <FiSliders className="text-fifa-blue" /> Filtering Operations
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-light-muted dark:text-dark-muted" size={14} />
                    <input
                      type="text"
                      placeholder="Search zone name..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-light-border rounded-xl text-xs focus:outline-none focus:border-fifa-blue dark:bg-fifa-navy dark:border-fifa-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block mb-1.5">Crowd Level</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "low", "medium", "high", "critical"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl as any)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
                            selectedLevel === lvl
                              ? "bg-fifa-blue border-fifa-blue text-white"
                              : "bg-slate-50 dark:bg-fifa-navy border-light-border dark:border-fifa-border text-light-muted dark:text-dark-muted hover:border-fifa-blue"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-light-text dark:text-dark-text">
                    Zone Telemetry Detail
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  {selectedZone ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-black">{selectedZone.name}</h4>
                          <span className="text-[10px] text-light-muted dark:text-dark-muted uppercase font-bold">{selectedZone.category}</span>
                        </div>
                        <Badge
                          className={`uppercase text-[10px] font-black ${getLevelInfo(selectedZone.density).bg} ${getLevelInfo(selectedZone.density).color}`}
                        >
                          {getLevelInfo(selectedZone.density).label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-2 border-y border-light-border/40 dark:border-fifa-border/40">
                        <div>
                          <span className="text-[9px] text-light-muted dark:text-dark-muted block">Density Load</span>
                          <strong className="text-xl font-black">{selectedZone.density}%</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-light-muted dark:text-dark-muted block">People Count</span>
                          <strong className="text-xl font-black">{selectedZone.people.toLocaleString()}</strong>
                        </div>
                      </div>

                      <span className="text-[9px] text-light-muted dark:text-dark-muted block">
                        Last updated: {new Date(selectedZone.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-xs text-light-muted dark:text-dark-muted">
                      Click any zone on the stadium heatmap visualizer to view operational logs.
                    </p>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>

          {/* AI Operations Insights Module */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-fifa-blue dark:text-fifa-sky flex items-center gap-1.5">
               AI Operations Insights Module
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl border bg-white dark:bg-fifa-navy/10 border-light-border dark:border-fifa-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-fifa-blue/10 text-fifa-blue`}>
                            {getCategoryIcon(insight.category)}
                          </div>
                          <span className="text-[10px] font-bold text-light-muted uppercase tracking-wider">
                            {insight.category}
                          </span>
                        </div>
                        <Badge className={`uppercase text-[9px] font-black border ${getPriorityBadgeStyles(insight.priority)}`}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-black mb-1">{insight.title}</h4>
                      <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                        {insight.recommendation}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-light-border/40 dark:border-fifa-border/40 flex justify-between items-center text-[10px] text-light-muted">
                      <span className="flex items-center gap-1">
                        <FiThumbsUp /> AI Confidence: {Math.round(insight.confidenceScore * 100)}%
                      </span>
                      <span>
                        {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Directory grid panel */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">
              Active Monitor Directory ({filteredZones.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <AnimatePresence>
                {filteredZones.map((zone) => {
                  const info = getLevelInfo(zone.density);
                  return (
                    <motion.div
                      key={zone.id}
                      layout
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`p-4 rounded-xl border bg-white dark:bg-fifa-navy/10 border-light-border dark:border-fifa-border cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[110px] ${
                        selectedZoneId === zone.id ? "ring-2 ring-fifa-blue dark:ring-fifa-sky" : ""
                      }`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-black truncate">{zone.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${zone.density > 80 ? "bg-red-500 animate-ping" : info.color.replace("text-", "bg-")}`} />
                      </div>
                      <div>
                        <span className="text-[10px] text-light-muted dark:text-dark-muted block">Density</span>
                        <strong className={`text-lg font-black ${info.color}`}>{zone.density}%</strong>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-light-border/40 dark:border-fifa-border/40 text-[9px] text-light-muted">
                        <span>{zone.people.toLocaleString()} people</span>
                        <span className="uppercase font-bold">{info.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Recharts Analytics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Concourse Peak Timeline Trends
                </h3>
              </CardHeader>
              <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridClr} />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke={textClr} />
                    <YAxis tick={{ fontSize: 9 }} stroke={textClr} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Line name="Gates Load" type="monotone" dataKey="gates" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                    <Line name="Food Stalls" type="monotone" dataKey="food" stroke="#f59e0b" strokeWidth={2} />
                    <Line name="Merch Shop" type="monotone" dataKey="store" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Comparative Live Zone Densities (%)
                </h3>
              </CardHeader>
              <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zones}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridClr} />
                    <XAxis dataKey="name" tick={{ fontSize: 8 }} stroke={textClr} />
                    <YAxis tick={{ fontSize: 9 }} stroke={textClr} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                    <Bar name="Density" dataKey="density" radius={[4, 4, 0, 0]}>
                      {zones.map((entry, index) => {
                        const info = getLevelInfo(entry.density);
                        return <rect key={`rect-${index}`} fill={info.fill} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default Crowd;
