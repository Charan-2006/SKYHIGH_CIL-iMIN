import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { BlendRecommendation } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { Sliders, RefreshCw, Train, Check } from 'lucide-react';

export const Blend: React.FC = () => {
  const [targetGcv, setTargetGcv] = useState(4850);
  const [quantity, setQuantity] = useState(12500);
  const [budget, setBudget] = useState(850000);
  const [isLoading, setIsLoading] = useState(false);
  
  const [result, setResult] = useState<BlendRecommendation | null>({
    components: [
      { mineName: 'Mine A (Superior)', ratio: 45, gcv: 5800, costPerTon: 82.00 },
      { mineName: 'Mine B (Mid-Tier)', ratio: 35, gcv: 4200, costPerTon: 48.00 },
      { mineName: 'Mine C (Utility)', ratio: 20, gcv: 3100, costPerTon: 28.46 }
    ],
    expectedGcv: 4852,
    totalCost: 742400,
    savings: 107600,
    efficiency: 100
  });

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getBlendRecommendation({
        gcvTarget: targetGcv,
        quantity,
        budget
      });
      setResult(res);
    } catch (err) {
      console.error('Error running blend simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatioColor = (mineName: string) => {
    if (mineName.includes('A')) return 'bg-gold-800';
    if (mineName.includes('B')) return 'bg-gold-500';
    return 'bg-gold-200';
  };

  // Columns for the source attribution details table
  const columns = [
    { header: 'Source ID', accessor: 'mineName' as const },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
          row.mineName.includes('C') 
            ? 'bg-amber-50 text-amber-700 border border-amber-250' 
            : 'bg-green-50 text-green-700 border border-green-250'
        }`}>
          {row.mineName.includes('C') ? 'Limited' : 'Available'}
        </span>
      )
    },
    { 
      header: 'Unit Price', 
      accessor: (row: any) => (
        <span className="font-mono">${row.costPerTon.toFixed(2)} / t</span>
      )
    },
    { 
      header: 'Optimal Load', 
      accessor: (row: any) => (
        <span className="font-mono font-semibold">
          {Math.round(quantity * (row.ratio / 100)).toLocaleString()} t
        </span>
      )
    },
    { 
      header: 'Cost Contribution', 
      accessor: (row: any) => (
        <span className="font-mono font-bold text-gold-900">
          ${Math.round(quantity * (row.ratio / 100) * row.costPerTon).toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header section */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Resource Allocation Engine</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">Blend Optimization Matrix</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Slider Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
          <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50 mb-2">
            <Sliders className="w-5 h-5 text-gold-500" />
            <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">Input Parameters</h3>
          </div>

          {/* Mine check toggles */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Resource Sources</span>
            {[
              { id: 'A', name: 'Mine A (Superior)', gcv: '5800 kcal/kg' },
              { id: 'B', name: 'Mine B (Mid-Tier)', gcv: '4200 kcal/kg' },
              { id: 'C', name: 'Mine C (Utility)', gcv: '3100 kcal/kg' }
            ].map((mine) => (
              <div key={mine.id} className="flex items-center justify-between p-3 border border-cortex-border rounded-xl bg-cortex-bg-secondary/40">
                <div className="text-xs">
                  <span className="font-bold text-cortex-dark block">{mine.name}</span>
                  <span className="text-[10px] text-cortex-gray font-mono">{mine.gcv}</span>
                </div>
                <div className="h-5 w-5 bg-gold-50 border border-gold-300 rounded-full flex items-center justify-center text-gold-700">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Slider 1: Target GCV */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Target GCV</span>
              <span className="font-mono font-bold text-gold-800">{targetGcv.toLocaleString()} kcal/kg</span>
            </div>
            <input 
              type="range" 
              min="3200" 
              max="5800" 
              step="50"
              value={targetGcv}
              onChange={(e) => setTargetGcv(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Quantity */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Quantity (Metric Tons)</span>
              <span className="font-mono font-bold text-gold-800">{quantity.toLocaleString()} t</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="25000" 
              step="500"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Budget Cap */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Budget Cap ($)</span>
              <span className="font-mono font-bold text-gold-800">${budget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max="2000000" 
              step="25000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          {/* Trigger button */}
          <div className="border-t border-cortex-border/50 pt-5 mt-2 flex gap-3">
            <Button
              onClick={handleRunSimulation}
              isLoading={isLoading}
              className="flex-1 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Run Simulation</span>
            </Button>
          </div>
        </div>

        {/* Right Side: Optimal Solver Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Result Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left relative overflow-hidden">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block">Expected Blend GCV</span>
              <p className="text-2xl font-extrabold font-mono text-cortex-dark mt-1.5">
                {result ? result.expectedGcv.toLocaleString() : '---'} <span className="text-xs font-sans text-cortex-gray font-normal">kcal/kg</span>
              </p>
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Within 0.04% Deviation</span>
              </div>
            </div>

            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block">Total Blend Cost</span>
              <p className="text-2xl font-extrabold font-mono text-cortex-dark mt-1.5">
                ${result ? result.totalCost.toLocaleString() : '---'}
              </p>
              <p className="text-[10px] text-cortex-gray mt-2 font-medium">
                Average ${result ? (result.totalCost / quantity).toFixed(2) : '---'} / Tonne
              </p>
            </div>

            <div className="bg-white border border-cortex-border p-5 rounded-2xl shadow-premium text-left relative overflow-hidden">
              <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block text-gold-700">Projected Savings</span>
              <p className="text-2xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-800 mt-1.5">
                ${result ? result.savings.toLocaleString() : '---'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gold-700 font-bold mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-650 animate-pulse"></span>
                <span>AI Optimized Path</span>
              </div>
            </div>
          </div>

          {result && (
            <>
              {/* Optimal Proportions Bar Chart */}
              <Card title="Optimal Blend Proportions" className="shadow-premium text-left">
                <p className="text-xs text-cortex-gray mb-4">
                  Cortex simulation ratios representing optimal utility-to-cost coal blending configurations.
                </p>

                {/* Legend list */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold mb-6">
                  {result.components.map((c) => (
                    <div key={c.mineName} className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded ${getRatioColor(c.mineName)}`}></span>
                      <span className="text-cortex-gray">{c.mineName} ({c.ratio}%)</span>
                    </div>
                  ))}
                </div>

                {/* Horizontal Segmented Bar */}
                <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-sm border border-cortex-border">
                  {result.components.map((c) => (
                    <div 
                      key={c.mineName} 
                      className={`${getRatioColor(c.mineName)} h-full flex items-center justify-center text-white text-[10px] font-bold font-mono transition-all`}
                      style={{ width: `${c.ratio}%` }}
                    >
                      {c.ratio > 8 ? `${c.ratio}%` : ''}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Current vs Optimized comparison slide element */}
              <Card title="Current vs. Optimized Comparison" className="shadow-premium text-left">
                <div className="flex flex-col gap-4 text-xs">
                  {/* Historical (Manual) */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cortex-border/30 pb-3">
                    <div className="w-1/3">
                      <span className="font-bold text-cortex-dark">Historical (Manual)</span>
                      <span className="text-[10px] text-cortex-gray block">GCV: 4,680 kcal/kg</span>
                    </div>
                    <div className="w-2/3 h-5 bg-gold-200/40 rounded flex overflow-hidden border border-gold-250/20 max-w-sm">
                      <div className="w-[35%] bg-gold-200/80"></div>
                      <div className="w-[45%] bg-gold-200/50"></div>
                      <div className="w-[20%] bg-gold-200/20"></div>
                    </div>
                  </div>

                  {/* CarbonCortex Optimized */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                    <div className="w-1/3">
                      <span className="font-extrabold text-gold-900">CarbonCortex Optimized</span>
                      <span className="text-[10px] text-gold-700 font-bold block">GCV: {result.expectedGcv} kcal/kg</span>
                    </div>
                    <div className="w-2/3 h-5 bg-gold-100/10 rounded flex overflow-hidden border border-gold-500/20 max-w-sm">
                      {result.components.map((c) => (
                        <div 
                          key={c.mineName} 
                          className={`${getRatioColor(c.mineName)} opacity-90`} 
                          style={{ width: `${c.ratio}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-cortex-gray mt-1 leading-normal italic">
                    * Results in +172 kcal/kg boost with a 12.6% reduction in operational fuel cost through precision mine-resource matching.
                  </p>
                </div>
              </Card>

              {/* Attribution Details Table */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Source Attribution Details</span>
                <Table 
                  columns={columns} 
                  data={result.components} 
                  className="shadow-premium"
                />
              </div>
            </>
          )}

          {/* Dark Logistic panel matching slide bottom */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 text-white rounded-2xl p-6 shadow-premium-lg flex flex-col sm:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-11 h-11 rounded-xl bg-stone-800 flex items-center justify-center text-gold-500 border border-stone-700 flex-shrink-0">
                <Train className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">Real-time Logistic Simulation</h4>
                <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                  Visualizing transport rail flow for the selected optimal blend. Ensuring delivery timelines align with production cycles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-900 border border-stone-850 px-4 py-2 rounded-xl text-xs font-bold text-gold-400 flex-shrink-0">
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-ping"></span>
              <span>ACTIVE RAKES: 12 / 15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blend;
