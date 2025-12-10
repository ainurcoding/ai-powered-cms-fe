import { publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Category, CreateCategoryData, BackendResponse } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await publicApi.get<BackendResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES.LIST
    );
    return response.data.result;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await publicApi.get<BackendResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.DETAIL(id)
    );
    return response.data.result;
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await publicApi.post<BackendResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.CREATE,
      data
    );
    return response.data.result;
  },

  async updateCategory(
    id: string,
    data: Partial<CreateCategoryData>
  ): Promise<Category> {
    const response = await publicApi.put<BackendResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.UPDATE(id),
      data
    );
    return response.data.result;
  },

  async deleteCategory(id: string): Promise<void> {
    await publicApi.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  },
};
