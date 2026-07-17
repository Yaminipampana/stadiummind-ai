import React from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "list" | "chart" | "circle";
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card",
  count = 1,
  className = "",
}) => {
  const shimmerClass =
    "animate-pulse bg-slate-200 dark:bg-fifa-border rounded-xl";

  const renderSkeleton = () => {
    switch (variant) {
      case "chart":
        return (
          <div className={`p-5 space-y-4 border border-light-border dark:border-fifa-border rounded-2xl ${className}`}>
            <div className="flex justify-between items-center">
              <div className={`h-4 w-1/3 ${shimmerClass}`} />
              <div className={`h-6 w-8 ${shimmerClass}`} />
            </div>
            <div className="flex items-end gap-3 h-[180px] pt-4">
              <div className={`w-full h-1/2 ${shimmerClass}`} />
              <div className={`w-full h-3/4 ${shimmerClass}`} />
              <div className={`w-full h-2/3 ${shimmerClass}`} />
              <div className={`w-full h-full ${shimmerClass}`} />
              <div className={`w-full h-1/3 ${shimmerClass}`} />
            </div>
          </div>
        );

      case "table":
        return (
          <div className={`w-full overflow-hidden border border-light-border dark:border-fifa-border rounded-2xl ${className}`}>
            <div className="p-4 bg-slate-50 dark:bg-fifa-darkNavy/50 border-b border-light-border dark:border-fifa-border">
              <div className={`h-4 w-1/4 ${shimmerClass}`} />
            </div>
            <div className="divide-y divide-light-border/60 dark:divide-fifa-border/40 p-4 space-y-4">
              {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2">
                  <div className={`h-3 w-1/3 ${shimmerClass}`} />
                  <div className={`h-3 w-1/6 ${shimmerClass}`} />
                  <div className={`h-3 w-1/12 ${shimmerClass}`} />
                </div>
              ))}
            </div>
          </div>
        );

      case "list":
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 border border-light-border/80 dark:border-fifa-border rounded-xl"
              >
                <div className={`w-10 h-10 rounded-lg ${shimmerClass} flex-shrink-0`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3.5 w-1/2 ${shimmerClass}`} />
                  <div className={`h-2.5 w-3/4 ${shimmerClass}`} />
                </div>
              </div>
            ))}
          </div>
        );

      case "circle":
        return <div className={`w-12 h-12 rounded-full ${shimmerClass} ${className}`} />;

      case "card":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, idx) => (
              <div
                key={idx}
                className={`p-6 border border-light-border dark:border-fifa-border rounded-2xl bg-light-card dark:bg-fifa-navy space-y-4 ${className}`}
              >
                <div className={`h-10 w-10 ${shimmerClass}`} />
                <div className="space-y-2">
                  <div className={`h-4 w-2/3 ${shimmerClass}`} />
                  <div className={`h-3 w-full ${shimmerClass}`} />
                  <div className={`h-3 w-5/6 ${shimmerClass}`} />
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingSkeleton;
