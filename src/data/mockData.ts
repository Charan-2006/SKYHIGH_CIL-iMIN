export const mines = [
  { id: 'BCCL', name: 'Bharat Coking Coal Ltd.', location: 'Jharkhand', type: 'Underground', capacity: 42.5 },
  { id: 'CCL', name: 'Central Coalfields Ltd.', location: 'Jharkhand', type: 'Open Cast', capacity: 68.2 },
  { id: 'ECL', name: 'Eastern Coalfields Ltd.', location: 'West Bengal', type: 'Mixed', capacity: 55.8 },
  { id: 'MCL', name: 'Mahanadi Coalfields Ltd.', location: 'Odisha', type: 'Open Cast', capacity: 143.6 },
  { id: 'NCL', name: 'Northern Coalfields Ltd.', location: 'Madhya Pradesh', type: 'Open Cast', capacity: 131.4 },
  { id: 'SECL', name: 'South Eastern Coalfields Ltd.', location: 'Chhattisgarh', type: 'Open Cast', capacity: 167.3 },
  { id: 'WCL', name: 'Western Coalfields Ltd.', location: 'Maharashtra', type: 'Underground', capacity: 58.9 },
]

export const kpiData = {
  totalProduction: { value: 668.7, unit: 'Million Tonnes', change: 4.2, trend: 'up' as const },
  avgGcv: { value: 4520, unit: 'kcal/kg', change: 1.8, trend: 'up' as const },
  ashContent: { value: 18.4, unit: '%', change: -2.1, trend: 'down' as const },
  revenue: { value: 1_42_850, unit: '₹ Crores', change: 6.7, trend: 'up' as const },
  predictionAccuracy: { value: 94.2, unit: '%', change: 1.3, trend: 'up' as const },
  activeBlends: { value: 127, unit: 'Active Blends', change: 12, trend: 'up' as const },
}

export const qualityTrendData = [
  { month: 'Jan', gcv: 4380, ash: 19.8, moisture: 8.2, sulphur: 0.52 },
  { month: 'Feb', gcv: 4410, ash: 19.4, moisture: 7.9, sulphur: 0.50 },
  { month: 'Mar', gcv: 4450, ash: 19.1, moisture: 7.6, sulphur: 0.49 },
  { month: 'Apr', gcv: 4480, ash: 18.9, moisture: 7.4, sulphur: 0.48 },
  { month: 'May', gcv: 4500, ash: 18.6, moisture: 7.2, sulphur: 0.47 },
  { month: 'Jun', gcv: 4520, ash: 18.4, moisture: 7.0, sulphur: 0.46 },
  { month: 'Jul', gcv: 4540, ash: 18.2, moisture: 6.9, sulphur: 0.45 },
  { month: 'Aug', gcv: 4560, ash: 18.0, moisture: 6.8, sulphur: 0.44 },
  { month: 'Sep', gcv: 4580, ash: 17.8, moisture: 6.7, sulphur: 0.43 },
  { month: 'Oct', gcv: 4600, ash: 17.6, moisture: 6.6, sulphur: 0.42 },
  { month: 'Nov', gcv: 4610, ash: 17.5, moisture: 6.5, sulphur: 0.41 },
  { month: 'Dec', gcv: 4620, ash: 17.4, moisture: 6.4, sulphur: 0.40 },
]

export const mineComparisonData = mines.map((mine) => ({
  name: mine.id,
  gcv: Math.round(4200 + Math.random() * 600),
  ash: Math.round((15 + Math.random() * 8) * 10) / 10,
  production: mine.capacity,
  efficiency: Math.round(78 + Math.random() * 18),
}))

export const predictionConfidenceData = [
  { model: 'GCV Predictor', confidence: 96.4, lastUpdated: '2026-06-28 06:00 IST' },
  { model: 'Ash Content Model', confidence: 93.8, lastUpdated: '2026-06-28 06:00 IST' },
  { model: 'Moisture Estimator', confidence: 91.2, lastUpdated: '2026-06-27 18:00 IST' },
  { model: 'Blend Optimizer', confidence: 94.7, lastUpdated: '2026-06-28 06:00 IST' },
  { model: 'Revenue Forecaster', confidence: 89.5, lastUpdated: '2026-06-27 12:00 IST' },
]

