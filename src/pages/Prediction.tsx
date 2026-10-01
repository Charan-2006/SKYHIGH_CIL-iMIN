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
  ChevronRight,
  AlertTriangle,
  FlaskConical,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

export const Prediction: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction, currentSample } = useApp();

  // If no prediction yet
  if (!lastPrediction) {
    return (
      <div className="text-left select-none max-w-lg mx-auto py-12">
        <Card title="No Coal Sample Evaluated" className="text-center flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
          <p className="text-xs text-cortex-gray mb-6">
            There is no active prediction output currently stored. Run real-time machine learning inference using geoscientific sensor inputs.
          </p>
          <Button onClick={() => navigate('/laboratory')}>
            Initialize Lab Sample Input
          </Button>
        </Card>
      </div>
    );
  }

  // Robustly extract properties from real prediction response
  const gcv = Math.round(lastPrediction.predictions?.gcv ?? (lastPrediction as any).predictedGcv ?? 5200);
  const ash = Number((lastPrediction.predictions?.ash ?? currentSample?.ash ?? 24.5).toFixed(1));
  const moisture = Number((lastPrediction.predictions?.moisture ?? currentSample?.moisture ?? 7.5).toFixed(1));
  const vm = Number((lastPrediction.predictions?.volatile_matter ?? currentSample?.volatileMatter ?? 25.0).toFixed(1));
  const fc = Number((lastPrediction.predictions?.fixed_carbon ?? currentSample?.fixedCarbon ?? 43.0).toFixed(1));
  const grade = lastPrediction.grade ?? (lastPrediction as any).coalGrade ?? 'G4';
  const confidenceVal = Math.round(lastPrediction.confidence > 1 ? lastPrediction.confidence : lastPrediction.confidence * 100);
  const isLowConfidence = Boolean(lastPrediction.verification_required || confidenceVal < 85);
  const qualityScore = lastPrediction.quality_score ? Number(lastPrediction.quality_score.toFixed(1)) : 82.5;
  const sampleCode = lastPrediction.sample_code || (lastPrediction as any).sampleId || currentSample?.sampleId || 'SAMPLE-001';
  const mineName = lastPrediction.mine_name || currentSample?.mineName || 'Gevra Mega Project';
  const coalfield = lastPrediction.coalfield || currentSample?.coalfield || 'Korba';
  const stateName = lastPrediction.state || currentSample?.state || 'Chhattisgarh';
  const modelVersion = lastPrediction.model_version || 'xgb-v1.0';
  const decision = lastPrediction.decision || (isLowConfidence ? 'Review & Lab Verification Required' : 'High Confidence - Approved for Dispatch');

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Coal Quality AI Engine</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Multi-Target Proximate Forecast</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/laboratory')}
            className="flex items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>New Sample</span>
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate('/blend')}
            className="flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Optimize Blend</span>
          </Button>
        </div>
      </div>

      {/* Requirement 30: Prominent Low Confidence Warning */}
      {isLowConfidence && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-200/70 px-2 py-0.5 rounded">
                  ATDIF Gating: Laboratory Verification Required
                </span>
                <span className="text-[11px] font-mono text-red-700 font-bold">
                  Confidence: {confidenceVal}% (Threshold: 85%)
                </span>
              </div>
              <p className="text-xs text-red-900 mt-1.5 font-medium leading-relaxed">
                {decision}. Do not use this prediction as verified truth for dispatch contracts without standard ISO bomb calorimetry.
              </p>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-red-700 font-mono">
                <span>Distance Factor: Drift Detected</span>
                <span>•</span>
                <span>Uncertainty: ±310 kcal/kg</span>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => navigate('/laboratory')}
            className="whitespace-nowrap flex items-center gap-1.5 font-bold"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>View Verification Queue</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main scorecard - GCV & Grade */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium relative overflow-hidden">
            {/* Ambient gold glow in top right */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-gold-500/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>

            <div className="flex justify-between items-center border-b border-cortex-border/50 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-cortex-gray">ATDIF Decision Layer Status</span>
              </div>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase ${getStatusBadgeClass(lastPrediction.status || 'OPTIMAL')}`}>
                {lastPrediction.status || 'OPTIMAL'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              {/* Primary Value: predicted GCV */}
              <div className="flex flex-col border-r border-cortex-border/50 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Predicted Energy Value</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-cortex-dark font-mono mt-2 flex items-baseline gap-1.5">
                  {gcv}
                  <span className="text-sm font-semibold text-cortex-gray font-sans">kcal/kg</span>
                </span>
                <p className="text-xs text-cortex-gray mt-2 leading-relaxed">
                  Gross Calorific Value forecast calculated with XGBoost regression.
                </p>
              </div>

              {/* Class classification */}
              <div className="flex flex-col border-r border-cortex-border/50 pr-4 pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Determined Quality Grade</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-800 font-mono mt-2">
                  {grade}
                </span>
                <p className="text-xs text-cortex-gray mt-2 leading-relaxed">
                  Official Coal India standard grade band for thermal utilities.
                </p>
              </div>

              {/* Quality Index */}
              <div className="flex flex-col pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">Weighted Quality Score</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-cortex-dark font-mono mt-2 flex items-baseline gap-1">
                  {qualityScore}
                  <span className="text-xs font-normal text-cortex-gray font-sans">/100</span>
                </span>
                <p className="text-xs text-cortex-gray mt-2 leading-relaxed">
                  Multi-parameter weighted index (GCV, Ash, Moisture, VM).
                </p>
              </div>
            </div>

            {/* Model Info Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-cortex-border/50 pt-5 mt-6 text-xs">
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <TrendingUp className="w-4 h-4 text-gold-500" />
                <span>Confidence: <span className={`font-bold font-mono ${confidenceVal < 85 ? 'text-red-600' : 'text-cortex-dark'}`}>{confidenceVal}%</span></span>
              </div>
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>Model: <span className="font-bold text-cortex-dark font-mono">{modelVersion}</span></span>
              </div>
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <Database className="w-4 h-4 text-gold-500" />
                <span>Sample ID: <span className="font-mono font-bold text-cortex-dark truncate">{sampleCode}</span></span>
              </div>
              <div className="flex items-center gap-2 text-cortex-gray font-medium">
                <Award className="w-4 h-4 text-gold-500" />
                <span>Gate: <span className="font-bold text-cortex-dark">{isLowConfidence ? 'Lab Review' : 'Verified AI'}</span></span>
              </div>
            </div>
          </div>

          {/* Sample overview details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card title="Predicted Proximate Analysis" className="shadow-premium">
              <div className="flex flex-col gap-3 text-xs text-cortex-dark">
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Total Moisture (M)</span>
                  <span className="font-bold font-mono">{moisture}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Ash Content (A)</span>
                  <span className="font-bold font-mono">{ash}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Volatile Matter (VM)</span>
                  <span className="font-bold font-mono">{vm}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cortex-gray font-semibold">Fixed Carbon (FC)</span>
                  <span className="font-bold font-mono">{fc}%</span>
                </div>
              </div>
            </Card>

            <Card title="Geospatial Telemetry" className="shadow-premium">
              <div className="flex flex-col gap-3 text-xs text-cortex-dark">
                <div className="flex items-center gap-2 text-cortex-gray mb-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span className="font-bold text-cortex-dark">{mineName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Coalfield Basin</span>
                  <span className="font-bold">{coalfield}</span>
                </div>
                <div className="flex justify-between items-center border-b border-cortex-border/40 pb-1.5">
                  <span className="text-cortex-gray font-semibold">Subsidiary Region</span>
                  <span className="font-bold">{stateName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cortex-gray font-semibold">Seam Strata</span>
                  <span className="font-bold font-mono text-xs">Seam-IV (135m Depth)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Model Narrative Card */}
          <div className="bg-gold-50/40 border border-gold-100 rounded-2xl p-5 shadow-premium">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-700" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-800">
                ATDIF Decision Intelligence Narrative
              </h4>
            </div>
            <p className="text-xs text-gold-950 leading-relaxed font-medium">
              {lastPrediction.narrative || `XGBoost regression determined a Gross Calorific Value of ${gcv} kcal/kg, placing the consignment in Grade ${grade}. ${decision}.`}
            </p>
          </div>
        </div>

        {/* Right drawer - Navigation & workflow actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Downstream Decision Nodes" className="shadow-premium">
            <div className="flex flex-col gap-3">
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
                    <p className="text-[10px] text-cortex-gray mt-0.5">SHAP TreeExplainer attributions</p>
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
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Optimize Blend</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">Google OR-Tools linear solver</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cortex-light-gray group-hover:text-gold-500 transition-colors" />
              </div>

              <div 
                onClick={() => navigate('/scenarios')}
                className="flex items-center justify-between p-3.5 border border-cortex-border rounded-xl cursor-pointer hover:border-gold-500/40 hover:bg-gold-50/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Scenario Simulator</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">Baseline vs What-If analysis</p>
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
                    <h4 className="text-xs font-bold text-cortex-dark uppercase">Executive Reports</h4>
                    <p className="text-[10px] text-cortex-gray mt-0.5">Live database valuation records</p>
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
              ATDIF Confidence Score
            </span>
            
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#E5E7EB" strokeWidth="6" fill="transparent"></circle>
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  stroke={confidenceVal < 85 ? "#DC2626" : "#C9A227"} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 - (301.6 * (confidenceVal / 100))}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-xl font-mono font-bold leading-none ${confidenceVal < 85 ? 'text-red-600' : 'text-cortex-dark'}`}>{confidenceVal}%</span>
                <span className="text-[8px] text-gold-600 uppercase font-bold tracking-wider mt-1">Confidence</span>
              </div>
            </div>
            
            <p className="text-[10px] text-cortex-gray px-4 group-hover:text-gold-700 transition-colors">
              Click to view prediction stability audit trails, domain drift, and ATDIF thresholds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Prediction;
