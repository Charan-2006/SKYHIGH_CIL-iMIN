import apiClient from './client';

export interface DispatchRequirement {
  customer_name: string;
  target_grade?: string;
  min_gcv: number;
  max_ash: number;
  required_quantity: number;
  application_type: 'THERMAL_UTILITY' | 'METALLURGICAL_STEEL' | 'CEMENT_KILN';
  max_budget_per_ton?: number;
}

export interface DispatchRecommendation {
  id: string;
  recommendation_id: string;
  customer_name: string;
  recommended_source: string;
  subsidiary: string;
  allocated_quantity: number;
  matched_gcv: number;
  matched_grade: string;
  quality_match_score: number;
  estimated_cost: number;
  cost_per_ton: number;
  rationale: string;
  priority: string;
  boiler_suitability: string;
  created_at: string;
}

export const dispatchApi = {
  recommend: async (req: DispatchRequirement): Promise<DispatchRecommendation> => {
    const res = await apiClient.post<DispatchRecommendation>('/dispatch/recommend', req);
    return res.data;
  },

  getHistory: async (): Promise<DispatchRecommendation[]> => {
    const res = await apiClient.get<DispatchRecommendation[]>('/dispatch/history');
    return res.data;
  }
};