export const revenueData = [
  { month: 'Jan', revenue: 11200, target: 11000, cost: 8400 },
  { month: 'Feb', revenue: 11450, target: 11200, cost: 8500 },
  { month: 'Mar', revenue: 11800, target: 11500, cost: 8600 },
  { month: 'Apr', revenue: 12100, target: 11800, cost: 8700 },
  { month: 'May', revenue: 12400, target: 12000, cost: 8800 },
  { month: 'Jun', revenue: 12750, target: 12200, cost: 8900 },
  { month: 'Jul', revenue: 12900, target: 12400, cost: 9000 },
  { month: 'Aug', revenue: 13100, target: 12600, cost: 9100 },
  { month: 'Sep', revenue: 13350, target: 12800, cost: 9200 },
  { month: 'Oct', revenue: 13600, target: 13000, cost: 9300 },
  { month: 'Nov', revenue: 13850, target: 13200, cost: 9400 },
  { month: 'Dec', revenue: 14200, target: 13500, cost: 9500 },
]

export const recentRecommendations = [
  {
    id: 'REC-2026-0847',
    title: 'Increase SECL-MCL blend ratio to 65:35',
    impact: 'High',
    category: 'Blend Optimization',
    estimatedGain: '₹18.4 Cr/month',
    confidence: 94.2,
    status: 'Pending Review',
    timestamp: '2026-06-28 08:15 IST',
  },
  {
    id: 'REC-2026-0846',
    title: 'Adjust washery feed rate at Piparwar OC',
    impact: 'Medium',
    category: 'Operational',
    estimatedGain: '₹6.2 Cr/month',
    confidence: 88.7,
    status: 'Approved',
    timestamp: '2026-06-28 07:42 IST',
  },
  {
    id: 'REC-2026-0845',
    title: 'Defer low-GCV dispatch from Rajrappa Area',
    impact: 'High',
    category: 'Quality Control',
    estimatedGain: '₹12.8 Cr/month',
    confidence: 91.5,
    status: 'In Progress',
    timestamp: '2026-06-28 06:30 IST',
  },
  {
    id: 'REC-2026-0844',
    title: 'Enable predictive maintenance for Conveyor Belt CB-14',
    impact: 'Medium',
    category: 'Maintenance',
    estimatedGain: '₹3.1 Cr/month',
    confidence: 86.3,
    status: 'Approved',
    timestamp: '2026-06-27 22:10 IST',
  },
]

export const systemHealth = [
  { component: 'Data Pipeline (Kafka)', status: 'healthy' as const, uptime: 99.97, latency: '12ms' },
  { component: 'ML Inference Engine', status: 'healthy' as const, uptime: 99.94, latency: '45ms' },
  { component: 'SCADA Integration', status: 'warning' as const, uptime: 98.82, latency: '230ms' },
  { component: 'SAP ERP Connector', status: 'healthy' as const, uptime: 99.89, latency: '180ms' },
  { component: 'IoT Sensor Network', status: 'healthy' as const, uptime: 99.76, latency: '8ms' },
  { component: 'Historical Data Warehouse', status: 'healthy' as const, uptime: 99.99, latency: '95ms' },
]

export const coalSeams = [
  { id: 'JSW-I', name: 'Jharia Seam I', gcv: 6200, ash: 12.4, moisture: 4.2, sulphur: 0.38, cost: 4200 },
  { id: 'JSW-II', name: 'Jharia Seam II', gcv: 5800, ash: 15.1, moisture: 5.0, sulphur: 0.42, cost: 3800 },
  { id: 'KSW-A', name: 'Korba Seam A', gcv: 5400, ash: 17.8, moisture: 6.1, sulphur: 0.45, cost: 3200 },
  { id: 'KSW-B', name: 'Korba Seam B', gcv: 5100, ash: 19.2, moisture: 6.8, sulphur: 0.48, cost: 2900 },
  { id: 'TAL-A', name: 'Talcher Seam A', gcv: 4800, ash: 22.1, moisture: 7.5, sulphur: 0.52, cost: 2600 },
  { id: 'TAL-B', name: 'Talcher Seam B', gcv: 4500, ash: 24.5, moisture: 8.2, sulphur: 0.55, cost: 2400 },
]

