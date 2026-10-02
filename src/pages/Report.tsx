import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { reportApi, type ReportData } from '../api/reports';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { 
  FileText, 
  Printer, 
  ArrowLeft, 
  BadgeCheck, 
  Layers, 
  Database, 
  Cpu, 
  Sliders, 
  FlaskConical,
  RefreshCw
} from 'lucide-react';

const REPORT_TYPES = [
  { id: 'consignment', name: 'Active Consignment Valuation', icon: BadgeCheck },
  { id: 'coal_quality', name: 'Coal Quality Inventory', icon: Database },
  { id: 'predictions', name: 'Prediction Telemetry Audit', icon: FileText },
  { id: 'laboratory', name: 'Lab Verification Ledger', icon: FlaskConical },
  { id: 'blending', name: 'OR-Tools Blend Runs', icon: Sliders },
  { id: 'models', name: 'Model Performance & Retraining', icon: Cpu },
  { id: 'scenarios', name: 'Scenario Simulation Runs', icon: Layers }
];

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const { lastPrediction, currentSample } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  const [activeReportTab, setActiveReportTab] = useState<string>('consignment');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  const fetchEnterpriseReport = async (type: string) => {
    if (type === 'consignment') return;
    setLoadingReport(true);
    try {
      const data = await reportApi.getReportByType(type);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching enterprise report:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    if (activeReportTab !== 'consignment') {
      fetchEnterpriseReport(activeReportTab);
    }
  }, [activeReportTab]);

  const handlePrint = () => {
    window.print();
  };

  // Dispatch rules for active consignment
  const predGcv = Math.round(lastPrediction?.predictions?.gcv ?? (lastPrediction as any)?.predictedGcv ?? 5200);
  const predAsh = Number((lastPrediction?.predictions?.ash ?? currentSample?.ash ?? 24.5).toFixed(1));
  const predMoisture = Number((lastPrediction?.predictions?.moisture ?? currentSample?.moisture ?? 7.5).toFixed(1));
  const predVm = Number((lastPrediction?.predictions?.volatile_matter ?? currentSample?.volatileMatter ?? 25.0).toFixed(1));
  const predFc = Number((lastPrediction?.predictions?.fixed_carbon ?? currentSample?.fixedCarbon ?? 43.0).toFixed(1));
  const predGrade = lastPrediction?.grade ?? (lastPrediction as any)?.coalGrade ?? 'G4';
  const predConfidence = Math.round(lastPrediction ? (lastPrediction.confidence > 1 ? lastPrediction.confidence : lastPrediction.confidence * 100) : 95);
  const sampleCode = lastPrediction?.sample_code || (lastPrediction as any)?.sampleId || 'SAMPLE-001';
  const mineName = lastPrediction?.mine_name || currentSample?.mineName || 'Gevra Mega Project';
  const coalfield = lastPrediction?.coalfield || currentSample?.coalfield || 'Korba';
  const stateName = lastPrediction?.state || currentSample?.state || 'Chhattisgarh';

  const getDispatchRecommendation = (gcv: number) => {
    if (gcv > 5800) {
      return {
        use: 'Metallurgical Coking & Steel Blending',
        instructions: 'Direct high-carbon consignment to active steel manufacturing complexes in Bokaro and Jamshedpur. Premium billing surcharge applies.',
        priority: 'CRITICAL HIGH'
      };
    } else if (gcv > 4400) {
      return {
        use: 'Supercritical Thermal Utility Grids',
        instructions: 'Authorize transit to National Thermal Power Corporation (NTPC) power plants. Optimized for high-efficiency pulverized boilers.',
        priority: 'OPTIMAL THERMAL'
      };
    } else {
      return {
        use: 'Industrial Cement Kilns & Domestic Grids',
        instructions: 'Allocate to localized pulverized heating grids and cement manufacturing kilns. Normal moisture transport precautions.',
        priority: 'STANDARD UTILITY'
      };
    }
  };

  const dispatch = getDispatchRecommendation(predGcv);

  // Dynamic table columns for generic enterprise reports
  const getDynamicColumns = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) return [];
    const sample = reportData.data[0];
    return Object.keys(sample)
      .filter(k => k !== '_id' && k !== 'id')
      .slice(0, 7)
      .map(key => ({
        header: key.replace(/_/g, ' ').toUpperCase(),
        accessor: (row: any) => {
          const val = row[key];
          if (val === null || val === undefined) return '---';
          if (typeof val === 'object') return JSON.stringify(val);
          if (typeof val === 'number') return val.toLocaleString();
          return String(val);
        }
      }));
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden min-w-0">
        <div>
          <button 
            onClick={() => navigate('/evaluation')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900 mb-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quality Evaluation
          </button>
          <h1 className="text-2xl font-bold text-cortex-dark">Enterprise Compliance & Valuation Reports</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </Button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cortex-border print:hidden min-w-0">
        {REPORT_TYPES.map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReportTab === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReportTab(rep.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive 
                  ? 'bg-gold-800 text-white shadow-sm' 
                  : 'bg-white border border-cortex-border text-cortex-gray hover:text-cortex-dark hover:bg-gold-50/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{rep.name}</span>
            </button>
          );
        })}
      </div>

      {/* View 1: Active Consignment Certificate */}
      {activeReportTab === 'consignment' && (
        !lastPrediction ? (
          <div className="text-left py-12 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center min-h-[360px]">
            <Card title="No Active Consignment" className="text-center flex flex-col items-center">
              <FileText className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
              <p className="text-xs text-cortex-gray mb-6">
                No active consignment prediction loaded. Please evaluate a laboratory sample to generate an executive certificate.
              </p>
              <Button onClick={() => navigate('/evaluation')}>Go to Quality Evaluation</Button>
            </Card>
          </div>
        ) : (
          <div 
            ref={reportRef}
            className="bg-white border border-cortex-border rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto w-full shadow-premium flex flex-col gap-6 print:border-none print:shadow-none print:p-0 min-w-0"
          >
            {/* Letterhead Logo Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-gold-500/30 pb-5">
              <div className="flex items-center gap-3.5">
                <img src="/logo.png" alt="CarbonCortex Logo" className="w-12 h-12 rounded-xl object-contain shadow-xs shrink-0" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gold-900 tracking-tight leading-none uppercase">CarbonCortex</span>
                  <span className="text-[10px] text-cortex-gray font-semibold mt-1 tracking-widest">COAL QUALITY & DECISION INTELLIGENCE PLATFORM</span>
                  <span className="text-[8px] text-cortex-gray/65 font-mono mt-0.5">COMPLIANCE LEDGER: CIL-ISO-1928-CERTIFIED</span>
                </div>
              </div>
              
              <div className="text-left sm:text-right text-[10px] text-cortex-gray flex flex-col gap-0.5 shrink-0">
                <span className="font-bold text-cortex-dark">DATE OF ISSUANCE:</span>
                <span className="font-mono">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="font-bold text-cortex-dark mt-1">REPORT CODE:</span>
                <span className="font-mono text-gold-800 font-bold">CCR-{sampleCode}</span>
              </div>
            </div>

            {/* Consignment Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-cortex-bg-secondary/40 border border-cortex-border rounded-xl">
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-cortex-gray uppercase">Coal Mine</span>
                <p className="text-sm font-bold text-cortex-dark mt-0.5 truncate">{mineName}</p>
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-cortex-gray uppercase">Basin / Coalfield</span>
                <p className="text-sm font-bold text-cortex-dark mt-0.5 truncate">{coalfield}</p>
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-cortex-gray uppercase">State Territory</span>
                <p className="text-sm font-bold text-cortex-dark mt-0.5 truncate">{stateName}</p>
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-cortex-gray uppercase">Sample Telemetry ID</span>
                <p className="text-sm font-bold font-mono text-gold-800 mt-0.5 truncate">{sampleCode}</p>
              </div>
            </div>

            {/* Certified Valuation Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 border border-cortex-border rounded-xl bg-white shadow-sm min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray">Gross Calorific Value</span>
                <p className="text-3xl font-extrabold font-mono text-cortex-dark mt-2 truncate">
                  {predGcv} <span className="text-xs font-normal text-cortex-gray font-sans">kcal/kg</span>
                </p>
                <span className="text-[10px] text-cortex-gray mt-1 block">XGBoost Multi-Target Regression</span>
              </div>

              <div className="p-5 border border-cortex-border rounded-xl bg-white shadow-sm min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray">Determined Coal Grade</span>
                <p className="text-3xl font-extrabold font-mono text-gold-800 mt-2 truncate">
                  {predGrade}
                </p>
                <span className="text-[10px] text-cortex-gray mt-1 block">Official CIL Thermal G1-G17 Schedule</span>
              </div>

              <div className="p-5 border border-cortex-border rounded-xl bg-white shadow-sm min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray">ATDIF Confidence</span>
                <p className={`text-3xl font-extrabold font-mono mt-2 truncate ${predConfidence < 85 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {predConfidence}%
                </p>
                <span className="text-[10px] text-cortex-gray mt-1 block">
                  {predConfidence >= 85 ? 'High Confidence Verified' : 'Review Required'}
                </span>
              </div>
            </div>

            {/* Proximate Analysis Breakdown Table */}
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-cortex-dark uppercase tracking-wider mb-3">
                Laboratory Proximate Breakdown
              </h3>
              <div className="overflow-x-auto min-w-0">
                <table className="w-full text-xs border border-cortex-border rounded-lg overflow-hidden min-w-[500px]">
                <thead className="bg-cortex-bg-secondary text-cortex-gray uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 text-left border-b border-cortex-border">Parameter</th>
                    <th className="py-2.5 px-4 text-left border-b border-cortex-border">Standard Code</th>
                    <th className="py-2.5 px-4 text-right border-b border-cortex-border">Measured Weight (%)</th>
                    <th className="py-2.5 px-4 text-right border-b border-cortex-border">Allowable Tolerance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cortex-border text-cortex-dark">
                  <tr>
                    <td className="py-2 px-4 font-semibold">Total Moisture (M)</td>
                    <td className="py-2 px-4 font-mono text-cortex-gray">IS 1350 (Part I)</td>
                    <td className="py-2 px-4 text-right font-mono font-bold">{predMoisture}%</td>
                    <td className="py-2 px-4 text-right font-mono text-cortex-gray">±0.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Ash Content (A)</td>
                    <td className="py-2 px-4 font-mono text-cortex-gray">IS 1350 (Part I)</td>
                    <td className="py-2 px-4 text-right font-mono font-bold">{predAsh}%</td>
                    <td className="py-2 px-4 text-right font-mono text-cortex-gray">±0.8%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Volatile Matter (VM)</td>
                    <td className="py-2 px-4 font-mono text-cortex-gray">IS 1350 (Part I)</td>
                    <td className="py-2 px-4 text-right font-mono font-bold">{predVm}%</td>
                    <td className="py-2 px-4 text-right font-mono text-cortex-gray">±0.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Fixed Carbon (FC)</td>
                    <td className="py-2 px-4 font-mono text-cortex-gray">By Difference</td>
                    <td className="py-2 px-4 text-right font-mono font-bold">{predFc}%</td>
                    <td className="py-2 px-4 text-right font-mono text-cortex-gray">Calculated</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            {/* Dispatch Intelligence Decision */}
            <div className="p-5 border-l-4 border-gold-500 bg-gold-50/30 rounded-r-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-800 block mb-1">
                Authorized Dispatch Instruction ({dispatch.priority})
              </span>
              <p className="text-sm font-bold text-cortex-dark">
                Recommended End-Use: {dispatch.use}
              </p>
              <p className="text-xs text-cortex-gray mt-1 leading-relaxed">
                {dispatch.instructions}
              </p>
            </div>

            {/* Signature footer */}
            <div className="border-t border-cortex-border pt-6 mt-4 flex justify-between items-end text-xs text-cortex-gray">
              <div>
                <p className="font-bold text-cortex-dark">CarbonCortex Automated Validator</p>
                <p className="text-[10px]">Machine Learning Certification Engine v1.0</p>
              </div>
              <div className="text-right">
                <div className="w-36 border-b border-cortex-dark/50 mb-1"></div>
                <p className="font-bold text-cortex-dark">Chief Quality Officer / Lab Lead</p>
                <p className="text-[10px]">Certified Signature / CIL Audit</p>
              </div>
            </div>
          </div>
        )
      )}

      {/* View 2: Enterprise Database Reports */}
      {activeReportTab !== 'consignment' && (
        <div className="flex flex-col gap-6 flex-1 min-h-0 min-w-0">
          {loadingReport ? (
            <div className="p-12 text-center text-xs text-cortex-gray font-semibold flex items-center justify-center gap-2 flex-1 min-h-[300px]">
              <RefreshCw className="w-4 h-4 animate-spin text-gold-600 shrink-0" />
              <span>Aggregating real-time records from MongoDB...</span>
            </div>
          ) : reportData ? (
            <>
              {/* Summary Banner */}
              <div className="p-5 bg-white border border-cortex-border rounded-2xl shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-cortex-dark">{reportData.title}</h3>
                  <p className="text-xs text-cortex-gray mt-0.5">{reportData.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono shrink-0">
                  <div className="bg-gold-50 text-gold-800 px-3 py-1.5 rounded-lg border border-gold-200">
                    <span className="font-bold">{reportData.record_count}</span> Records Queried
                  </div>
                  <span className="text-[10px] text-cortex-gray">
                    Generated: {new Date(reportData.generated_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <Card title={`Live Database Audit: ${reportData.title}`} className="shadow-premium min-w-0">
                {reportData.data && reportData.data.length > 0 ? (
                  <div className="overflow-x-auto min-w-0">
                    <Table 
                      columns={getDynamicColumns()}
                      data={reportData.data}
                    />
                  </div>
                ) : (
                  <p className="p-8 text-center text-xs text-cortex-gray">
                    No database records found for this report category.
                  </p>
                )}
              </Card>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              <p className="p-8 text-center text-xs text-cortex-gray">
                Unable to load report from server.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Report;
