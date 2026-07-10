import axios from 'axios';

import type { ImageAnalysisResponse } from '../types/analysis';
import type { ReportCreatePayload, ReportRecord } from '../types/report';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const reportApiClient = axios.create({
  baseURL: apiBaseUrl,
});

/**
 * POST /analyze — Upload image + optional location to Gemini Vision AI.
 *
 * Sends the image as multipart/form-data along with optional latitude
 * and longitude. The backend uploads to Supabase Storage, runs Gemini
 * analysis, and returns the structured response.
 */
export async function analyzeImageIssue(
  image: File,
  notes?: string,
  latitude?: number,
  longitude?: number,
): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append('image', image);

  if (notes?.trim()) {
    formData.append('notes', notes.trim());
  }

  if (latitude !== undefined && latitude !== null) {
    formData.append('latitude', String(latitude));
  }

  if (longitude !== undefined && longitude !== null) {
    formData.append('longitude', String(longitude));
  }

  const response = await reportApiClient.post<ImageAnalysisResponse>('/analyze', formData, {
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
