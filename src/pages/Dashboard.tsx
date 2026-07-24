import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Activity, 
  Database, 
  Cpu, 
  Map, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  Sliders, 
  Layers 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { history } = useApp();

  // Grab the 5 latest history entries
  const recentHistory = history.slice(0, 5);

  // Subsidiary metrics for chart
  const comparisonData = [
    { name: 'Moonidih (BCCL)', gcv: 6410, ash: 13.2 },
    { name: 'Sonalpur (ECL)', gcv: 6120, ash: 15.1 },
    { name: 'Jayant (NCL)', gcv: 5380, ash: 22.8 },
    { name: 'Gevra (SECL)', gcv: 4920, ash: 28.5 },
    { name: 'Lakhanpur (MCL)', gcv: 4720, ash: 31.4 }
  ];

  return (
    <div className="text-left select-none flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Executive Command</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Decision Intelligence Hub</h2>
        </div>
        <div className="px-3 py-1.5 bg-white border border-cortex-border rounded-lg text-xs flex items-center gap-2 font-mono shadow-sm">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Telemetry Status: SECURE SYSTEM CONNECTED</span>
        </div>
      </div>

      {/* Hero Stats (Luxury Spacing, Large Typography, No fake templates) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Prediction Stability', value: '98.4%', sub: 'Optimized by Cortex v4.2', icon: Activity },
          { label: 'Active Edge Sensors', value: '214 Nodes', sub: 'CIL subsidiaries connected', icon: Database },
          { label: 'System Model State', value: 'ACTIVE', sub: 'XGBoost & SHAP engines online', icon: Cpu },
          { label: 'Operational Drift', value: '0.02%', sub: 'Within safety thresholds', icon: TrendingUp }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium hover:border-gold-500/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-cortex-gray uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-gold-500" />
            </div>
            <div className="text-3xl font-extrabold text-cortex-dark font-mono tracking-tight">{stat.value}</div>
            <div className="text-[10px] text-cortex-light-gray font-semibold mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recent Prediction Logs and Chart */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Recharts GCV Comparison */}
          <Card title="Mine Quality Diagnostics" className="shadow-premium">
            <p className="text-xs text-cortex-gray mb-6">
              Empirical GCV (kcal/kg) performance metrics categorized by primary Coal India subsidiary regions.
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} domain={[3000, 7000]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(201, 162, 39, 0.03)' }}
                  />
                  <Bar dataKey="gcv" fill="#C9A227" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Predictions Table */}
          <Card title="Recent Predictive Outcomes" className="shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Sample ID</th>
                    <th className="pb-3 font-semibold">Mine / Subsidiary</th>
                    <th className="pb-3 font-semibold">GCV (kcal/kg)</th>
                    <th className="pb-3 font-semibold">Grade</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/50">
                  {recentHistory.map((row, i) => (
                    <tr key={i} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-cortex-dark">{row.sampleId}</td>
                      <td className="py-3">
                        <div className="font-semibold text-cortex-dark">{row.mineName}</div>
                        <div className="text-[10px] text-cortex-gray">{row.coalfield}, {row.state}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-gold-800">{row.gcv}</td>
                      <td className="py-3 font-mono font-bold">{row.grade}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          row.status === 'OPTIMAL' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : row.status === 'LIMIT' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Quick Launcher Nodes */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Operational Workflow" className="shadow-premium">
            <p className="text-xs text-cortex-gray mb-6">
              Launch modular intelligence components to execute coal prediction, blending optimization, and geospatial telemetry.
            </p>
            
            <div className="flex flex-col gap-4">
              {[
                { label: 'Laboratory Input', path: '/laboratory', desc: 'Feed analytical proximate values', icon: Database },
                { label: 'Interactive Mine Map', path: '/map', desc: 'Visualize national coal fields', icon: Map },
                { label: 'Blend Optimization', path: '/blend', desc: 'Solve mixing ratios & cost budgets', icon: Sliders },
                { label: 'Analytics Dashboard', path: '/analytics', desc: 'Historical deviation reports', icon: Layers },
                { label: 'Executive Reports', path: '/report', desc: 'Compile print-ready summaries', icon: FileText }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between p-3.5 border border-cortex-border rounded-xl cursor-pointer hover:border-gold-500/40 hover:bg-gold-50/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-cortex-dark uppercase tracking-wider">{item.label}</h4>
                      <p className="text-[10px] text-cortex-gray mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cortex-light-gray group-hover:text-gold-500 transition-colors" />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Help Callout */}
          <div className="bg-gold-50/40 border border-gold-100 rounded-2xl p-5 shadow-premium text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-2">
              Decision Intelligence Engine
            </h4>
            <p className="text-xs text-gold-900 leading-relaxed font-semibold">
              Ready for real-time model inference. Input physical properties to compute accurate GCV forecasts using game-theoretic SHAP local explainability.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate('/laboratory')} size="sm" className="font-bold w-full justify-center">
                Initialize Inference Model
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
