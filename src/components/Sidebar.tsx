import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  LineChart, 
  BrainCircuit, 
  ShieldAlert, 
  Truck, 
  Settings, 
  HelpCircle, 
  Map, 
  History, 
  FileSpreadsheet,
  Database
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Laboratory Input', path: '/laboratory', icon: Database },
    { name: 'Mine Analytics', path: '/analytics', icon: LineChart },
    { name: 'AI Insights', path: '/prediction', icon: BrainCircuit },
    { name: 'India Mine Map', path: '/map', icon: Map },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'Executive Report', path: '/report', icon: FileSpreadsheet }
  ];

  const secondaryItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Support', path: '#', icon: HelpCircle }
  ];

  const getLinkClass = (isActive: boolean) => {
    return `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
      isActive 
        ? 'bg-gold-50/50 border-l-4 border-gold-500 text-gold-900 font-bold' 
        : 'text-cortex-gray hover:text-cortex-dark hover:bg-cortex-bg-secondary border-l-4 border-transparent'
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-cortex-border h-screen flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-cortex-border">
          <NavLink to="/dashboard" className="flex flex-col">
            <span className="text-xl font-bold text-gold-900 tracking-tight leading-none">
              CarbonCortex
            </span>
            <span className="text-[10px] text-cortex-light-gray uppercase tracking-widest font-semibold mt-1">
              Institutional Alpha
            </span>
            <span className="text-[8px] text-cortex-light-gray/60 font-mono mt-0.5">
              System v4.2.0
            </span>
          </NavLink>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <item.icon className="w-5 h-5 opacity-80" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          
          {/* Static design links from slides */}
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-cortex-light-gray cursor-not-allowed border-l-4 border-transparent">
            <ShieldAlert className="w-5 h-5 opacity-50" />
            <span>Operational Safety</span>
          </div>
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-cortex-light-gray cursor-not-allowed border-l-4 border-transparent">
            <Truck className="w-5 h-5 opacity-50" />
            <span>Fleet Control</span>
          </div>
        </nav>
      </div>

      {/* Footer Navigation */}
      <div>
        {/* Real-time telemetry card from Slide 2 */}
        <div className="mx-4 mb-4 p-4 bg-gold-50/40 border border-gold-100 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-gold-600 animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold text-gold-800 tracking-wider">
              AI Cortex Active
            </span>
          </div>
          <p className="text-[10px] text-gold-700 leading-normal">
            Processing real-time telemetry from 214 edge sensor nodes.
          </p>
        </div>

        <nav className="p-4 border-t border-cortex-border flex flex-col gap-1">
          {secondaryItems.map((item) => (
            item.path.startsWith('#') ? (
              <div 
                key={item.name} 
                className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-cortex-gray hover:text-cortex-dark hover:bg-cortex-bg-secondary cursor-pointer border-l-4 border-transparent"
                onClick={() => alert('Support module initiated. CarbonCortex support agent has been notified.')}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                <span>{item.name}</span>
              </div>
            ) : (
              <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => getLinkClass(isActive)}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                <span>{item.name}</span>
              </NavLink>
            )
          ))}
        </nav>
      </div>
    </aside>
  );
};
export default Sidebar;
