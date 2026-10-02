import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Settings as SettingsIcon, ShieldCheck, Database, Save, RotateCcw, AlertTriangle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, saveSettings } = useApp();
  
  // Local state initialized from context settings
  const [modelVersion, setModelVersion] = useState('Cortex-v4.2-Prod');
  const [alertThreshold, setAlertThreshold] = useState(90.0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.carboncortex.cil/v1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setModelVersion(settings.modelVersion || 'Cortex-v4.2-Prod');
      setAlertThreshold(settings.alertThreshold || 90.0);
      setAutoRefresh(settings.autoRefresh !== undefined ? settings.autoRefresh : true);
      setApiEndpoint(settings.apiEndpoint || 'https://api.carboncortex.cil/v1');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings({
      modelVersion,
      alertThreshold,
      autoRefresh,
      apiEndpoint
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset system settings to default parameters?')) {
      setModelVersion('Cortex-v4.2-Prod');
      setAlertThreshold(90.0);
      setAutoRefresh(true);
      setApiEndpoint('https://api.carboncortex.cil/v1');
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Title */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Control Panel</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">System Settings</h2>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-w-0">
        {/* Left Side: Parameters input form */}
        <div className="xl:col-span-8 flex flex-col gap-6 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium min-w-0">
          <div className="flex items-center gap-2 pb-3 border-b border-cortex-border/50 mb-2">
            <SettingsIcon className="w-5 h-5 text-gold-500 shrink-0" />
            <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">Model & API Gateway Settings</h3>
          </div>

          {/* Model Selection */}
          <div className="flex flex-col gap-1.5 w-full min-w-0">
            <label className="text-xs font-semibold uppercase tracking-wider text-cortex-gray">
              Active Neural Estimator Model
            </label>
            <select
              value={modelVersion}
              onChange={(e) => setModelVersion(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-cortex-border rounded-lg text-sm text-cortex-dark outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10"
            >
              <option value="Cortex-v4.2-Prod">Cortex Neural Core v4.2 (XGBoost Default - Production)</option>
              <option value="Cortex-v4.1-Legacy">Cortex Neural Core v4.1 (Random Forest - Legacy Support)</option>
              <option value="XGBoost-v2.1-Experimental">XGBoost Estimator v2.1 (Deep-tree - Experimental)</option>
            </select>
            <span className="text-[10px] text-cortex-gray">Selects the core mathematical engine for calculating Gross Calorific Values.</span>
          </div>

          {/* API Endpoints */}
          <div className="grid grid-cols-1 gap-4 min-w-0">
            <Input
              label="API Endpoint Gateway"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              helperText="Target FastAPI backend url endpoint connected to local lab servers."
            />
          </div>

          {/* Threshold sliders */}
          <div className="flex flex-col gap-2 pt-2 border-t border-cortex-border/50">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cortex-dark uppercase tracking-wider">Confidence Warning Threshold</span>
              <span className="font-mono font-bold text-gold-800">{alertThreshold.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="85.0" 
              max="99.0" 
              step="0.5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
            <span className="text-[10px] text-cortex-gray">Triggers audit warning flags in history registers if prediction results fall below this threshold.</span>
          </div>

          {/* Auto Refresh Toggles */}
          <div className="flex items-center justify-between p-4 border border-cortex-border rounded-xl bg-cortex-bg-secondary/40 border-t">
            <div className="text-xs">
              <span className="font-bold text-cortex-dark block">Real-time Telemetry Refreshing</span>
              <span className="text-[10px] text-cortex-gray">Automatically synchronizes with online Coal India telemetry grids.</span>
            </div>
            <input 
              type="checkbox" 
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-5 h-5 rounded accent-gold-500 cursor-pointer shrink-0 ml-2"
            />
          </div>

          {/* Footer Action buttons */}
          <div className="border-t border-cortex-border/50 pt-5 mt-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleReset}
              className="flex items-center justify-center gap-1 font-bold cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </Button>

            <div className="flex items-center justify-end gap-3 shrink-0">
              {saveSuccess && (
                <span className="text-xs font-bold text-green-600 animate-pulse">
                  Settings Saved Successfully
                </span>
              )}
              <Button
                type="submit"
                size="md"
                className="flex items-center justify-center gap-1.5 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Informative Panels */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          {/* Card: System Node Security */}
          <Card 
            title="System Security compliance" 
            headerAction={<ShieldCheck className="w-5 h-5 text-gold-500" />}
            className="shadow-premium text-left"
          >
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-cortex-gray font-medium">
              <p>
                CarbonCortex operates under active institutional encryption grids. Modifying active estimator configurations records cryptographic audit checksums.
              </p>
              <div className="p-3 border border-amber-250 bg-amber-50 rounded-xl text-amber-900 flex items-start gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] font-semibold leading-normal">
                  Warning: Changing active model versions alters GCV calculation parameters. Ensure matching downstream solver configurations.
                </div>
              </div>
            </div>
          </Card>

          {/* Node Metadata Summary */}
          <Card 
            title="Cortex Node Metadata"
            headerAction={<Database className="w-5 h-5 text-gold-500" />}
            className="shadow-premium text-left"
          >
            <div className="flex flex-col gap-3.5 text-xs text-cortex-dark">
              <div className="flex justify-between border-b border-cortex-border/50 pb-1.5">
                <span className="text-cortex-gray font-semibold">Active Client Version</span>
                <span className="font-mono font-bold">Cortex-v4.2.0-Alpha</span>
              </div>
              <div className="flex justify-between border-b border-cortex-border/50 pb-1.5">
                <span className="text-cortex-gray font-semibold">FastAPI Connection</span>
                <span className="font-bold text-red-600">Simulated Mock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cortex-gray font-semibold">Encryption Protocol</span>
                <span className="font-mono text-gold-800 font-bold">AES-GCM 256</span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
export default Settings;
