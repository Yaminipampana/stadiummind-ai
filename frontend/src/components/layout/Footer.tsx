import React from "react";
import { Link } from "react-router-dom";
import {
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCpu,
  FiActivity,
  FiHeart,
  FiCheckSquare,
} from "react-icons/fi";

export const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <FiTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FiLinkedin />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FiGithub />, url: "https://github.com", label: "GitHub" },
  ];

  const quickLinks = [
    { label: "Home Base", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "AI Assistant", path: "/ai-assistant" },
    { label: "Stadium Map", path: "/map" },
  ];

  const operationalLinks = [
    { label: "Accessibility Assist", path: "/accessibility" },
    { label: "Sustainability Console", path: "/sustainability" },
    { label: "Emergency SOS", path: "/emergency" },
    { label: "Volunteer Portal", path: "/volunteer" },
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-200 border-t border-fifa-border pt-16 pb-8 transition-colors duration-200">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Column 1: Brand & Socials */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-fifa-blue-gradient text-white shadow-fifa-glow">
              <FiCpu size={18} />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-fifa-blue to-fifa-pitch bg-clip-text text-transparent">
              STADIUMMIND AI
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time stadium operations cockpit integrating AI chat guidance, crowd density tracking, queue predictions, and sustainability benchmarks.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-fifa-navy hover:bg-fifa-blue hover:text-white border border-fifa-border hover:border-fifa-blue transition-all duration-300 text-slate-400"
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-black tracking-widest text-fifa-sky">Quick Routes</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.path} className="hover:text-fifa-sky transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Operations Modules */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-black tracking-widest text-fifa-pitch">Operations</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
            {operationalLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.path} className="hover:text-fifa-pitch transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact & Operations */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-black tracking-widest text-slate-200">Support Desk</h4>
          <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
            <li className="flex items-center gap-2.5">
              <FiMail className="text-fifa-blue flex-shrink-0" />
              <a href="mailto:ops@stadiummind.ai" className="hover:text-white transition-colors">
                ops@stadiummind.ai
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FiPhone className="text-fifa-pitch flex-shrink-0" />
              <span>+1 (555) 2026-FIFA</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiMapPin className="text-red-400 flex-shrink-0" />
              <span>Sector 4 East, Stadium Center</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Under-Footer: Status & Copyright */}
      <div className="container mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase font-black tracking-wider text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-slate-400">StadiumMind AI</span>
          <span>&bull; World Cup Operations Command</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1">
            <FiCheckSquare className="text-fifa-pitch" />
            <span>Accessibility Assured</span>
          </div>
          <div className="flex items-center gap-1">
            <FiActivity className="text-fifa-sky" />
            <span>Green Energy Diverted</span>
          </div>
          <div className="flex items-center gap-1">
            <FiHeart className="text-red-500" />
            <span>Medical Rescue Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
