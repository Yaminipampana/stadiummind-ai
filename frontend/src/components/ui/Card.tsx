import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "pitch" | "gradient";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  hoverEffect = true,
  className = "",
  ...props
}) => {
  const baseStyle =
    "rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm";

  const hoverStyle = hoverEffect
    ? "hover:shadow-lg hover:border-fifa-blue/30 dark:hover:border-fifa-sky/30 hover:-translate-y-0.5"
    : "";

  const variants = {
    default:
      "bg-light-card border-light-border text-light-text dark:bg-fifa-navy dark:border-fifa-border dark:text-dark-text",
    glass:
      "bg-fifa-glassLight backdrop-blur-lg border-white/40 text-light-text dark:bg-fifa-glassDark dark:backdrop-blur-xl dark:border-fifa-border dark:text-dark-text",
    pitch:
      "bg-light-card border-fifa-pitch/30 text-light-text dark:bg-fifa-navy dark:border-fifa-pitch/30 dark:text-dark-text shadow-pitch-glow/10",
    gradient:
      "bg-fifa-glassDark backdrop-blur-lg border-fifa-border text-white bg-gradient-to-br from-fifa-navy to-fifa-darkNavy",
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`px-6 py-5 border-b border-light-border/80 dark:border-fifa-border/80 flex justify-between items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <div className={`px-6 py-5 ${className}`} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`px-6 py-4 border-t border-light-border/80 dark:border-fifa-border/80 bg-slate-50/50 dark:bg-fifa-darkNavy/50 text-xs text-light-muted dark:text-dark-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
