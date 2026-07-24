import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Printer, ArrowLeft, BadgeCheck } from 'lucide-react';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction, currentSample } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!lastPrediction) {
    return (
      <div className="text-left py-12 max-w-lg mx-auto">
        <Card title="Report Empty" className="text-center flex flex-col items-center">
          <FileText className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
          <p className="text-xs text-cortex-gray mb-6">
            No valuation report has been compiled yet. Please analyze a laboratory sample.
          </p>
          <Button onClick={() => navigate('/laboratory')}>Go to Laboratory Input</Button>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Determine Dispatch Recommendations based on GCV
  const getDispatchRecommendation = (gcv: number) => {
    if (gcv > 6000) {
      return {
        use: 'Metallurgical Coking & Steel Blending',
        instructions: 'Direct high-carbon consignment to active steel manufacturing plants in Bokaro and Jamshedpur. Premium value surcharge applied.',
        priority: 'CRITICAL HIGH'
      };
    } else if (gcv > 4800) {
      return {
        use: 'Supercritical Thermal Utility Blends',
        instructions: 'Authorize transit to National Thermal Power Corporation (NTPC) grids. Suitable for high-temperature superheated boiler streams.',
        priority: 'OPTIMAL THERMAL'
      };
    } else {
      return {
        use: 'Industrial Cement Kilns & Domestic Grids',
        instructions: 'Allocate to localized pulverized heating grids and brick/cement manufacturing complexes. Low moisture transport precautions.',
        priority: 'STANDARD UTILITY'
      };
    }
  };

  const dispatch = getDispatchRecommendation(lastPrediction.predictedGcv);

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <button 
            onClick={() => navigate('/prediction')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900 mb-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Prediction Outcome
          </button>
          <h1 className="text-2xl font-bold text-cortex-dark">Executive Summary Report</h1>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Report sheet wrapper - formatted as high-grade paper page */}
      <div 
        ref={reportRef}
        className="bg-white border border-cortex-border rounded-2xl p-8 max-w-4xl mx-auto w-full shadow-premium flex flex-col gap-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Letterhead Logo Header */}
        <div className="flex justify-between items-start border-b-2 border-gold-500/30 pb-5">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gold-900 tracking-tight leading-none uppercase">CarbonCortex</span>
            <span className="text-[9px] text-cortex-gray font-semibold mt-1 tracking-widest">COAL INDIA DECISION INTEL PLATFORM</span>
            <span className="text-[8px] text-cortex-gray/65 font-mono mt-0.5">COMPLIANCE REPORT: SECURE-v4.2</span>
          </div>
          
          <div className="text-right text-[10px] text-cortex-gray flex flex-col gap-0.5">
            <span className="font-bold text-cortex-dark">DATE OF ISSUANCE:</span>
            <span className="font-mono">{lastPrediction.predictionTime}</span>
            <span className="font-bold text-cortex-dark mt-1">REPORT ID:</span>
            <span className="font-mono">CCR-{lastPrediction.sampleId}</span>
          </div>
        </div>

        {/* Overview Box */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800 mb-3 border-b border-cortex-border/50 pb-1.5">
            1. Core Analysis Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-cortex-bg-secondary/40 border border-cortex-border/80 p-4 rounded-xl">
            <div>
              <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">Predicted GCV</span>
              <p className="text-xl font-bold font-mono text-gold-800 mt-1">{lastPrediction.predictedGcv} kcal/kg</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">CIL Coal Grade</span>
              <p className="text-xl font-bold text-cortex-dark mt-1">{lastPrediction.coalGrade}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">Inference Confidence</span>
              <p className="text-xl font-bold font-mono text-cortex-dark mt-1">{lastPrediction.confidence}%</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider">Veracity Check</span>
              <p className="text-xl font-bold text-green-600 mt-1">PASS</p>
            </div>
          </div>
        </div>

        {/* Mine and Sample Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800 mb-3 border-b border-cortex-border/50 pb-1.5">
              2. Source Demographics
            </h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Subsidiary Provider</span>
                <span className="font-bold">{currentSample?.state} (CIL)</span>
              </div>
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Active Basin Mine</span>
                <span className="font-bold">{currentSample?.mineName}</span>
              </div>
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Basin field location</span>
                <span className="font-bold">{currentSample?.coalfield} field</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cortex-gray font-semibold">Inference Latency</span>
                <span className="font-bold font-mono">{lastPrediction.analysisDurationMs} ms</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800 mb-3 border-b border-cortex-border/50 pb-1.5">
              3. Proximate Parameters
            </h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Moisture (M)</span>
                <span className="font-bold font-mono">{currentSample?.moisture}%</span>
              </div>
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Ash Content (A)</span>
                <span className="font-bold font-mono">{currentSample?.ash}%</span>
              </div>
              <div className="flex justify-between border-b border-cortex-border/40 pb-1.5">
                <span className="text-cortex-gray font-semibold">Volatile Matter (VM)</span>
                <span className="font-bold font-mono">{currentSample?.volatileMatter}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cortex-gray font-semibold">Fixed Carbon (FC)</span>
                <span className="font-bold font-mono">{currentSample?.fixedCarbon}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch recommendation */}
        <div className="border border-gold-200/50 bg-gold-50/20 p-5 rounded-xl flex flex-col gap-2.5 mt-2">
          <div className="flex items-center gap-2 border-b border-gold-200/30 pb-2 mb-1">
            <BadgeCheck className="w-5 h-5 text-gold-650" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800">
              4. Automated Dispatch Recommendation
            </h3>
          </div>

          <div className="text-xs text-cortex-dark">
            <div className="flex justify-between mb-2">
              <span className="text-cortex-gray font-semibold">Allocated Target Use:</span>
              <span className="font-extrabold text-gold-900 uppercase tracking-wide">{dispatch.use}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-cortex-gray font-semibold">Inference Priority Class:</span>
              <span className="font-bold text-cortex-dark font-mono">{dispatch.priority}</span>
            </div>
            <div className="text-left border-t border-gold-250/20 pt-2.5 text-cortex-gray leading-relaxed font-semibold">
              <span className="text-[10px] font-bold text-gold-800 uppercase block mb-1">Operational Instructions:</span>
              {dispatch.instructions}
            </div>
          </div>
        </div>

        {/* Certification Signoff layout */}
        <div className="grid grid-cols-2 gap-8 border-t border-cortex-border pt-10 mt-12 text-xs">
          <div className="flex flex-col items-start gap-1">
            <div className="w-32 h-6 border-b border-cortex-light-gray flex items-end">
              <span className="font-mono text-[9px] text-cortex-gray italic">Cortex Neural Link Signed</span>
            </div>
            <span className="font-bold text-cortex-dark">CarbonCortex Predictive Core</span>
            <span className="text-[10px] text-cortex-gray">Automated Cryptographic Certification</span>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <div className="w-32 h-6 border-b border-cortex-light-gray"></div>
            <span className="font-bold text-cortex-dark">Quality Assurance Supervisor</span>
            <span className="text-[10px] text-cortex-gray">Coal India Inspectorate Signoff</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Report;
