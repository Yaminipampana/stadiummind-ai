import React from "react";
import { FiRefreshCw, FiMoreHorizontal } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "./Card";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  isLoading?: boolean;
  legend?: { label: string; colorClass: string }[];
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  onRefresh,
  isLoading = false,
  legend,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <h3 className="font-extrabold text-base tracking-tight text-light-text dark:text-dark-text">{title}</h3>
          {subtitle && (
            <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-fifa-darkNavy transition-colors disabled:opacity-40"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-fifa-blue" : ""}`} />
            </button>
          )}
          <button className="p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-fifa-darkNavy transition-colors">
            <FiMoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="relative min-h-[220px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-fifa-navy/40 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full border-4 border-fifa-blue border-t-transparent animate-spin" />
              <span className="text-[10px] uppercase font-black text-fifa-blue dark:text-fifa-sky tracking-widest">
                Recalculating Match Stats
              </span>
            </div>
          </div>
        )}

        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex-1 w-full">{children}</div>
          
          {legend && legend.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-light-border/60 dark:border-fifa-border/40">
              {legend.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`} />
                  <span className="text-light-muted dark:text-dark-muted">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
