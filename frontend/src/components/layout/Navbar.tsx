import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiCpu, FiUser, FiSliders, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../store/AuthContext";
import { useLanguage, LanguageCode } from "../../store/LanguageContext";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "../ui/Button";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, login, logout, setRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track scrolling to toggle transparent -> glassmorphic style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = location.pathname === "/";

  // Smooth scroll handler
  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (!isLandingPage) {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMockLogin = () => {
    login("admin@stadiummind.ai", "mock-admin-token");
    setRole("admin");
  };

  const navLinks = [
    { label: t("nav_home"), action: () => isLandingPage ? handleScrollToSection("hero") : navigate("/") },
    { label: t("nav_dashboard"), action: () => navigate("/dashboard") },
    { label: t("nav_chat"), action: () => navigate("/ai-assistant") },
    { label: t("nav_map"), action: () => navigate("/map") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-fifa-navy/90 backdrop-blur-md border-b border-light-border dark:border-fifa-border shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Left Side: Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && location.pathname !== "/" && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-fifa-darkNavy text-light-text dark:text-dark-text"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-fifa-blue-gradient text-white shadow-fifa-glow">
              <FiCpu size={20} className="animate-spin-slow" />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-fifa-blue to-fifa-pitch bg-clip-text text-transparent">
              STADIUMMIND AI
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={link.action}
              className="text-sm font-bold text-light-muted hover:text-fifa-blue dark:text-dark-muted dark:hover:text-fifa-sky transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side: Language Picker + Theme Switch + Auth + Dashboard CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-fifa-darkNavy dark:hover:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-xl px-2 py-1.5 focus:outline-none text-light-text dark:text-dark-text cursor-pointer"
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="ar">العربية (AR)</option>
            <option value="pt">Português (PT)</option>
          </select>

          <ThemeToggle />

          {user.isAuthenticated ? (
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-fifa-darkNavy/50 border border-light-border dark:border-fifa-border px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-light-text dark:text-dark-text">
                <FiUser size={14} className="text-fifa-blue dark:text-fifa-sky" />
                <span className="capitalize">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 transition-colors"
                title={t("logout_btn")}
              >
                <FiLogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-light-muted hover:text-fifa-blue dark:text-dark-muted dark:hover:text-fifa-sky transition-colors flex items-center gap-1"
            >
              <FiUser /> {t("login_btn")}
            </button>
          )}

          <Link to="/dashboard">
            <Button variant="primary" size="sm" className="gap-2 shadow-fifa-glow">
              <FiSliders size={14} /> {t("nav_dashboard")}
            </Button>
          </Link>
        </div>

        {/* Mobile View Toggles */}
        <div className="flex items-center gap-3 lg:hidden">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="text-xs font-bold bg-slate-100 dark:bg-fifa-darkNavy border border-light-border dark:border-fifa-border rounded-xl px-2 py-1.5 text-light-text dark:text-dark-text"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="hi">HI</option>
            <option value="ar">AR</option>
            <option value="pt">PT</option>
          </select>
          
          <ThemeToggle />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-fifa-darkNavy border border-light-border dark:border-fifa-border text-light-text dark:text-dark-text"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white dark:bg-fifa-navy border-b border-light-border dark:border-fifa-border overflow-hidden shadow-lg mt-3"
          >
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      link.action();
                    }}
                    className="text-left font-bold text-light-text dark:text-dark-text hover:text-fifa-blue dark:hover:text-fifa-sky py-2 border-b border-light-border/40 dark:border-fifa-border/40"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-light-border/60 dark:border-fifa-border/60">
                {user.isAuthenticated ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-fifa-darkNavy rounded-xl border border-light-border dark:border-fifa-border">
                    <span className="text-xs font-bold capitalize">Logged in as {user.role}</span>
                    <button onClick={logout} className="text-xs text-red-500 font-bold flex items-center gap-1">
                      <FiLogOut /> {t("logout_btn")}
                    </button>
                  </div>
                ) : (
                  <Button variant="secondary" fullWidth onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}>
                    {t("login_btn")}
                  </Button>
                )}

                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth className="gap-2">
                    <FiSliders /> {t("nav_dashboard")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
