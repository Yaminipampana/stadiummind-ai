import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiMessageSquare,
  FiUsers,
  FiCompass,
  FiClock,
  FiBriefcase,
  FiSliders,
  FiHeart,
  FiActivity,
  FiAlertOctagon,
  FiArrowLeftCircle,
  FiTrendingUp,
  FiBell,
} from "react-icons/fi";
import { useAuth } from "../../store/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { label: "Home Base", path: "/", icon: <FiHome />, role: "all" },
    { label: "Dashboard", path: "/dashboard", icon: <FiSliders />, role: "all" },
    { label: "AI Assistant", path: "/ai-assistant", icon: <FiMessageSquare />, role: "all" },
    { label: "Stadium Map", path: "/map", icon: <FiCompass />, role: "all" },
    { label: "Crowd Flow", path: "/crowd", icon: <FiUsers />, role: "all" },
    { label: "Crowd Analytics", path: "/crowd-analytics", icon: <FiTrendingUp />, role: "all" },
    { label: "Alert Center", path: "/alerts", icon: <FiBell />, role: "all" },
    { label: "Queue Predict", path: "/queue", icon: <FiClock />, role: "all" },
    { label: "Accessibility", path: "/accessibility", icon: <FiHeart />, role: "all" },
    { label: "Sustainability", path: "/sustainability", icon: <FiActivity />, role: "all" },
    { label: "Emergency Center", path: "/emergency", icon: <FiAlertOctagon />, role: "all" },
    { label: "Reports Log", path: "/reports", icon: <FiSliders />, role: "admin" },
    { label: "Settings", path: "/settings", icon: <FiSliders />, role: "all" },
    { label: "Volunteer Portal", path: "/volunteer", icon: <FiBriefcase />, role: "volunteer" },
  ];

  const filteredLinks = links.filter((link) => {
    if (link.role === "all") return true;
    if (link.role === "volunteer" && (user.role === "volunteer" || user.role === "admin")) return true;
    if (link.role === "admin" && user.role === "admin") return true;
    return false;
  });

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-fifa-darkNavy/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-light-border dark:border-fifa-border bg-white dark:bg-fifa-navy transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-light-border/60 dark:border-fifa-border/60">
            <span className="text-xs uppercase font-black tracking-widest text-fifa-blue dark:text-fifa-sky">
              TOURNAMENT PANEL
            </span>
            <button onClick={onClose} className="lg:hidden text-light-muted dark:text-dark-muted">
              <FiArrowLeftCircle size={20} />
            </button>
          </div>

          {/* Links list */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-fifa-blue text-white shadow-fifa-glow"
                      : "text-light-text dark:text-dark-text hover:bg-slate-50 dark:hover:bg-fifa-darkNavy/60"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User metadata footer card */}
          <div className="p-4 border-t border-light-border/80 dark:border-fifa-border/80 bg-slate-50/50 dark:bg-fifa-darkNavy/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fifa-blue-gradient text-white flex items-center justify-center font-bold shadow-sm">
                {user.role[0].toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-light-text dark:text-dark-text capitalize">
                  {user.role} Account
                </h4>
                <p className="text-[10px] text-light-muted dark:text-dark-muted">
                  StadiumMind Simulation
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
