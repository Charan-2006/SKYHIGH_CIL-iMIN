import apiClient from './client';
import type { BlendSource } from './blending';

export interface ScenarioParameters {
  sources: BlendSource[];
  target_quantity: number;
  target_gcv: number;
  max_ash?: number;
  max_moisture?: number;
  budget?: number;
}

export interface ScenarioMetric {
  gcv: number;
  ash: number;
  moisture: number;
  volatile_matter: number;
  total_cost: number;
  cost_per_ton: number;
  quality_score: number;
  feasibility: boolean;
}

export interface ScenarioDelta {
  gcv_delta: number;
  ash_delta: number;
  moisture_delta: number;
  vm_delta: number;
  cost_delta: number;
  cost_per_ton_delta: number;
  quality_score_delta: number;
  feasibility_improved: boolean;
}

export interface ScenarioSimulationResult {
  id: string;
  scenario_id: string;
  scenario_name: string;
  baseline_metrics: ScenarioMetric;
  what_if_metrics: ScenarioMetric;
  deltas: ScenarioDelta;
  summary: string;
  strategic_advice: string;
  created_at: string;
}

export const scenarioApi = {
  simulate: async (data: { scenario_name: string; baseline: ScenarioParameters; what_if: ScenarioParameters }): Promise<ScenarioSimulationResult> => {
    const res = await apiClient.post<ScenarioSimulationResult>('/scenarios/simulate', data);
    return res.data;
  },

  getHistory: async (): Promise<ScenarioSimulationResult[]> => {
    const res = await apiClient.get<ScenarioSimulationResult[]>('/scenarios/history');
    return res.data;
  }
};
