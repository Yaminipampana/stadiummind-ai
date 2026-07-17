import React from "react";
import { FiDownload, FiBarChart2 } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Analytical Reports</h1>
        <p className="text-light-muted dark:text-dark-muted">Generate and export crowd throughput, queue duration, and carbon offset logs.</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold text-lg">Available Datasets</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-light-border dark:border-fifa-border rounded-xl">
            <div>
              <h4 className="font-bold text-sm">Match Day Crowd Analytics</h4>
              <p className="text-xs text-light-muted dark:text-dark-muted">Throughput rates, heatmap aggregates, gate loads.</p>
            </div>
            <Button variant="primary" size="sm" className="gap-1.5"><FiDownload /> Export CSV</Button>
          </div>
          <div className="flex justify-between items-center p-4 border border-light-border dark:border-fifa-border rounded-xl">
            <div>
              <h4 className="font-bold text-sm">Concessions & Queue Forecasts</h4>
              <p className="text-xs text-light-muted dark:text-dark-muted">Estimated vs actual queue wait timelines.</p>
            </div>
            <Button variant="primary" size="sm" className="gap-1.5"><FiDownload /> Export CSV</Button>
          </div>
          <div className="flex justify-between items-center p-4 border border-light-border dark:border-fifa-border rounded-xl">
            <div>
              <h4 className="font-bold text-sm">Recycling & Transit Carbon Offsets</h4>
              <p className="text-xs text-light-muted dark:text-dark-muted">Total diverted waste counts, public transit shares.</p>
            </div>
            <Button variant="primary" size="sm" className="gap-1.5"><FiDownload /> Export CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
