import { publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Tag, CreateTagData, BackendResponse } from '../types';

export const tagService = {
  async getTags(): Promise<Tag[]> {
    const response = await publicApi.get<BackendResponse<Tag[]>>(
      API_ENDPOINTS.TAGS.LIST
    );
    return response.data.result;
  },

  async getPopularTags(limit: number = 5): Promise<Tag[]> {
    const response = await publicApi.get<BackendResponse<Tag[]>>(
      API_ENDPOINTS.TAGS.LIST,
      {
        params: {
          sortBy: 'post_count',
          limit,
          order: 'desc',
        },
      }
    );
    return response.data.result;
  },

  async getTag(id: string): Promise<Tag> {
    const response = await publicApi.get<BackendResponse<Tag>>(
      API_ENDPOINTS.TAGS.DETAIL(id)
    );
    return response.data.result;
  },

  async createTag(data: CreateTagData): Promise<Tag> {
    const response = await publicApi.post<BackendResponse<Tag>>(
      API_ENDPOINTS.TAGS.CREATE,
      data
    );
    return response.data.result;
  },

  async updateTag(id: string, data: Partial<CreateTagData>): Promise<Tag> {
    const response = await publicApi.put<BackendResponse<Tag>>(
      API_ENDPOINTS.TAGS.UPDATE(id),
      data
    );
    return response.data.result;
  },

  async deleteTag(id: string): Promise<void> {
    await publicApi.delete(API_ENDPOINTS.TAGS.DELETE(id));
  },
};
