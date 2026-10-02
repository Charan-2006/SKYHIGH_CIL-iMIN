import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, type DashboardSummary } from '../api/dashboard';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  MapPin, 
  ChevronRight, 
  RefreshCw,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface QualityRow {
  mine: string;
  avgGcv: string;
  ash: string;
  moisture: string;
  status: 'Stable' | 'Good' | 'Review';
}

interface RecentEvaluation {
  sample: string;
  mine: string;
  predictedGcv: string;
  confidence: string;
  status: 'Continue' | 'Lab Test';
}

const QUALITY_OVERVIEW_DATA: QualityRow[] = [
  { mine: 'Talcher', avgGcv: '4,850 kcal/kg', ash: '28%', moisture: '7.2%', status: 'Stable' },
  { mine: 'Korba', avgGcv: '5,120 kcal/kg', ash: '23%', moisture: '6.1%', status: 'Good' },
  { mine: 'Singrauli', avgGcv: '4,920 kcal/kg', ash: '25%', moisture: '7.8%', status: 'Review' },
];

const RECENT_EVALUATIONS_DATA: RecentEvaluation[] = [
  { sample: 'CCX-1025', mine: 'Talcher', predictedGcv: '4,850 kcal/kg', confidence: '94%', status: 'Continue' },
  { sample: 'CCX-1026', mine: 'Korba', predictedGcv: '5,120 kcal/kg', confidence: '91%', status: 'Continue' },
  { sample: 'CCX-1027', mine: 'Singrauli', predictedGcv: '4,760 kcal/kg', confidence: '62%', status: 'Lab Test' },
];

