import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg dark:bg-fifa-darkNavy text-light-text dark:text-dark-text transition-colors duration-200">
      
      {/* Top sticky Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Main body: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden pt-20">
        
        {/* Left Side Navigation Drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right Scrollable Content Pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
          
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default ResponsiveLayout;
