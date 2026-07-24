import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { 
  ShieldCheck, 
  TrendingUp, 
  BrainCircuit, 
  Sliders, 
  FileSpreadsheet, 
  Clock, 
  Database,
  MapPin,
  ChevronRight
} from 'lucide-react';

export const Prediction: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction, currentSample } = useApp();

  // Redirect to laboratory if no prediction has been generated yet
  if (!lastPrediction) {
    return (
      <div className="text-left select-none max-w-lg mx-auto py-12">
        <Card title="No Telemetry Loaded" className="text-center flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
          <p className="text-xs text-cortex-gray mb-6">
            There is no active prediction output currently stored. Please input a laboratory sample to initiate calculations.
          </p>
          <Button onClick={() => navigate('/laboratory')}>
            Initialize Lab Sample Input
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'LIMIT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'OUTLIER':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header section */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Model Inference Results</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">Coal Valuation Report</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main scorecard - GCV & Grade */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium relative overflow-hidden">
            {/* Ambient gold glow in top right */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-gold-500/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>

            <div className="flex justify-between items-center border-b border-cortex-border/50 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-cortex-gray">Prediction Node Status</span>
              </div>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase ${getStatusBadgeClass(lastPrediction.status)}`}>
                {lastPrediction.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              {/* Primary Value: predicted GCV */}
              <div className="flex flex-col border-r border-cortex-border/50 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Predicted Energy Value</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-cortex-dark font-mono mt-2 flex items-baseline gap-1.5">
                  {lastPrediction.predictedGcv}
                  <span className="text-sm font-semibold text-cortex-gray font-sans">kcal/kg</span>
                </span>
                <p className="text-xs text-cortex-gray mt-2 leading-relaxed">
                  Gross Calorific Value (GCV) forecast calculated with XGBoost neural regressions.
                </p>
              </div>

              {/* Class classification */}
              <div className="flex flex-col pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Determined Quality Grade</span>
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-800 font-mono mt-2">
                  {lastPrediction.coalGrade}
                </span>
                <p className="text-xs text-cortex-gray mt-2 leading-relaxed">
                  Classified within the CIL standard framework (G1-G17) for thermal coal utilities.
                </p>
              </div>
            </div>

            {/* Model Info Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-cortex-border/50 pt-5 mt-6 text-xs">
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <TrendingUp className="w-4 h-4 text-gold-500" />
                <span>Confidence: <span className="font-bold text-cortex-dark">{lastPrediction.confidence}%</span></span>
              </div>
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>Latency: <span className="font-bold text-cortex-dark">{lastPrediction.analysisDurationMs}ms</span></span>
              </div>
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <Database className="w-4 h-4 text-gold-500" />
                <span>ID: <span className="font-mono font-bold text-cortex-dark">{lastPrediction.sampleId}</span></span>
              </div>
            </div>
          </div>

          {/* Sample overview details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card title="Proximate Parameters Analysis" className="shadow-premium">
              <div className="flex flex-col gap-3.5 text-xs text-cortex-dark">
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Moisture (M)</span>
                  <span className="font-bold font-mono">{currentSample?.moisture}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Ash Content (A)</span>
                  <span className="font-bold font-mono">{currentSample?.ash}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Volatile Matter (VM)</span>
                  <span className="font-bold font-mono">{currentSample?.volatileMatter}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cortex-gray font-semibold">Fixed Carbon (FC)</span>
                  <span className="font-bold font-mono">{currentSample?.fixedCarbon}%</span>
                </div>
              </div>
            </Card>

            <Card title="Geospatial Telemetry" className="shadow-premium">
              <div className="flex flex-col gap-3.5 text-xs text-cortex-dark">
                <div className="flex items-center gap-2 text-cortex-gray mb-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span className="font-bold text-cortex-dark">{currentSample?.mineName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Coalfield Basin</span>
                  <span className="font-bold">{currentSample?.coalfield}</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Subsidiary Region</span>
                  <span className="font-bold">{currentSample?.state}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cortex-gray font-semibold">GPS Coordinates</span>
                  <span className="font-bold font-mono text-[10px]">{currentSample?.latitude}° N, {currentSample?.longitude}° E</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Model Narrative Card */}
          <div className="bg-gold-50/40 border border-gold-100 rounded-2xl p-5 shadow-premium">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-2">
              Neural Narrative Summary
            </h4>
            <p className="text-xs text-gold-900 leading-relaxed font-semibold italic">
              {lastPrediction.narrative}
            </p>
          </div>
        </div>

        {/* Right drawer - Navigation & workflow actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Downstream Decision Nodes" className="shadow-premium">
            <div className="flex flex-col gap-4">
              <div 
                onClick={() => navigate('/explainability')}
                className="flex items-center justify-between p-3.5 border border-cortex-border rounded-xl cursor-pointer hover:border-gold-500/40 hover:bg-gold-50/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Explain Prediction</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">SHAP waterfall attributions</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cortex-light-gray group-hover:text-gold-500 transition-colors" />
              </div>

              <div 
                onClick={() => navigate('/blend')}
                className="flex items-center justify-between p-3.5 border border-cortex-border rounded-xl cursor-pointer hover:border-gold-500/40 hover:bg-gold-50/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Optimise Blend</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">Solve coal mixing ratios</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cortex-light-gray group-hover:text-gold-500 transition-colors" />
              </div>

              <div 
                onClick={() => navigate('/report')}
                className="flex items-center justify-between p-3.5 border border-cortex-border rounded-xl cursor-pointer hover:border-gold-500/40 hover:bg-gold-50/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Executive Report</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">Generate formal print PDF</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cortex-light-gray group-hover:text-gold-500 transition-colors" />
              </div>
            </div>
          </Card>

          {/* Confidence Indicator Widget */}
          <div 
            onClick={() => navigate('/confidence')}
            className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium flex flex-col items-center justify-center text-center cursor-pointer hover:border-gold-500/40 transition-colors group"
          >
            <span className="text-[9px] font-bold text-cortex-gray uppercase tracking-widest block mb-4">
              Prediction Stability Score
            </span>
            
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              {/* Circular gauge border */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#E5E7EB" strokeWidth="6" fill="transparent"></circle>
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  stroke="#C9A227" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 - (301.6 * (lastPrediction.confidence / 100))}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-mono font-bold text-cortex-dark leading-none">{lastPrediction.confidence}%</span>
                <span className="text-[8px] text-gold-600 uppercase font-bold tracking-wider mt-1">Confidence</span>
              </div>
            </div>
            
            <p className="text-[10px] text-cortex-gray px-4 group-hover:text-gold-700 transition-colors">
              Click to view prediction stability audit trails and model drift metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Prediction;
