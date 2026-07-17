import React, { useEffect, useState } from "react";
import { FiTrendingDown, FiSmile, FiTrash2, FiMapPin, FiTruck } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { sustainabilityService, SustainabilityReport } from "../services/sustainabilityService";

export const Sustainability: React.FC = () => {
  const [report, setReport] = useState<SustainabilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [recycleType, setRecycleType] = useState<"bottle" | "can" | "cardboard">("bottle");
  const [recycleCount, setRecycleCount] = useState(1);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await sustainabilityService.getReport();
      if (res.data) setReport(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleRecycle = async () => {
    const res = await sustainabilityService.logRecycleAction({
      userId: "usr_mock",
      itemType: recycleType,
      count: recycleCount,
    });
    if (res.data?.success) {
      setEarnedPoints(res.data.rewardPoints);
      setTimeout(() => setEarnedPoints(null), 4000);
      fetchReport();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Eco-Sustainability Console</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Stadium carbon metrics, smart recycling incentives, and eco-friendly public transit links.
        </p>
      </div>

      {loading && <p>Loading eco metrics...</p>}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Telemetry */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">CO2 Offset Saved</h4>
                <div className="text-3xl font-bold text-brand-emerald mt-1">{report.co2SavedKg} KG</div>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-2">Offset by clean energy & transit</p>
              </Card>

              <Card>
                <h4 className="text-xs uppercase text-light-muted dark:text-dark-muted font-bold">Recycled Material</h4>
                <div className="text-3xl font-bold mt-1">{report.recycledTons} Tons</div>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-2">Diverted from landfills today</p>
              </Card>
            </div>

            {/* Waste bin levels */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiTrash2 className="text-brand-emerald" /> Smart Waste Bin Fill Capacity
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.wasteBins.map((bin) => (
                  <div key={bin.binId} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{bin.locationDescription} ({bin.type})</span>
                      <span className={bin.fillPercentage > 80 ? "text-brand-rose" : "text-light-text dark:text-dark-text"}>
                        {bin.fillPercentage}% Full
                      </span>
                    </div>
                    <div className="w-full bg-light-border dark:bg-dark-border h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          bin.fillPercentage > 80
                            ? "bg-brand-rose"
                            : bin.type === "recycling"
                            ? "bg-brand-blue"
                            : "bg-brand-emerald"
                        }`}
                        style={{ width: `${bin.fillPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Public Transit alternatives */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiTruck className="text-brand-blue" /> Green Transit Departures
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.transit.map((trans, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border border-light-border dark:border-dark-border rounded-xl"
                  >
                    <div>
                      <h4 className="font-bold text-sm">
                        {trans.type.toUpperCase()} Line {trans.routeNumber}
                      </h4>
                      <p className="text-xs text-light-muted dark:text-dark-muted">To {trans.destination}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-emerald">
                        In {trans.nextDepartureMinutes} mins
                      </div>
                      <p className="text-xs text-light-muted dark:text-dark-muted capitalize">Status: {trans.status}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recycling Reward Incentive */}
          <Card className="h-fit">
            <CardHeader>
              <h3 className="font-bold text-lg">Log Recycling Action</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-light-muted dark:text-dark-muted">
                Scan barcode or select recycled item to collect Fan Rewards tokens.
              </p>

              <div>
                <label className="block text-sm font-semibold mb-1">Item Category</label>
                <select
                  value={recycleType}
                  onChange={(e: any) => setRecycleType(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
                >
                  <option value="bottle">Plastic Bottle (+10 pts)</option>
                  <option value="can">Aluminum Can (+15 pts)</option>
                  <option value="cardboard">Cardboard Container (+5 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
                  value={recycleCount}
                  onChange={(e) => setRecycleCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <Button variant="success" fullWidth onClick={handleRecycle}>
                Claim Fan Points
              </Button>

              {earnedPoints !== null && (
                <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-lg text-center font-bold text-xs mt-4">
                  <FiSmile size={18} className="mx-auto mb-1 text-brand-emerald" />
                  Successfully credited {earnedPoints} Points to your FIFA Wallet!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Sustainability;
