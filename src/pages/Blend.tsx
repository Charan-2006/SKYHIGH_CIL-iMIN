import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Check, 
  FileCheck 
} from 'lucide-react';

interface AvailableCoalSource {
  id: string;
  mine: string;
  seam: string;
  quantity: number;
  predictedGcv: number;
  ash: number;
  moisture: number;
  color: string;
}

const AVAILABLE_COALS: AvailableCoalSource[] = [
  {
    id: 'TALCHER',
    mine: 'Talcher',
    seam: 'Seam V',
    quantity: 5000,
    predictedGcv: 4850,
    ash: 28.0,
    moisture: 9.5,
    color: 'bg-gold-700'
  },
  {
    id: 'KORBA',
    mine: 'Korba',
    seam: 'Seam III',
    quantity: 4000,
    predictedGcv: 5200,
    ash: 22.0,
    moisture: 7.5,
    color: 'bg-gold-500'
  },
  {
    id: 'SINGRAULI',
    mine: 'Singrauli',
    seam: 'Seam II',
    quantity: 3000,
    predictedGcv: 5000,
    ash: 24.0,
    moisture: 9.0,
    color: 'bg-amber-600'
  }
];

export const Blend: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  // 1. Target Quality State
  const [targetGcv, setTargetGcv] = useState<number>(4900);
  const [maxAsh, setMaxAsh] = useState<number>(25.0);
  const [maxMoisture, setMaxMoisture] = useState<number>(10.0);
  const [targetQuantity, setTargetQuantity] = useState<number>(10000);

  // Available coal sources
  const [sources] = useState<AvailableCoalSource[]>(AVAILABLE_COALS);

  // Solver / Result State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [blendResult, setBlendResult] = useState<{
    allocations: { mine: string; ratio: number; tons: number; color: string }[];
    expectedGcv: number;
    expectedAsh: number;
    expectedMoisture: number;
    meetsTarget: boolean;
    gcvMet: boolean;
    ashMet: boolean;
    moistureMet: boolean;
  } | null>(null);

  // Calculate the best blend combination
  const calculateBestBlend = () => {
    setIsOptimizing(true);

    setTimeout(() => {
      // Find weights (w0, w1, w2) summing to 1 that satisfy constraints
      let bestCombination: { w0: number; w1: number; w2: number; score: number } | null = null;
      let minDeviation = Infinity;

      // Discrete grid search with 5% steps for clean, realistic industrial ratios
      for (let w0 = 0; w0 <= 100; w0 += 5) {
        for (let w1 = 0; w1 <= 100 - w0; w1 += 5) {
          const w2 = 100 - w0 - w1;
          const r0 = w0 / 100;
          const r1 = w1 / 100;
          const r2 = w2 / 100;

          const blendGcv = r0 * sources[0].predictedGcv + r1 * sources[1].predictedGcv + r2 * sources[2].predictedGcv;
          const blendAsh = r0 * sources[0].ash + r1 * sources[1].ash + r2 * sources[2].ash;
          const blendMoist = r0 * sources[0].moisture + r1 * sources[1].moisture + r2 * sources[2].moisture;

          // Check constraints
          const satisfiesGcv = blendGcv >= targetGcv - 25;
          const satisfiesAsh = blendAsh <= maxAsh + 0.1;
          const satisfiesMoist = blendMoist <= maxMoisture + 0.1;

          if (satisfiesGcv && satisfiesAsh && satisfiesMoist) {
            // Prioritize higher GCV and minimal deviation
            const dev = Math.abs(blendGcv - targetGcv) + (blendAsh > maxAsh ? 50 : 0);
            if (dev < minDeviation) {
              minDeviation = dev;
              bestCombination = { w0, w1, w2, score: dev };
            }
          }
        }
      }

      // Default to 40% Talcher, 35% Korba, 25% Singrauli if default 4900 is selected or fallback
      const finalW0 = bestCombination ? bestCombination.w0 : 40;
      const finalW1 = bestCombination ? bestCombination.w1 : 35;
      const finalW2 = bestCombination ? bestCombination.w2 : 25;

      const r0 = finalW0 / 100;
      const r1 = finalW1 / 100;
      const r2 = finalW2 / 100;

      const expectedGcv = Math.round(r0 * sources[0].predictedGcv + r1 * sources[1].predictedGcv + r2 * sources[2].predictedGcv);
      const expectedAsh = Number((r0 * sources[0].ash + r1 * sources[1].ash + r2 * sources[2].ash).toFixed(1));
      const expectedMoisture = Number((r0 * sources[0].moisture + r1 * sources[1].moisture + r2 * sources[2].moisture).toFixed(1));

      const gcvMet = expectedGcv >= targetGcv;
      const ashMet = expectedAsh <= maxAsh;
      const moistureMet = expectedMoisture <= maxMoisture;
      const meetsTarget = gcvMet && ashMet && moistureMet;

      const allocations = [
        {
          mine: sources[0].mine,
          ratio: finalW0,
          tons: Math.round((finalW0 / 100) * targetQuantity),
          color: sources[0].color
        },
        {
          mine: sources[1].mine,
          ratio: finalW1,
          tons: Math.round((finalW1 / 100) * targetQuantity),
          color: sources[1].color
        },
        {
          mine: sources[2].mine,
          ratio: finalW2,
          tons: Math.round((finalW2 / 100) * targetQuantity),
          color: sources[2].color
        }
      ].filter(a => a.ratio > 0);

      setBlendResult({
        allocations,
        expectedGcv,
        expectedAsh,
        expectedMoisture,
        meetsTarget,
        gcvMet,
        ashMet,
        moistureMet
      });

      setIsOptimizing(false);
      showToast('Calculated optimal blend combination.', meetsTarget ? 'success' : 'info');
    }, 400);
  };

  useEffect(() => {
    calculateBestBlend();
  }, []);

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Optimization & Decision</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Blend Optimizer</h2>
          <p className="text-xs text-cortex-gray mt-0.5">Find the right coal mix for your target quality.</p>
        </div>
        <div className="text-xs text-cortex-gray bg-white border border-cortex-border px-3 py-1.5 rounded-lg shadow-sm">
          <span>Quality Data: </span>
          <span className="font-semibold text-cortex-dark">Predicted by ML Model</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0">
        
        {/* LEFT COLUMN: Inputs & Available Coals */}
        <div className="xl:col-span-5 flex flex-col gap-6 min-w-0">
          
          {/* 2. TARGET QUALITY CARD */}
          <Card title="Target Quality" className="shadow-premium min-w-0">
            <p className="text-xs text-cortex-gray mb-4">
              Enter your required customer or power plant specifications:
            </p>

            <div className="flex flex-col gap-4">
              {/* Target GCV */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cortex-dark">Target GCV</span>
                  <span className="font-mono font-bold text-gold-900 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                    {targetGcv.toLocaleString()} kcal/kg
                  </span>
                </div>
                <input
                  type="range"
                  min="4200"
                  max="5200"
                  step="50"
                  value={targetGcv}
                  onChange={(e) => setTargetGcv(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
              </div>

              {/* Max Ash */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cortex-dark">Max Ash</span>
                  <span className="font-mono font-bold text-cortex-dark">
                    {maxAsh}%
                  </span>
                </div>
                <input
                  type="range"
                  min="18.0"
                  max="32.0"
                  step="0.5"
                  value={maxAsh}
                  onChange={(e) => setMaxAsh(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
              </div>

              {/* Max Moisture */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cortex-dark">Max Moisture</span>
                  <span className="font-mono font-bold text-cortex-dark">
                    {maxMoisture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="14.0"
                  step="0.5"
                  value={maxMoisture}
                  onChange={(e) => setMaxMoisture(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
              </div>

              {/* Target Batch Quantity */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-cortex-border/50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cortex-dark">Batch Quantity</span>
                  <span className="font-mono font-bold text-cortex-dark">
                    {targetQuantity.toLocaleString()} tonnes
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="1000"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
              </div>
            </div>

            {/* 4. OPTIMIZE BUTTON */}
            <div className="mt-5">
              <Button
                onClick={calculateBestBlend}
                disabled={isOptimizing}
                className="w-full py-3 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sliders className="w-4 h-4" />
                <span>{isOptimizing ? 'Calculating Best Mix...' : 'Find Best Blend'}</span>
              </Button>
            </div>
          </Card>

          {/* 3. AVAILABLE COAL SOURCES TABLE */}
          <Card title="Available Coal" className="shadow-premium min-w-0">
            <p className="text-xs text-cortex-gray mb-3">
              Stockpiles with quality predicted by the CarbonCortex ML model:
            </p>

            <div className="overflow-x-auto min-w-0">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Mine</th>
                    <th className="py-2.5 px-3">Seam</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Predicted GCV</th>
                    <th className="py-2.5 px-3 text-right">Ash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/40 font-mono">
                  {sources.map((src) => (
                    <tr key={src.id} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-cortex-dark font-sans flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${src.color} shrink-0`}></span>
                        <span>{src.mine}</span>
                      </td>
                      <td className="py-2.5 px-3 text-cortex-gray font-sans">{src.seam}</td>
                      <td className="py-2.5 px-3 text-cortex-dark">{src.quantity.toLocaleString()} t</td>
                      <td className="py-2.5 px-3 font-bold text-gold-900">{src.predictedGcv}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-cortex-dark">{src.ash}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Recommended Blend, Visual Bar & Decision Summary */}
        <div className="xl:col-span-7 flex flex-col gap-6 min-w-0">
          
          {blendResult ? (
            <div className="flex flex-col gap-6 min-w-0">
              
              {/* 5. RECOMMENDED BLEND CARD */}
              <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium min-w-0">
                <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                      Recommended Blend
                    </h3>
                    <p className="text-xs text-cortex-gray mt-0.5">
                      Optimal combination to meet your target of {targetGcv.toLocaleString()} kcal/kg.
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    blendResult.meetsTarget 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}>
                    {blendResult.meetsTarget ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Meets Target</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Review Suggested</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Proportions Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {blendResult.allocations.map((item) => (
                    <div 
                      key={item.mine}
                      className="p-3.5 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`}></span>
                        <span className="text-xs font-bold text-cortex-dark">{item.mine}</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold font-mono text-gold-900">
                          {item.ratio}%
                        </span>
                        <span className="text-xs font-mono text-cortex-gray">
                          {item.tons.toLocaleString()} t
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expected Result Metrics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-white border border-cortex-border/80 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                      Expected GCV
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-cortex-dark mt-1 block">
                      {blendResult.expectedGcv.toLocaleString()} <span className="text-xs font-sans text-cortex-gray font-normal">kcal/kg</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Target: {targetGcv.toLocaleString()} kcal/kg
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                      Expected Ash
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-cortex-dark mt-1 block">
                      {blendResult.expectedAsh}%
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Limit: ≤ {maxAsh}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                      Expected Moisture
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-cortex-dark mt-1 block">
                      {blendResult.expectedMoisture}%
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Limit: ≤ {maxMoisture}%
                    </span>
                  </div>
                </div>

                {/* 6. SIMPLE VISUAL COMPOSITION BAR */}
                <div className="mt-5 pt-4 border-t border-cortex-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-2">
                    Blend Composition
                  </span>

                  {/* Horizontal Segmented Bar */}
                  <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-sm border border-cortex-border">
                    {blendResult.allocations.map((item) => (
                      <div
                        key={item.mine}
                        className={`${item.color} h-full flex items-center justify-center text-white text-[10px] font-bold font-mono transition-all`}
                        style={{ width: `${item.ratio}%` }}
                        title={`${item.mine}: ${item.ratio}%`}
                      >
                        {item.ratio >= 15 ? `${item.mine} ${item.ratio}%` : `${item.ratio}%`}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-cortex-gray">
                    {blendResult.allocations.map((item) => (
                      <div key={item.mine} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                        <span>{item.mine} ({item.ratio}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. DECISION SUMMARY CARD */}
              <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium min-w-0">
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider mb-4 border-b border-cortex-border/60 pb-3">
                  Decision Summary
                </h3>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Target GCV achieved ({blendResult.expectedGcv.toLocaleString()} ≥ {targetGcv.toLocaleString()} kcal/kg)</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ash within limit ({blendResult.expectedAsh}% ≤ {maxAsh}%)</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Moisture within limit ({blendResult.expectedMoisture}% ≤ {maxMoisture}%)</span>
                  </div>
                </div>

                {/* Recommended Action Box */}
                <div className="mt-5 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                      Recommended Action
                    </span>
                    <p className="text-sm font-bold text-emerald-950 mt-0.5">
                      Use the recommended blend for dispatch.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => navigate('/report')}
                      className="py-2.5 px-4 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Generate Dispatch Certificate</span>
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <Card className="text-center py-16 flex flex-col items-center justify-center flex-1 min-h-[380px] shadow-premium">
              <Layers className="w-10 h-10 text-gold-500 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-cortex-dark">Ready to Optimize Blend</h3>
              <p className="text-xs text-cortex-gray max-w-sm mt-1 leading-relaxed">
                Set your Target GCV and maximum Ash limits on the left, then click <strong>"Find Best Blend"</strong> to calculate the exact coal mix.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default Blend;
