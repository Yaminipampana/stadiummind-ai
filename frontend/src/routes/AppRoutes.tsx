import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import Chat from "../pages/Chat";
import Navigation from "../pages/Navigation";
import Crowd from "../pages/Crowd";
import CrowdAnalytics from "../pages/CrowdAnalytics";
import AlertCenter from "../pages/AlertCenter";
import Queue from "../pages/Queue";
import Volunteer from "../pages/Volunteer";
import Emergency from "../pages/Emergency";
import Accessibility from "../pages/Accessibility";
import Sustainability from "../pages/Sustainability";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 1. Home */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* 2. Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 3. AI Assistant */}
      <Route path="/ai-assistant" element={<Chat />} />
      <Route path="/chat" element={<Navigate to="/ai-assistant" replace />} />

      {/* 4. Interactive Stadium Map */}
      <Route path="/map" element={<Navigation />} />
      <Route path="/navigation" element={<Navigate to="/map" replace />} />

      {/* 5. Crowd Heatmap */}
      <Route path="/crowd" element={<Crowd />} />
      <Route path="/crowd-analytics" element={<CrowdAnalytics />} />
      <Route path="/alerts" element={<AlertCenter />} />

      {/* 6. Queue Prediction */}
      <Route path="/queue" element={<Queue />} />

      {/* 7. Volunteer Portal */}
      <Route path="/volunteer" element={<Volunteer />} />

      {/* 8. Emergency Center */}
      <Route path="/emergency" element={<Emergency />} />

      {/* 9. Accessibility */}
      <Route path="/accessibility" element={<Accessibility />} />

      {/* 10. Sustainability */}
      <Route path="/sustainability" element={<Sustainability />} />

      {/* 11. Reports */}
      <Route path="/reports" element={<Reports />} />

      {/* 12. Settings */}
      <Route path="/settings" element={<Settings />} />

      {/* 13. Unknown Route Fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
