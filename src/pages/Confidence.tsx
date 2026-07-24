import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { ConfidenceMetric, ConfidenceLog } from '../types';
import Card from '../components/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowLeft, ShieldCheck, Database, Cpu, Activity, Download, Filter } from 'lucide-react';

export const Confidence: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction } = useApp();
  const [metrics, setMetrics] = useState<ConfidenceMetric | null>(null);
  const [logs, setLogs] = useState<ConfidenceLog[]>([]);

  useEffect(() => {
    const fetchConfidenceData = async () => {
      try {
        const m = await apiService.getConfidenceMetrics();
        const l = await apiService.getConfidenceLogs();
        setMetrics(m);
        setLogs(l);
      } catch (err) {
        console.error('Error fetching confidence details:', err);
      }
    };
    fetchConfidenceData();
  }, []);

  const getStatusBadge = (stability: string) => {
    switch (stability) {
      case 'WARNING':
        return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-200">Warning</span>;
      case 'STABLE':
        return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-200">Stable</span>;
      default:
        return <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-200">Optimal</span>;
    }
  };

  const currentConfidence = lastPrediction ? lastPrediction.confidence : 98.2;

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/prediction')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900 mb-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Prediction Outcome
          </button>
          <h1 className="text-2xl font-bold text-cortex-dark">Confidence Engine Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Gauge and stability timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gauge card */}
            <Card title="CarbonCortex Confidence Engine" className="shadow-premium flex flex-col items-center justify-center text-center">
              <p className="text-xs text-cortex-gray mb-6 leading-relaxed">
                Reliable Prediction — Verified against 14k historical samples from deep-core telemetry and surface operations.
              </p>

              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" stroke="#E5E7EB" strokeWidth="8" fill="transparent"></circle>
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="62" 
                    stroke="#C9A227" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray="389.5" 
                    strokeDashoffset={389.5 - (389.5 * (currentConfidence / 100))}
                    strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-cortex-dark leading-none">{currentConfidence}%</span>
                  <span className="text-[9px] text-gold-700 uppercase font-bold tracking-widest mt-1">Confidence</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200">
                <ShieldCheck className="w-4 h-4 fill-current" />
                <span>Risk Score: Low</span>
              </div>
            </Card>

            {/* Stability Timeline Card */}
            <Card 
              title="Stability Timeline" 
              headerAction={
                <span className="bg-gold-50 text-gold-800 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono">LIVE</span>
              }
              className="shadow-premium"
            >
              <p className="text-xs text-cortex-gray mb-4">
                Real-time output stability metrics for recent analysis iterations.
              </p>
              
              <div className="h-44 w-full">
                {metrics && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.stabilityTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C9A227" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                      <YAxis domain={[95, 100]} tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#C9A227" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorStability)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-cortex-border/50 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">Standard Dev</span>
                  <p className="font-bold text-cortex-dark font-mono mt-0.5">0.024</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">Drift Detection</span>
                  <p className="font-bold text-green-600 mt-0.5">None</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Core metrics badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-l-4 border-gold-500 border-y border-r border-cortex-border p-5 rounded-r-xl shadow-premium text-left">
              <Database className="w-5 h-5 text-gold-500 mb-2" />
              <h4 className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest">Data Veracity</h4>
              <p className="text-lg font-bold font-mono text-cortex-dark mt-1">99.8%</p>
              <p className="text-[10px] text-cortex-gray mt-1 leading-normal">Clean signal across 1.4M events per hour.</p>
            </div>
            
            <div className="bg-white border border-cortex-border p-5 rounded-xl shadow-premium text-left">
              <Cpu className="w-5 h-5 text-gold-500 mb-2" />
              <h4 className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest">Neural Nodes</h4>
              <p className="text-lg font-bold font-mono text-cortex-dark mt-1">1,024</p>
              <p className="text-[10px] text-cortex-gray mt-1 leading-normal">Active transformer layers in Cortex-Alpha.</p>
            </div>

            <div className="bg-white border border-cortex-border p-5 rounded-xl shadow-premium text-left">
              <Activity className="w-5 h-5 text-gold-500 mb-2" />
              <h4 className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest">Predictive Stability</h4>
              <p className="text-lg font-bold text-cortex-dark mt-1">Operational Alpha 2.0</p>
              <span className="inline-block bg-gold-50 border border-gold-200/50 text-gold-800 text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 uppercase font-mono">
                Historical Match
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Audit Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card 
            title="Audit Logs" 
            headerAction={
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert('Exporting CSV log...')}
                  className="p-1 rounded text-cortex-gray hover:text-cortex-dark hover:bg-cortex-bg-secondary transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded text-cortex-gray hover:text-cortex-dark hover:bg-cortex-bg-secondary transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            }
            className="shadow-premium h-full flex flex-col"
          >
            <p className="text-xs text-cortex-gray mb-4">
              Historical ledger of inference decisions and compliance validations.
            </p>
            
            <div className="flex-1 overflow-y-auto max-h-[420px] flex flex-col gap-3.5">
              {logs.map((log, idx) => (
                <div key={idx} className="p-3 border border-cortex-border/70 rounded-xl bg-cortex-bg-secondary/40 text-xs flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-cortex-dark">{log.action}</span>
                    <span className="text-[10px] text-cortex-gray font-mono">{log.timestamp}</span>
                    <span className="text-[9px] text-cortex-gray/70">{log.modelVersion}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-mono font-bold text-gold-850">{log.confidence}%</span>
                    {getStatusBadge(log.stability)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Confidence;
