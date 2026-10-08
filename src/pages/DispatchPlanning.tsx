import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Calendar, 
  MapPin, 
  Layers, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';

interface AvailableCoalSource {
  id: string;
  mine: string;
  seam: string;
  quantity: number;
  predictedGcv: number;
  ash: number;
  moisture: number;
}

const AVAILABLE_COAL_INVENTORY: AvailableCoalSource[] = [
  {
    id: 'talcher-v',
    mine: 'Talcher',
    seam: 'Seam-V',
    quantity: 8000,
    predictedGcv: 4850,
    ash: 28.4,
    moisture: 8.2
  },
  {
    id: 'korba-ii',
    mine: 'Korba',
    seam: 'Seam-II',
    quantity: 6000,
    predictedGcv: 5120,
    ash: 23.1,
    moisture: 6.4
  },
  {
    id: 'singrauli-iii',
    mine: 'Singrauli',
    seam: 'Seam-III',
    quantity: 5000,
    predictedGcv: 4620,
    ash: 31.2,
    moisture: 9.1
  }
];

export const DispatchPlanning: React.FC = () => {
  // 1. Dispatch Requirements State
  const [destination, setDestination] = useState<string>('NTPC Power Plant');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(10000);
  const [requiredGcv, setRequiredGcv] = useState<number>(4800);
  const [maxAsh, setMaxAsh] = useState<number>(30.0);
  const [maxMoisture, setMaxMoisture] = useState<number>(10.0);
  const [dispatchDate, setDispatchDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('High');

  // 8. Logistics State
  const [dispatchLocation, setDispatchLocation] = useState<string>('Talcher Central Railway Siding');
  const [transportMode, setTransportMode] = useState<'Road' | 'Rail' | 'Conveyor'>('Rail');
  const [estimatedDistance, setEstimatedDistance] = useState<number>(145);
  const [plannedDispatchTime, setPlannedDispatchTime] = useState<string>('06:30 hrs (Shift 1)');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Available Coal Suitability evaluation
  const availableCoalWithStatus = useMemo(() => {
    return AVAILABLE_COAL_INVENTORY.map((item) => {
      const gcvOk = item.predictedGcv >= requiredGcv;
      const ashOk = item.ash <= maxAsh;
      const moistOk = item.moisture <= maxMoisture;

      let statusText: 'Suitable' | 'Review' | 'Exceeds Limit' = 'Suitable';
      if (!gcvOk || !ashOk || !moistOk) {
        if (item.ash > maxAsh + 1.0 || item.predictedGcv < requiredGcv - 150) {
          statusText = 'Review';
        } else {
          statusText = 'Review';
        }
      }
      return {
        ...item,
        status: statusText,
        gcvOk,
        ashOk,
        moistOk
      };
    });
  }, [requiredGcv, maxAsh, maxMoisture]);

  // Dispatch Allocation Calculation Algorithm
  // Allocates coal from available sources to satisfy target quantity & quality
  const dispatchPlan = useMemo(() => {
    const totalAvail = AVAILABLE_COAL_INVENTORY.reduce((sum, s) => sum + s.quantity, 0);

    // Default allocation scenario matching standard requirements (e.g. 10000 tonnes: 6000 Talcher + 4000 Korba)
    let talcherTons = 0;
    let korbaTons = 0;
    let singrauliTons = 0;

    if (requiredQuantity <= 8000 && requiredGcv <= 4850) {
      talcherTons = requiredQuantity;
    } else if (requiredQuantity <= 10000) {
      talcherTons = Math.min(6000, requiredQuantity * 0.6);
      korbaTons = requiredQuantity - talcherTons;
    } else {
      talcherTons = 8000;
      korbaTons = Math.min(6000, requiredQuantity - 8000);
      singrauliTons = Math.max(0, requiredQuantity - talcherTons - korbaTons);
    }

    const allocations = [
      {
        source: 'Talcher',
        mine: 'Talcher',
        seam: 'Seam-V',
        quantity: Math.round(talcherTons),
        gcv: 4850,
        ash: 28.4,
        moisture: 8.2,
        status: 'Suitable'
      },
      {
        source: 'Korba',
        mine: 'Korba',
        seam: 'Seam-II',
        quantity: Math.round(korbaTons),
        gcv: 5120,
        ash: 23.1,
        moisture: 6.4,
        status: 'Suitable'
      },
      ...(singrauliTons > 0 ? [{
        source: 'Singrauli',
        mine: 'Singrauli',
        seam: 'Seam-III',
        quantity: Math.round(singrauliTons),
        gcv: 4620,
        ash: 31.2,
        moisture: 9.1,
        status: 'Review'
      }] : [])
    ].filter(a => a.quantity > 0);

    const allocatedQuantity = allocations.reduce((sum, a) => sum + a.quantity, 0);

    let expectedGcv = 0;
    let expectedAsh = 0;
    let expectedMoisture = 0;

    if (allocatedQuantity > 0) {
      expectedGcv = Math.round(allocations.reduce((sum, a) => sum + a.quantity * a.gcv, 0) / allocatedQuantity);
      expectedAsh = Number((allocations.reduce((sum, a) => sum + a.quantity * a.ash, 0) / allocatedQuantity).toFixed(1));
      expectedMoisture = Number((allocations.reduce((sum, a) => sum + a.quantity * a.moisture, 0) / allocatedQuantity).toFixed(1));
    }

    // Quality check flags
    const gcvMet = expectedGcv >= requiredGcv;
    const ashMet = expectedAsh <= maxAsh;
    const moistureMet = expectedMoisture <= maxMoisture;
    const quantityMet = allocatedQuantity >= requiredQuantity;
    const isReady = gcvMet && ashMet && moistureMet && quantityMet;

    const failureReasons: string[] = [];
    if (!quantityMet) failureReasons.push(`Insufficient available tonnage (planned ${allocatedQuantity.toLocaleString()} t of required ${requiredQuantity.toLocaleString()} t)`);
    if (!gcvMet) failureReasons.push(`Expected GCV (${expectedGcv.toLocaleString()} kcal/kg) is below required ${requiredGcv.toLocaleString()} kcal/kg`);
    if (!ashMet) failureReasons.push(`Expected Ash (${expectedAsh}%) exceeds maximum limit of ${maxAsh}%`);
    if (!moistureMet) failureReasons.push(`Expected Moisture (${expectedMoisture}%) exceeds maximum limit of ${maxMoisture}%`);

    return {
      allocations,
      allocatedQuantity,
      expectedGcv,
      expectedAsh,
      expectedMoisture,
      gcvMet,
      ashMet,
      moistureMet,
      quantityMet,
      isReady,
      failureReason: failureReasons.join(' • ')
    };
  }, [requiredQuantity, requiredGcv, maxAsh, maxMoisture]);

  const handleCreateDispatchPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCalculated(true);
      const resEl = document.getElementById('recommended-dispatch-section');
      if (resEl) resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Dispatch Logistics &amp; Allocation</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Dispatch Planning</h2>
          <p className="text-xs text-cortex-gray mt-0.5">
            What coal should be dispatched, from where, and in what quantity while meeting destination quality requirements.
          </p>
        </div>
        <div className="text-xs text-cortex-gray bg-white border border-cortex-border px-3 py-1.5 rounded-lg shadow-sm">
          <span>Allocation Engine: </span>
          <span className="font-semibold text-emerald-700">CIL Inventory Calibrated</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Form & Available Inventory Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================================================================= */}
        {/* 1. DISPATCH REQUIREMENTS                                         */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  1. Dispatch Requirements
                </h3>
                <p className="text-[11px] text-cortex-gray mt-0.5">
                  Define the quantity and quality requirements for the destination.
                </p>
              </div>
              <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Destination */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Destination *
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="">Select Destination</option>
                  <option value="NTPC Power Plant">NTPC Super Thermal Power Plant (Ramagundam)</option>
                  <option value="Mahagenco Thermal Plant">Mahagenco Chandrapur Thermal Power Station</option>
                  <option value="Hindalco Smelter">Hindalco Mahan Aluminium Smelter Unit</option>
                  <option value="Tata Steel Plant">Tata Steel Jamshedpur Works</option>
                  <option value="Vedanta Power Grid">Vedanta Jharsuguda Captive Power Plant</option>
                  <option value="Central Genco Silo">NTPC Korba Super Thermal Power Station</option>
                </select>
              </div>

              {/* Required Quantity */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Required Quantity (tonnes) *
                </label>
                <input
                  type="number"
                  step="500"
                  placeholder="e.g. 10000"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-bold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Required GCV */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Required GCV (kcal/kg) *
                </label>
                <input
                  type="number"
                  step="50"
                  placeholder="e.g. 4800"
                  value={requiredGcv}
                  onChange={(e) => setRequiredGcv(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-bold text-gold-900 bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Maximum Ash */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Maximum Ash (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 30"
                  value={maxAsh}
                  onChange={(e) => setMaxAsh(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Maximum Moisture */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Maximum Moisture (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 10"
                  value={maxMoisture}
                  onChange={(e) => setMaxMoisture(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Dispatch Date */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Dispatch Date *
                </label>
                <input
                  type="date"
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. CREATE DISPATCH PLAN BUTTON                                  */}
          {/* =============================================================== */}
          <div className="mt-5 pt-4 border-t border-cortex-border/60">
            <Button
              onClick={handleCreateDispatchPlan}
              disabled={isLoading || requiredQuantity <= 0}
              className="w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Dispatch Plan...</span>
                </>
              ) : (
                <>
                  <span>Create Dispatch Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. AVAILABLE COAL                                                 */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  2. Available Coal
                </h3>
                <p className="text-[11px] text-cortex-gray mt-0.5">
                  Coal currently available for dispatch.
                </p>
              </div>
              <Layers className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-cortex-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-cortex-bg-secondary/70 text-[10px] uppercase font-bold text-cortex-gray border-b border-cortex-border">
                  <tr>
                    <th className="py-2.5 px-3">Mine</th>
                    <th className="py-2.5 px-3">Seam</th>
                    <th className="py-2.5 px-3">Available Quantity</th>
                    <th className="py-2.5 px-3">Predicted GCV</th>
                    <th className="py-2.5 px-3">Ash</th>
                    <th className="py-2.5 px-3">Moisture</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/40 font-mono">
                  {availableCoalWithStatus.map((coal) => (
                    <tr key={coal.id} className="hover:bg-cortex-bg-secondary/30 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-cortex-dark">{coal.mine}</td>
                      <td className="py-3 px-3 text-cortex-gray">{coal.seam}</td>
                      <td className="py-3 px-3 font-semibold text-cortex-dark">{coal.quantity.toLocaleString()} t</td>
                      <td className="py-3 px-3 font-bold text-gold-900">{coal.predictedGcv.toLocaleString()}</td>
                      <td className="py-3 px-3">{coal.ash}%</td>
                      <td className="py-3 px-3">{coal.moisture}%</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          coal.status === 'Suitable'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {coal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Total Available Pithead Stock</span>
            <span className="font-mono font-bold text-cortex-dark">19,000 tonnes</span>
          </div>
        </div>

      </div>

      {/* Empty State when no plan is generated yet */}
      {!isCalculated && (
        <div className="bg-white border border-cortex-border border-dashed rounded-2xl p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-cortex-dark">No Dispatch Plan Generated Yet</h4>
          <p className="text-xs text-cortex-gray max-w-md mt-1">
            Specify your destination requirements and click <strong>"Create Dispatch Plan"</strong> above to generate the optimal source allocation, quality check, and logistics routing.
          </p>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. RECOMMENDED DISPATCH (SECTIONS 4-8)                              */}
      {/* =================================================================== */}
      {isCalculated && (
        <div id="recommended-dispatch-section" className="flex flex-col gap-6 scroll-mt-6">
          
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cortex-border/60 pb-3 mb-5">
              <div>
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  4. Recommended Dispatch
                </h3>
                <p className="text-xs text-cortex-gray mt-0.5">
                  Optimal source blend allocated to meet <strong className="text-cortex-dark">{destination}</strong> requirements.
                </p>
              </div>
              <div className="text-xs text-cortex-gray">
                Priority: <strong className="text-gold-900">{priority}</strong>
              </div>
            </div>

            {/* Selected Sources Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {dispatchPlan.allocations.map((alloc) => (
                <div 
                  key={alloc.mine}
                  className="p-3.5 bg-cortex-bg-secondary/50 border border-cortex-border rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-cortex-dark block">{alloc.mine} — {alloc.seam}</span>
                    <span className="text-[10px] text-cortex-gray">GCV {alloc.gcv} • Ash {alloc.ash}%</span>
                  </div>
                  <span className="text-base font-extrabold font-mono text-gold-900">
                    {alloc.quantity.toLocaleString()} tonnes
                  </span>
                </div>
              ))}
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                  Total Quantity
                </span>
                <div className="text-2xl font-extrabold font-mono text-cortex-dark mt-1">
                  {dispatchPlan.allocatedQuantity.toLocaleString()} <span className="text-xs font-sans text-cortex-gray font-normal">tonnes</span>
                </div>
                <span className="text-[10px] text-cortex-gray mt-1 block">Required: {requiredQuantity.toLocaleString()} t</span>
              </div>

              <div className="p-4 bg-gold-50/40 border border-gold-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-900 block">
                  Expected GCV
                </span>
                <div className="text-2xl font-extrabold font-mono text-gold-950 mt-1">
                  {dispatchPlan.expectedGcv.toLocaleString()} <span className="text-xs font-sans text-gold-800 font-normal">kcal/kg</span>
                </div>
                <span className="text-[10px] text-gold-700 mt-1 block">Target: ≥ {requiredGcv.toLocaleString()} kcal/kg</span>
              </div>

              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                  Expected Ash
                </span>
                <div className="text-2xl font-extrabold font-mono text-cortex-dark mt-1">
                  {dispatchPlan.expectedAsh}%
                </div>
                <span className="text-[10px] text-cortex-gray mt-1 block">Ceiling: ≤ {maxAsh}%</span>
              </div>

              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block">
                  Expected Moisture
                </span>
                <div className="text-2xl font-extrabold font-mono text-cortex-dark mt-1">
                  {dispatchPlan.expectedMoisture}%
                </div>
                <span className="text-[10px] text-cortex-gray mt-1 block">Ceiling: ≤ {maxMoisture}%</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 5. DISPATCH ALLOCATION                                          */}
          {/* =============================================================== */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="border-b border-cortex-border/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                5. Dispatch Allocation
              </h3>
              <p className="text-xs text-cortex-gray mt-0.5">
                Exact seam quantities and expected proximate specifications.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-cortex-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-cortex-bg-secondary/70 text-[10px] uppercase font-bold text-cortex-gray border-b border-cortex-border">
                  <tr>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 px-3">Mine</th>
                    <th className="py-2.5 px-3">Seam</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Expected GCV</th>
                    <th className="py-2.5 px-3">Ash</th>
                    <th className="py-2.5 px-3">Moisture</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/40 font-mono">
                  {dispatchPlan.allocations.map((alloc) => (
                    <tr key={alloc.mine} className="hover:bg-cortex-bg-secondary/20 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-cortex-dark">{alloc.source}</td>
                      <td className="py-3 px-3 font-sans text-cortex-dark">{alloc.mine}</td>
                      <td className="py-3 px-3 text-cortex-gray">{alloc.seam}</td>
                      <td className="py-3 px-3 font-bold text-cortex-dark">{alloc.quantity.toLocaleString()} t</td>
                      <td className="py-3 px-3 font-bold text-gold-900">{alloc.gcv.toLocaleString()}</td>
                      <td className="py-3 px-3">{alloc.ash}%</td>
                      <td className="py-3 px-3">{alloc.moisture}%</td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {alloc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* TOTAL ROW */}
                  <tr className="bg-cortex-bg-secondary/60 font-bold border-t-2 border-cortex-border text-cortex-dark">
                    <td className="py-3 px-3 uppercase text-[10px] tracking-wider text-cortex-gray">TOTAL</td>
                    <td className="py-3 px-3">—</td>
                    <td className="py-3 px-3">—</td>
                    <td className="py-3 px-3 text-gold-950 font-extrabold">{dispatchPlan.allocatedQuantity.toLocaleString()} t</td>
                    <td className="py-3 px-3 text-gold-900 font-extrabold">{dispatchPlan.expectedGcv.toLocaleString()}</td>
                    <td className="py-3 px-3">{dispatchPlan.expectedAsh}%</td>
                    <td className="py-3 px-3">{dispatchPlan.expectedMoisture}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        dispatchPlan.isReady 
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {dispatchPlan.isReady ? 'Matched' : 'Variance'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 6. DISPATCH QUALITY CHECK                                       */}
          {/* =============================================================== */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="border-b border-cortex-border/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                6. Dispatch Quality Check
              </h3>
              <p className="text-xs text-cortex-gray mt-0.5">
                Verification of allocated blend against destination contractual quality thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* GCV Check */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                dispatchPlan.gcvMet ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cortex-dark">GCV</span>
                    {dispatchPlan.gcvMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-cortex-gray block mt-2">Required: {requiredGcv.toLocaleString()} kcal/kg</span>
                  <span className="text-sm font-bold font-mono text-cortex-dark block mt-0.5">
                    Expected: {dispatchPlan.expectedGcv.toLocaleString()} kcal/kg
                  </span>
                </div>
                <div className={`text-[11px] font-bold mt-3 ${dispatchPlan.gcvMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dispatchPlan.gcvMet ? '✓ GCV Requirement Met' : '✗ Below Target'}
                </div>
              </div>

              {/* Ash Check */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                dispatchPlan.ashMet ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cortex-dark">Ash</span>
                    {dispatchPlan.ashMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-cortex-gray block mt-2">Maximum: {maxAsh}%</span>
                  <span className="text-sm font-bold font-mono text-cortex-dark block mt-0.5">
                    Expected: {dispatchPlan.expectedAsh}%
                  </span>
                </div>
                <div className={`text-[11px] font-bold mt-3 ${dispatchPlan.ashMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dispatchPlan.ashMet ? '✓ Ash Within Limit' : '✗ Exceeds Maximum'}
                </div>
              </div>

              {/* Moisture Check */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                dispatchPlan.moistureMet ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cortex-dark">Moisture</span>
                    {dispatchPlan.moistureMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-cortex-gray block mt-2">Maximum: {maxMoisture}%</span>
                  <span className="text-sm font-bold font-mono text-cortex-dark block mt-0.5">
                    Expected: {dispatchPlan.expectedMoisture}%
                  </span>
                </div>
                <div className={`text-[11px] font-bold mt-3 ${dispatchPlan.moistureMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dispatchPlan.moistureMet ? '✓ Moisture Within Limit' : '✗ Exceeds Maximum'}
                </div>
              </div>

              {/* Quantity Check */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                dispatchPlan.quantityMet ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cortex-dark">Quantity</span>
                    {dispatchPlan.quantityMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-cortex-gray block mt-2">Required: {requiredQuantity.toLocaleString()} tonnes</span>
                  <span className="text-sm font-bold font-mono text-cortex-dark block mt-0.5">
                    Planned: {dispatchPlan.allocatedQuantity.toLocaleString()} tonnes
                  </span>
                </div>
                <div className={`text-[11px] font-bold mt-3 ${dispatchPlan.quantityMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dispatchPlan.quantityMet ? '✓ Quantity Requirement Met' : '✗ Quantity Deficit'}
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 7. FINAL DISPATCH DECISION (MOST PROMINENT SECTION)             */}
          {/* =============================================================== */}
          <div className={`rounded-2xl p-6 shadow-premium border ${
            dispatchPlan.isReady 
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  dispatchPlan.isReady 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                    : 'bg-amber-100 border-amber-300 text-amber-800'
                }`}>
                  {dispatchPlan.isReady ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <AlertTriangle className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">
                    7. Final Dispatch Decision
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                    {dispatchPlan.isReady ? 'READY FOR DISPATCH' : 'REVIEW REQUIRED'}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90 max-w-2xl">
                    {dispatchPlan.isReady 
                      ? 'Recommended coal meets the required quantity and quality specifications.' 
                      : dispatchPlan.failureReason || 'Dispatch constraints currently not satisfied.'}
                  </p>
                </div>
              </div>

              <div className="self-stretch sm:self-auto shrink-0 flex items-center gap-2">
                <span className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wide border shadow-sm ${
                  dispatchPlan.isReady 
                    ? 'bg-emerald-600 text-white border-emerald-700' 
                    : 'bg-amber-600 text-white border-amber-700'
                }`}>
                  {dispatchPlan.isReady ? 'Approved' : 'Action Needed'}
                </span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 8. DISPATCH LOGISTICS                                           */}
          {/* =============================================================== */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  8. Dispatch Logistics
                </h3>
                <p className="text-xs text-cortex-gray mt-0.5">
                  Transportation routing, distance, and planned rake movement.
                </p>
              </div>
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Dispatch Location */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Dispatch Location
                </label>
                <input
                  type="text"
                  value={dispatchLocation}
                  onChange={(e) => setDispatchLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:border-gold-500"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  disabled
                  value={destination}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-gray bg-cortex-bg-secondary/60 cursor-not-allowed"
                />
              </div>

              {/* Transport Mode */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Transport Mode
                </label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value as any)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:border-gold-500"
                >
                  <option value="Rail">Rail (Indian Railways Rakes)</option>
                  <option value="Road">Road (Heavy Dump Hauler Fleet)</option>
                  <option value="Conveyor">Conveyor (Merry-Go-Round MGR)</option>
                </select>
              </div>

              {/* Estimated Distance */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Estimated Distance (km)
                </label>
                <input
                  type="number"
                  value={estimatedDistance}
                  onChange={(e) => setEstimatedDistance(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-bold text-cortex-dark bg-white outline-none focus:border-gold-500"
                />
              </div>

              {/* Planned Dispatch Time */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Planned Dispatch Time
                </label>
                <input
                  type="text"
                  value={plannedDispatchTime}
                  onChange={(e) => setPlannedDispatchTime(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default DispatchPlanning;
