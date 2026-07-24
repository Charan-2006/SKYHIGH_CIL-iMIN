import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Sliders } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { systemStatus, lastPrediction } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const getSystemStatusLabel = () => {
    switch (systemStatus) {
      case 'ACTIVE':
        return 'AI Cortex Active - Optimizing Decision Logic';
      case 'MAINTENANCE':
        return 'AI Cortex - System Maintenance Mode';
      default:
        return 'AI Cortex Idle - Awaiting Lab telemetry';
    }
  };

  const getActiveTabClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
      isActive 
        ? 'text-gold-500 border-b-2 border-gold-500 font-bold' 
        : 'text-cortex-gray hover:text-cortex-dark'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-cortex-border flex items-center justify-between px-6 shadow-sm">
      {/* Search and Tabs Area */}
      <div className="flex items-center gap-8 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cortex-light-gray" />
          <input 
            type="text"
            placeholder="Search operational metadata..."
            className="w-full pl-9 pr-4 py-1.5 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/10"
          />
        </div>

        {/* Global/Unit Tabs as shown in slide */}
        <div className="hidden lg:flex items-center gap-5">
          <Link to="/dashboard" className={getActiveTabClass('/dashboard')}>Global View</Link>
          <Link to="/laboratory" className={getActiveTabClass('/laboratory')}>Unit Alpha</Link>
          <Link to="/blend" className={getActiveTabClass('/blend')}>Blend Optimizer</Link>
        </div>
      </div>

      {/* Status Indicators & Notifications */}
      <div className="flex items-center gap-5">
        {/* Dynamic status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gold-50 border border-gold-100 rounded-full text-xs text-gold-800 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600"></span>
          </span>
          <span>{getSystemStatusLabel()}</span>
        </div>

        {/* System Status button from slide */}
        <div className="hidden sm:block">
          <span className="inline-flex items-center gap-1.5 bg-gold-800 hover:bg-gold-900 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm">
            <Sliders className="w-3.5 h-3.5" />
            System Status
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-lg text-cortex-gray hover:text-cortex-dark hover:bg-cortex-bg-secondary transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-cortex-border rounded-xl shadow-premium-xl py-2 text-xs">
              <div className="px-4 py-2 font-bold border-b border-cortex-border text-cortex-dark flex justify-between items-center">
                <span>Recent AI Notifications</span>
                <span className="text-[10px] text-gold-500 bg-gold-50 px-1.5 py-0.5 rounded">Real-time</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {lastPrediction ? (
                  <div className="px-4 py-3 hover:bg-cortex-bg-secondary border-b border-cortex-border/50">
                    <p className="font-semibold text-cortex-dark">GCV Model Prediction Finished</p>
                    <p className="text-cortex-gray mt-0.5">Sample ID: <span className="font-mono">{lastPrediction.sampleId}</span></p>
                    <p className="text-gold-700 font-bold mt-1">Result: {lastPrediction.predictedGcv} kcal/kg ({lastPrediction.coalGrade})</p>
                  </div>
                ) : null}
                <div className="px-4 py-3 hover:bg-cortex-bg-secondary">
                  <p className="font-semibold text-cortex-dark">Telemetry Connection Stable</p>
                  <p className="text-cortex-gray mt-0.5">Connected to 214 edge sensor arrays across Coal India.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 border-l border-cortex-border pl-4">
          <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-800 text-xs font-bold border border-gold-200">
            C
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-cortex-dark leading-tight">Admin User</p>
            <p className="text-[10px] text-cortex-gray leading-none">Institutional Lead</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-cortex-gray hidden xl:block" />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
