import apiClient from './client';

export interface ReportData {
  title: string;
  report_type: string;
  generated_at: string;
  record_count: number;
  summary: string;
  data: any[];
}

export const reportApi = {
  getReportByType: async (type: string): Promise<ReportData> => {
    const res = await apiClient.get<ReportData>(`/reports/${type}`);
    return res.data;
  },

  generateCustomReport: async (payload: { report_type: string; mine_id?: string; start_date?: string; end_date?: string }): Promise<ReportData> => {
    const res = await apiClient.post<ReportData>('/reports/generate', payload);
    return res.data;
  }
};
