import React, { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { systemStatus, lastPrediction, currentUser, logout } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getSystemStatusLabel = () => {
    switch (systemStatus) {
      case 'ACTIVE':
        return 'ATDIF Active - Continuous Inference';
      case 'MAINTENANCE':
        return 'AI Cortex - Maintenance Mode';
      default:
        return 'AI Cortex Idle';
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

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ENGINEER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LAB_TECHNICIAN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-cortex-border flex items-center justify-between px-6 shadow-sm">
      {/* Search and Tabs Area */}
      <div className="flex items-center gap-8 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cortex-light-gray" />
          <input 
            type="text"
            placeholder="Search mines, seams, samples..."
            className="w-full pl-9 pr-4 py-1.5 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/10"
          />
        </div>

        {/* Global/Unit Tabs */}
        <div className="hidden lg:flex items-center gap-5">
          <Link to="/dashboard" className={getActiveTabClass('/dashboard')}>Overview</Link>
          <Link to="/prediction" className={getActiveTabClass('/prediction')}>Quality AI</Link>
          <Link to="/laboratory" className={getActiveTabClass('/laboratory')}>Verification</Link>
          <Link to="/blend" className={getActiveTabClass('/blend')}>Blend</Link>
          <Link to="/scenarios" className={getActiveTabClass('/scenarios')}>Simulation</Link>
        </div>
      </div>

      {/* Status Indicators & Notifications */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-md text-[10px] font-semibold text-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Demo Environment — Synthetic Dataset</span>
        </div>

        {/* Dynamic status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gold-50 border border-gold-100 rounded-full text-xs text-gold-800 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600"></span>
          </span>
          <span>{getSystemStatusLabel()}</span>
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
                <span className="text-[10px] text-gold-500 bg-gold-50 px-1.5 py-0.5 rounded">Live Telemetry</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {lastPrediction ? (
                  <div className="px-4 py-3 hover:bg-cortex-bg-secondary border-b border-cortex-border/50">
                    <p className="font-semibold text-cortex-dark">Prediction Model Inference Complete</p>
                    <p className="text-cortex-gray mt-0.5">Sample ID: <span className="font-mono">{lastPrediction.sample_code || (lastPrediction as any).sampleId}</span></p>
                    <p className="text-gold-700 font-bold mt-1">
                      Result: {Math.round(lastPrediction.predictions?.gcv ?? (lastPrediction as any).predictedGcv ?? 5200)} kcal/kg ({lastPrediction.grade ?? (lastPrediction as any).coalGrade ?? 'G4'})
                    </p>
                  </div>
                ) : null}
                <div className="px-4 py-3 hover:bg-cortex-bg-secondary">
                  <p className="font-semibold text-cortex-dark">ATDIF Decision Layer Operational</p>
                  <p className="text-cortex-gray mt-0.5">Automated confidence gating active across CIL subsidiary mines.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / User dropdown */}
        <div className="relative">
          {currentUser ? (
            <div 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 border-l border-cortex-border pl-3 cursor-pointer hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-800 text-xs font-bold border border-gold-200">
                {currentUser.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-cortex-dark leading-tight">{currentUser.full_name}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-cortex-gray hidden xl:block" />
            </div>
          ) : (
            <Link 
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-700 hover:bg-gold-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {showUserMenu && currentUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-cortex-border rounded-xl shadow-premium-xl py-1 text-xs z-50">
              <div className="px-4 py-2 border-b border-cortex-border">
                <p className="font-bold text-cortex-dark truncate">{currentUser.full_name}</p>
                <p className="text-[10px] text-cortex-gray truncate">{currentUser.email}</p>
              </div>
              <button 
                onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                className="w-full text-left px-4 py-2 hover:bg-gold-50/50 flex items-center gap-2 text-cortex-dark font-medium"
              >
                <UserIcon className="w-4 h-4 text-gold-600" />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium border-t border-cortex-border/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
