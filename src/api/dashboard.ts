import apiClient from './client';

export interface DashboardSummary {
  total_samples: number;
  predictions_generated: number;
  high_confidence_predictions: number;
  verification_required_predictions: number;
  pending_laboratory_verifications: number;
  completed_laboratory_verifications: number;
  average_gcv: number;
  average_ash: number;
  average_moisture: number;
  active_model_version: string;
  active_model_r2_gcv: number;
  optimization_runs: number;
  successful_blends: number;
  stability_score: number;
  operational_drift: number;
  active_edge_nodes: number;
  telemetry_status: string;
}

export interface DashboardTrends {
  monthly_trends: { month: string; gcv: number; ash: number; moisture: number }[];
  accuracy_distribution: { range: string; count: number }[];
  grade_distribution: { grade: string; count: number }[];
  mine_comparison: { mine: string; avgGcv: number; avgAsh: number; avgMoisture: number }[];
  confidence_distribution: { bucket: string; count: number }[];
  recent_predictions: {
    sampleId: string;
    mineName: string;
    coalfield: string;
    state: string;
    gcv: number;
    ash: number;
    grade: string;
    confidence: number;
    timestamp: string;
    status: string;
    verification_required: boolean;
  }[];
}

export interface Subsidiary {
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

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return res.data;
  },

  getTrends: async (): Promise<DashboardTrends> => {
    const res = await apiClient.get<DashboardTrends>('/dashboard/trends');
    return res.data;
  },

  getSubsidiaries: async (): Promise<Subsidiary[]> => {
    const res = await apiClient.get<Subsidiary[]>('/dashboard/subsidiaries');
    return res.data;
  }
};
