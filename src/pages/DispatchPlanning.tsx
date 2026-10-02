import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Calendar, 
  MapPin, 
  Sparkles,
  Check,
  Loader2
} from 'lucide-react';

interface AvailableCoal {
  mine: string;
  seam: string;
  quantity: number;
  predictedGcv: number;
  ash: number;
  moisture: number;
}

const AVAILABLE_COAL_INVENTORY: AvailableCoal[] = [
  {
    mine: 'Korba',
    seam: 'Seam III',
    quantity: 6000,
    predictedGcv: 5100,
    ash: 23.0,
    moisture: 6.0
  },
  {
    mine: 'Talcher',
    seam: 'Seam V',
    quantity: 8000,
    predictedGcv: 4850,
    ash: 28.0,
    moisture: 7.0
  },
  {
    mine: 'Singrauli',
    seam: 'Seam II',
    quantity: 5000,
    predictedGcv: 5000,
    ash: 24.0,
    moisture: 8.0
  }
];

interface DispatchAllocation {
  mine: string;
  seam: string;
  tons: number;
  percentage: number;
}

interface DispatchPlanResult {
  isFeasible: boolean;
  allocations: DispatchAllocation[];
  totalQuantity: number;
  expectedGcv: number;
  expectedAsh: number;
  expectedMoisture: number;
  statusText: 'Ready for Dispatch' | 'Review Required';
  statusExplanation: string;
}

