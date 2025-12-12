import { publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  AIGenerateContentRequest,
  AIGenerateContentResponse,
  AISuggestTagsRequest,
  AISuggestTagsResponse,
  SEOOptimizationResponse,
  BackendResponse,
} from '../types';

export const aiService = {
  async generateContent(
    request: AIGenerateContentRequest
  ): Promise<AIGenerateContentResponse> {
    // Uses publicApi because backend may return Access-Control-Allow-Origin: *
    // Token is automatically added via publicApi interceptor
    const response = await publicApi.post<
      BackendResponse<AIGenerateContentResponse>
    >(API_ENDPOINTS.AI.GENERATE_CONTENT, request);
    return response.data.result;
  },

  async generateImage(prompt: string): Promise<{ image_url: string }> {
    // Uses publicApi because backend may return Access-Control-Allow-Origin: *
    // Token is automatically added via publicApi interceptor
    const response = await publicApi.post<{ image_url: string }>(
      API_ENDPOINTS.AI.GENERATE_IMAGE,
      { prompt }
    );
    return response.data;
  },

  async optimizeSEO(
    content: string,
    title?: string,
    targetKeywords?: string[]
  ): Promise<SEOOptimizationResponse> {
    // Uses publicApi because backend may return Access-Control-Allow-Origin: *
    // Token is automatically added via publicApi interceptor
    const response = await publicApi.post<
      BackendResponse<SEOOptimizationResponse>
    >(API_ENDPOINTS.AI.OPTIMIZE_SEO, {
      content,
      title,
      target_keywords: targetKeywords,
    });
    return response.data.result;
  },

  async suggestTags(
    request: AISuggestTagsRequest
  ): Promise<AISuggestTagsResponse> {
    // Uses publicApi because backend may return Access-Control-Allow-Origin: *
    // Token is automatically added via publicApi interceptor
    const response = await publicApi.post<AISuggestTagsResponse>(
      API_ENDPOINTS.AI.SUGGEST_TAGS,
      request
    );
    return response.data;
  },
};