export const blendComponents = [
  { seam: 'JSW-I', seamId: 'JSW-I', percentage: 35, color: '#0369A1' },
  { seam: 'KSW-A', seamId: 'KSW-A', percentage: 30, color: '#059669' },
  { seam: 'JSW-II', seamId: 'JSW-II', percentage: 20, color: '#4F46E5' },
  { seam: 'TAL-A', seamId: 'TAL-A', percentage: 15, color: '#D97706' },
]

export const aiRecommendations = [
  {
    id: 'AI-001',
    title: 'Optimize dispatch schedule for Q3 FY26',
    description: 'Shift 12% of NCL production to peak-demand windows to capture ₹24 Cr premium pricing.',
    impact: { revenue: '+₹24 Cr', cost: '-₹2.1 Cr', net: '+₹21.9 Cr' },
    risk: 'Low',
    confidence: 92.4,
    priority: 'Critical',
    actions: ['Adjust rail rake allocation', 'Coordinate with Indian Railways', 'Update dispatch ERP rules'],
  },
  {
    id: 'AI-002',
    title: 'Implement washery bypass for high-ash feed',
    description: 'Route feed with ash >24% directly to power sector contracts, saving ₹8.4 Cr in washery costs.',
    impact: { revenue: '-₹1.2 Cr', cost: '-₹9.6 Cr', net: '+₹8.4 Cr' },
    risk: 'Medium',
    confidence: 87.6,
    priority: 'High',
    actions: ['Validate contract GCV tolerances', 'Update quality gate thresholds', 'Train shift supervisors'],
  },
  {
    id: 'AI-003',
    title: 'Deploy edge ML at SECL Gevra OC',
    description: 'Real-time GCV prediction at extraction point reduces quality variance by 18%.',
    impact: { revenue: '+₹15.2 Cr', cost: '+₹1.8 Cr', net: '+₹13.4 Cr' },
    risk: 'Low',
    confidence: 94.1,
    priority: 'High',
    actions: ['Install edge compute nodes', 'Deploy lightweight GCV model', 'Integrate with SCADA'],
  },
]

export const reports = [
  { id: 'RPT-001', title: 'Monthly Production & Quality Summary', type: 'Production', period: 'June 2026', size: '2.4 MB', format: 'PDF', generated: '2026-06-28 06:00 IST' },
  { id: 'RPT-002', title: 'Blend Optimization Analysis — Q1 FY26', type: 'Analytics', period: 'Apr–Jun 2026', size: '4.1 MB', format: 'PDF', generated: '2026-06-25 14:30 IST' },
  { id: 'RPT-003', title: 'AI Model Performance Audit', type: 'AI/ML', period: 'H1 FY26', size: '1.8 MB', format: 'PDF', generated: '2026-06-20 10:00 IST' },
  { id: 'RPT-004', title: 'Mine-wise GCV Variance Report', type: 'Quality', period: 'June 2026', size: '3.2 MB', format: 'XLSX', generated: '2026-06-28 07:00 IST' },
  { id: 'RPT-005', title: 'Revenue Forecast — FY26 Q3', type: 'Financial', period: 'Jul–Sep 2026', size: '1.5 MB', format: 'PDF', generated: '2026-06-27 16:00 IST' },
  { id: 'RPT-006', title: 'Environmental Compliance Dashboard', type: 'Compliance', period: 'June 2026', size: '2.8 MB', format: 'PDF', generated: '2026-06-26 12:00 IST' },
]

