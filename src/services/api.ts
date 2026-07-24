import type { 
  CoalSample, 
  PredictionResult, 
  MineAnalyticsData, 
  ConfidenceMetric, 
  ConfidenceLog, 
  CoalIndiaSubsidiary, 
  BlendRecommendation 
} from '../types';
import { 
  getCoalGrade, 
  CIL_SUBSIDIARIES, 
  MOCK_ANALYTICS, 
  MOCK_CONFIDENCE_METRIC, 
  MOCK_CONFIDENCE_LOGS, 
  INITIAL_HISTORY 
} from '../constants/mockData';

// Simulated database in localStorage to maintain state across pages
const DB_KEYS = {
  HISTORY: 'carbon_cortex_history',
  SETTINGS: 'carbon_cortex_settings',
  LAST_PREDICTION: 'carbon_cortex_last_pred'
};

// Initial setup helper
const initializeLocalStorage = () => {
  if (!localStorage.getItem(DB_KEYS.HISTORY)) {
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY));
  }
  if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({
      modelVersion: 'Cortex-v4.2-Prod',
      alertThreshold: 90.0,
      autoRefresh: true,
      apiEndpoint: 'https://api.carboncortex.cil/v1'
    }));
  }
};
initializeLocalStorage();

// Simulated API Latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Predict Coal GCV and generate SHAP values based on proximate/ultimate analysis
  predictCoalQuality: async (sample: CoalSample): Promise<PredictionResult> => {
    await delay(3000); // Simulate ML inference delay

    // Empirical formula for Indian Coals (Realistic GCV estimation)
    // Baseline: 8200 kcal/kg for pure carbon. Decreases with Ash, Moisture, Sulphur.
    const rawGcv = 8250 - (88 * sample.ash) - (72 * sample.moisture) - (120 * sample.sulphur) + (sample.fixedCarbon * 5);
    const predictedGcv = Math.round(Math.max(2500, Math.min(RawGcvToKcal(rawGcv), 7800)));
    
    // Determine status
    let status: 'OPTIMAL' | 'LIMIT' | 'OUTLIER' = 'OPTIMAL';
    if (sample.ash > 35 || sample.moisture > 15) {
      status = 'LIMIT';
    } else if (sample.ash > 45 || sample.moisture > 22) {
      status = 'OUTLIER';
    }

    // Determine Coal Grade
    const coalGrade = getCoalGrade(predictedGcv);

    // Calculate SHAP contributions relative to base value (e.g. 5200)
    const fixedCarbonImpact = (sample.fixedCarbon - 45) * 35;
    const volatileMatterImpact = (sample.volatileMatter - 25) * 12;
    const moistureImpact = -(sample.moisture - 5) * 65;
    const ashImpact = -(sample.ash - 20) * 85;
    const sulphurImpact = -(sample.sulphur - 0.6) * 110;

    const shapValues = [
      { feature: 'Fixed Carbon', value: Number(fixedCarbonImpact.toFixed(2)), impact: fixedCarbonImpact >= 0 ? 'positive' as const : 'negative' as const, actualValue: `${sample.fixedCarbon}%` },
      { feature: 'Volatile Matter', value: Number(volatileMatterImpact.toFixed(2)), impact: volatileMatterImpact >= 0 ? 'positive' as const : 'negative' as const, actualValue: `${sample.volatileMatter}%` },
      { feature: 'Moisture', value: Number(moistureImpact.toFixed(2)), impact: moistureImpact >= 0 ? 'positive' as const : 'negative' as const, actualValue: `${sample.moisture}%` },
      { feature: 'Ash Content', value: Number(ashImpact.toFixed(2)), impact: ashImpact >= 0 ? 'positive' as const : 'negative' as const, actualValue: `${sample.ash}%` },
      { feature: 'Sulphur', value: Number(sulphurImpact.toFixed(2)), impact: sulphurImpact >= 0 ? 'positive' as const : 'negative' as const, actualValue: `${sample.sulphur}%` }
    ];

    // Build narrative based on features
    const primaryDriver = fixedCarbonImpact > Math.abs(ashImpact) ? 'Fixed Carbon' : 'Ash Content';
    const primaryImpactStr = primaryDriver === 'Fixed Carbon' 
      ? 'primary driver for high thermal output' 
      : 'principal factor reducing heating values';
    
    const narrative = `"${primaryDriver} was the ${primaryImpactStr} for ${sample.coalfield} coal. Fixed Carbon was calculated at ${sample.fixedCarbon}%, while Ash content marginally ${sample.ash > 20 ? 'reduced' : 'stabilized'} prediction confidence."`;

    const result: PredictionResult = {
      sampleId: sample.sampleId || `CCX-2026-${Math.floor(Math.random() * 900 + 100)}`,
      predictedGcv,
      coalGrade,
      confidence: Number((95 + Math.random() * 4).toFixed(1)), // 95% - 99%
      predictionTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status,
      shapValues,
      analysisDurationMs: 24, // simulated inference duration
      narrative
    };

    // Save to local storage database
    localStorage.setItem(DB_KEYS.LAST_PREDICTION, JSON.stringify(result));
    
    // Add to history
    const history = JSON.parse(localStorage.getItem(DB_KEYS.HISTORY) || '[]');
    const newHistoryItem = {
      sampleId: result.sampleId,
      mineName: sample.mineName,
      coalfield: sample.coalfield,
      state: sample.state,
      gcv: result.predictedGcv,
      grade: result.coalGrade,
      confidence: result.confidence,
      timestamp: result.predictionTime,
      status: result.status
    };
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify([newHistoryItem, ...history]));

    return result;
  },

  getLastPrediction: async (): Promise<PredictionResult | null> => {
    const raw = localStorage.getItem(DB_KEYS.LAST_PREDICTION);
    if (!raw) return null;
    return JSON.parse(raw);
  },

  getPredictionHistory: async (): Promise<any[]> => {
    await delay(500);
    return JSON.parse(localStorage.getItem(DB_KEYS.HISTORY) || '[]');
  },

  clearHistory: async (): Promise<void> => {
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify([]));
  },

  getAnalytics: async (): Promise<MineAnalyticsData> => {
    await delay(800);
    return MOCK_ANALYTICS;
  },

  getConfidenceMetrics: async (): Promise<ConfidenceMetric> => {
    await delay(400);
    return MOCK_CONFIDENCE_METRIC;
  },

  getConfidenceLogs: async (): Promise<ConfidenceLog[]> => {
    await delay(600);
    return MOCK_CONFIDENCE_LOGS;
  },

  getMapSubsidiaries: async (): Promise<CoalIndiaSubsidiary[]> => {
    await delay(300);
    return CIL_SUBSIDIARIES;
  },

  getBlendRecommendation: async (params: { gcvTarget: number; budget: number; quantity: number }): Promise<BlendRecommendation> => {
    await delay(1200); // Blend optimization solver delay

    // Calculate a realistic blending allocation based on Target GCV
    // Mine A (Superior): 5800 GCV, Cost: $82
    // Mine B (Mid-Tier): 4200 GCV, Cost: $48
    // Mine C (Utility): 3100 GCV, Cost: $28.46
    const target = params.gcvTarget;
    let ratioA = 0.45;
    let ratioB = 0.35;
    let ratioC = 0.20;

    // Adjust ratios based on target
    if (target > 5000) {
      ratioA = 0.70;
      ratioB = 0.20;
      ratioC = 0.10;
    } else if (target < 4000) {
      ratioA = 0.20;
      ratioB = 0.30;
      ratioC = 0.50;
    }

    const calculatedGcv = Math.round(5800 * ratioA + 4200 * ratioB + 3100 * ratioC);
    
    // Costs
    const costA = 82.00 * (params.quantity * ratioA);
    const costB = 48.00 * (params.quantity * ratioB);
    const costC = 28.46 * (params.quantity * ratioC);
    const totalCost = Math.round(costA + costB + costC);
    
    
    // Savings calculation compared to buying Mine A only
    const standardCost = params.quantity * 82.00;
    const savings = Math.round(standardCost - totalCost);

    return {
      components: [
        { mineName: 'Mine A (Superior)', ratio: Math.round(ratioA * 100), gcv: 5800, costPerTon: 82.00 },
        { mineName: 'Mine B (Mid-Tier)', ratio: Math.round(ratioB * 100), gcv: 4200, costPerTon: 48.00 },
        { mineName: 'Mine C (Utility)', ratio: Math.round(ratioC * 100), gcv: 3100, costPerTon: 28.46 }
      ],
      expectedGcv: calculatedGcv,
      totalCost,
      savings,
      efficiency: 100
    };
  },

  getSystemSettings: async (): Promise<any> => {
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  },

  updateSystemSettings: async (settings: any): Promise<any> => {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }
};

// Helper function for raw GCV to Kcal conversion
function RawGcvToKcal(val: number): number {
  return val;
}
