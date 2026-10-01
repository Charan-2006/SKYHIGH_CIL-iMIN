import apiClient from './client';

export interface ShapValue {
  feature: string;
  value: number;
  impact: 'positive' | 'negative';
  actual_value: string | number;
}

export interface PredictionPayload {
  sample_code?: string;
  mine_name: string;
  seam: string;
  depth: number;
  coalfield: string;
  state: string;
  latitude?: number;
  longitude?: number;
  geological_features?: Record<string, any>;
  production_features?: Record<string, any>;
  sensor_features?: Record<string, any>;
  moisture?: number;
  ash?: number;
  volatile_matter?: number;
  fixed_carbon?: number;
  sulphur?: number;
}

export interface PredictionResult {
  prediction_id: string;
  sample_id: string;
  sample_code: string;
  mine_name: string;
  coalfield: string;
  state: string;
  predictions: {
    gcv: number;
    ash: number;
    moisture: number;
    volatile_matter: number;
    fixed_carbon: number;
  };
  grade: string;
  quality_score: number;
  confidence: number;
  verification_required: boolean;
  decision: string;
  status: 'OPTIMAL' | 'LIMIT' | 'OUTLIER';
  model_version: string;
  explanation_available: boolean;
  shap_values?: ShapValue[];
  narrative?: string;
  created_at: string;
}

export interface PredictionExplanation {
  prediction_id: string;
  sample_id: string;
  base_value: number;
  predicted_gcv: number;
  shap_contributions: ShapValue[];
  top_positive_features: ShapValue[];
  top_negative_features: ShapValue[];
  disclaimer: string;
  narrative: string;
}

export const predictionApi = {
  createPrediction: async (payload: PredictionPayload): Promise<PredictionResult> => {
    const res = await apiClient.post<PredictionResult>('/predictions', payload);
    return res.data;
  },

  getPrediction: async (id: string): Promise<PredictionResult> => {
    const res = await apiClient.get<PredictionResult>(`/predictions/${id}`);
    return res.data;
  },

  getExplanation: async (id: string): Promise<PredictionExplanation> => {
    const res = await apiClient.get<PredictionExplanation>(`/predictions/${id}/explanation`);
    return res.data;
  },

  getHistory: async (limit: number = 50): Promise<PredictionResult[]> => {
    const res = await apiClient.get<PredictionResult[]>(`/predictions/history?limit=${limit}`);
    return res.data;
  },

  clearHistory: async (): Promise<void> => {
    await apiClient.delete('/predictions/history');
  },

  getConfidenceMetrics: async (): Promise<any> => {
    const res = await apiClient.get('/predictions/confidence/metrics');
    return res.data;
  },

  getConfidenceLogs: async (): Promise<any[]> => {
    const res = await apiClient.get('/predictions/confidence/logs');
    return res.data;
  }
};
