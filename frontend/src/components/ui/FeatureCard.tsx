import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Card, CardContent } from "./Card";
import { Badge } from "./Badge";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  badgeText?: string;
  delay?: number;
  variant?: "default" | "glass" | "pitch" | "gradient";
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  path,
  badgeText,
  delay = 0,
  variant = "default",
}) => {
  // Framer Motion entry animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover={{
        scale: 1.03,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="h-full flex"
    >
      <Card
        variant={variant}
        hoverEffect={false} // hover handled by framer motion parent
        className="flex-1 flex flex-col justify-between h-full group"
      >
        <CardContent className="p-8 space-y-6 flex flex-col h-full justify-between">
          <div className="space-y-4">
            {/* Icon + Badge row */}
            <div className="flex justify-between items-start">
              <div className="p-3.5 bg-slate-100 dark:bg-fifa-darkNavy w-fit rounded-xl border border-light-border dark:border-fifa-border group-hover:border-fifa-blue/50 dark:group-hover:border-fifa-sky/50 transition-colors duration-300">
                <span className="text-fifa-blue dark:text-fifa-sky">{icon}</span>
              </div>
              {badgeText && (
                <Badge variant={variant === "pitch" ? "green" : "blue"} size="sm">
                  {badgeText}
                </Badge>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-light-text dark:text-dark-text tracking-tight group-hover:text-fifa-blue dark:group-hover:text-fifa-sky transition-colors duration-200">
                {title}
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Action Link footer */}
          {path && (
            <div className="pt-6 mt-4 border-t border-light-border/40 dark:border-fifa-border/40">
              <Link
                to={path}
                className="text-xs font-black uppercase text-fifa-blue dark:text-fifa-sky hover:underline flex items-center gap-1.5 w-fit"
              >
                <span>Access Console</span>
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
