import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { predictionApi } from '../api/predictions';
import { laboratoryApi, type VerificationRequest, type LabResultResponse } from '../api/laboratory';
import { SAMPLE_PRESETS } from '../constants/mockData';
import type { CoalSample } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Database, RefreshCw, ArrowRight } from 'lucide-react';

export const Laboratory: React.FC = () => {
  const navigate = useNavigate();
  const { setLastPrediction, setCurrentSample, setIsLoading, showToast } = useApp();
  
  // Tab state: 'input' or 'verification'
  const [activeTab, setActiveTab] = useState<'input' | 'verification'>('input');

  // Verification queue states
  const [pendingRequests, setPendingRequests] = useState<VerificationRequest[]>([]);
  const [labHistory, setLabHistory] = useState<LabResultResponse[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  // Modal submission state
  const [actualGcv, setActualGcv] = useState<number>(5000);
  const [actualAsh, setActualAsh] = useState<number>(24.0);
  const [actualMoisture, setActualMoisture] = useState<number>(5.5);
  const [actualVm, setActualVm] = useState<number>(26.0);
  const [actualFc, setActualFc] = useState<number>(44.5);
  const [submittingResult, setSubmittingResult] = useState(false);

  // Set up react-hook-form for sample telemetry input
  const { register, handleSubmit, setValue, watch } = useForm<CoalSample>({
    defaultValues: {
      sampleId: `CCX-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      mineName: 'Gevra Mega Project',
      coalfield: 'Korba',
      state: 'Chhattisgarh',
      moisture: 7.5,
      ash: 28.5,
      volatileMatter: 24.1,
      fixedCarbon: 39.9,
      sulphur: 0.61,
      carbon: 49.5,
      hydrogen: 3.7,
      nitrogen: 0.8,
      oxygen: 45.39,
      latitude: 22.35,
      longitude: 82.60
    }
  });

  const selectedPresetName = watch('mineName');

  const fetchVerificationQueue = async () => {
    setLoadingQueue(true);
    try {
      const [pending, history] = await Promise.all([
        laboratoryApi.getPending(),
        laboratoryApi.getHistory()
      ]);
      setPendingRequests(pending);
      setLabHistory(history);
    } catch (err) {
      console.error('Error fetching lab verification queue:', err);
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'verification') {
      fetchVerificationQueue();
    }
  }, [activeTab]);

  const handleLoadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setValue('mineName', preset.mineName);
    setValue('coalfield', preset.coalfield);
    setValue('state', preset.state);
    setValue('moisture', preset.moisture);
    setValue('ash', preset.ash);
    setValue('volatileMatter', preset.volatileMatter);
    setValue('fixedCarbon', preset.fixedCarbon);
    setValue('sulphur', preset.sulphur);
    setValue('carbon', preset.carbon);
    setValue('hydrogen', preset.hydrogen);
    setValue('nitrogen', preset.nitrogen);
    setValue('oxygen', preset.oxygen);
    setValue('latitude', preset.latitude);
    setValue('longitude', preset.longitude);
  };

  const onSubmitSample = async (data: CoalSample) => {
    setIsLoading(true);
    setCurrentSample(data);
    try {
      const payload = {
        sample_code: data.sampleId,
        mine_name: data.mineName || 'Gevra Mega Project',
        seam: 'Seam-IV',
        depth: 135.0,
        coalfield: data.coalfield || 'Korba',
        state: data.state || 'Chhattisgarh',
        latitude: data.latitude,
        longitude: data.longitude,
        moisture: Number(data.moisture),
        ash: Number(data.ash),
        volatile_matter: Number(data.volatileMatter),
        fixed_carbon: Number(data.fixedCarbon),
        sulphur: Number(data.sulphur),
        geological_features: {
          seam_thickness: 7.8,
          overburden_thickness: 100.0,
          geological_strata_density: 2.35,
          core_recovery_rate: 93.5,
          sandstone_shale_ratio: 1.8
        },
        production_features: {
          drilling_rate_index: 28.0,
          cutting_resistance_index: 46.0
        },
        sensor_features: {
          spectral_gamma_ray: 80.0,
          spectral_resistivity: 140.0,
          optical_reflectance: 0.94,
          density_bulk: 1.49
        }
      };

      const result = await predictionApi.createPrediction(payload);
      setLastPrediction(result);
      showToast('ML inference calculated successfully.', 'success');
      navigate('/prediction');
    } catch (err: any) {
      console.error('Prediction API error:', err);
      showToast('Inference error: ' + (err.response?.data?.detail || err.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSubmission = (req: VerificationRequest) => {
    setSelectedRequest(req);
    setActualGcv(req.predicted_gcv);
    setActualAsh(req.predicted_ash);
    setActualMoisture(6.0);
    setActualVm(25.0);
    setActualFc(Math.max(10, 100 - (req.predicted_ash + 6.0 + 25.0)));
  };

  const handleSubmitLabResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSubmittingResult(true);
    try {
      const res = await laboratoryApi.submitResults({
        request_id: selectedRequest.request_id,
        prediction_id: selectedRequest.prediction_id,
        sample_id: selectedRequest.sample_id,
        actual_gcv: Number(actualGcv),
        actual_ash: Number(actualAsh),
        actual_moisture: Number(actualMoisture),
        actual_vm: Number(actualVm),
        actual_fixed_carbon: Number(actualFc),
        technician_notes: 'Bomb calorimeter verification completed.'
      });

      showToast(`Laboratory result verified: GCV error = ${res.gcv_absolute_error} kcal/kg (${res.gcv_percentage_error}%)`, 'success');
      setSelectedRequest(null);
      await fetchVerificationQueue();
    } catch (err: any) {
      console.error('Failed to submit lab results:', err);
      showToast('Submission error: ' + (err.response?.data?.detail || err.message), 'error');
    } finally {
      setSubmittingResult(false);
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Page Title header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Analytical & Calibration Hub</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Laboratory Telemetry & Verification Node</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-cortex-bg-secondary p-1 rounded-xl border border-cortex-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'input'
                ? 'bg-white text-gold-900 font-bold shadow-sm'
                : 'text-cortex-gray hover:text-cortex-dark'
            }`}
          >
            Telemetry Input
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-white text-gold-900 font-bold shadow-sm'
                : 'text-cortex-gray hover:text-cortex-dark'
            }`}
          >
            <span>Verification Queue</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-mono">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'input' ? (
        <>
          {/* Preset Card selection */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray mb-3.5 block">
              Select Standard Mineral Preset Template
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SAMPLE_PRESETS.map((p) => {
                const isSelected = selectedPresetName === p.mineName;
                return (
                  <div
                    key={p.name}
                    onClick={() => handleLoadPreset(p)}
                    className={`p-3 border rounded-xl cursor-pointer text-xs transition-all shadow-sm ${
                      isSelected 
                        ? 'border-gold-500 bg-gold-50/20 ring-1 ring-gold-500' 
                        : 'border-cortex-border bg-white hover:border-gold-500/30'
                    }`}
                  >
                    <div className="font-bold text-cortex-dark">{p.name}</div>
                    <div className="text-[10px] text-cortex-gray mt-1">{p.coalfield} field, {p.state}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitSample)} className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Left column - laboratory form fields */}
            <div className="xl:col-span-8 min-w-0 flex flex-col gap-6 bg-white border border-cortex-border rounded-2xl p-5 sm:p-6 shadow-premium">
              <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50 mb-2">
                <Database className="w-5 h-5 text-gold-500 shrink-0" />
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  Proximate & Ultimate Physical Telemetry
                </h3>
              </div>

              {/* Metadata Section */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
                  Geographical Metadata
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="Sample ID" {...register('sampleId')} />
                  <Input label="Mine / Project" {...register('mineName')} />
                  <Input label="Coalfield Basin" {...register('coalfield')} />
                  <Input label="State Region" {...register('state')} />
                </div>
              </div>

              {/* Proximate Analysis Section */}
              <div className="border-t border-cortex-border/50 pt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
                  Proximate Chemical Analysis (%)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Input label="Moisture (%)" type="number" step="0.1" {...register('moisture')} />
                  <Input label="Ash Content (%)" type="number" step="0.1" {...register('ash')} />
                  <Input label="Volatile Matter (%)" type="number" step="0.1" {...register('volatileMatter')} />
                  <Input label="Fixed Carbon (%)" type="number" step="0.1" {...register('fixedCarbon')} />
                </div>
              </div>

              {/* Geological Wireline Section */}
              <div className="border-t border-cortex-border/50 pt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
                  Geological & Drill Core Mechanics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Input label="Borehole Depth (m)" type="number" step="0.5" defaultValue={135.0} />
                  <Input label="Strata Density (g/cm³)" type="number" step="0.01" defaultValue={2.35} />
                  <Input label="Core Recovery (%)" type="number" step="0.1" defaultValue={93.5} />
                  <Input label="Drilling Rate Index" type="number" step="0.1" defaultValue={28.0} />
                </div>
              </div>

              <div className="pt-4 border-t border-cortex-border/50 flex justify-end">
                <Button type="submit" className="flex items-center gap-2 font-bold px-6 py-2.5">
                  <span>Execute ML Model Inference</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right column - Operational Guide */}
            <div className="xl:col-span-4 min-w-0 flex flex-col gap-6">
              <Card title="ATDIF Verification Protocol" className="shadow-premium min-w-0">
                <p className="text-xs text-cortex-gray leading-relaxed mb-4">
                  CarbonCortex enforces the <strong className="text-cortex-dark">Adaptive Trust Decision Intelligence Framework (ATDIF)</strong>.
                </p>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl">
                    <span className="font-bold block text-[10px] uppercase">Confidence ≥ 85%</span>
                    <span>Direct decision support authorized. Grade and dispatch advice compiled instantly.</span>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                    <span className="font-bold block text-[10px] uppercase">Confidence &lt; 85%</span>
                    <span>Routed to Laboratory Verification Queue. Actual calorimeter audit required before dispatch.</span>
                  </div>
                </div>
              </Card>
            </div>
          </form>
        </>
      ) : (
        /* Laboratory Verification Queue View */
        <div className="flex flex-col gap-6 flex-1 min-h-0">
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-cortex-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cortex-dark">
                Pending Verification Requests ({pendingRequests.length})
              </span>
              <p className="text-[11px] text-cortex-gray mt-0.5">
                Low-confidence predictions awaiting physical bomb calorimeter testing.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchVerificationQueue} disabled={loadingQueue} className="shrink-0">
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingQueue ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </Button>
          </div>

          {/* Pending Table */}
          <Card title="Pending Lab Queue" className="shadow-premium min-w-0">
            {pendingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-cortex-gray">
                No pending laboratory verification requests. All inferences are within high-confidence bounds.
              </div>
            ) : (
              <div className="overflow-x-auto min-w-0">
                <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Request ID</th>
                      <th className="py-2.5 px-3">Sample Code</th>
                      <th className="py-2.5 px-3">Mine Name</th>
                      <th className="py-2.5 px-3">Predicted GCV</th>
                      <th className="py-2.5 px-3">Predicted Ash</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cortex-border/40 font-mono">
                    {pendingRequests.map((req) => (
                      <tr key={req.request_id} className="hover:bg-cortex-bg-secondary/40">
                        <td className="py-3 px-3 font-bold text-cortex-dark">{req.request_id}</td>
                        <td className="py-3 px-3">{req.sample_code}</td>
                        <td className="py-3 px-3 font-sans font-semibold text-cortex-dark">{req.mine_name}</td>
                        <td className="py-3 px-3 font-bold text-gold-900">{req.predicted_gcv} kcal/kg</td>
                        <td className="py-3 px-3">{req.predicted_ash}%</td>
                        <td className="py-3 px-3 text-amber-700 font-bold">{req.confidence}%</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Button
                            size="sm"
                            onClick={() => handleOpenSubmission(req)}
                            className="font-bold text-[10px] py-1 px-3"
                          >
                            Submit Lab Result
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Submission Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white border border-cortex-border rounded-2xl shadow-premium p-6 max-w-lg w-full text-left my-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start pb-3 border-b border-cortex-border mb-4">
                  <div>
                    <h3 className="font-bold text-cortex-dark text-base">Enter Physical Bomb Calorimeter Results</h3>
                    <span className="text-xs text-cortex-gray font-mono">Sample: {selectedRequest.sample_code} ({selectedRequest.mine_name})</span>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-700">✕</button>
                </div>

                <form onSubmit={handleSubmitLabResult} className="flex flex-col gap-4 text-xs">
                  <div className="p-3 bg-gold-50/30 rounded-xl border border-gold-200 text-gold-900 flex justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-700 block">AI Predicted GCV</span>
                      <span className="font-mono font-bold text-sm">{selectedRequest.predicted_gcv} kcal/kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-700 block">AI Predicted Ash</span>
                      <span className="font-mono font-bold text-sm">{selectedRequest.predicted_ash}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Actual GCV (kcal/kg)</label>
                      <input
                        type="number"
                        step="1"
                        value={actualGcv}
                        onChange={(e) => setActualGcv(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border rounded-xl font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Actual Ash (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={actualAsh}
                        onChange={(e) => setActualAsh(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Moisture (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={actualMoisture}
                        onChange={(e) => setActualMoisture(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Volatile Matter (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={actualVm}
                        onChange={(e) => setActualVm(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Fixed Carbon (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={actualFc}
                        onChange={(e) => setActualFc(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-3">
                    <Button variant="outline" size="sm" type="button" onClick={() => setSelectedRequest(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" type="submit" disabled={submittingResult} className="font-bold">
                      {submittingResult ? 'Submitting...' : 'Register Verified Result & Feedback'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Verified Lab History & Error Analysis */}
          <Card title="Prediction vs Actual Laboratory Reconciliation" className="shadow-premium min-w-0">
            <div className="overflow-x-auto min-w-0">
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Result ID</th>
                    <th className="py-2.5 px-3">Sample Code</th>
                    <th className="py-2.5 px-3">Predicted GCV</th>
                    <th className="py-2.5 px-3">Actual GCV</th>
                    <th className="py-2.5 px-3">Absolute Error</th>
                    <th className="py-2.5 px-3">Percentage Error</th>
                    <th className="py-2.5 px-3">Feedback Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/40 font-mono">
                  {labHistory.map((h) => (
                    <tr key={h.result_id} className="hover:bg-cortex-bg-secondary/40">
                      <td className="py-2.5 px-3 font-bold text-cortex-dark">{h.result_id}</td>
                      <td className="py-2.5 px-3">{h.sample_code}</td>
                      <td className="py-2.5 px-3">{h.predicted_values?.gcv || 0} kcal/kg</td>
                      <td className="py-2.5 px-3 font-bold text-gold-900">{h.actual_values?.gcv || 0} kcal/kg</td>
                      <td className="py-2.5 px-3">{h.gcv_absolute_error} kcal/kg</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{h.gcv_percentage_error}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          RETRAINING FEEDBACK REGISTERED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Laboratory;
