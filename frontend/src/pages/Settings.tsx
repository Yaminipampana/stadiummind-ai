import React from "react";
import { FiSettings, FiSliders, FiBell, FiLock } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-light-muted dark:text-dark-muted">Manage simulator configurations, account configurations, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg flex items-center gap-2"><FiBell /> Notification Channels</h3>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Push Broadcast Warnings</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Send SMS/App push notifications during emergencies.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-fifa-blue" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Queue Alert Thresholds</h4>
                  <p className="text-xs text-light-muted dark:text-dark-muted">Warn when concession stand wait times exceed 20 minutes.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-fifa-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg flex items-center gap-2"><FiLock /> Security Controls</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Button variant="primary">Update Security Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
