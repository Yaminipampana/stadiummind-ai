import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = id || "input_" + Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={generatedId}
            className="text-xs font-extrabold uppercase tracking-wide mb-1.5 text-light-text dark:text-dark-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={generatedId}
          className={`w-full rounded-xl px-4 py-3 bg-white border text-sm text-light-text transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-fifa-navy dark:text-dark-text ${
            error
              ? "border-red-500 focus:ring-red-500/25 focus:border-red-500"
              : "border-light-border focus:ring-fifa-blue/25 focus:border-fifa-blue dark:border-fifa-border dark:focus:ring-fifa-sky/25 dark:focus:border-fifa-sky"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-red-500 mt-1 font-bold">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
