import apiClient from './client';

export interface VerificationRequest {
  id: string;
  request_id: string;
  prediction_id: string;
  sample_id: string;
  sample_code: string;
  mine_name: string;
  predicted_gcv: number;
  predicted_ash: number;
  confidence: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priority: string;
  reason: string;
  created_at: string;
}

export interface LabResultSubmission {
  request_id?: string;
  prediction_id?: string;
  sample_id: string;
  actual_gcv: number;
  actual_ash: number;
  actual_moisture: number;
  actual_vm: number;
  actual_fixed_carbon: number;
  technician_notes?: string;
}

export interface ErrorMetric {
  parameter: string;
  predicted: number;
  actual: number;
  absolute_error: number;
  percentage_error: number;
}

export interface LabResultResponse {
  id: string;
  result_id: string;
  request_id?: string;
  prediction_id?: string;
  sample_id: string;
  sample_code: string;
  mine_name: string;
  actual_values: Record<string, number>;
  predicted_values: Record<string, number>;
  errors: ErrorMetric[];
  gcv_absolute_error: number;
  gcv_percentage_error: number;
  verified_by: string;
  feedback_registered_for_retraining: boolean;
  created_at: string;
}

export const laboratoryApi = {
  createVerification: async (data: { prediction_id: string; sample_id: string; reason?: string; priority?: string }): Promise<VerificationRequest> => {
    const res = await apiClient.post<VerificationRequest>('/laboratory/verification', data);
    return res.data;
  },

  getPending: async (): Promise<VerificationRequest[]> => {
    const res = await apiClient.get<VerificationRequest[]>('/laboratory/pending');
    return res.data;
  },

  submitResults: async (data: LabResultSubmission): Promise<LabResultResponse> => {
    const res = await apiClient.post<LabResultResponse>('/laboratory/results', data);
    return res.data;
  },

  getHistory: async (): Promise<LabResultResponse[]> => {
    const res = await apiClient.get<LabResultResponse[]>('/laboratory/history');
    return res.data;
  }
};
