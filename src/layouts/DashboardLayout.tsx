import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-cortex-bg-secondary">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {isMapPage ? (
          // Single-section full-viewport GIS Mine Map matching Image 2 exactly (Zero vertical scroll)
          <main className="flex-1 min-h-0 w-full h-full overflow-hidden flex flex-col p-2 sm:p-3 bg-stone-100">
            <Outlet />
          </main>
        ) : (
          /* Scrollable Page Viewport for Standard Dashboard/Content Pages */
          <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
            <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1680px] mx-auto flex-1 flex flex-col min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col min-w-0 w-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Institutional Footer as shown in slides */}
            <footer className="border-t border-cortex-border bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-cortex-gray/80 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
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
        )}
      </div>
    </div>
  );
};
export default DashboardLayout;
