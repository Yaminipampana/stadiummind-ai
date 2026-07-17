import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: "default" | "glass";
}

export const Table: React.FC<TableProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const containerClass =
    variant === "glass"
      ? "bg-fifa-glassLight backdrop-blur-md border-white/30 dark:bg-fifa-glassDark dark:border-fifa-border"
      : "bg-light-card border-light-border dark:bg-fifa-navy dark:border-fifa-border";

  return (
    <div className={`w-full overflow-x-auto rounded-2xl border ${containerClass}`}>
      <table className={`w-full text-left border-collapse text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead
      className={`bg-slate-50/80 border-b border-light-border dark:bg-fifa-darkNavy/50 dark:border-fifa-border ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <tbody className={`divide-y divide-light-border/60 dark:divide-fifa-border/40 ${className}`} {...props}>{children}</tbody>;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tr
      className={`hover:bg-slate-50/50 dark:hover:bg-fifa-darkNavy/30 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <th
      className={`px-6 py-4 font-bold text-xs uppercase tracking-wider text-light-muted dark:text-dark-muted ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <td className={`px-6 py-4 align-middle text-light-text dark:text-dark-text ${className}`} {...props}>{children}</td>;
};
export default Table;
