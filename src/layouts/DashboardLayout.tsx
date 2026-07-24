import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cortex-bg-secondary">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-8 py-6 max-w-7xl w-full mx-auto flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Institutional Footer as shown in slides */}
          <footer className="border-t border-cortex-border bg-white py-4 px-8 text-xs text-cortex-gray/80 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              © 2026 CarbonCortex. Industrial Intelligence Division.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-cortex-dark transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-cortex-dark transition-colors">Security</a>
              <a href="#" className="hover:text-cortex-dark transition-colors">Compliance</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
