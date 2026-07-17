import React from "react";
import {
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiClock,
  FiUsers,
  FiArrowUpRight,
  FiArrowDownLeft,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useLanguage } from "../store/LanguageContext";
import { useTheme } from "../store/ThemeContext";

// --- Mock Match Day Data ---
const matchDayTrend = [
  { hour: "12:00 PM", attendance: 5200, entryFlow: 1200, exitFlow: 50, occupancy: 10 },
  { hour: "01:00 PM", attendance: 12400, entryFlow: 2400, exitFlow: 80, occupancy: 25 },
  { hour: "02:00 PM", attendance: 28900, entryFlow: 5600, exitFlow: 150, occupancy: 58 },
  { hour: "03:00 PM", attendance: 47200, entryFlow: 9200, exitFlow: 300, occupancy: 94 }, // Kickoff peak
  { hour: "04:00 PM", attendance: 49500, entryFlow: 1800, exitFlow: 450, occupancy: 98 }, // Match active
  { hour: "05:00 PM", attendance: 49800, entryFlow: 1500, exitFlow: 1200, occupancy: 99 }, // Halftime peak
  { hour: "06:00 PM", attendance: 49600, entryFlow: 300, exitFlow: 500, occupancy: 98 },
  { hour: "07:00 PM", attendance: 49100, entryFlow: 100, exitFlow: 1200, occupancy: 97 },
  { hour: "08:00 PM", attendance: 35000, entryFlow: 50, exitFlow: 15000, occupancy: 70 }, // Match finishes
  { hour: "09:00 PM", attendance: 12000, entryFlow: 10, exitFlow: 23000, occupancy: 24 },
  { hour: "10:00 PM", attendance: 1500, entryFlow: 0, exitFlow: 10500, occupancy: 3 },
];

const zoneComparison = [
  { name: "North Gate", load: 35, people: 1750 },
  { name: "South Gate", load: 62, people: 3100 },
  { name: "East Gate", load: 78, people: 3900 },
  { name: "West Gate", load: 85, people: 4250 },
  { name: "Food Court A", load: 92, people: 2760 },
  { name: "Food Court B", load: 58, people: 1740 },
  { name: "Merchandise Store", load: 88, people: 1760 },
  { name: "Main Entrance", load: 94, people: 5640 },
  { name: "VIP Entrance", load: 18, people: 360 },
  { name: "Parking Area", load: 45, people: 3600 },
];

const distributionData = [
  { name: "Gates & Ingress", value: 30, color: "#3b82f6" },
  { name: "Seating Tiers", value: 45, color: "#10b981" },
  { name: "Food Courts", value: 12, color: "#f59e0b" },
  { name: "Merchandise Store", value: 8, color: "#ef4444" },
  { name: "Parking & Transit", value: 5, color: "#6366f1" },
];

// --- Reusable Chart Components ---

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, icon, children }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20 flex flex-row items-center gap-2">
      <div className="text-fifa-blue dark:text-fifa-sky">{icon}</div>
      <div>
        <h3 className="font-extrabold text-sm uppercase tracking-wider leading-tight">{title}</h3>
        {subtitle && <p className="text-[10px] text-light-muted dark:text-dark-muted mt-0.5">{subtitle}</p>}
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-1 min-h-[250px]">{children}</CardContent>
  </Card>
);

export const CrowdAnalytics: React.FC = () => {
  const { isRtl } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const textClr = isDark ? "#94a3b8" : "#64748b";
  const gridClr = isDark ? "#1e293b" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#cbd5e1";

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
             Crowd Analytics Intelligence
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            Analytical insights, match-day timeline trends, and sector flow balance.
          </p>
        </div>
        <Badge variant="blue" className="bg-fifa-blue/15 border border-fifa-blue/30 text-fifa-blue px-3 py-1.5 rounded-lg text-xs font-bold uppercase">
           Match Day Profile
        </Badge>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-fifa-blue/10 text-fifa-blue rounded-xl">
              <FiClock size={26} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Peak Inflow Hours</span>
              <h3 className="text-xl font-black mt-0.5">3:00 PM - 5:00 PM</h3>
              <span className="text-[10px] text-light-muted block mt-0.5">Pre-kickoff bottleneck window</span>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FiActivity size={26} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Average Occupancy</span>
              <h3 className="text-xl font-black mt-0.5">71.2%</h3>
              <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">Comfortable flow average</span>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <FiUsers size={26} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Maximum Occupancy</span>
              <h3 className="text-xl font-black mt-0.5">99.0%</h3>
              <span className="text-[10px] text-red-500 font-bold block mt-0.5">49,800 spectators (Halftime)</span>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FiTrendingUp size={26} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-light-muted dark:text-dark-muted block">Egress Duration</span>
              <h3 className="text-xl font-black mt-0.5">38 Mins</h3>
              <span className="text-[10px] text-light-muted block mt-0.5">Full clear-out index</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Chart 1: Hourly trend */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Hourly Attendance & Load Trend"
            subtitle="Spectator volume timeline compared against average section density percentage."
            icon={<FiTrendingUp />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={matchDayTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridClr} vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: textClr }} stroke={gridClr} />
                <YAxis tick={{ fontSize: 9, fill: textClr }} stroke={gridClr} />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line
                  name="Attendance (Visitors)"
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={3.5}
                  dot={{ r: 3 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
                <Line
                  name="Occupancy Index (%)"
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Chart 2: Crowd Distribution */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Spatial Distribution Profile"
            subtitle="Allocation breakdown of active spectators during match operations."
            icon={<FiPieChart />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={{ fontSize: 8, fill: textClr }}
                  isAnimationActive={true}
                  animationDuration={1500}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
                <Legend wrapperStyle={{ fontSize: "9px" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>

      {/* Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Entry vs Exit Flow */}
        <ChartCard
          title="Ingress vs Egress Velocity"
          subtitle="Timeline flow rates measuring incoming gates entries vs outgoing ticket holders (per hour)."
          icon={<FiActivity />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={matchDayTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridClr} vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: textClr }} stroke={gridClr} />
              <YAxis tick={{ fontSize: 9, fill: textClr }} stroke={gridClr} />
              <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Area
                name="Ingress Rate"
                type="monotone"
                dataKey="entryFlow"
                stroke="#3b82f6"
                fill="url(#entryColor)"
                fillOpacity={0.15}
                isAnimationActive={true}
                animationDuration={1500}
              />
              <Area
                name="Egress Rate"
                type="monotone"
                dataKey="exitFlow"
                stroke="#f97316"
                fill="url(#exitColor)"
                fillOpacity={0.15}
                isAnimationActive={true}
                animationDuration={1500}
              />
              <defs>
                <linearGradient id="entryColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Zone Comparison */}
        <ChartCard
          title="Comparative Zone Peak Loads"
          subtitle="Live spatial capacity and occupant totals mapped side-by-side."
          icon={<FiBarChart2 />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridClr} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: textClr }} stroke={gridClr} />
              <YAxis tick={{ fontSize: 9, fill: textClr }} stroke={gridClr} />
              <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px", background: tooltipBg, borderColor: tooltipBorder }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar
                name="Occupant density (%)"
                dataKey="load"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

    </div>
  );
};

export default CrowdAnalytics;
