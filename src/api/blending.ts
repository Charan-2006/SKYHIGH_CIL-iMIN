import apiClient from './client';

export interface BlendSource {
  source_id: string;
  mine_name: string;
  available_quantity: number;
  gcv: number;
  ash: number;
  moisture: number;
  volatile_matter: number;
  cost_per_ton: number;
}

export interface BlendOptimizeRequest {
  sources: BlendSource[];
  target_quantity: number;
  target_gcv: number;
  max_ash?: number;
  max_moisture?: number;
  max_cost?: number;
  objective?: 'MINIMIZE_COST' | 'MAXIMIZE_QUALITY' | 'MINIMIZE_DEVIATION';
}

export interface BlendAllocationItem {
  source_id: string;
  mine_name: string;
  allocated_quantity: number;
  ratio_percentage: number;
  gcv: number;
  ash: number;
  moisture: number;
  cost_per_ton: number;
  subtotal_cost: number;
}

export interface BlendOptimizeResponse {
  id: string;
  blend_id: string;
  allocations: BlendAllocationItem[];
  blended_gcv: number;
  blended_ash: number;
  blended_moisture: number;
  blended_vm: number;
  total_quantity: number;
  total_cost: number;
  cost_per_ton: number;
  savings: number;
  feasibility: boolean;
  solver_status: string;
  solver_time_ms: number;
  recommendation_summary: string;
  created_at: string;
}

export const blendingApi = {
  optimize: async (params: BlendOptimizeRequest): Promise<BlendOptimizeResponse> => {
    const res = await apiClient.post<BlendOptimizeResponse>('/blending/optimize', params);
    return res.data;
  },

  getHistory: async (): Promise<BlendOptimizeResponse[]> => {
    const res = await apiClient.get<BlendOptimizeResponse[]>('/blending/history');
    return res.data;
  }
};
