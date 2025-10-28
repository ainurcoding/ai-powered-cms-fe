import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Category, CreateCategoryData } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
    return response.data;
  },

  async updateCategory(
    id: string,
    data: Partial<CreateCategoryData>
  ): Promise<Category> {
    const response = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  },
};

