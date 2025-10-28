import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  AIGenerateContentRequest,
  AIGenerateContentResponse,
  AISuggestTagsRequest,
  AISuggestTagsResponse,
} from '../types';

export const aiService = {
  async generateContent(
    request: AIGenerateContentRequest
  ): Promise<AIGenerateContentResponse> {
    const response = await api.post(
      API_ENDPOINTS.AI.GENERATE_CONTENT,
      request
    );
    return response.data;
  },

  async generateImage(prompt: string): Promise<{ image_url: string }> {
    const response = await api.post(API_ENDPOINTS.AI.GENERATE_IMAGE, {
      prompt,
    });
    return response.data;
  },

  async optimizeSEO(content: string): Promise<{
    meta_title: string;
    meta_description: string;
    keywords: string[];
  }> {
    const response = await api.post(API_ENDPOINTS.AI.OPTIMIZE_SEO, {
      content,
    });
    return response.data;
  },

  async suggestTags(
    request: AISuggestTagsRequest
  ): Promise<AISuggestTagsResponse> {
    const response = await api.post(API_ENDPOINTS.AI.SUGGEST_TAGS, request);
    return response.data;
  },
};