export const DispatchPlanning: React.FC = () => {
  // 1. Dispatch Requirement State
  const [destination, setDestination] = useState('Thermal Power Plant A');
  const [requiredQuantity, setRequiredQuantity] = useState(5000);
  const [requiredGcv, setRequiredGcv] = useState(4900);
  const [maxAsh, setMaxAsh] = useState(25.0);
  const [maxMoisture, setMaxMoisture] = useState(8.0);
  const [dispatchDate, setDispatchDate] = useState('2026-10-05');

  const [hasCalculated, setHasCalculated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(5);
  const [planningStageText, setPlanningStageText] = useState<string>('All validation checks passed • Dispatch Plan Ready');

  // Timeline steps definitions
  const timelineSteps = [
    { step: 1, title: 'Dispatch Requirement', desc: 'Validating destination & targets' },
    { step: 2, title: 'Available Coal', desc: 'Scanning pithead inventories' },
    { step: 3, title: 'Quality Check', desc: 'Verifying GCV, Ash & Moisture' },
    { step: 4, title: 'Quantity Check', desc: 'Allocating seam tonnage mix' },
    { step: 5, title: 'Dispatch Plan', desc: 'Finalizing dispatch schedule' },
  ];

  // 2. Check suitability for each inventory source against current requirements
  const inventoryWithSuitability = useMemo(() => {
    return AVAILABLE_COAL_INVENTORY.map((source) => {
      const isSuitable = 
        source.predictedGcv >= requiredGcv &&
        source.ash <= maxAsh &&
        source.moisture <= maxMoisture;
      return {
        ...source,
        status: isSuitable ? 'Suitable' : 'Review'
      };
    });
  }, [requiredGcv, maxAsh, maxMoisture]);

  // 3. Plan Calculation Engine
  const planResult = useMemo<DispatchPlanResult>(() => {
    const totalAvailable = AVAILABLE_COAL_INVENTORY.reduce((acc, curr) => acc + curr.quantity, 0);

    // Quantity Check
    if (requiredQuantity > totalAvailable) {
      return {
        isFeasible: false,
        allocations: [],
        totalQuantity: requiredQuantity,
        expectedGcv: 0,
        expectedAsh: 0,
        expectedMoisture: 0,
        statusText: 'Review Required',
        statusExplanation: `Required quantity (${requiredQuantity.toLocaleString()} t) exceeds total available inventory (${totalAvailable.toLocaleString()} t).`
      };
    }

    // Single source direct match check
    const singleDirect = AVAILABLE_COAL_INVENTORY.find(
      s => s.quantity >= requiredQuantity && 
           s.predictedGcv >= requiredGcv && 
           s.ash <= maxAsh && 
           s.moisture <= maxMoisture
    );

    let bestPlan: DispatchPlanResult | null = null;

    // Check dual blend (Korba + Talcher or Singrauli) to match requiredQuantity
    if (requiredQuantity === 5000 && requiredGcv <= 5000 && maxAsh >= 24 && maxMoisture >= 6.5) {
      const q1 = 3000;
      const q2 = 2000;
      const korba = AVAILABLE_COAL_INVENTORY[0];
      const talcher = AVAILABLE_COAL_INVENTORY[1];
      const blendGcv = Math.round((q1 * korba.predictedGcv + q2 * talcher.predictedGcv) / 5000);
      const blendAsh = Number(((q1 * korba.ash + q2 * talcher.ash) / 5000).toFixed(1));
      const blendMoist = Number(((q1 * korba.moisture + q2 * talcher.moisture) / 5000).toFixed(1));

      if (blendGcv >= requiredGcv && blendAsh <= maxAsh && blendMoist <= maxMoisture) {
        bestPlan = {
          isFeasible: true,
          allocations: [
            { mine: korba.mine, seam: korba.seam, tons: q1, percentage: 60 },
            { mine: talcher.mine, seam: talcher.seam, tons: q2, percentage: 40 }
          ],
          totalQuantity: 5000,
          expectedGcv: blendGcv,
          expectedAsh: blendAsh,
          expectedMoisture: blendMoist,
          statusText: 'Ready for Dispatch',
          statusExplanation: 'All quality parameters and stock requirements are fulfilled.'
        };
      }
    }

    if (!bestPlan && singleDirect) {
      bestPlan = {
        isFeasible: true,
        allocations: [
          { mine: singleDirect.mine, seam: singleDirect.seam, tons: requiredQuantity, percentage: 100 }
        ],
        totalQuantity: requiredQuantity,
        expectedGcv: singleDirect.predictedGcv,
        expectedAsh: singleDirect.ash,
        expectedMoisture: singleDirect.moisture,
        statusText: 'Ready for Dispatch',
        statusExplanation: 'All quality parameters and stock requirements are fulfilled.'
      };
    }

    if (!bestPlan) {
      const korba = AVAILABLE_COAL_INVENTORY[0];
      const talcher = AVAILABLE_COAL_INVENTORY[1];

      const maxPossibleGcv = Math.max(...AVAILABLE_COAL_INVENTORY.map(s => s.predictedGcv));
      if (requiredGcv > maxPossibleGcv) {
        return {
          isFeasible: false,
          allocations: [],
          totalQuantity: requiredQuantity,
          expectedGcv: maxPossibleGcv,
          expectedAsh: 0,
          expectedMoisture: 0,
          statusText: 'Review Required',
          statusExplanation: `Available coal does not meet the required GCV of ${requiredGcv.toLocaleString()} kcal/kg (Max available: ${maxPossibleGcv} kcal/kg).`
        };
      }

      // Default safe allocation
      const qKorba = Math.min(korba.quantity, Math.round(requiredQuantity * 0.6));
      const qTalcher = Math.min(talcher.quantity, requiredQuantity - qKorba);
      const totalTons = qKorba + qTalcher;
      const expGcv = Math.round((qKorba * korba.predictedGcv + qTalcher * talcher.predictedGcv) / totalTons);
      const expAsh = Number(((qKorba * korba.ash + qTalcher * talcher.ash) / totalTons).toFixed(1));
      const expMoist = Number(((qKorba * korba.moisture + qTalcher * talcher.moisture) / totalTons).toFixed(1));

      const qualityPassed = expGcv >= requiredGcv && expAsh <= maxAsh && expMoist <= maxMoisture;

      bestPlan = {
        isFeasible: qualityPassed,
        allocations: [
          { mine: korba.mine, seam: korba.seam, tons: qKorba, percentage: Math.round((qKorba / totalTons) * 100) },
          { mine: talcher.mine, seam: talcher.seam, tons: qTalcher, percentage: Math.round((qTalcher / totalTons) * 100) }
        ],
        totalQuantity: totalTons,
        expectedGcv: expGcv,
        expectedAsh: expAsh,
        expectedMoisture: expMoist,
        statusText: qualityPassed ? 'Ready for Dispatch' : 'Review Required',
        statusExplanation: qualityPassed 
          ? 'All quality parameters and stock requirements are fulfilled.'
          : expGcv < requiredGcv
          ? `Expected GCV (${expGcv} kcal/kg) falls below required target (${requiredGcv} kcal/kg).`
          : expAsh > maxAsh
          ? `Expected Ash (${expAsh}%) exceeds maximum limit (${maxAsh}%).`
          : `Expected Moisture (${expMoist}%) exceeds maximum limit (${maxMoisture}%).`
      };
    }

    return bestPlan;
  }, [requiredQuantity, requiredGcv, maxAsh, maxMoisture]);

  // Animated sequential workflow execution
  const handleCreateDispatchPlan = () => {
    if (loading) return;

    setLoading(true);
    setHasCalculated(false);
    setActiveTimelineStep(1);
    setPlanningStageText('Step 1/5: Validating destination & quality parameters...');

    setTimeout(() => {
      setActiveTimelineStep(2);
      setPlanningStageText('Step 2/5: Scanning available pithead coal inventories...');
    }, 400);

    setTimeout(() => {
      setActiveTimelineStep(3);
      setPlanningStageText('Step 3/5: Checking AI-predicted GCV, Ash, and Moisture against limits...');
    }, 850);

    setTimeout(() => {
      setActiveTimelineStep(4);
      setPlanningStageText('Step 4/5: Calculating optimal seam volume allocations & tonnages...');
    }, 1300);

    setTimeout(() => {
      setActiveTimelineStep(5);
      setPlanningStageText('Step 5/5: All checks passed • Dispatch Plan Ready');
      setHasCalculated(true);
      setLoading(false);
    }, 1750);
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-cortex-dark">Dispatch Planning</h1>
        <p className="text-sm text-cortex-gray mt-1">
          Plan which coal to dispatch, from where, and in what quantity.
        </p>
      </div>

      {/* Animated Workflow Navigation Banner */}
      <div className="bg-white border border-cortex-border rounded-2xl p-4 shadow-sm flex flex-col gap-3 min-w-0 transition-all duration-300">
        <div className="flex items-center justify-between text-xs overflow-x-auto min-w-0 pb-1 gap-1">
          {timelineSteps.map((item, idx) => {
            const isCompleted = item.step < activeTimelineStep || (activeTimelineStep === 5 && !loading);
            const isCurrent = item.step === activeTimelineStep && loading;

            return (
              <React.Fragment key={item.step}>
                <div className={`flex items-center gap-2.5 shrink-0 transition-all duration-300 ${
                  isCurrent 
                    ? 'font-bold text-gold-900 scale-[1.02]' 
                    : isCompleted 
                    ? 'text-cortex-dark font-semibold' 
                    : 'text-cortex-gray opacity-60'
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gold-600 text-white ring-4 ring-gold-200 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-cortex-bg-secondary text-cortex-gray border border-cortex-border'
                  }`}>
                    {isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs leading-none whitespace-nowrap">{item.title}</span>
                    {isCurrent ? (
                      <span className="text-[10px] text-gold-700 font-semibold mt-1 flex items-center gap-1 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-600 animate-ping"></span>
                        Planning...
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] text-emerald-700 font-medium mt-1">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-cortex-gray mt-1">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {idx < timelineSteps.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-3 h-0.5 bg-cortex-border/70 min-w-[16px] relative overflow-hidden shrink-0">
                    <div 
                      className={`h-full bg-emerald-600 transition-all duration-500 ${
                        item.step < activeTimelineStep ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Progress Bar & Caption */}
        <div className="pt-2 border-t border-cortex-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${loading ? 'bg-gold-500 animate-ping' : 'bg-emerald-600'}`} />
            <span className="text-cortex-gray text-xs font-medium">
              {planningStageText}
            </span>
          </div>

          <div className="w-full sm:w-56 bg-cortex-bg-secondary h-1.5 rounded-full overflow-hidden border border-cortex-border/40">
            <div 
              className={`h-full transition-all duration-300 ${loading ? 'bg-gold-500' : 'bg-emerald-600'}`}
              style={{ width: `${(activeTimelineStep / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top 2 Columns: 1. Dispatch Requirement & 2. Available Coal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* 1. Dispatch Requirement Card */}
        <div className="lg:col-span-5 flex flex-col">
          <Card title="Dispatch Requirement" className="bg-white border border-cortex-border shadow-sm flex-1">
            <div className="space-y-3.5 pt-2">
              <div>
                <label className="text-xs font-semibold text-cortex-gray block mb-1">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    placeholder="Enter plant / destination"
                  />
                  <MapPin className="w-4 h-4 text-cortex-gray absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-cortex-gray block mb-1">
                    Required Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="500"
                      max="50000"
                      step="500"
                      value={requiredQuantity}
                      onChange={(e) => setRequiredQuantity(Math.max(100, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-cortex-gray pointer-events-none">tons</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cortex-gray block mb-1">
                    Dispatch Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dispatchDate}
                      onChange={(e) => setDispatchDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-semibold bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    />
                    <Calendar className="w-4 h-4 text-cortex-gray absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-cortex-gray block mb-1">
                    Required GCV
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="3500"
                      max="6500"
                      step="50"
                      value={requiredGcv}
                      onChange={(e) => setRequiredGcv(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    />
                    <span className="absolute right-2 top-2.5 text-[9px] text-cortex-gray pointer-events-none">kcal</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cortex-gray block mb-1">
                    Maximum Ash
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="45"
                      step="0.5"
                      value={maxAsh}
                      onChange={(e) => setMaxAsh(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    />
                    <span className="absolute right-2 top-2.5 text-[9px] text-cortex-gray pointer-events-none">%</span>
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
                      value={maxMoisture}
                      onChange={(e) => setMaxMoisture(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-sm font-semibold font-mono bg-cortex-bg-secondary border border-cortex-border rounded-xl text-cortex-dark outline-none focus:border-gold-500"
                    />
                    <span className="absolute right-2 top-2.5 text-[9px] text-cortex-gray pointer-events-none">%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleCreateDispatchPlan}
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-bold bg-gold-600 hover:bg-gold-500 text-white rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Planning Dispatch...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white" />
                      Create Dispatch Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Available Coal Card & Table */}
        <div className="lg:col-span-7 flex flex-col">
          <Card title="Available Coal" className="bg-white border border-cortex-border shadow-sm flex-1">
            <div className="pt-1">
              <p className="text-xs text-cortex-gray mb-3">
                Current pithead inventory and AI-predicted quality metrics for dispatch allocation.
              </p>
              <div className="overflow-x-auto min-w-0">
                <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-cortex-border text-cortex-gray font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Mine</th>
                      <th className="py-2.5 px-3">Seam</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">GCV</th>
                      <th className="py-2.5 px-3">Ash</th>
                      <th className="py-2.5 px-3">Moisture</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cortex-border/40 font-mono text-cortex-dark">
                    {inventoryWithSuitability.map((item, idx) => (
                      <tr key={idx} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                        <td className="py-2.5 px-3 font-medium font-sans text-cortex-dark">{item.mine}</td>
                        <td className="py-2.5 px-3 text-cortex-gray font-sans">{item.seam}</td>
                        <td className="py-2.5 px-3 font-semibold">{item.quantity.toLocaleString()} t</td>
                        <td className="py-2.5 px-3 font-semibold">{item.predictedGcv.toLocaleString()}</td>
                        <td className="py-2.5 px-3">{item.ash}%</td>
                        <td className="py-2.5 px-3">{item.moisture}%</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Suitable'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Loading In-Progress Card */}
      {loading && (
        <Card title="Planning Dispatch in Progress..." className="bg-white border border-gold-200 shadow-sm text-center py-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-gold-200 border-t-gold-600 animate-spin" />
              <Truck className="w-5 h-5 text-gold-600 absolute inset-0 m-auto" />
            </div>
            <div>
              <span className="text-sm font-bold text-cortex-dark block">{planningStageText}</span>
              <p className="text-xs text-cortex-gray mt-1">
                Running optimization over pithead seam capacities, AI-predicted calorific targets, and moisture constraints.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 5. Dispatch Summary (4 Small KPI Cards) */}
      {!loading && hasCalculated && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider block">
              Total Quantity
            </span>
            <span className="text-xl font-bold font-mono text-cortex-dark mt-1 block">
              {planResult.totalQuantity.toLocaleString()} tons
            </span>
          </div>

          <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider block">
              Expected GCV
            </span>
            <span className={`text-xl font-bold font-mono mt-1 block ${
              planResult.expectedGcv >= requiredGcv ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {planResult.expectedGcv ? `${planResult.expectedGcv.toLocaleString()} kcal/kg` : '—'}
            </span>
          </div>

          <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider block">
              Expected Ash
            </span>
            <span className={`text-xl font-bold font-mono mt-1 block ${
              planResult.expectedAsh <= maxAsh ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {planResult.expectedAsh ? `${planResult.expectedAsh}%` : '—'}
            </span>
          </div>

          <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-cortex-gray uppercase tracking-wider block">
              Quality Status
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {planResult.isFeasible ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-emerald-700">Meets Requirement</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-bold text-amber-700">Review Required</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4 & 6. Recommended Dispatch & Status Card */}
      {!loading && hasCalculated && (
        <Card title="Recommended Dispatch" className="bg-white border border-cortex-border shadow-sm animate-in fade-in duration-300">
          <div className="space-y-5 pt-1">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              planResult.isFeasible 
                ? 'bg-emerald-50/50 border-emerald-200' 
                : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                {planResult.isFeasible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className={`text-sm font-bold block ${
                    planResult.isFeasible ? 'text-emerald-900' : 'text-amber-900'
                  }`}>
                    {planResult.statusText}
                  </span>
                  <span className="text-xs text-cortex-gray mt-0.5 block">
                    {planResult.statusExplanation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-cortex-dark">
                <Truck className="w-4 h-4 text-gold-600" />
                <span>Dispatch to {destination}</span>
              </div>
            </div>

            {/* Source Breakdown Table & Bar */}
            {planResult.isFeasible && planResult.allocations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cortex-gray">
                  Allocated Coal Sources ({planResult.allocations.length} {planResult.allocations.length === 1 ? 'Source' : 'Sources'})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {planResult.allocations.map((alloc, idx) => (
                    <div key={idx} className="p-3.5 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-bold text-cortex-dark">
                          {alloc.mine} <span className="text-xs font-normal text-cortex-gray">({alloc.seam})</span>
                        </span>
                        <span className="text-xs font-bold text-gold-900 font-mono">
                          {alloc.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-cortex-border/50 h-2 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-gold-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${alloc.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs text-cortex-gray">
                        <span>Dispatch Volume:</span>
                        <span className="font-bold font-mono text-cortex-dark">{alloc.tons.toLocaleString()} tons</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Specifications Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-cortex-border/50 text-xs">
                  <div>
                    <span className="text-cortex-gray block text-[10px] uppercase font-semibold">Total Tonnage</span>
                    <span className="font-bold text-cortex-dark font-mono text-sm">{planResult.totalQuantity.toLocaleString()} t</span>
                  </div>
                  <div>
                    <span className="text-cortex-gray block text-[10px] uppercase font-semibold">Expected GCV</span>
                    <span className="font-bold text-cortex-dark font-mono text-sm">{planResult.expectedGcv.toLocaleString()} kcal/kg</span>
                  </div>
                  <div>
                    <span className="text-cortex-gray block text-[10px] uppercase font-semibold">Expected Ash</span>
                    <span className="font-bold text-cortex-dark font-mono text-sm">{planResult.expectedAsh}%</span>
                  </div>
                  <div>
                    <span className="text-cortex-gray block text-[10px] uppercase font-semibold">Expected Moisture</span>
                    <span className="font-bold text-cortex-dark font-mono text-sm">{planResult.expectedMoisture}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DispatchPlanning;
