import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiPhoneCall, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAlert, SystemAlert } from "../store/AlertContext";
import { emergencyService, SOSRequest, EvacuationRoute } from "../services/emergencyService";

export const Emergency: React.FC = () => {
  const { alerts, addAlert } = useAlert();
  const [sosType, setSosType] = useState<"medical" | "security" | "fire" | "structural">("medical");
  const [sosLoc, setSosLoc] = useState("");
  const [sosPhone, setSosPhone] = useState("");
  const [activeSOS, setActiveSOS] = useState<SOSRequest | null>(null);
  const [evacPlan, setEvacPlan] = useState<EvacuationRoute | null>(null);
  const [loadingEvac, setLoadingEvac] = useState(false);

  const handleSOS = async () => {
    if (!sosLoc) return;
    const res = await emergencyService.triggerSOS({
      type: sosType,
      locationDescription: sosLoc,
      contactPhone: sosPhone,
    });
    if (res.data) {
      setActiveSOS(res.data);
      // Dispatch alert to local context
      addAlert(
        `SOS Triggered: ${sosType.toUpperCase()}`,
        `Incident reported at ${sosLoc}. Security dispatched.`,
        "critical"
      );
    }
  };

  const handleEvacuationRoute = async (zone: string) => {
    setLoadingEvac(true);
    try {
      const res = await emergencyService.getEvacuationPlan(zone);
      if (res.data) setEvacPlan(res.data);
    } finally {
      setLoadingEvac(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-rose flex items-center gap-2">
          <FiAlertTriangle className="animate-pulse" /> Emergency Response Center
        </h1>
        <p className="text-light-muted dark:text-dark-muted">
          Immediate incident reporting, safety alerts broadcast status, and evacuation pathway routes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active broadcasts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-brand-rose/40">
            <CardHeader>
              <h3 className="font-bold text-lg text-brand-rose flex items-center gap-2">
                <FiPhoneCall className="animate-bounce" /> Trigger Instant SOS Dispatch
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-light-muted dark:text-dark-muted">
                If there is an active medical event, fire, or safety concern, fill out the form below. 
                This alerts nearest volunteers and security dispatchers immediately.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Incident Type</label>
                  <select
                    value={sosType}
                    onChange={(e: any) => setSosType(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
                  >
                    <option value="medical">Medical Event / Injury</option>
                    <option value="security">Safety Threat / Conflict</option>
                    <option value="fire">Fire / Smoke</option>
                    <option value="structural">Structural / Crowd crush</option>
                  </select>
                </div>
                <Input
                  label="Contact Phone"
                  placeholder="+1 (555) 000-1111"
                  value={sosPhone}
                  onChange={(e) => setSosPhone(e.target.value)}
                />
              </div>

              <Input
                label="Exact Incident Location"
                placeholder="e.g. Near Gate 3, Row L Seat 12"
                value={sosLoc}
                onChange={(e) => setSosLoc(e.target.value)}
              />

              <Button variant="danger" fullWidth onClick={handleSOS} disabled={!sosLoc}>
                Signal Emergency Beacon
              </Button>

              {activeSOS && (
                <div className="p-4 bg-brand-rose/10 border border-brand-rose/30 text-brand-rose rounded-xl text-xs flex items-center gap-3">
                  <FiCheckCircle size={24} className="flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">SOS ACTIVE & SENT!</h4>
                    <p>Incident Ref: <span className="font-semibold underline">{activeSOS.id}</span></p>
                    <p className="text-light-muted dark:text-dark-muted mt-0.5">Emergency teams and volunteers are en route to your coordinates.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Broadcast alert logs */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg">System Broadcast Log</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-light-muted dark:text-dark-muted">No safety alerts currently active.</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 border rounded-lg text-sm flex gap-3 ${
                      alert.severity === "critical"
                        ? "border-brand-rose/30 bg-brand-rose/5"
                        : "border-light-border dark:border-dark-border"
                    }`}
                  >
                    <FiAlertTriangle className={alert.severity === "critical" ? "text-brand-rose mt-0.5" : "text-brand-gold mt-0.5"} />
                    <div>
                      <h4 className="font-bold">{alert.title}</h4>
                      <p>{alert.message}</p>
                      <span className="text-xs text-light-muted dark:text-dark-muted">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Egress guide */}
        <Card className="h-fit">
          <CardHeader>
            <h3 className="font-bold text-lg">Instant Evacuation Guides</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Select your current stadium zone to print immediate exit pathways and routes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEvacuationRoute("zone-north")}
                className="flex-1 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded hover:bg-brand-rose/10 transition-colors text-xs font-semibold"
              >
                North Stand
              </button>
              <button
                onClick={() => handleEvacuationRoute("zone-south")}
                className="flex-1 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded hover:bg-brand-rose/10 transition-colors text-xs font-semibold"
              >
                South Stand
              </button>
            </div>

            {loadingEvac && <p className="text-center py-4 text-xs">Computing escape path...</p>}

            {evacPlan && (
              <div className="border-t border-light-border dark:border-dark-border pt-4 space-y-3">
                <div className="text-xs font-bold text-brand-rose uppercase">
                  Route to Exit: {evacPlan.exitGateName}
                </div>
                <ul className="space-y-1.5">
                  {evacPlan.recommendedPathInstructions.map((inst, index) => (
                    <li key={index} className="flex gap-1.5 text-xs items-start">
                      <FiChevronRight className="flex-shrink-0 mt-0.5 text-brand-rose" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;
