import React, { useEffect, useState } from "react";
import { FiEye, FiVolume2, FiMap, FiSmile, FiAlertCircle } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { accessibilityService, AccessibilityIncident, WheelchairRequest } from "../services/accessibilityService";

export const Accessibility: React.FC = () => {
  const [facilities, setFacilities] = useState<AccessibilityIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [userLoc, setUserLoc] = useState("");
  const [reqNotes, setReqNotes] = useState("");
  const [activeRequest, setActiveRequest] = useState<WheelchairRequest | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await accessibilityService.getFacilityStatus();
      if (res.data) setFacilities(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleRequestAssistance = async () => {
    if (!userPhone || !userLoc) return;
    const res = await accessibilityService.requestWheelchairAssistance({
      locationName: userLoc,
      contactPhone: userPhone,
      specialNotes: reqNotes,
    });
    if (res.data) {
      setActiveRequest(res.data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Accessibility Assistant</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Adaptive services, sensory zones, and wheelchair assistance. We are here to support every fan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adaptive settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg">Adaptive Services & Settings</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 border border-light-border dark:border-dark-border rounded-xl hover:bg-brand-blue/10 text-left transition-colors">
                <FiVolume2 size={24} className="text-brand-blue" />
                <div>
                  <h4 className="font-bold text-sm">Audio Description</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Turn on live match commentator narration.</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-light-border dark:border-dark-border rounded-xl hover:bg-brand-blue/10 text-left transition-colors">
                <FiEye size={24} className="text-brand-blue" />
                <div>
                  <h4 className="font-bold text-sm">High Contrast Mode</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Configure color palette for maximum visibility.</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-light-border dark:border-dark-border rounded-xl hover:bg-brand-blue/10 text-left transition-colors">
                <FiSmile size={24} className="text-brand-blue" />
                <div>
                  <h4 className="font-bold text-sm">Sensory Room Status</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Check location and noise levels of quiet rooms.</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-light-border dark:border-dark-border rounded-xl hover:bg-brand-blue/10 text-left transition-colors">
                <FiMap size={24} className="text-brand-blue" />
                <div>
                  <h4 className="font-bold text-sm">Wheelchair Map POIs</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Highlight elevators, ramps, and accessible toilets.</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Infrastructure updates */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg">Infrastructure Health Monitor</h3>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Retrieving health metrics...</p>
              ) : (
                <div className="space-y-3">
                  {facilities.map((fac) => (
                    <div
                      key={fac.id}
                      className="flex justify-between items-center p-3 border border-light-border dark:border-dark-border rounded-lg"
                    >
                      <div>
                        <h4 className="font-bold text-sm">{fac.facilityName}</h4>
                        <p className="text-xs text-light-muted dark:text-dark-muted capitalize">Type: {fac.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        fac.status === "operational" ? "bg-brand-emerald/10 text-brand-emerald" : "bg-brand-rose/10 text-brand-rose"
                      }`}>
                        {fac.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Wheelchair Request */}
        <Card className="h-fit">
          <CardHeader>
            <h3 className="font-bold text-lg">Request Physical Escort</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Need assistance getting to your seat? Log a wheelchair assist call and our volunteer team will find you.
            </p>

            <Input
              label="Your Current Section / Gate"
              placeholder="e.g. Gate 4, Section 102 Row G"
              value={userLoc}
              onChange={(e) => setUserLoc(e.target.value)}
            />

            <Input
              label="Contact Phone Number"
              placeholder="+1 (555) 123-4567"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />

            <div>
              <label className="block text-sm font-semibold mb-1">Special Assistance Details</label>
              <textarea
                rows={2}
                value={reqNotes}
                onChange={(e) => setReqNotes(e.target.value)}
                placeholder="Require extra space, oxygen tank support..."
                className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none text-sm"
              />
            </div>

            <Button variant="primary" fullWidth onClick={handleRequestAssistance} disabled={!userLoc || !userPhone}>
              Submit Assistance Request
            </Button>

            {activeRequest && (
              <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-lg text-xs mt-4">
                <p className="font-bold mb-1">Assistance Confirmed!</p>
                <p>Status: <span className="underline capitalize font-semibold">{activeRequest.status}</span></p>
                <p className="text-light-muted dark:text-dark-muted mt-1">Our dispatch team has been notified. Keep your phone active.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accessibility;
