import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Tag, CreateTagData } from '../types';

export const tagService = {
  async getTags(): Promise<Tag[]> {
    const response = await api.get(API_ENDPOINTS.TAGS.LIST);
    return response.data;
  },

  async getTag(id: string): Promise<Tag> {
    const response = await api.get(API_ENDPOINTS.TAGS.DETAIL(id));
    return response.data;
  },

  async createTag(data: CreateTagData): Promise<Tag> {
    const response = await api.post(API_ENDPOINTS.TAGS.CREATE, data);
    return response.data;
  },

  async updateTag(id: string, data: Partial<CreateTagData>): Promise<Tag> {
    const response = await api.put(API_ENDPOINTS.TAGS.UPDATE(id), data);
    return response.data;
  },

  async deleteTag(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.TAGS.DELETE(id));
  },
};

