import React, { useState, useEffect } from 'react';
import { blendingApi, type BlendOptimizeResponse, type BlendSource } from '../api/blending';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { Sliders, RefreshCw, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

const DEFAULT_SOURCES: BlendSource[] = [
  { source_id: 'SRC-GEVRA', mine_name: 'Gevra Mega Project (SECL)', available_quantity: 50000, gcv: 4250, ash: 34.0, moisture: 8.5, volatile_matter: 24.5, cost_per_ton: 2200 },
  { source_id: 'SRC-KUSMUNDA', mine_name: 'Kusmunda OCP (SECL)', available_quantity: 45000, gcv: 3800, ash: 39.5, moisture: 9.2, volatile_matter: 22.0, cost_per_ton: 1850 },
  { source_id: 'SRC-DIPKA', mine_name: 'Dipka Project (SECL)', available_quantity: 35000, gcv: 4600, ash: 29.5, moisture: 7.0, volatile_matter: 26.0, cost_per_ton: 2550 },
  { source_id: 'SRC-JAYANT', mine_name: 'Jayant Deep Seam (NCL)', available_quantity: 25000, gcv: 5300, ash: 21.0, moisture: 6.0, volatile_matter: 28.5, cost_per_ton: 3200 },
  { source_id: 'SRC-SAMAL', mine_name: 'Samaleswari Mine (MCL)', available_quantity: 40000, gcv: 3400, ash: 42.0, moisture: 10.5, volatile_matter: 20.0, cost_per_ton: 1600 }
];

export const Blend: React.FC = () => {
  const { showToast } = useApp();
  const [sources] = useState<BlendSource[]>(DEFAULT_SOURCES);
  const [targetGcv, setTargetGcv] = useState(4500);
  const [quantity, setQuantity] = useState(20000);
  const [maxAsh, setMaxAsh] = useState(32.0);
  const [maxMoisture, setMaxMoisture] = useState(9.0);
  const [objective, setObjective] = useState<'MINIMIZE_COST' | 'MAXIMIZE_QUALITY' | 'MINIMIZE_DEVIATION'>('MINIMIZE_COST');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BlendOptimizeResponse | null>(null);

  const handleRunOptimization = async () => {
    setIsLoading(true);
    try {
      const res = await blendingApi.optimize({
        sources,
        target_quantity: quantity,
        target_gcv: targetGcv,
        max_ash: maxAsh,
        max_moisture: maxMoisture,
        objective
      });
      setResult(res);
      if (res.feasibility) {
        showToast(`Google OR-Tools solved optimal blend in ${res.solver_time_ms}ms`, 'success');
      } else {
        showToast('No feasible blend found matching constraints.', 'warning');
      }
    } catch (err: any) {
      console.error('Blend optimization error:', err);
      showToast('Optimization error: ' + (err.response?.data?.detail || err.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRunOptimization();
  }, []);

  const getRatioColor = (idx: number) => {
    const colors = ['bg-gold-700', 'bg-gold-500', 'bg-amber-600', 'bg-emerald-600', 'bg-blue-600'];
    return colors[idx % colors.length];
  };

  const columns = [
    { 
      header: 'Source Mine', 
      accessor: (row: any) => (
        <div>
          <span className="font-bold text-cortex-dark block">{row.mine_name}</span>
          <span className="text-[10px] text-cortex-gray font-mono">{row.source_id}</span>
        </div>
      )
    },
    { 
      header: 'GCV / Ash', 
      accessor: (row: any) => (
        <span className="font-mono text-xs">
          {row.gcv} kcal / {row.ash}%
        </span>
      )
    },
    { 
      header: 'Ratio (%)', 
      accessor: (row: any) => (
        <span className="font-mono font-bold text-gold-900 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
          {row.ratio_percentage}%
        </span>
      )
    },
    { 
      header: 'Allocated Tonnage', 
      accessor: (row: any) => (
        <span className="font-mono font-bold text-cortex-dark">
          {Math.round(row.allocated_quantity).toLocaleString()} t
        </span>
      )
    },
    { 
      header: 'Unit Rate', 
      accessor: (row: any) => (
        <span className="font-mono text-cortex-gray">
          ₹{row.cost_per_ton.toLocaleString()} / t
        </span>
      )
    },
    { 
      header: 'Cost Contribution', 
      accessor: (row: any) => (
        <span className="font-mono font-bold text-gold-900">
          ₹{Math.round(row.subtotal_cost).toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Mathematical Optimization</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-mono font-bold uppercase">
              Google OR-Tools GLOP
            </span>
          </div>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Multi-Source Coal Blend Optimizer</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRunOptimization}
            isLoading={isLoading}
            className="flex items-center gap-1.5 font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-solve Model</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Slider Panel */}
        <div className="lg:col-span-4 flex flex-col gap-5 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
          <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50">
            <Sliders className="w-5 h-5 text-gold-500" />
            <h3 className="text-xs font-bold text-cortex-dark uppercase tracking-wider">Target Constraints</h3>
          </div>

          {/* Objective Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Optimization Goal</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
              className="w-full px-3 py-2 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark outline-none focus:border-gold-500"
            >
              <option value="MINIMIZE_COST">Minimize Overall Consignment Cost</option>
              <option value="MAXIMIZE_QUALITY">Maximize Thermal Quality (GCV)</option>
              <option value="MINIMIZE_DEVIATION">Minimize Target GCV Variance</option>
            </select>
          </div>

          {/* Slider 1: Target GCV */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Target GCV</span>
              <span className="font-mono font-bold text-gold-800">{targetGcv.toLocaleString()} kcal/kg</span>
            </div>
            <input 
              type="range" 
              min="3500" 
              max="5200" 
              step="50"
              value={targetGcv}
              onChange={(e) => setTargetGcv(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Quantity */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Consignment Tonnage</span>
              <span className="font-mono font-bold text-gold-800">{quantity.toLocaleString()} t</span>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="40000" 
              step="1000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Max Ash limit */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Max Ash Limit</span>
              <span className="font-mono font-bold text-gold-800">{maxAsh.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="20.0" 
              max="42.0" 
              step="0.5"
              value={maxAsh}
              onChange={(e) => setMaxAsh(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Slider 4: Max Moisture limit */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Max Moisture Limit</span>
              <span className="font-mono font-bold text-gold-800">{maxMoisture.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="5.0" 
              max="14.0" 
              step="0.5"
              value={maxMoisture}
              onChange={(e) => setMaxMoisture(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Mine check toggles */}
          <div className="flex flex-col gap-2 pt-2 border-t border-cortex-border/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Available Feedstock Mines ({sources.length})</span>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {sources.map((mine) => (
                <div key={mine.source_id} className="flex items-center justify-between p-2 border border-cortex-border/70 rounded-lg bg-cortex-bg-secondary/40 text-[11px]">
                  <div>
                    <span className="font-bold text-cortex-dark block truncate max-w-[180px]">{mine.mine_name}</span>
                    <span className="text-[9px] text-cortex-gray font-mono">{mine.gcv} kcal | ₹{mine.cost_per_ton}/t</span>
                  </div>
                  <div className="h-4 w-4 bg-gold-50 border border-gold-300 rounded-full flex items-center justify-center text-gold-700">
                    <CheckCircle2 className="w-3 h-3 text-gold-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleRunOptimization}
            isLoading={isLoading}
            className="w-full font-bold flex items-center justify-center gap-1.5 mt-2"
          >
            <Cpu className="w-4 h-4" />
            <span>Execute OR-Tools GLOP</span>
          </Button>
        </div>

        {/* Right Side: Optimal Solver Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Result Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left relative overflow-hidden">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block">Blended Energy (GCV)</span>
              <p className="text-2xl font-extrabold font-mono text-cortex-dark mt-1.5">
                {result?.feasibility ? result.blended_gcv.toLocaleString() : '---'} <span className="text-xs font-sans text-cortex-gray font-normal">kcal/kg</span>
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Target: {targetGcv} kcal/kg</span>
              </div>
            </div>

            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block">Blended Ash / Moisture</span>
              <p className="text-2xl font-extrabold font-mono text-cortex-dark mt-1.5">
                {result?.feasibility ? `${result.blended_ash}%` : '---'}
                <span className="text-xs font-sans text-cortex-gray font-normal ml-1">/ {result?.feasibility ? `${result.blended_moisture}%` : '---'}</span>
              </p>
              <p className="text-[10px] text-cortex-gray mt-2 font-medium">
                Within {maxAsh}% Ash limit
              </p>
            </div>

            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left relative overflow-hidden">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block text-gold-700">Total Blend Valuation</span>
              <p className="text-2xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-800 mt-1.5">
                {result?.feasibility ? `₹${Math.round(result.total_cost).toLocaleString()}` : '---'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gold-700 font-bold mt-2">
                <span>Avg: ₹{result?.feasibility ? Math.round(result.cost_per_ton).toLocaleString() : 0}/tonne</span>
              </div>
            </div>
          </div>

          {/* Infeasibility Alert if no solution found */}
          {result && !result.feasibility && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 text-left">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-800">No Feasible Blend Found</h4>
                <p className="text-xs text-red-700 mt-1">
                  Google OR-Tools solver returned status: <span className="font-mono font-bold">{result.solver_status}</span>. The specified constraints (GCV: {targetGcv} kcal, Max Ash: {maxAsh}%) cannot be satisfied with currently selected feedstock stocks. Relax constraints or include higher-grade sources.
                </p>
              </div>
            </div>
          )}

          {result && result.feasibility && (
            <>
              {/* Optimal Proportions Bar Chart */}
              <Card title="Optimal Blending Proportions" className="shadow-premium text-left">
                <p className="text-xs text-cortex-gray mb-3">
                  Google OR-Tools continuous solver allocation ratio across coal sources:
                </p>

                {/* Legend list */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold mb-4">
                  {result.allocations.filter(a => a.ratio_percentage > 0).map((a, idx) => (
                    <div key={a.source_id} className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded ${getRatioColor(idx)}`}></span>
                      <span className="text-cortex-gray">{a.mine_name} ({a.ratio_percentage}%)</span>
                    </div>
                  ))}
                </div>

                {/* Horizontal Segmented Bar */}
                <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-sm border border-cortex-border">
                  {result.allocations.filter(a => a.ratio_percentage > 0).map((a, idx) => (
                    <div 
                      key={a.source_id} 
                      className={`${getRatioColor(idx)} h-full flex items-center justify-center text-white text-[10px] font-bold font-mono transition-all`}
                      style={{ width: `${a.ratio_percentage}%` }}
                      title={`${a.mine_name}: ${a.ratio_percentage}%`}
                    >
                      {a.ratio_percentage >= 8 ? `${a.ratio_percentage}%` : ''}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Source Allocations Table */}
              <Card 
                title="Optimization Breakdown by Mine" 
                className="shadow-premium text-left"
                headerAction={
                  <div className="flex items-center gap-2 text-[10px] font-mono text-cortex-gray">
                    <span>Solve Time: {result.solver_time_ms}ms</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Status: {result.solver_status}</span>
                  </div>
                }
              >
                <Table 
                  columns={columns}
                  data={result.allocations}
                />
              </Card>

              {/* Recommendation Narrative */}
              <div className="p-4 bg-gold-50/50 border border-gold-200/80 rounded-xl text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 block mb-1">
                  Optimization Synthesis
                </span>
                <p className="text-xs text-gold-950 font-medium leading-relaxed">
                  {result.recommendation_summary}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Blend;
