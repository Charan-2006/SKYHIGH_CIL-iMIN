import type { CoalIndiaSubsidiary, MineAnalyticsData, ConfidenceMetric, ConfidenceLog } from '../types';

// Helper to determine CIL Coal Grade based on GCV (kcal/kg)
export const getCoalGrade = (gcv: number): string => {
  if (gcv > 7000) return 'G1';
  if (gcv > 6700) return 'G2';
  if (gcv > 6400) return 'G3';
  if (gcv > 6100) return 'G4';
  if (gcv > 5800) return 'G5';
  if (gcv > 5500) return 'G6';
  if (gcv > 5200) return 'G7';
  if (gcv > 4900) return 'G8';
  if (gcv > 4600) return 'G9';
  if (gcv > 4300) return 'G10';
  if (gcv > 4000) return 'G11';
  if (gcv > 3700) return 'G12';
  if (gcv > 3400) return 'G13';
  if (gcv > 3100) return 'G14';
  if (gcv > 2800) return 'G15';
  if (gcv > 2500) return 'G16';
  return 'G17';
};

// CIL Subsidiaries with lat/long coordinates matching geographical center of major coalfields
export const CIL_SUBSIDIARIES: CoalIndiaSubsidiary[] = [
  {
    id: 'ECL',
    name: 'ECL',
    fullName: 'Eastern Coalfields Limited',
    headquarters: 'Sanctoria, West Bengal',
    latitude: 23.68,
    longitude: 86.85,
    productionCapacity: '50 MTPA',
    activeMinesCount: 104,
    avgGcv: 6150
  },
  {
    id: 'BCCL',
    name: 'BCCL',
    fullName: 'Bharat Coking Coal Limited',
    headquarters: 'Dhanbad, Jharkhand',
    latitude: 23.79,
    longitude: 86.43,
    productionCapacity: '40 MTPA',
    activeMinesCount: 36,
    avgGcv: 6450
  },
  {
    id: 'CCL',
    name: 'CCL',
    fullName: 'Central Coalfields Limited',
    headquarters: 'Ranchi, Jharkhand',
    latitude: 23.63,
    longitude: 85.37,
    productionCapacity: '75 MTPA',
    activeMinesCount: 62,
    avgGcv: 5800
  },
  {
    id: 'NCL',
    name: 'NCL',
    fullName: 'Northern Coalfields Limited',
    headquarters: 'Singrauli, Madhya Pradesh',
    latitude: 24.20,
    longitude: 82.68,
    productionCapacity: '130 MTPA',
    activeMinesCount: 10,
    avgGcv: 5400
  },
  {
    id: 'WCL',
    name: 'WCL',
    fullName: 'Western Coalfields Limited',
    headquarters: 'Nagpur, Maharashtra',
    latitude: 21.15,
    longitude: 79.09,
    productionCapacity: '65 MTPA',
    activeMinesCount: 72,
    avgGcv: 5200
  },
  {
    id: 'SECL',
    name: 'SECL',
    fullName: 'South Eastern Coalfields Limited',
    headquarters: 'Bilaspur, Chhattisgarh',
    latitude: 22.08,
    longitude: 82.14,
    productionCapacity: '180 MTPA',
    activeMinesCount: 89,
    avgGcv: 5600
  },
  {
    id: 'MCL',
    name: 'MCL',
    fullName: 'Mahanadi Coalfields Limited',
    headquarters: 'Sambalpur, Odisha',
    latitude: 21.47,
    longitude: 83.97,
    productionCapacity: '190 MTPA',
    activeMinesCount: 47,
    avgGcv: 4800
  },
  {
    id: 'NEC',
    name: 'NEC',
    fullName: 'North Eastern Coalfields',
    headquarters: 'Margherita, Assam',
    latitude: 27.28,
    longitude: 95.68,
    productionCapacity: '2 MTPA',
    activeMinesCount: 5,
    avgGcv: 6800
  }
];

