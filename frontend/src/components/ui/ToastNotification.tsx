import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertOctagon, FiX } from "react-icons/fi";
import { useAlert } from "../../store/AlertContext";

export const ToastNotification: React.FC = () => {
  const { alerts, acknowledgeAlert } = useAlert();
  const [activeToastId, setActiveToastId] = useState<string | null>(null);

  // Find the latest critical/error alert that is not acknowledged
  const latestUrgent = alerts.find(
    (a) => (a.severity === "critical" || a.severity === "error") && !a.acknowledged
  );

  useEffect(() => {
    if (latestUrgent) {
      setActiveToastId(latestUrgent.id);

      // Auto-hide toast after 6 seconds
      const timer = setTimeout(() => {
        setActiveToastId(null);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setActiveToastId(null);
    }
  }, [latestUrgent]);

  if (!latestUrgent || activeToastId !== latestUrgent.id) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] max-w-sm w-full pointer-events-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-4 rounded-xl shadow-2xl border flex gap-3 items-start bg-red-500 text-white border-red-600"
        >
          <div className="mt-0.5">
            <FiAlertOctagon size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
              CRITICAL INCIDENT ALERT
            </span>
            <h4 className="text-xs font-black truncate mt-0.5">{latestUrgent.title}</h4>
            <p className="text-[11px] mt-1 leading-relaxed opacity-90">{latestUrgent.message}</p>
          </div>
          <button
            onClick={() => acknowledgeAlert(latestUrgent.id)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="Dismiss Alert"
          >
            <FiX size={16} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
