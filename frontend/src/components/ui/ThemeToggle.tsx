import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../../store/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-16 h-8 p-1 bg-slate-200 dark:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-full cursor-pointer focus:outline-none transition-colors duration-300"
      aria-label="Toggle Theme"
    >
      <FiSun className="w-4 h-4 text-amber-500 ml-1 z-10" />
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-fifa-blue shadow-sm border border-light-border/40 dark:border-none"
        animate={{
          x: theme === "dark" ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <FiMoon className="w-4 h-4 text-fifa-sky mr-1 z-10" />
    </button>
  );
};

export default ThemeToggle;