const PREDICTED_GCV_TREND = [
  { label: 'Sample 1', gcv: 4890 },
  { label: 'Sample 2', gcv: 4940 },
  { label: 'Sample 3', gcv: 4870 },
  { label: 'Sample 4', gcv: 5020 },
  { label: 'Sample 5', gcv: 4980 },
  { label: 'Sample 6', gcv: 5120 },
  { label: 'Sample 7', gcv: 5060 },
  { label: 'Sample 8', gcv: 5180 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const sumData = await dashboardApi.getSummary();
      setSummary(sumData);
    } catch {
      // Quietly use local prototype telemetry
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cortex-dark">CarbonCortex Dashboard</h1>
          <p className="text-sm text-cortex-gray mt-1">
            AI-powered coal quality and decision intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 font-bold cursor-pointer text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <div className="px-3 py-1.5 bg-white border border-cortex-border rounded-xl text-xs flex items-center gap-2 font-mono shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-cortex-dark font-medium">
              {summary?.telemetry_status || 'LIVE TELEMETRY ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards (Row of 5 compact cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1: Active Mines */}
        <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-cortex-gray text-xs font-semibold uppercase tracking-wider">
            <span>Active Mines</span>
            <MapPin className="w-4 h-4 text-gold-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-cortex-dark mt-2 block">
            12
          </span>
          <span className="text-[11px] text-cortex-gray font-medium mt-0.5 block truncate">
            Subsidiaries connected
          </span>
        </div>

        {/* KPI 2: Samples Evaluated */}
        <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-cortex-gray text-xs font-semibold uppercase tracking-wider">
            <span>Samples Evaluated</span>
            <Database className="w-4 h-4 text-gold-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-cortex-dark mt-2 block">
            1,248
          </span>
          <span className="text-[11px] text-cortex-gray font-medium mt-0.5 block truncate">
            Total inferences run
          </span>
        </div>

        {/* KPI 3: High-Confidence Predictions */}
        <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-cortex-gray text-xs font-semibold uppercase tracking-wider">
            <span>High-Confidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 mt-2 block">
            86%
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block truncate">
            Automated pass rate
          </span>
        </div>

        {/* KPI 4: Lab Verification Needed */}
        <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-cortex-gray text-xs font-semibold uppercase tracking-wider">
            <span>Lab Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-700 mt-2 block">
            14%
          </span>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block truncate">
            Safety-gated checks
          </span>
        </div>

        {/* KPI 5: Pending Dispatch */}
        <div className="p-4 bg-white border border-cortex-border rounded-xl shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-cortex-gray text-xs font-semibold uppercase tracking-wider">
            <span>Pending Dispatch</span>
            <Truck className="w-4 h-4 text-gold-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-cortex-dark mt-2 block">
            8
          </span>
          <span className="text-[11px] text-cortex-gray font-medium mt-0.5 block truncate">
            Orders scheduled
          </span>
        </div>
      </div>

      {/* 3. Quality Overview + AI Monitoring (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Quality Overview Section */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          <Card title="Quality Overview" className="bg-white border border-cortex-border shadow-xs flex-1 min-w-0">
            <div className="pt-1">
              <p className="text-xs text-cortex-gray mb-3">
                Key quality metrics across primary coal sources and their current AI health status.
              </p>
              <div className="overflow-x-auto min-w-0">
                <table className="w-full text-xs text-left border-collapse min-w-[440px]">
                  <thead>
                    <tr className="border-b border-cortex-border text-cortex-gray font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Mine</th>
                      <th className="py-2.5 px-3">Avg. GCV</th>
                      <th className="py-2.5 px-3">Ash</th>
                      <th className="py-2.5 px-3">Moisture</th>
                      <th className="py-2.5 px-3 text-center">AI Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cortex-border/40 font-mono text-cortex-dark">
                    {QUALITY_OVERVIEW_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                        <td className="py-3 px-3 font-semibold font-sans text-cortex-dark">{row.mine}</td>
                        <td className="py-3 px-3 font-bold text-gold-900">{row.avgGcv}</td>
                        <td className="py-3 px-3">{row.ash}</td>
                        <td className="py-3 px-3">{row.moisture}</td>
                        <td className="py-3 px-3 text-center font-sans">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === 'Good'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : row.status === 'Stable'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Monitoring Section */}
        <div className="lg:col-span-5 flex flex-col min-w-0">
          <Card title="AI Monitoring" className="bg-white border border-cortex-border shadow-xs flex-1 min-w-0">
            <div className="space-y-4 pt-1">
              {/* Confidence Breakdown Bars */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cortex-dark font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      High Confidence
                    </span>
                    <span className="font-mono font-bold text-emerald-700">86%</span>
                  </div>
                  <div className="w-full bg-cortex-bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cortex-dark font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Medium Confidence
                    </span>
                    <span className="font-mono font-bold text-blue-700">9%</span>
                  </div>
                  <div className="w-full bg-cortex-bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cortex-dark font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Lab Verification Needed
                    </span>
                    <span className="font-mono font-bold text-amber-700">5%</span>
                  </div>
                  <div className="w-full bg-cortex-bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>

              {/* Predicted GCV Trend Chart */}
              <div className="pt-2 border-t border-cortex-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cortex-gray">
                    Predicted GCV Trend
                  </span>
                  <span className="text-[11px] font-mono text-gold-900 font-semibold">
                    Avg ~5,030 kcal/kg
                  </span>
                </div>
                <div className="h-32 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PREDICTED_GCV_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="label" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} domain={[4700, 5300]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`${val} kcal/kg`, 'GCV']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gcv" 
                        stroke="#C9A227" 
                        strokeWidth={2.5} 
                        dot={{ r: 3, fill: '#C9A227' }} 
                        activeDot={{ r: 5 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Action Center + Decision Summary (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Action Center */}
        <div className="lg:col-span-6 flex flex-col min-w-0">
          <Card title="Action Center" className="bg-white border border-cortex-border shadow-xs flex-1 min-w-0">
            <div className="space-y-3 pt-1">
              <p className="text-xs text-cortex-gray mb-1">
                Operational tasks requiring immediate decision-maker review or sign-off.
              </p>

              {/* Item 1 */}
              <div className="p-3 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-cortex-dark truncate">
                    3 samples require lab verification
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/evaluation')}
                  className="px-3 py-1 text-xs font-bold shrink-0 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-300"
                >
                  View
                </Button>
              </div>

              {/* Item 2 */}
              <div className="p-3 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-cortex-dark truncate">
                    2 blend scenarios need review
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/blend')}
                  className="px-3 py-1 text-xs font-bold shrink-0 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-300"
                >
                  View
                </Button>
              </div>

              {/* Item 3 */}
              <div className="p-3 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-cortex-dark truncate">
                    4 dispatch plans pending
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/dispatch')}
                  className="px-3 py-1 text-xs font-bold shrink-0 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-300"
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Decision Summary */}
        <div className="lg:col-span-6 flex flex-col min-w-0">
          <Card title="Decision Summary" className="bg-white border border-cortex-border shadow-xs flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Summary Item 1: Quality */}
              <div className="p-3.5 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cortex-gray uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Quality</span>
                </div>
                <p className="text-xs font-semibold text-cortex-dark leading-relaxed">
                  86% of evaluated samples are high-confidence
                </p>
              </div>

              {/* Summary Item 2: Blending */}
              <div className="p-3.5 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cortex-gray uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5 text-gold-600" />
                  <span>Blending</span>
                </div>
                <p className="text-xs font-semibold text-cortex-dark leading-relaxed">
                  5 active blend plans
                </p>
              </div>

              {/* Summary Item 3: Dispatch */}
              <div className="p-3.5 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cortex-gray uppercase tracking-wider mb-1">
                  <Truck className="w-3.5 h-3.5 text-gold-600" />
                  <span>Dispatch</span>
                </div>
                <p className="text-xs font-semibold text-cortex-dark leading-relaxed">
                  8 planned dispatches
                </p>
              </div>

              {/* Summary Item 4: Verification */}
              <div className="p-3.5 bg-cortex-bg-secondary rounded-xl border border-cortex-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cortex-gray uppercase tracking-wider mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verification</span>
                </div>
                <p className="text-xs font-semibold text-cortex-dark leading-relaxed">
                  3 samples require lab testing
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Recent AI Evaluations */}
      <Card title="Recent AI Evaluations" className="bg-white border border-cortex-border shadow-xs min-w-0">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-cortex-border text-cortex-gray font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Sample</th>
                <th className="py-2.5 px-3">Mine</th>
                <th className="py-2.5 px-3">Predicted GCV</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cortex-border/40 font-mono text-cortex-dark">
              {RECENT_EVALUATIONS_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-cortex-bg-secondary/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-cortex-dark">{row.sample}</td>
                  <td className="py-3 px-3 font-medium font-sans text-cortex-dark">{row.mine}</td>
                  <td className="py-3 px-3 font-bold text-gold-900">{row.predictedGcv}</td>
                  <td className="py-3 px-3 font-semibold">{row.confidence}</td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'Continue'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => navigate('/evaluation')}
                      className="text-gold-700 hover:text-gold-900 font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
