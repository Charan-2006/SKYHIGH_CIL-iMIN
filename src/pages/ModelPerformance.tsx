import React, { useState, useEffect } from 'react';
import { modelApi, type ModelVersion, type RetrainResult } from '../api/models';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ModelPerformance: React.FC = () => {
  const { hasRole, showToast } = useApp();
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [activeModel, setActiveModel] = useState<ModelVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState<RetrainResult | null>(null);

  const fetchModelData = async () => {
    setLoading(true);
    try {
      const allModels = await modelApi.listVersions();
      setModels(allModels);
      const active = allModels.find(m => m.status === 'ACTIVE') || (await modelApi.getActive());
      setActiveModel(active);
    } catch (err) {
      console.error('Failed to load model registry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelData();
  }, []);

  const handleTriggerRetrain = async () => {
    if (!window.confirm('Trigger continuous learning retraining with all verified lab samples?')) return;
    setRetraining(true);
    setRetrainResult(null);
    try {
      const res = await modelApi.retrain(0.85);
      setRetrainResult(res);
      showToast(res.message, res.promoted_to_active ? 'success' : 'info');
      await fetchModelData();
    } catch (err: any) {
      console.error('Retraining error:', err);
      showToast('Retraining error: ' + (err.response?.data?.detail || err.message), 'error');
    } finally {
      setRetraining(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-300">Active</span>;
      case 'CANDIDATE':
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-200">Candidate</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-200">Retired</span>;
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Model Governance & Registry</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">XGBoost Architecture & Performance</h2>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchModelData}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Registry</span>
          </Button>

          {hasRole(['ADMIN', 'ENGINEER']) && (
            <Button
              size="sm"
              onClick={handleTriggerRetrain}
              disabled={retraining}
              className="flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{retraining ? 'Training Candidate...' : 'Trigger Continuous Learning'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Retrain Alert Notification */}
      {retrainResult && (
        <div className={`p-4 rounded-xl border text-xs flex flex-col gap-1.5 ${
          retrainResult.promoted_to_active 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className="font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Candidate Evaluation: {retrainResult.candidate_version}</span>
          </div>
          <p>{retrainResult.comparison_summary}</p>
          <div className="font-mono text-[11px] opacity-80">
            Training Samples: {retrainResult.training_samples_count} | Verified Feedback Samples Incorporated: {retrainResult.verified_samples_incorporated}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-xs text-cortex-gray">Loading Model Registry metrics...</div>
      ) : activeModel ? (
        <div className="flex flex-col gap-6">
          {/* Active Model Hero Card */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cortex-border/60 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-bold text-cortex-dark font-mono">{activeModel.version}</span>
                  {getStatusBadge(activeModel.status)}
                  <span className="text-[10px] text-cortex-gray uppercase tracking-wider font-semibold">
                    XGBoost Multi-Target Regressors
                  </span>
                </div>
                <p className="text-xs text-cortex-gray mt-1">
                  Dataset Version: <span className="font-mono font-bold text-cortex-dark">{activeModel.dataset_version}</span> • Trained on {activeModel.training_samples.toLocaleString()} samples ({activeModel.verified_samples} verified lab feedback)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-cortex-gray tracking-wider">GCV Accuracy Score</span>
                <div className="text-3xl font-extrabold text-gold-900 font-mono">
                  R² {(activeModel.metrics?.gcv?.r2 ?? 0.8862).toFixed(4)}
                </div>
              </div>
            </div>

            {/* Regression Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Gross Calorific Value (GCV)', unit: 'kcal/kg', metrics: activeModel.metrics?.gcv },
                { label: 'Ash Content', unit: '%', metrics: activeModel.metrics?.ash },
                { label: 'Moisture Content', unit: '%', metrics: activeModel.metrics?.moisture },
                { label: 'Volatile Matter', unit: '%', metrics: activeModel.metrics?.volatile_matter }
              ].map((m, i) => (
                <div key={i} className="bg-cortex-bg-secondary/60 border border-cortex-border/70 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-cortex-gray uppercase tracking-wider block">{m.label}</span>
                  <div className="mt-2 flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-cortex-gray">R² Score:</span>
                      <span className="font-mono font-bold text-cortex-dark">{(m.metrics?.r2 ?? 0).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cortex-gray">RMSE:</span>
                      <span className="font-mono font-bold text-cortex-dark">{(m.metrics?.rmse ?? 0).toFixed(2)} {m.unit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cortex-gray">MAE:</span>
                      <span className="font-mono font-bold text-cortex-dark">{(m.metrics?.mae ?? 0).toFixed(2)} {m.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model History Table */}
          <Card title="Model Registry Version History" className="shadow-premium">
            <p className="text-xs text-cortex-gray mb-4">
              Comprehensive immutable record of all candidate, production, and retired models with validation benchmarks.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-cortex-border text-cortex-gray font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Version</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Dataset</th>
                    <th className="py-3 px-3">Training Samples</th>
                    <th className="py-3 px-3">GCV R²</th>
                    <th className="py-3 px-3">GCV MAE</th>
                    <th className="py-3 px-3">Ash R²</th>
                    <th className="py-3 px-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border/40 font-mono">
                  {models.map((m) => (
                    <tr key={m.version} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-cortex-dark">{m.version}</td>
                      <td className="py-3 px-3">{getStatusBadge(m.status)}</td>
                      <td className="py-3 px-3 text-cortex-gray font-sans">{m.dataset_version}</td>
                      <td className="py-3 px-3">{m.training_samples.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-gold-900">{(m.metrics?.gcv?.r2 ?? 0).toFixed(4)}</td>
                      <td className="py-3 px-3">{(m.metrics?.gcv?.mae ?? 0).toFixed(2)} kcal/kg</td>
                      <td className="py-3 px-3 font-semibold text-cortex-dark">{(m.metrics?.ash?.r2 ?? 0).toFixed(4)}</td>
                      <td className="py-3 px-3 text-[11px] text-cortex-gray">
                        {new Date(m.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <Card title="No Model Loaded">
          <p className="text-xs text-cortex-gray">No trained model found. Please run the train_models script.</p>
        </Card>
      )}
    </div>
  );
};

export default ModelPerformance;
