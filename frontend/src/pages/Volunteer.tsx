import React, { useEffect, useState } from "react";
import { FiCheckSquare, FiAlertCircle, FiClipboard, FiMapPin } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../store/AuthContext";
import { volunteerService, VolunteerTask } from "../services/volunteerService";

export const Volunteer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Issue Reporting States
  const [reportLoc, setReportLoc] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const [reportSeverity, setReportSeverity] = useState("medium");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await volunteerService.getTasks();
      if (res.data) setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    if (!user) return;
    const res = await volunteerService.claimTask(taskId, user.id);
    if (res.data) {
      fetchTasks();
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const res = await volunteerService.updateTaskStatus(taskId, { status: "completed" });
    if (res.data) {
      fetchTasks();
    }
  };

  const handleReportIssue = async () => {
    if (!reportLoc || !reportNotes) return;
    const res = await volunteerService.reportCrowdIssue({
      locationName: reportLoc,
      description: reportNotes,
      severity: reportSeverity,
    });
    if (res.data && res.data.success) {
      setReportSuccess(true);
      setReportLoc("");
      setReportNotes("");
      setReportSeverity("medium");
      fetchTasks();
      setTimeout(() => setReportSuccess(false), 3000);
    }
  };

  if (!isAuthenticated || (user?.role !== "volunteer" && user?.role !== "admin")) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiAlertCircle size={48} className="mx-auto text-brand-rose mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto">
          Please log in using the "Mock Volunteer" or "Mock Admin" button in the navigation header to view this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-light-text dark:text-dark-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Volunteer Dispatch Center</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Active volunteer: <span className="font-semibold text-brand-blue">{user.name}</span>. Handle assigned jobs and submit telemetry reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiClipboard className="text-brand-blue" /> Dispatch Queue ({tasks.length} Jobs)
              </h3>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Retrieving jobs...</p>
              ) : (
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-light-muted dark:text-dark-muted text-center py-6">All tasks completed! Sit back and monitor.</p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-light-border dark:border-dark-border rounded-xl bg-light-bg/50 dark:bg-dark-bg/25"
                      >
                        <div>
                          <div className="flex gap-2 items-center">
                            <span className={`text-xs uppercase font-extrabold px-1.5 py-0.5 rounded ${
                              task.priority === "critical"
                                ? "bg-brand-rose/20 text-brand-rose"
                                : task.priority === "high"
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-brand-gold/20 text-brand-gold"
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-light-muted dark:text-dark-muted">Status: {task.status}</span>
                          </div>
                          <h4 className="font-bold text-base mt-1">{task.title}</h4>
                          <p className="text-sm text-light-muted dark:text-dark-muted">{task.description}</p>
                          <div className="flex items-center gap-1 text-xs text-light-muted dark:text-dark-muted mt-2">
                            <FiMapPin /> {task.locationName}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {task.status === "pending" ? (
                            <Button size="sm" onClick={() => handleClaimTask(task.id)}>
                              Claim Job
                            </Button>
                          ) : task.assignedToId === user.id && task.status === "in-progress" ? (
                            <Button size="sm" variant="success" onClick={() => handleCompleteTask(task.id)}>
                              <FiCheckSquare className="mr-1.5" /> Resolve Job
                            </Button>
                          ) : (
                            <span className="text-xs text-light-muted dark:text-dark-muted italic">Assigned to another team</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Panel */}
        <Card className="h-fit">
          <CardHeader>
            <h3 className="font-bold text-lg">Report Stadium Issue</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Issue Location</label>
              <input
                type="text"
                placeholder="e.g., Gate 4 Restrooms"
                value={reportLoc}
                onChange={(e) => setReportLoc(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Severity Level</label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none text-light-text dark:text-dark-text"
              >
                <option value="low">Low - Clean up required</option>
                <option value="medium">Medium - Congestion block</option>
                <option value="high">High - Physical support needed</option>
                <option value="critical">Critical - Safety hazard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Incident Report Notes</label>
              <textarea
                rows={3}
                placeholder="Explain the situation..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-white border border-light-border dark:bg-dark-bg dark:border-dark-border focus:outline-none"
              />
            </div>
            <Button
              variant="warning"
              fullWidth
              onClick={handleReportIssue}
              disabled={!reportLoc || !reportNotes}
            >
              Submit Flag
            </Button>
            {reportSuccess && (
              <p className="text-xs text-brand-emerald text-center font-bold">Issue logged in system and broadcast to admin control!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Volunteer;
