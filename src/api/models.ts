import apiClient from './client';

export interface RegressionMetrics {
  mae: number;
  rmse: number;
  r2: number;
  mape?: number;
}

export interface TargetMetrics {
  gcv: RegressionMetrics;
  ash: RegressionMetrics;
  moisture: RegressionMetrics;
  volatile_matter: RegressionMetrics;
  fixed_carbon?: RegressionMetrics;
}

export interface ModelVersion {
  id: string;
  version: string;
  status: 'ACTIVE' | 'CANDIDATE' | 'RETIRED';
  dataset_version: string;
  training_samples: number;
  verified_samples: number;
  metrics: TargetMetrics;
  created_at: string;
}

export interface RetrainResult {
  candidate_version: string;
  prior_active_version: string;
  promoted_to_active: boolean;
  training_samples_count: number;
  verified_samples_incorporated: number;
  metrics: TargetMetrics;
  comparison_summary: string;
  message: string;
}

export const modelApi = {
  listVersions: async (): Promise<ModelVersion[]> => {
    const res = await apiClient.get<ModelVersion[]>('/models');
    return res.data;
  },

  getActive: async (): Promise<ModelVersion> => {
    const res = await apiClient.get<ModelVersion>('/models/active');
    return res.data;
  },

  retrain: async (minEvaluationR2: number = 0.85): Promise<RetrainResult> => {
    const res = await apiClient.post<RetrainResult>('/models/retrain', {
      min_evaluation_r2: minEvaluationR2
    });
    return res.data;
  }
};
