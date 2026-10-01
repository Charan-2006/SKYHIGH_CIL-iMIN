import React, { useState } from 'react';
import { scenarioApi, type ScenarioSimulationResult } from '../api/scenarios';
import Card from '../components/Card';
import Button from '../components/Button';
import { Sliders, Scale } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const [scenarioName, setScenarioName] = useState('Monsoon High-Moisture Compensation');
  const [targetQuantity, setTargetQuantity] = useState(10000);
  
  // Baseline parameters
  const [baseTargetGcv, setBaseTargetGcv] = useState(5000);
  const [baseMaxAsh, setBaseMaxAsh] = useState(25.0);
  const [baseMaxMoisture, setBaseMaxMoisture] = useState(6.0);
  
  // What-If parameters
  const [whatTargetGcv, setWhatTargetGcv] = useState(4850);
  const [whatMaxAsh, setWhatMaxAsh] = useState(28.0);
  const [whatMaxMoisture, setWhatMaxMoisture] = useState(8.5);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);

  const defaultSources = [
    { source_id: 'SRC-A', mine_name: 'Moonidih UG (BCCL)', available_quantity: 8000, gcv: 6450, ash: 12.8, moisture: 1.4, volatile_matter: 28.5, cost_per_ton: 84.50 },
    { source_id: 'SRC-B', mine_name: 'Jayant OCP (NCL)', available_quantity: 12000, gcv: 5380, ash: 22.4, moisture: 5.8, volatile_matter: 26.8, cost_per_ton: 54.00 },
    { source_id: 'SRC-C', mine_name: 'Gevra OCP (SECL)', available_quantity: 15000, gcv: 4920, ash: 28.2, moisture: 7.2, volatile_matter: 24.1, cost_per_ton: 42.50 }
  ];

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await scenarioApi.simulate({
        scenario_name: scenarioName,
        baseline: {
          sources: defaultSources,
          target_quantity: targetQuantity,
          target_gcv: baseTargetGcv,
          max_ash: baseMaxAsh,
          max_moisture: baseMaxMoisture
        },
        what_if: {
          sources: defaultSources,
          target_quantity: targetQuantity,
          target_gcv: whatTargetGcv,
          max_ash: whatMaxAsh,
          max_moisture: whatMaxMoisture
        }
      });
      setResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">What-If Analysis Engine</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">Operational Scenario Simulator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters input */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
          <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50">
            <Sliders className="w-5 h-5 text-gold-500" />
            <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
              Simulation Parameters
            </h3>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-cortex-gray block mb-1.5">
              Scenario Name
            </label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full px-4 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-cortex-gray block mb-1.5">
              Total Target Batch Quantity: <span className="font-mono font-bold text-cortex-dark">{targetQuantity.toLocaleString()} t</span>
            </label>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(Number(e.target.value))}
              className="w-full accent-gold-600 cursor-pointer"
            />
          </div>

          {/* Baseline vs What-If Sliders */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-cortex-border/50">
            {/* Baseline Column */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                Baseline Specs
              </span>
              <div>
                <label className="text-[10px] text-cortex-gray">Target GCV: {baseTargetGcv}</label>
                <input
                  type="range"
                  min="4000"
                  max="6200"
                  step="50"
                  value={baseTargetGcv}
                  onChange={(e) => setBaseTargetGcv(Number(e.target.value))}
                  className="w-full accent-gray-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-cortex-gray">Max Ash: {baseMaxAsh}%</label>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="0.5"
                  value={baseMaxAsh}
                  onChange={(e) => setBaseMaxAsh(Number(e.target.value))}
                  className="w-full accent-gray-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-cortex-gray">Max Moisture: {baseMaxMoisture}%</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={baseMaxMoisture}
                  onChange={(e) => setBaseMaxMoisture(Number(e.target.value))}
                  className="w-full accent-gray-500"
                />
              </div>
            </div>

            {/* What-If Column */}
            <div className="flex flex-col gap-3 bg-gold-50/20 p-2.5 rounded-xl border border-gold-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-900">
                What-If Specs
              </span>
              <div>
                <label className="text-[10px] text-gold-800 font-semibold">Target GCV: {whatTargetGcv}</label>
                <input
                  type="range"
                  min="4000"
                  max="6200"
                  step="50"
                  value={whatTargetGcv}
                  onChange={(e) => setWhatTargetGcv(Number(e.target.value))}
                  className="w-full accent-gold-600"
                />
              </div>
              <div>
                <label className="text-[10px] text-gold-800 font-semibold">Max Ash: {whatMaxAsh}%</label>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="0.5"
                  value={whatMaxAsh}
                  onChange={(e) => setWhatMaxAsh(Number(e.target.value))}
                  className="w-full accent-gold-600"
                />
              </div>
              <div>
                <label className="text-[10px] text-gold-800 font-semibold">Max Moisture: {whatMaxMoisture}%</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={whatMaxMoisture}
                  onChange={(e) => setWhatMaxMoisture(Number(e.target.value))}
                  className="w-full accent-gold-600"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 font-bold text-xs"
          >
            {loading ? 'Running OR-Tools Simulators...' : 'Run Comparative What-If Simulation'}
          </Button>
        </div>

        {/* Right Side: Comparative Results */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {result ? (
            <div className="flex flex-col gap-6">
              {/* Comparative Hero Matrix */}
              <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
                <div className="flex items-center justify-between pb-4 border-b border-cortex-border/60 mb-6">
                  <div>
                    <span className="text-base font-bold text-cortex-dark">{result.scenario_name}</span>
                    <p className="text-xs text-cortex-gray mt-0.5">{result.summary}</p>
                  </div>
                  <Scale className="w-5 h-5 text-gold-600" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-cortex-bg-secondary rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-cortex-gray block">Energy Delta</span>
                    <span className={`text-xl font-extrabold font-mono mt-1 block ${
                      result.deltas.gcv_delta >= 0 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {result.deltas.gcv_delta > 0 ? '+' : ''}{result.deltas.gcv_delta} kcal/kg
                    </span>
                  </div>

                  <div className="p-3 bg-cortex-bg-secondary rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-cortex-gray block">Unit Cost Delta</span>
                    <span className={`text-xl font-extrabold font-mono mt-1 block ${
                      result.deltas.cost_per_ton_delta <= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {result.deltas.cost_per_ton_delta > 0 ? '+' : ''}${result.deltas.cost_per_ton_delta}/t
                    </span>
                  </div>

                  <div className="p-3 bg-cortex-bg-secondary rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-cortex-gray block">Total Expenditure</span>
                    <span className={`text-xl font-extrabold font-mono mt-1 block ${
                      result.deltas.cost_delta <= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {result.deltas.cost_delta > 0 ? '+' : ''}${Math.round(result.deltas.cost_delta).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Side by side comparison table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Metric</th>
                        <th className="py-2.5 px-3">Baseline</th>
                        <th className="py-2.5 px-3 bg-gold-50/30 text-gold-900 font-bold">What-If Scenario</th>
                        <th className="py-2.5 px-3">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cortex-border/40 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-cortex-dark font-sans">Gross Calorific Value</td>
                        <td className="py-2.5 px-3">{result.baseline_metrics.gcv} kcal/kg</td>
                        <td className="py-2.5 px-3 bg-gold-50/20 font-bold">{result.what_if_metrics.gcv} kcal/kg</td>
                        <td className="py-2.5 px-3">{result.deltas.gcv_delta > 0 ? '+' : ''}{result.deltas.gcv_delta}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-cortex-dark font-sans">Ash Content</td>
                        <td className="py-2.5 px-3">{result.baseline_metrics.ash}%</td>
                        <td className="py-2.5 px-3 bg-gold-50/20 font-bold">{result.what_if_metrics.ash}%</td>
                        <td className="py-2.5 px-3">{result.deltas.ash_delta > 0 ? '+' : ''}{result.deltas.ash_delta}%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-cortex-dark font-sans">Moisture Content</td>
                        <td className="py-2.5 px-3">{result.baseline_metrics.moisture}%</td>
                        <td className="py-2.5 px-3 bg-gold-50/20 font-bold">{result.what_if_metrics.moisture}%</td>
                        <td className="py-2.5 px-3">{result.deltas.moisture_delta > 0 ? '+' : ''}{result.deltas.moisture_delta}%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-cortex-dark font-sans">Total Batch Cost</td>
                        <td className="py-2.5 px-3">${Math.round(result.baseline_metrics.total_cost).toLocaleString()}</td>
                        <td className="py-2.5 px-3 bg-gold-50/20 font-bold">${Math.round(result.what_if_metrics.total_cost).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold">${Math.round(result.deltas.cost_delta).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-cortex-dark font-sans">Quality Score Index</td>
                        <td className="py-2.5 px-3">{result.baseline_metrics.quality_score}</td>
                        <td className="py-2.5 px-3 bg-gold-50/20 font-bold">{result.what_if_metrics.quality_score}</td>
                        <td className="py-2.5 px-3">{result.deltas.quality_score_delta > 0 ? '+' : ''}{result.deltas.quality_score_delta}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gold-50/50 border border-gold-200 rounded-xl text-xs text-gold-900 leading-relaxed font-semibold">
                  {result.strategic_advice}
                </div>
              </div>
            </div>
          ) : (
            <Card title="Ready to Simulate" className="text-center py-16 flex flex-col items-center">
              <Scale className="w-12 h-12 text-gold-500 mb-3 animate-pulse" />
              <p className="text-xs text-cortex-gray max-w-sm mb-4">
                Adjust baseline and what-if targets on the left, then click 'Run Comparative What-If Simulation' to compute mathematically rigorous linear program differentials.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;