export const users = [
  { id: 1, name: 'Charan Annamalai A', email: 'charan.annamalai@coalindia.in', role: 'Administrator', mine: 'HQ — Kolkata', status: 'Active', lastLogin: '2026-06-28 09:12 IST' },
  { id: 2, name: 'Priya Sharma', email: 'priya.sharma@coalindia.in', role: 'Data Scientist', mine: 'SECL — Bilaspur', status: 'Active', lastLogin: '2026-06-28 08:45 IST' },
  { id: 3, name: 'Amit Patel', email: 'amit.patel@coalindia.in', role: 'Mine Manager', mine: 'MCL — Sambalpur', status: 'Active', lastLogin: '2026-06-27 18:30 IST' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@coalindia.in', role: 'Quality Analyst', mine: 'NCL — Singrauli', status: 'Active', lastLogin: '2026-06-28 07:20 IST' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@coalindia.in', role: 'Operations Lead', mine: 'BCCL — Dhanbad', status: 'Inactive', lastLogin: '2026-06-15 14:00 IST' },
]

export const roles = [
  { name: 'Administrator', permissions: 24, users: 3, description: 'Full system access including user management and AI configuration' },
  { name: 'Data Scientist', permissions: 18, users: 8, description: 'Model training, prediction access, and analytics dashboards' },
  { name: 'Mine Manager', permissions: 14, users: 22, description: 'Mine-specific dashboards, recommendations, and operational controls' },
  { name: 'Quality Analyst', permissions: 10, users: 35, description: 'Quality prediction, blend optimization, and reporting' },
  { name: 'Viewer', permissions: 6, users: 48, description: 'Read-only access to dashboards and reports' },
]

export const aiModels = [
  { name: 'GCV-XGBoost-v3.2', type: 'Regression', status: 'Active', accuracy: 96.4, lastTrained: '2026-06-15', dataPoints: '2.4M' },
  { name: 'Ash-RF-v2.1', type: 'Regression', status: 'Active', accuracy: 93.8, lastTrained: '2026-06-10', dataPoints: '1.8M' },
  { name: 'Blend-DQN-v1.4', type: 'Reinforcement', status: 'Active', accuracy: 94.7, lastTrained: '2026-06-20', dataPoints: '890K' },
  { name: 'Revenue-LSTM-v2.0', type: 'Time Series', status: 'Retraining', accuracy: 89.5, lastTrained: '2026-05-28', dataPoints: '560K' },
  { name: 'Anomaly-ISO-v1.0', type: 'Anomaly Detection', status: 'Active', accuracy: 91.2, lastTrained: '2026-06-01', dataPoints: '3.1M' },
]

export const landingStats = [
  { label: 'Million Tonnes Produced', value: 668.7, suffix: 'MT' },
  { label: 'Prediction Accuracy', value: 94.2, suffix: '%' },
  { label: 'Active Mines Monitored', value: 352, suffix: '' },
  { label: 'Revenue Optimized', value: 142, suffix: '₹Cr' },
]

export const landingFeatures = [
  { title: 'Real-Time Quality Prediction', description: 'AI-powered GCV, ash, moisture, and sulphur prediction at extraction point with sub-minute latency.', icon: 'Brain' },
  { title: 'Intelligent Blend Optimization', description: 'Multi-objective optimization balancing quality specs, cost minimization, and revenue maximization.', icon: 'Layers' },
  { title: 'Decision Intelligence Engine', description: 'Actionable recommendations with business impact quantification and risk assessment.', icon: 'Lightbulb' },
  { title: 'Scenario Simulation', description: 'Interactive what-if analysis for production, pricing, and quality parameter changes.', icon: 'FlaskConical' },
  { title: 'Enterprise Integration', description: 'Native connectors for SAP ERP, SCADA, IoT sensors, and Indian Railways dispatch systems.', icon: 'Network' },
  { title: 'Explainable AI', description: 'SHAP-based feature attribution for every prediction with audit-ready documentation.', icon: 'Eye' },
]

export const explainabilityFactors = [
  { factor: 'Seam Depth', contribution: 28.4, direction: 'positive' as const },
  { factor: 'Overburden Ratio', contribution: 22.1, direction: 'negative' as const },
  { factor: 'Moisture Content', contribution: 18.7, direction: 'negative' as const },
  { factor: 'Ash Fusion Temp', contribution: 15.3, direction: 'positive' as const },
  { factor: 'Mining Method', contribution: 10.2, direction: 'positive' as const },
  { factor: 'Seasonal Factor', contribution: 5.3, direction: 'negative' as const },
]
