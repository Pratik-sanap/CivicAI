import axios from 'axios';

import type { ImageAnalysisResponse } from '../types/analysis';
import type { ReportCreatePayload, ReportRecord } from '../types/report';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const reportApiClient = axios.create({
  baseURL: apiBaseUrl,
});

export async function analyzeImageIssue(image: File, notes?: string): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append('image', image);

  if (notes?.trim()) {
    formData.append('notes', notes.trim());
  }

  const response = await reportApiClient.post<ImageAnalysisResponse>('/analysis/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function submitReport(payload: ReportCreatePayload): Promise<ReportRecord> {
  const response = await reportApiClient.post<ReportRecord>('/reports', payload);
  return response.data;
}