// Presets for laboratory forms
export const SAMPLE_PRESETS = [
  {
    name: 'Jharia Prime Coking (BCCL)',
    coalfield: 'Jharia',
    mineName: 'Moonidih Underground',
    state: 'Jharkhand',
    moisture: 1.2,
    ash: 12.4,
    volatileMatter: 28.5,
    fixedCarbon: 57.9,
    sulphur: 0.55,
    carbon: 78.4,
    hydrogen: 4.8,
    nitrogen: 1.3,
    oxygen: 14.95,
    latitude: 23.76,
    longitude: 86.35
  },
  {
    name: 'Raniganj High Volatile (ECL)',
    coalfield: 'Raniganj',
    mineName: 'Sonalpur Open Cast',
    state: 'West Bengal',
    moisture: 3.8,
    ash: 14.8,
    volatileMatter: 34.2,
    fixedCarbon: 47.2,
    sulphur: 0.42,
    carbon: 70.1,
    hydrogen: 5.1,
    nitrogen: 1.2,
    oxygen: 23.18,
    latitude: 23.65,
    longitude: 86.92
  },
  {
    name: 'Singrauli Thermal Power (NCL)',
    coalfield: 'Singrauli',
    mineName: 'Jayant OCP',
    state: 'Madhya Pradesh',
    moisture: 6.2,
    ash: 24.5,
    volatileMatter: 27.1,
    fixedCarbon: 42.2,
    sulphur: 0.78,
    carbon: 58.2,
    hydrogen: 4.1,
    nitrogen: 0.95,
    oxygen: 35.97,
    latitude: 24.18,
    longitude: 82.65
  },
  {
    name: 'Korba Power Coal (SECL)',
    coalfield: 'Korba',
    mineName: 'Gevra Mega Project',
    state: 'Chhattisgarh',
    moisture: 7.5,
    ash: 32.2,
    volatileMatter: 24.1,
    fixedCarbon: 36.2,
    sulphur: 0.61,
    carbon: 49.5,
    hydrogen: 3.7,
    nitrogen: 0.8,
    oxygen: 45.39,
    latitude: 22.35,
    longitude: 82.60
  }
];

// Historical Predictions
export const INITIAL_HISTORY = [
  {
    sampleId: 'CCX-2026-001',
    mineName: 'Gevra OCP',
    coalfield: 'Korba',
    state: 'Chhattisgarh',
    gcv: 4852,
    grade: 'G9',
    confidence: 98.2,
    timestamp: '2026-07-24 14:22:01',
    status: 'OPTIMAL'
  },
  {
    sampleId: 'CCX-2026-002',
    mineName: 'Moonidih UG',
    coalfield: 'Jharia',
    state: 'Jharkhand',
    gcv: 6420,
    grade: 'G3',
    confidence: 97.8,
    timestamp: '2026-07-24 14:12:00',
    status: 'OPTIMAL'
  },
  {
    sampleId: 'CCX-2026-003',
    mineName: 'Jayant OCP',
    coalfield: 'Singrauli',
    state: 'Madhya Pradesh',
    gcv: 5120,
    grade: 'G8',
    confidence: 96.5,
    timestamp: '2026-07-24 11:34:12',
    status: 'OPTIMAL'
  },
  {
    sampleId: 'CCX-2026-004',
    mineName: 'Belpahar OCP',
    coalfield: 'Ib Valley',
    state: 'Odisha',
    gcv: 3950,
    grade: 'G12',
    confidence: 94.2,
    timestamp: '2026-07-23 16:45:30',
    status: 'LIMIT'
  },
  {
    sampleId: 'CCX-2026-005',
    mineName: 'Rajmahal OCP',
    coalfield: 'Rajmahal',
    state: 'Jharkhand',
    gcv: 3610,
    grade: 'G13',
    confidence: 92.1,
    timestamp: '2026-07-23 09:12:44',
    status: 'OPTIMAL'
  },
  {
    sampleId: 'CCX-2026-006',
    mineName: 'Sonalpur UG',
    coalfield: 'Raniganj',
    state: 'West Bengal',
    gcv: 6180,
    grade: 'G4',
    confidence: 98.9,
    timestamp: '2026-07-22 15:30:11',
    status: 'OPTIMAL'
  },
  {
    sampleId: 'CCX-2026-007',
    mineName: 'Padmapur OCP',
    coalfield: 'Wardha Valley',
    state: 'Maharashtra',
    gcv: 4720,
    grade: 'G9',
    confidence: 88.5,
    timestamp: '2026-07-22 11:05:00',
    status: 'OUTLIER'
  }
];

