import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "green" | "gold" | "red" | "glass" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "blue",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-extrabold rounded-full uppercase tracking-wider text-[10px]";

  const variants = {
    blue: "bg-fifa-blue/15 text-fifa-blue border border-fifa-blue/20 dark:bg-fifa-blue/20 dark:text-fifa-sky dark:border-fifa-blue/30",
    green: "bg-fifa-pitch/15 text-fifa-green border border-fifa-pitch/20 dark:bg-fifa-pitch/20 dark:text-fifa-pitch dark:border-fifa-pitch/30",
    gold: "bg-amber-500/15 text-amber-600 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    red: "bg-red-500/15 text-red-600 border border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    glass:
      "bg-white/10 backdrop-blur-md border border-white/20 text-white dark:bg-fifa-glassDark dark:border-fifa-border dark:text-dark-text",
    outline:
      "border border-light-border dark:border-fifa-border text-light-muted dark:text-dark-muted",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-3 py-1 text-[10px]",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
