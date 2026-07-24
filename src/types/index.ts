export interface CoalSample {
  id?: string;
  sampleId: string;
  mineName: string;
  coalfield: string;
  state: string;
  moisture: number; // Proximate (%)
  ash: number;      // Proximate (%)
  volatileMatter: number; // Proximate (%)
  fixedCarbon: number;    // Proximate (%)
  sulphur: number;        // Ultimate (%)
  carbon: number;         // Ultimate (%)
  hydrogen: number;       // Ultimate (%)
  nitrogen: number;       // Ultimate (%)
  oxygen: number;         // Ultimate (%)
  latitude: number;
  longitude: number;
}

export interface ShapValue {
  feature: string;
  value: number;
  impact: 'positive' | 'negative';
  actualValue: string | number;
}

export interface PredictionResult {
  sampleId: string;
  predictedGcv: number; // kcal/kg
  coalGrade: string;    // e.g. G3, G5
  confidence: number;   // e.g. 98.2%
  predictionTime: string; // Timestamp
  status: 'OPTIMAL' | 'LIMIT' | 'OUTLIER';
  shapValues: ShapValue[];
  analysisDurationMs: number;
  narrative: string;
}

export interface ConfidenceMetric {
  veracityScore: number; // e.g. 99.8%
  neuralNodesCount: number; // e.g. 1024
  stabilityScore: number; // e.g. 98.4%
  stabilityTimeline: { time: string; value: number }[];
  driftStatus: 'NONE' | 'DRIFT_DETECTED';
  riskScore: 'Low' | 'Medium' | 'High';
}

export interface ConfidenceLog {
  timestamp: string;
  modelVersion: string;
  confidence: number;
  stability: 'OPTIMAL' | 'STABLE' | 'WARNING';
  action: string;
}

export interface BlendComponent {
  mineName: string;
  ratio: number; // Percentage, e.g. 45
  gcv: number;
  costPerTon: number;
}

export interface BlendRecommendation {
  components: BlendComponent[];
  expectedGcv: number;
  totalCost: number;
  savings: number;
  efficiency: number;
}

export interface MineAnalyticsData {
  monthlyTrends: { month: string; gcv: number; ash: number; moisture: number }[];
  accuracyDistribution: { range: string; count: number }[];
  gradeDistribution: { grade: string; count: number }[];
  mineComparison: { mine: string; avgGcv: number; avgAsh: number; avgMoisture: number }[];
}

export interface CoalIndiaSubsidiary {
  id: string;
  name: string;
  fullName: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  productionCapacity: string;
  activeMinesCount: number;
  avgGcv: number;
}
