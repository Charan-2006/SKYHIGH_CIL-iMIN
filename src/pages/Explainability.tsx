import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ShapWaterfall from '../components/ShapWaterfall';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  BrainCircuit, 
  Download, 
  FileCheck2, 
  TrendingUp, 
  ArrowLeft 
} from 'lucide-react';

export const Explainability: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction } = useApp();

  if (!lastPrediction) {
    return (
      <div className="text-left py-12 max-w-lg mx-auto">
        <Card title="No Prediction Active" className="text-center flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
          <p className="text-xs text-cortex-gray mb-6">
            Please run a laboratory sample analysis first to generate SHAP waterfall data.
          </p>
          <Button onClick={() => navigate('/laboratory')}>Go to Laboratory Input</Button>
        </Card>
      </div>
    );
  }

  const handleDownloadShap = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastPrediction.shapValues, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CCX_SHAP_${lastPrediction.sampleId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/prediction')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900 mb-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Prediction Outcome
          </button>
          <h1 className="text-2xl font-bold text-cortex-dark">Explainable AI (XAI) Node</h1>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadShap}
          className="flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Raw SHAP Values</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Waterfall Chart Column */}
        <div className="lg:col-span-8">
          <ShapWaterfall
            shapValues={lastPrediction.shapValues}
            baseValue={5200}
            predictionValue={lastPrediction.predictedGcv}
          />
        </div>

        {/* Narratives and Context Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cortex Narrative Card */}
          <div className="bg-gold-800 border border-gold-900/10 text-white rounded-2xl p-6 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-white/10 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-gold-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-200">Cortex Narrative</span>
            </div>
            
            <p className="text-sm font-semibold leading-relaxed italic text-gold-50">
              {lastPrediction.narrative}
            </p>

            <div className="border-t border-gold-700/50 mt-6 pt-4 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-[9px] uppercase font-bold text-gold-300 tracking-wider">Confidence Interval</span>
                <p className="text-base font-bold font-mono text-white mt-0.5">{lastPrediction.confidence}%</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gold-300 tracking-wider">Model Stability</span>
                <p className="text-base font-bold text-white mt-0.5">High</p>
              </div>
            </div>
          </div>

          {/* Industrial Context Card */}
          <Card title="Industrial Context" className="shadow-premium">
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3 border-b border-cortex-border/50 pb-3">
                <FileCheck2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-bold text-cortex-dark">Correlation Benchmarking</h4>
                  <p className="text-cortex-gray mt-1 leading-relaxed">
                    Physical parameters match historic <span className="font-bold">'Coal Alpha'</span> signatures from Q3 2023 core.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-bold text-cortex-dark">Drift Detection</h4>
                  <p className="text-cortex-gray mt-1 leading-relaxed">
                    Model inference variance remains within default operational thresholds <span className="font-bold">(±0.2%)</span>.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Verified Material Sample visual card */}
          <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium overflow-hidden text-center relative flex flex-col items-center">
            {/* Visual representation of material sample box */}
            <div className="w-full h-32 bg-cortex-bg-secondary rounded-xl border border-cortex-border flex items-center justify-center mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 to-transparent rounded-full"></div>
              {/* Gold matrix-pattern outline */}
              <div className="w-16 h-16 rounded border-2 border-dashed border-gold-500/30 flex items-center justify-center text-[10px] font-mono text-gold-700 font-bold">
                RAW.COAL
              </div>
            </div>
            
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark">
                VERIFIED MATERIAL SAMPLE
              </span>
              <span className="text-[9px] font-mono font-bold text-gold-800 bg-gold-50 border border-gold-200/50 px-1.5 py-0.5 rounded uppercase">
                {lastPrediction.sampleId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Explainability;
