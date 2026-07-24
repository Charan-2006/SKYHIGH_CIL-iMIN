import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { SAMPLE_PRESETS } from '../constants/mockData';
import type { CoalSample } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Database, Link2, Wifi, Activity } from 'lucide-react';

export const Laboratory: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentSample, setIsLoading } = useApp();
  
  // Set up react-hook-form
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CoalSample>({
    defaultValues: {
      sampleId: `CCX-2026-${Math.floor(Math.random() * 900 + 100)}`,
      mineName: '',
      coalfield: '',
      state: 'Jharkhand',
      moisture: 3.5,
      ash: 15.0,
      volatileMatter: 30.0,
      fixedCarbon: 51.5,
      sulphur: 0.5,
      carbon: 72.0,
      hydrogen: 4.8,
      nitrogen: 1.2,
      oxygen: 21.5,
      latitude: 23.6,
      longitude: 86.2
    }
  });

  const selectedPresetName = watch('mineName');

  // Load a preset template into form values
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

  const onSubmit = (data: CoalSample) => {
    setCurrentSample(data);
    setIsLoading(true);
    navigate('/processing');
  };

  return (
    <div className="text-left select-none">
      {/* Page Title header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Analytical Engine</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Laboratory Telemetry Node</h2>
        </div>
        <div className="px-3 py-1 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs flex items-center gap-2 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Idle - Waiting for Sample Data</span>
        </div>
      </div>

      {/* Preset Card selection */}
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray mb-3.5 block">
          Select Standard Mineral Preset Template
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - laboratory form fields */}
        <div className="lg:col-span-8 flex flex-col gap-6 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
          <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50 mb-2">
            <Database className="w-5 h-5 text-gold-500" />
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
              <Input
                label="Sample ID"
                placeholder="CCX-2026-001"
                error={errors.sampleId?.message}
                {...register('sampleId', { required: 'Sample ID is required' })}
              />
              <Input
                label="Mine Name"
                placeholder="e.g. Moonidih UG"
                error={errors.mineName?.message}
                {...register('mineName', { required: 'Mine name is required' })}
              />
              <Input
                label="Coalfield"
                placeholder="e.g. Jharia"
                error={errors.coalfield?.message}
                {...register('coalfield', { required: 'Coalfield is required' })}
              />
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cortex-gray">State</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border border-cortex-border rounded-lg text-sm text-cortex-dark outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10"
                  {...register('state')}
                >
                  {['Jharkhand', 'Chhattisgarh', 'Odisha', 'West Bengal', 'Madhya Pradesh', 'Maharashtra', 'Assam'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Proximate Analysis Section */}
          <div className="border-t border-cortex-border/50 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
              Proximate Analysis (%)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Moisture (%)"
                type="number"
                step="0.01"
                error={errors.moisture?.message}
                {...register('moisture', { 
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 100, message: 'Max 100' }
                })}
              />
              <Input
                label="Ash Content (%)"
                type="number"
                step="0.01"
                error={errors.ash?.message}
                {...register('ash', { 
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 100, message: 'Max 100' }
                })}
              />
              <Input
                label="Volatile Matter (%)"
                type="number"
                step="0.01"
                error={errors.volatileMatter?.message}
                {...register('volatileMatter', { 
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 100, message: 'Max 100' }
                })}
              />
              <Input
                label="Fixed Carbon (%)"
                type="number"
                step="0.01"
                error={errors.fixedCarbon?.message}
                {...register('fixedCarbon', { 
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 100, message: 'Max 100' }
                })}
              />
            </div>
          </div>

          {/* Ultimate Analysis Section */}
          <div className="border-t border-cortex-border/50 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
              Ultimate Analysis (%)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Input
                label="Carbon (%)"
                type="number"
                step="0.01"
                error={errors.carbon?.message}
                {...register('carbon', { required: 'Required' })}
              />
              <Input
                label="Hydrogen (%)"
                type="number"
                step="0.01"
                error={errors.hydrogen?.message}
                {...register('hydrogen', { required: 'Required' })}
              />
              <Input
                label="Nitrogen (%)"
                type="number"
                step="0.01"
                error={errors.nitrogen?.message}
                {...register('nitrogen', { required: 'Required' })}
              />
              <Input
                label="Oxygen (%)"
                type="number"
                step="0.01"
                error={errors.oxygen?.message}
                {...register('oxygen', { required: 'Required' })}
              />
              <Input
                label="Sulphur (%)"
                type="number"
                step="0.01"
                error={errors.sulphur?.message}
                {...register('sulphur', { required: 'Required' })}
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="border-t border-cortex-border/50 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-4">
              Geographic Coordinates
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.0001"
                error={errors.latitude?.message}
                {...register('latitude', { required: 'Required' })}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.0001"
                error={errors.longitude?.message}
                {...register('longitude', { required: 'Required' })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-cortex-border/50 pt-6 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="font-bold flex items-center justify-center gap-2"
            >
              <span>Analyze Sample</span>
              <Activity className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right column - status panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card: Awaiting Neural Link */}
          <div className="bg-gradient-to-b from-white to-gold-50/5 border border-cortex-border rounded-2xl p-6 shadow-premium text-center flex flex-col items-center justify-center h-full min-h-[380px]">
            {/* Spinning/pulse radar graphic matching slide */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border border-gold-500/10 rounded-full border-dashed animate-pulse"></div>
              <div className="absolute inset-2 border border-gold-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border border-gold-500/20 rounded-full border-dashed"></div>
              <div className="w-16 h-16 bg-white border border-gold-200 rounded-full shadow-premium flex items-center justify-center text-gold-500">
                <Link2 className="w-7 h-7 rotate-45" />
              </div>
            </div>

            <h3 className="text-base font-bold text-cortex-dark tracking-tight uppercase">
              Awaiting Neural Link
            </h3>
            <p className="text-xs text-cortex-gray mt-2 leading-relaxed px-4">
              Connect laboratory instruments or input manual sample data to begin CarbonCortex predictive valuation and grade verification.
            </p>

            <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-cortex-border/50 text-left">
              <div className="bg-white border border-cortex-border p-3.5 rounded-xl">
                <span className="text-[8px] font-bold text-cortex-gray uppercase tracking-widest block mb-1">Cortex Load</span>
                <span className="text-xs font-mono font-bold text-gold-700">0.00% SYNC</span>
              </div>
              <div className="bg-white border border-cortex-border p-3.5 rounded-xl">
                <span className="text-[8px] font-bold text-cortex-gray uppercase tracking-widest block mb-1">Sync Status</span>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" /> STABLE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info card: Network Status */}
          <Card title="Telemetry Node Information" className="text-left shadow-premium">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-cortex-border/50 pb-2">
                <span className="text-xs text-cortex-gray font-medium">Network Nodes</span>
                <span className="text-xs font-bold text-cortex-dark">12 Online</span>
              </div>
              <div className="flex justify-between items-center border-b border-cortex-border/50 pb-2">
                <span className="text-xs text-cortex-gray font-medium">Institutional Hub</span>
                <span className="text-xs font-bold text-cortex-dark">Central India Core</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-cortex-gray font-medium">Gateway Protocol</span>
                <span className="text-xs font-bold text-cortex-dark font-mono">TCP/IP cortex-secure</span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
export default Laboratory;
