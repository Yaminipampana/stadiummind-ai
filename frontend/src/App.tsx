import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./store/ThemeContext";
import { AuthProvider } from "./store/AuthContext";
import { AlertProvider } from "./store/AlertContext";
import { LanguageProvider } from "./store/LanguageContext";
import ResponsiveLayout from "./components/layout/ResponsiveLayout";
import AppRoutes from "./routes/AppRoutes";
import ToastNotification from "./components/ui/ToastNotification";
import "./index.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AlertProvider>
            <ToastNotification />
            <Router>
              <ResponsiveLayout>
                <AppRoutes />
              </ResponsiveLayout>
            </Router>
          </AlertProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

