import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";
import { Button } from "../components/ui/Button";

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 text-light-text dark:text-dark-text">
      <div className="p-4 bg-fifa-blue/10 text-fifa-blue rounded-full mb-6">
        <FiAlertCircle size={48} className="animate-bounce" />
      </div>
      <h1 className="text-4xl font-black mb-3">404 - Seat Map Out of Bounds</h1>
      <p className="text-light-muted dark:text-dark-muted max-w-md mb-8">
        The corridor or gate route you attempted to visit does not exist. Check your stadium tickets or return to the main dashboard.
      </p>
      <Link to="/">
        <Button variant="primary" className="gap-2">
          <FiHome /> Back to Main Stadium
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
