import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard';
import type { MineAnalyticsData } from '../types';
import Card from '../components/Card';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { FileDown, RefreshCcw } from 'lucide-react';
import Button from '../components/Button';
import { MOCK_ANALYTICS } from '../constants/mockData';

export const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<MineAnalyticsData>(MOCK_ANALYTICS);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getTrends();
      if (data && data.monthly_trends && data.monthly_trends.length > 0) {
        setAnalyticsData({
          monthlyTrends: data.monthly_trends,
          accuracyDistribution: data.accuracy_distribution || MOCK_ANALYTICS.accuracyDistribution,
          gradeDistribution: data.grade_distribution || MOCK_ANALYTICS.gradeDistribution,
          mineComparison: data.mine_comparison || MOCK_ANALYTICS.mineComparison
        });
      } else {
        setAnalyticsData(MOCK_ANALYTICS);
      }
    } catch (err) {
      console.warn('Backend unavailable, using telemetry analytics baseline:', err);
      setAnalyticsData(MOCK_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Operational Overview</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Mine Quality Analytics</h2>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => alert('Downloading Quality Reports...')}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 min-h-[400px] flex items-center justify-center text-xs text-cortex-gray font-semibold">
          <svg className="animate-spin h-5 w-5 text-gold-500 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Aggregating Historical Analytics Datasets...
        </div>
      ) : (
        analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* 1. Monthly GCV Trend */}
            <Card title="Monthly GCV Trend" className="shadow-premium min-w-0">
              <p className="text-xs text-cortex-gray mb-4">Average Gross Calorific Value (GCV) trend line over prior operational months.</p>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGcv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#C9A227" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" domain={[4500, 5600]} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="gcv" stroke="#C9A227" strokeWidth={2} fillOpacity={1} fill="url(#colorGcv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 2. Ash & Moisture Trends */}
            <Card title="Ash & Moisture Dynamics" className="shadow-premium min-w-0">
              <p className="text-xs text-cortex-gray mb-4">Proximate ash and moisture weight ratios tracking over time.</p>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="ash" stroke="#111111" strokeWidth={2} dot={{ r: 3 }} name="Ash Content (%)" />
                    <Line type="monotone" dataKey="moisture" stroke="#C9A227" strokeWidth={2} dot={{ r: 3 }} name="Moisture (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 3. Prediction Accuracy Distribution */}
            <Card title="Model Error Deviation Rates" className="shadow-premium min-w-0">
              <p className="text-xs text-cortex-gray mb-4">Distribution of prediction errors compared against core laboratory measurements.</p>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.accuracyDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="range" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#C9A227" radius={[4, 4, 0, 0]} name="Sample count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 4. Coal Grade Distribution */}
            <Card title="Coal Grade Allocation Index" className="shadow-premium min-w-0">
              <p className="text-xs text-cortex-gray mb-4">Aggregate count distribution categorized by CIL coal grade ranges.</p>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.gradeDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="grade" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#4B5563" radius={[4, 4, 0, 0]} name="Binned Samples" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 5. Mine Comparison chart */}
            <Card title="Subsidiary Quality Benchmarking" className="shadow-premium lg:col-span-2 min-w-0">
              <p className="text-xs text-cortex-gray mb-4">Comparative breakdown of average GCV output across Coal India subsidiary mines.</p>
              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.mineComparison} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="mine" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="avgGcv" fill="#C9A227" radius={[4, 4, 0, 0]} name="Average GCV (kcal/kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )
      )}
    </div>
  );
};
export default Analytics;
