import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Minus,
  Play
} from 'lucide-react';

interface CoalSource {
  mine: string;
  seam: string;
  gcv: number;
  ash: number;
  moisture: number;
  cost_per_ton: number;
}

const AVAILABLE_COAL_SOURCES: CoalSource[] = [
  {
    mine: 'Moonidih UG (BCCL)',
    seam: 'Seam XVI',
    gcv: 6450,
    ash: 12.8,
    moisture: 1.4,
    cost_per_ton: 4850
  },
  {
    mine: 'Jayant OCP (NCL)',
    seam: 'Seam Purewa',
    gcv: 5380,
    ash: 22.4,
    moisture: 5.8,
    cost_per_ton: 3100
  },
  {
    mine: 'Gevra OCP (SECL)',
    seam: 'Seam Kusmunda',
    gcv: 4920,
    ash: 28.2,
    moisture: 7.2,
    cost_per_ton: 2450
  }
];

interface PlanMetrics {
  gcv: number;
  ash: number;
  moisture: number;
  costPerTon: number;
  totalCost: number;
}

export const ScenarioSimulator: React.FC = () => {
  // Current Plan inputs
  const [batchQuantity, setBatchQuantity] = useState(20000);
  const [currentGcv, setCurrentGcv] = useState(5000);
  const [currentMaxAsh, setCurrentMaxAsh] = useState(25.0);
  const [currentMaxMoisture, setCurrentMaxMoisture] = useState(6.0);

  // What-If Plan inputs
  const [whatIfGcv, setWhatIfGcv] = useState(4850);
  const [whatIfMaxAsh, setWhatIfMaxAsh] = useState(25.0);
  const [whatIfMaxMoisture, setWhatIfMaxMoisture] = useState(8.5);

  const [simulated, setSimulated] = useState(true);
  const [loading, setLoading] = useState(false);

  // Solver: computes realistic blend given targets and available coals
  const computePlanMetrics = (targetGcv: number, maxAsh: number, maxMoisture: number, quantity: number): PlanMetrics => {
    // Determine blend ratio among the 3 sources to satisfy targets with minimum cost
    // Source 0: Moonidih (high GCV, low ash/moist, high cost)
    // Source 1: Jayant (mid GCV, mid ash/moist, mid cost)
    // Source 2: Gevra (standard GCV, higher ash/moist, lowest cost)
    let bestCost = Infinity;
    let bestBlend = [0.33, 0.33, 0.34];

    // Grid search for optimal blend satisfying constraints
    for (let w0 = 0; w0 <= 1.01; w0 += 0.05) {
      for (let w1 = 0; w1 <= 1.01 - w0; w1 += 0.05) {
        const w2 = Math.max(0, 1.0 - w0 - w1);
        const blendGcv = w0 * AVAILABLE_COAL_SOURCES[0].gcv + w1 * AVAILABLE_COAL_SOURCES[1].gcv + w2 * AVAILABLE_COAL_SOURCES[2].gcv;
        const blendAsh = w0 * AVAILABLE_COAL_SOURCES[0].ash + w1 * AVAILABLE_COAL_SOURCES[1].ash + w2 * AVAILABLE_COAL_SOURCES[2].ash;
        const blendMoist = w0 * AVAILABLE_COAL_SOURCES[0].moisture + w1 * AVAILABLE_COAL_SOURCES[1].moisture + w2 * AVAILABLE_COAL_SOURCES[2].moisture;
        const blendCost = w0 * AVAILABLE_COAL_SOURCES[0].cost_per_ton + w1 * AVAILABLE_COAL_SOURCES[1].cost_per_ton + w2 * AVAILABLE_COAL_SOURCES[2].cost_per_ton;

        // Soft penalty if constraints not fully met
        const gcvDeficit = Math.max(0, targetGcv - blendGcv);
        const ashExcess = Math.max(0, blendAsh - maxAsh);
        const moistExcess = Math.max(0, blendMoist - maxMoisture);

        const penalty = (gcvDeficit * 10) + (ashExcess * 1000) + (moistExcess * 1000);
        const totalObjective = blendCost + penalty;

        if (totalObjective < bestCost) {
          bestCost = totalObjective;
          bestBlend = [w0, w1, w2];
        }
      }
    }

    const finalGcv = Math.round(bestBlend[0] * AVAILABLE_COAL_SOURCES[0].gcv + bestBlend[1] * AVAILABLE_COAL_SOURCES[1].gcv + bestBlend[2] * AVAILABLE_COAL_SOURCES[2].gcv);
    const finalAsh = Number((bestBlend[0] * AVAILABLE_COAL_SOURCES[0].ash + bestBlend[1] * AVAILABLE_COAL_SOURCES[1].ash + bestBlend[2] * AVAILABLE_COAL_SOURCES[2].ash).toFixed(1));
    const finalMoist = Number((bestBlend[0] * AVAILABLE_COAL_SOURCES[0].moisture + bestBlend[1] * AVAILABLE_COAL_SOURCES[1].moisture + bestBlend[2] * AVAILABLE_COAL_SOURCES[2].moisture).toFixed(1));
    const costPerTon = Number((bestBlend[0] * AVAILABLE_COAL_SOURCES[0].cost_per_ton + bestBlend[1] * AVAILABLE_COAL_SOURCES[1].cost_per_ton + bestBlend[2] * AVAILABLE_COAL_SOURCES[2].cost_per_ton).toFixed(2));
    const totalCost = Math.round(costPerTon * quantity);

    return {
      gcv: finalGcv,
      ash: finalAsh,
      moisture: finalMoist,
      costPerTon,
      totalCost
    };
  };

  const currentResult = computePlanMetrics(currentGcv, currentMaxAsh, currentMaxMoisture, batchQuantity);
  const whatIfResult = computePlanMetrics(whatIfGcv, whatIfMaxAsh, whatIfMaxMoisture, batchQuantity);

  const gcvChange = whatIfResult.gcv - currentResult.gcv;
  const ashChange = Number((whatIfResult.ash - currentResult.ash).toFixed(1));
  const moistureChange = Number((whatIfResult.moisture - currentResult.moisture).toFixed(1));
  const costPerTonChange = Number((whatIfResult.costPerTon - currentResult.costPerTon).toFixed(2));
  const totalCostChange = whatIfResult.totalCost - currentResult.totalCost;

  const handleRunSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      setSimulated(true);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-cortex-dark">Scenario Simulator</h1>
        <p className="text-sm text-cortex-gray mt-1">
          Compare your current plan with a what-if scenario.
        </p>
      </div>

      {/* 2 & 3. Current Plan vs What-If Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        {/* Current Plan Card */}
        <Card title="Current Plan" className="bg-white border border-cortex-border shadow-sm">
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-cortex-gray uppercase tracking-wider block mb-1">
                Batch Quantity (tons)
              </label>
              <input
                type="number"
                min="1000"
                max="100000"
                step="1000"
                value={batchQuantity}
                onChange={(e) => setBatchQuantity(Math.max(1000, Number(e.target.value)))}
                className="w-full px-3.5 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-cortex-gray block mb-1">
                  Target GCV
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="3500"
                    max="6500"
                    step="50"
                    value={currentGcv}
                    onChange={(e) => setCurrentGcv(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">kcal</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-cortex-gray block mb-1">
                  Max Ash
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="45"
                    step="0.5"
                    value={currentMaxAsh}
                    onChange={(e) => setCurrentMaxAsh(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-cortex-gray block mb-1">
                  Max Moisture
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="20"
                    step="0.5"
                    value={currentMaxMoisture}
                    onChange={(e) => setCurrentMaxMoisture(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What-If Plan Card */}
        <Card title="What-If Plan" className="bg-gold-50/20 border border-gold-200/70 shadow-sm">
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gold-900 font-medium">
              Change these values to see what happens.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gold-900 block mb-1">
                  Target GCV
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="3500"
                    max="6500"
                    step="50"
                    value={whatIfGcv}
                    onChange={(e) => setWhatIfGcv(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-white border border-gold-300 rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">kcal</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gold-900 block mb-1">
                  Max Ash
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="45"
                    step="0.5"
                    value={whatIfMaxAsh}
                    onChange={(e) => setWhatIfMaxAsh(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-white border border-gold-300 rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gold-900 block mb-1">
                  Max Moisture
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="20"
                    step="0.5"
                    value={whatIfMaxMoisture}
                    onChange={(e) => setWhatIfMaxMoisture(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-semibold font-mono bg-white border border-gold-300 rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-cortex-gray">
              Batch Quantity is kept at <span className="font-semibold text-cortex-dark">{batchQuantity.toLocaleString()} tons</span> for fair comparison.
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Coal Sources Table */}
      <Card title="Available Coal Sources" className="bg-white border border-cortex-border shadow-sm">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-cortex-border text-cortex-gray font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Mine</th>
                <th className="py-2.5 px-3">Seam</th>
                <th className="py-2.5 px-3">GCV</th>
                <th className="py-2.5 px-3">Ash</th>
                <th className="py-2.5 px-3">Moisture</th>
                <th className="py-2.5 px-3">Cost/t</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cortex-border/40 font-mono text-cortex-dark">
              {AVAILABLE_COAL_SOURCES.map((source, idx) => (
                <tr key={idx} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium font-sans text-cortex-dark">{source.mine}</td>
                  <td className="py-2.5 px-3 text-cortex-gray font-sans">{source.seam}</td>
                  <td className="py-2.5 px-3 font-semibold">{source.gcv} kcal/kg</td>
                  <td className="py-2.5 px-3">{source.ash}%</td>
                  <td className="py-2.5 px-3">{source.moisture}%</td>
                  <td className="py-2.5 px-3 font-semibold">₹{source.cost_per_ton.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Run Simulation Button */}
      <div className="flex justify-start">
        <Button
          onClick={handleRunSimulation}
          disabled={loading}
          className="px-8 py-3 text-xs font-bold bg-gold-600 hover:bg-gold-500 text-white rounded-xl shadow-sm flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          {loading ? 'Running Simulation...' : 'Run Simulation'}
        </Button>
      </div>

      {/* 6. Results Section */}
      {simulated && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-cortex-dark">Simulation Result</h2>
          </div>

          {/* 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* GCV Change Card */}
            <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider">
                GCV Change
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={`text-xl font-bold font-mono ${gcvChange >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {gcvChange > 0 ? `+${gcvChange}` : gcvChange} kcal/kg
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  gcvChange > 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : gcvChange < 0 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-gray-100 text-cortex-gray'
                }`}>
                  {gcvChange > 0 ? 'Higher GCV' : gcvChange < 0 ? 'Lower GCV' : 'Unchanged'}
                </span>
              </div>
            </div>

            {/* Cost Change Card */}
            <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider">
                Cost Change
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={`text-xl font-bold font-mono ${costPerTonChange <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {costPerTonChange > 0 ? `+₹${costPerTonChange}` : `-₹${Math.abs(costPerTonChange)}`}/t
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  costPerTonChange < 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : costPerTonChange > 0 
                    ? 'bg-rose-50 text-rose-700' 
                    : 'bg-gray-100 text-cortex-gray'
                }`}>
                  {costPerTonChange < 0 ? 'Lower Cost' : costPerTonChange > 0 ? 'Higher Cost' : 'No Change'}
                </span>
              </div>
            </div>

            {/* Total Cost Change Card */}
            <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider">
                Total Cost Change
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={`text-xl font-bold font-mono ${totalCostChange <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {totalCostChange > 0 ? `+₹${totalCostChange.toLocaleString()}` : `-₹${Math.abs(totalCostChange).toLocaleString()}`}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  totalCostChange < 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : totalCostChange > 0 
                    ? 'bg-rose-50 text-rose-700' 
                    : 'bg-gray-100 text-cortex-gray'
                }`}>
                  {totalCostChange < 0 ? 'Lower Cost' : totalCostChange > 0 ? 'Higher Cost' : 'No Change'}
                </span>
              </div>
            </div>
          </div>

          {/* 7 & 8. Comparison Table & Decision Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
            {/* Simple Comparison Table */}
            <div className="lg:col-span-7 bg-white border border-cortex-border rounded-2xl p-5 shadow-sm min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cortex-gray mb-4">
                Plan Comparison
              </h3>
              <div className="overflow-x-auto min-w-0">
                <table className="w-full text-xs text-left border-collapse min-w-[380px]">
                  <thead>
                    <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Metric</th>
                      <th className="py-2.5 px-3">Current</th>
                      <th className="py-2.5 px-3 bg-gold-50/40 text-gold-900">What-If</th>
                      <th className="py-2.5 px-3">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cortex-border/40 font-mono text-cortex-dark">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-cortex-dark font-sans">GCV</td>
                      <td className="py-3 px-3">{currentResult.gcv.toLocaleString()} kcal/kg</td>
                      <td className="py-3 px-3 bg-gold-50/30 font-bold">{whatIfResult.gcv.toLocaleString()} kcal/kg</td>
                      <td className={`py-3 px-3 font-bold ${gcvChange >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {gcvChange > 0 ? `+${gcvChange}` : gcvChange} kcal/kg
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-cortex-dark font-sans">Ash</td>
                      <td className="py-3 px-3">{currentResult.ash}%</td>
                      <td className="py-3 px-3 bg-gold-50/30 font-bold">{whatIfResult.ash}%</td>
                      <td className="py-3 px-3 font-bold">
                        {ashChange > 0 ? `+${ashChange}` : ashChange}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-cortex-dark font-sans">Moisture</td>
                      <td className="py-3 px-3">{currentResult.moisture}%</td>
                      <td className="py-3 px-3 bg-gold-50/30 font-bold">{whatIfResult.moisture}%</td>
                      <td className="py-3 px-3 font-bold">
                        {moistureChange > 0 ? `+${moistureChange}` : moistureChange}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-cortex-dark font-sans">Total Cost</td>
                      <td className="py-3 px-3">₹{currentResult.totalCost.toLocaleString()}</td>
                      <td className="py-3 px-3 bg-gold-50/30 font-bold">₹{whatIfResult.totalCost.toLocaleString()}</td>
                      <td className={`py-3 px-3 font-bold ${totalCostChange <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {totalCostChange > 0 ? `+₹${totalCostChange.toLocaleString()}` : `-₹${Math.abs(totalCostChange).toLocaleString()}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decision Summary Card */}
            <div className="lg:col-span-5 bg-white border border-cortex-border rounded-2xl p-5 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cortex-gray mb-3">
                  Scenario Summary
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-xs">
                    {totalCostChange <= 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="text-cortex-dark font-medium leading-relaxed">
                      {totalCostChange < 0 
                        ? `Cost is lower by ₹${Math.abs(totalCostChange).toLocaleString()}` 
                        : totalCostChange > 0 
                        ? `Cost is higher by ₹${totalCostChange.toLocaleString()}` 
                        : 'Total batch cost remains unchanged'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    {whatIfMaxMoisture >= currentMaxMoisture ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Minus className="w-4 h-4 text-cortex-gray shrink-0 mt-0.5" />
                    )}
                    <span className="text-cortex-dark font-medium leading-relaxed">
                      {whatIfMaxMoisture !== currentMaxMoisture
                        ? `Moisture limit changes from ${currentMaxMoisture}% to ${whatIfMaxMoisture}%`
                        : `Moisture limit remains at ${currentMaxMoisture}%`}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    {gcvChange < 0 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span className="text-cortex-dark font-medium leading-relaxed">
                      {gcvChange < 0
                        ? `GCV decreases by ${Math.abs(gcvChange)} kcal/kg`
                        : gcvChange > 0
                        ? `GCV increases by ${gcvChange} kcal/kg`
                        : 'GCV delivered remains unchanged'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-5 pt-4 border-t border-cortex-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Recommended Action
                </span>
                <p className="text-xs text-cortex-dark font-medium leading-relaxed bg-cortex-bg-secondary p-3 rounded-xl border border-cortex-border/50">
                  {gcvChange < 0 && totalCostChange < 0
                    ? 'Review the lower GCV before using this scenario to ensure plant boiler compliance.'
                    : totalCostChange <= 0 && gcvChange >= 0
                    ? 'This scenario meets target quality requirements at an optimal lower cost.'
                    : 'Evaluate whether the higher expenditure is necessary for current boiler specs.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
