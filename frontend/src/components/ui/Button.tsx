import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "pitch" | "glass" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-fifa-darkNavy disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-fifa-blue-gradient hover:shadow-fifa-glow text-white focus:ring-fifa-blue",
    secondary: "bg-light-card text-light-text border border-light-border dark:bg-dark-card dark:text-dark-text dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-900/40",
    pitch: "bg-fifa-green-gradient hover:shadow-pitch-glow text-white focus:ring-fifa-pitch",
    glass:
      "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 dark:bg-fifa-glassDark dark:hover:bg-fifa-glassDark/80 dark:border-fifa-border",
    outline:
      "border-2 border-fifa-blue text-fifa-blue bg-transparent hover:bg-fifa-blue hover:text-white dark:border-fifa-sky dark:text-fifa-sky dark:hover:bg-fifa-sky dark:hover:text-fifa-darkNavy",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "text-fifa-blue hover:bg-fifa-blue/10 bg-transparent dark:text-fifa-sky dark:hover:bg-fifa-sky/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
