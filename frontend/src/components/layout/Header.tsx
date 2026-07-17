import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiAlertTriangle, FiUser, FiActivity } from "react-icons/fi";
import { useTheme } from "../../store/ThemeContext";
import { useAuth } from "../../store/AuthContext";
import { useAlert } from "../../store/AlertContext";
import ThemeToggle from "../ui/ThemeToggle";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, login } = useAuth();
  const { activeCriticalAlert, alerts } = useAlert();

  const activeAlertCount = alerts.filter((a) => !a.acknowledged).length;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "AI Chat", path: "/chat" },
    { label: "Crowds", path: "/crowd" },
    { label: "Navigation", path: "/navigation" },
    { label: "Queues", path: "/queue" },
    { label: "Accessibility", path: "/accessibility" },
    { label: "Sustainability", path: "/sustainability" },
  ];

  // Role based dashboards
  const volunteerItem = { label: "Volunteer DB", path: "/volunteer" };
  const adminItem = { label: "Admin Panel", path: "/admin" };
  const emergencyItem = { label: "Emergency", path: "/emergency" };

  const activeClass = "text-brand-blue dark:text-brand-gold border-b-2 border-brand-blue dark:border-brand-gold";
  const inactiveClass = "text-light-text/80 hover:text-brand-blue dark:text-dark-text/80 dark:hover:text-brand-gold border-b-2 border-transparent transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full bg-light-card border-b border-light-border dark:bg-dark-card dark:border-dark-border shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      {/* Real-time Emergency Banner */}
      {activeCriticalAlert && (
        <div className="bg-brand-rose text-white text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
          <FiAlertTriangle className="flex-shrink-0" />
          <span>CRITICAL ALERT: {activeCriticalAlert.title} - {activeCriticalAlert.message}</span>
          <Link to="/emergency" className="underline hover:text-dark-bg transition-colors ml-2">
            View Details
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-brand-blue dark:text-brand-gold">
          <FiActivity size={24} />
          <span>StadiumMind <span className="font-light text-light-text dark:text-dark-text">AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 h-full font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-5 ${location.pathname === item.path ? activeClass : inactiveClass}`}
            >
              {item.label}
            </Link>
          ))}

          {/* Conditional Role-Based Pages */}
          {isAuthenticated && user?.role === "volunteer" && (
            <Link
              to={volunteerItem.path}
              className={`py-5 ${location.pathname === volunteerItem.path ? activeClass : inactiveClass}`}
            >
              {volunteerItem.label}
            </Link>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <Link
                to={volunteerItem.path}
                className={`py-5 ${location.pathname === volunteerItem.path ? activeClass : inactiveClass}`}
              >
                {volunteerItem.label}
              </Link>
              <Link
                to={adminItem.path}
                className={`py-5 ${location.pathname === adminItem.path ? activeClass : inactiveClass}`}
              >
                {adminItem.label}
              </Link>
            </>
          )}

          <Link
            to={emergencyItem.path}
            className={`py-5 flex items-center gap-1.5 ${
              location.pathname === emergencyItem.path ? "text-brand-rose border-b-2 border-brand-rose" : "text-brand-rose/80 hover:text-brand-rose border-b-2 border-transparent"
            }`}
          >
            <FiAlertTriangle />
            {emergencyItem.label}
            {activeAlertCount > 0 && (
              <span className="bg-brand-rose text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {activeAlertCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Actions (Auth & Theme) */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-light-muted dark:text-dark-muted capitalize">{user.role}</p>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full border border-brand-blue"
              />
              <button
                onClick={logout}
                className="text-sm text-brand-rose font-medium hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => login("organizer@stadiummind.ai", "admin")}
                className="text-xs px-3 py-1.5 bg-brand-blue text-white rounded hover:bg-brand-blue/90"
              >
                Mock Admin
              </button>
              <button
                onClick={() => login("volunteer1@stadiummind.ai", "volunteer")}
                className="text-xs px-3 py-1.5 bg-brand-gold text-dark-bg rounded font-semibold hover:bg-brand-gold/90"
              >
                Mock Vol
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-light-text dark:text-dark-text border border-light-border dark:border-dark-border rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card px-4 py-4 space-y-3 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-base font-semibold ${
                location.pathname === item.path
                  ? "text-brand-blue dark:text-brand-gold"
                  : "text-light-text/80 dark:text-dark-text/80"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated && user?.role === "volunteer" && (
            <Link
              to={volunteerItem.path}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-base font-semibold text-brand-blue dark:text-brand-gold"
            >
              {volunteerItem.label}
            </Link>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <Link
                to={volunteerItem.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-semibold text-brand-blue dark:text-brand-gold"
              >
                {volunteerItem.label}
              </Link>
              <Link
                to={adminItem.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-semibold text-brand-blue dark:text-brand-gold"
              >
                {adminItem.label}
              </Link>
            </>
          )}

          <Link
            to={emergencyItem.path}
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-brand-rose flex items-center gap-1.5"
          >
            <FiAlertTriangle />
            Emergency
            {activeAlertCount > 0 && (
              <span className="bg-brand-rose text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                {activeAlertCount}
              </span>
            )}
          </Link>

          <hr className="border-light-border dark:border-dark-border" />

          {isAuthenticated && user ? (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-sm text-brand-rose font-medium hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  login("organizer@stadiummind.ai", "admin");
                  setIsOpen(false);
                }}
                className="text-xs px-3 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue/90"
              >
                Mock Admin
              </button>
              <button
                onClick={() => {
                  login("volunteer1@stadiummind.ai", "volunteer");
                  setIsOpen(false);
                }}
                className="text-xs px-3 py-2 bg-brand-gold text-dark-bg rounded font-semibold hover:bg-brand-gold/90"
              >
                Mock Volunteer
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
