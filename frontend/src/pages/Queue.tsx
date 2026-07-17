import React, { useEffect, useState } from "react";
import { FiClock, FiTrendingUp, FiTrendingDown, FiRefreshCw } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { queueService, QueuePrediction } from "../services/queueService";

export const Queue: React.FC = () => {
  const [predictions, setPredictions] = useState<QueuePrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await queueService.getQueuePredictions();
      if (res.data) setPredictions(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const renderTrend = (trend: "rising" | "stable" | "falling") => {
    switch (trend) {
      case "rising":
        return <FiTrendingUp className="text-brand-rose" title="Rising wait time" />;
      case "falling":
        return <FiTrendingDown className="text-brand-emerald" title="Falling wait time" />;
      default:
        return <span className="text-brand-gold font-bold">→</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Queue Wait Time Predictions</h1>
          <p className="text-light-muted dark:text-dark-muted">
            Predictive wait forecasts for stadium gates, food stalls, and restrooms using AI telemetry.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQueues} disabled={loading}>
          <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-10">Running ML queue forecast models...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((queue) => (
            <Card key={queue.poiId} hoverEffect className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue dark:text-brand-gold dark:bg-brand-gold/10">
                      {queue.poiType}
                    </span>
                    <h3 className="font-bold text-lg mt-1">{queue.poiName}</h3>
                  </div>
                  <div className="text-xl flex items-center gap-1">
                    {renderTrend(queue.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiClock size={28} className="text-brand-blue" />
                    <div>
                      <div className="text-2xl font-black">{queue.currentWaitMinutes} mins</div>
                      <p className="text-xs text-light-muted dark:text-dark-muted">Current Wait Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-light-border dark:border-dark-border pt-3">
                    <div>
                      <p className="text-light-muted dark:text-dark-muted">In 15 Mins</p>
                      <p className="font-semibold">{queue.predictedWait15Min} mins</p>
                    </div>
                    <div>
                      <p className="text-light-muted dark:text-dark-muted">In 30 Mins</p>
                      <p className="font-semibold">{queue.predictedWait30Min} mins</p>
                    </div>
                  </div>
                </CardContent>
              </div>

              {queue.alternatives && queue.alternatives.length > 0 && (
                <div className="border-t border-light-border dark:border-dark-border pt-3 mt-4 text-xs">
                  <p className="font-semibold text-brand-emerald mb-1">Recommended Alternative:</p>
                  <div className="flex justify-between items-center">
                    <span>{queue.alternatives[0].poiName}</span>
                    <span className="font-bold">{queue.alternatives[0].waitMinutes} min wait ({queue.alternatives[0].distanceMeters}m away)</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queue;
