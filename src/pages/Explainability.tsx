import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { predictionApi, type PredictionExplanation } from '../api/predictions';
import ShapWaterfall from '../components/ShapWaterfall';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  BrainCircuit, 
  Download, 
  FileCheck2, 
  TrendingUp, 
  ArrowLeft,
  Info,
  Sparkles
} from 'lucide-react';

export const Explainability: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction } = useApp();
  const [explanation, setExplanation] = useState<PredictionExplanation | null>(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      if (!lastPrediction) return;
      const predId = (lastPrediction as any).prediction_id || (lastPrediction as any).sample_id;
      if (predId) {
        try {
          const exp = await predictionApi.getExplanation(predId);
          setExplanation(exp);
        } catch (err) {
          console.warn('Could not fetch server explanation, using cached SHAP values:', err);
        }
      }
    };
    fetchExplanation();
  }, [lastPrediction]);

  if (!lastPrediction) {
    return (
      <div className="text-left py-12 max-w-lg mx-auto flex-1 flex flex-col justify-center min-h-[400px]">
        <Card title="No Prediction Active" className="text-center flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
          <p className="text-xs text-cortex-gray mb-6">
            Please run an AI evaluation first to generate feature attributions.
          </p>
          <Button onClick={() => navigate('/evaluation')}>Go to Quality Evaluation</Button>
        </Card>
      </div>
    );
  }

  // Derive SHAP values from server explanation or fallback to lastPrediction.shap_values
  const shapList = explanation?.shap_contributions || 
    (lastPrediction as any).shap_values || 
    (lastPrediction as any).shapValues || 
    [];

  const baseValue = explanation?.base_value || 5200;
  const predictedGcv = Math.round(lastPrediction.predictions?.gcv ?? (lastPrediction as any).predictedGcv ?? 5200);
  const sampleCode = lastPrediction.sample_code || (lastPrediction as any).sampleId || 'SAMPLE-001';
  const confidenceVal = Math.round(lastPrediction.confidence > 1 ? lastPrediction.confidence : lastPrediction.confidence * 100);

  const handleDownloadShap = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shapList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CCX_SHAP_${sampleCode}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Header breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/evaluation')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900 mb-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quality Evaluation
          </button>
          <h1 className="text-2xl font-bold text-cortex-dark">Explainable AI (SHAP TreeExplainer)</h1>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadShap}
          className="flex items-center gap-1.5 font-bold cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export SHAP Attribution JSON</span>
        </Button>
      </div>

      {/* Requirement 17: Disclaimer banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Model Feature Contributions:</span> {explanation?.disclaimer || 'SHAP values represent local marginal feature contributions calculated via TreeExplainer from the background training baseline. Do NOT interpret SHAP attributions as causal physical mechanisms.'}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0">
        {/* Waterfall Chart Column */}
        <div className="xl:col-span-8 min-w-0">
          <ShapWaterfall
            shapValues={shapList}
            baseValue={baseValue}
            predictionValue={predictedGcv}
          />
        </div>

        {/* Narratives and Context Column */}
        <div className="xl:col-span-4 min-w-0 flex flex-col gap-6">
          {/* Cortex Narrative Card */}
          <div className="bg-gold-800 border border-gold-900/10 text-white rounded-2xl p-6 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-white/10 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-200">Neural Narrative</span>
            </div>
            
            <p className="text-sm font-semibold leading-relaxed text-gold-50">
              {explanation?.narrative || lastPrediction.narrative || `Model GCV prediction of ${predictedGcv} kcal/kg is heavily governed by proximate ash and moisture levels.`}
            </p>

            <div className="border-t border-gold-700/50 mt-6 pt-4 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-[9px] uppercase font-bold text-gold-300 tracking-wider">Confidence Score</span>
                <p className="text-base font-bold font-mono text-white mt-0.5">{confidenceVal}%</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gold-300 tracking-wider">ATDIF Gate</span>
                <p className="text-base font-bold text-white mt-0.5">{confidenceVal >= 85 ? 'Verified AI' : 'Lab Review'}</p>
              </div>
            </div>
          </div>

          {/* Industrial Context Card */}
          <Card title="Model Feature Significance" className="shadow-premium">
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3 border-b border-cortex-border/50 pb-3">
                <FileCheck2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-bold text-cortex-dark">Proximate Proxies</h4>
                  <p className="text-cortex-gray mt-1 leading-relaxed">
                    Ash content provides the strongest negative gradient constraint, suppressing GCV by direct mass substitution of non-combustible mineral matter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-bold text-cortex-dark">Geophysical Telemetry</h4>
                  <p className="text-cortex-gray mt-1 leading-relaxed">
                    Overburden thickness and borehole bulk density calibrate the proximate baseline across the Korba and Singrauli coalfields.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Verified Material Sample visual card */}
          <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium overflow-hidden text-center relative flex flex-col items-center">
            <div className="w-full h-28 bg-cortex-bg-secondary rounded-xl border border-cortex-border flex items-center justify-center mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 to-transparent rounded-full"></div>
              <div className="w-20 h-16 rounded border-2 border-dashed border-gold-500/30 flex items-center justify-center text-[10px] font-mono text-gold-700 font-bold">
                CIL.SAMPLE
              </div>
            </div>
            
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark">
                SAMPLE IDENTIFIER
              </span>
              <span className="text-[10px] font-mono font-bold text-gold-800 bg-gold-50 border border-gold-200/50 px-2 py-0.5 rounded">
                {sampleCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Explainability;