// Mock Analytics Data
export const MOCK_ANALYTICS: MineAnalyticsData = {
  monthlyTrends: [
    { month: 'Jan', gcv: 5200, ash: 22.1, moisture: 5.4 },
    { month: 'Feb', gcv: 5350, ash: 21.4, moisture: 5.2 },
    { month: 'Mar', gcv: 5100, ash: 23.2, moisture: 5.5 },
    { month: 'Apr', gcv: 5420, ash: 20.8, moisture: 4.9 },
    { month: 'May', gcv: 5500, ash: 19.9, moisture: 4.6 },
    { month: 'Jun', gcv: 4950, ash: 24.6, moisture: 6.8 }, // Monsoon onset
    { month: 'Jul', gcv: 4850, ash: 25.1, moisture: 7.2 }
  ],
  accuracyDistribution: [
    { range: '±0.5%', count: 145 },
    { range: '±1.0%', count: 86 },
    { range: '±1.5%', count: 32 },
    { range: '±2.0%', count: 11 },
    { range: '>2.0%', count: 3 }
  ],
  gradeDistribution: [
    { grade: 'G3-G5', count: 48 },
    { grade: 'G6-G8', count: 92 },
    { grade: 'G9-G11', count: 114 },
    { grade: 'G12-G14', count: 54 },
    { grade: 'G15+', count: 18 }
  ],
  mineComparison: [
    { mine: 'Gevra (SECL)', avgGcv: 4920, avgAsh: 28.5, avgMoisture: 7.1 },
    { mine: 'Moonidih (BCCL)', avgGcv: 6410, avgAsh: 13.2, avgMoisture: 1.4 },
    { mine: 'Sonalpur (ECL)', avgGcv: 6120, avgAsh: 15.1, avgMoisture: 3.2 },
    { mine: 'Jayant (NCL)', avgGcv: 5380, avgAsh: 22.8, avgMoisture: 5.8 },
    { mine: 'Lakhanpur (MCL)', avgGcv: 4720, avgAsh: 31.4, avgMoisture: 7.6 }
  ]
};

// Confidence Details
export const MOCK_CONFIDENCE_METRIC: ConfidenceMetric = {
  veracityScore: 99.8,
  neuralNodesCount: 1024,
  stabilityScore: 98.4,
  stabilityTimeline: [
    { time: '10m ago', value: 98.2 },
    { time: '8m ago', value: 97.9 },
    { time: '6m ago', value: 98.5 },
    { time: '4m ago', value: 98.1 },
    { time: '2m ago', value: 98.3 },
    { time: 'Now', value: 98.4 }
  ],
  driftStatus: 'NONE',
  riskScore: 'Low'
};

export const MOCK_CONFIDENCE_LOGS: ConfidenceLog[] = [
  { timestamp: '2026-07-24 14:22:01', modelVersion: 'Cortex-v4.2-Prod', confidence: 98.2, stability: 'OPTIMAL', action: 'Audit Approved' },
  { timestamp: '2026-07-24 14:12:00', modelVersion: 'Cortex-v4.2-Prod', confidence: 97.8, stability: 'OPTIMAL', action: 'Audit Approved' },
  { timestamp: '2026-07-24 11:34:12', modelVersion: 'Cortex-v4.2-Prod', confidence: 96.5, stability: 'OPTIMAL', action: 'Audit Approved' },
  { timestamp: '2026-07-23 16:45:30', modelVersion: 'Cortex-v4.2-Prod', confidence: 94.2, stability: 'STABLE', action: 'Manual Review Flags' },
  { timestamp: '2026-07-23 09:12:44', modelVersion: 'Cortex-v4.2-Prod', confidence: 92.1, stability: 'STABLE', action: 'Audit Approved' },
  { timestamp: '2026-07-22 15:30:11', modelVersion: 'Cortex-v4.1-Legacy', confidence: 98.9, stability: 'OPTIMAL', action: 'Audit Approved' },
  { timestamp: '2026-07-22 11:05:00', modelVersion: 'Cortex-v4.1-Legacy', confidence: 88.5, stability: 'WARNING', action: 'Outlier Corrected' }
];
