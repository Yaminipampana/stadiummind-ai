import React from "react";
import { FiAlertOctagon, FiRotateCcw } from "react-icons/fi";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Telemetry Signal Lost",
  message = "We encountered a socket disruption or connection issue. Rest assured, stadium operations crews are investigating.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-red-500/20 bg-red-500/5 dark:border-red-500/30 rounded-2xl max-w-md mx-auto ${className}`}
    >
      <div className="p-3 bg-red-600/10 text-red-600 dark:text-red-400 rounded-xl mb-4">
        <FiAlertOctagon size={32} />
      </div>
      <h3 className="font-extrabold text-lg text-light-text dark:text-dark-text mb-2">{title}</h3>
      <p className="text-sm text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" className="gap-2" onClick={onRetry}>
          <FiRotateCcw size={14} /> Reconnect Signal
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
