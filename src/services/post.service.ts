import { api, publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Post, CreatePostData, BackendResponse } from '../types';

export const postService = {
  async getPosts(params?: {
    page?: number;
    size?: number;
    status?: string;
    category_id?: string;
    tag_id?: string;
    search?: string;
    author?: string;
  }): Promise<Post[]> {
    const response = await publicApi.get<BackendResponse<Post[]>>(
      API_ENDPOINTS.POSTS.LIST,
      { params }
    );
    return response.data.result;
  },

  async getPost(id: string): Promise<Post> {
    const response = await publicApi.get<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.DETAIL(id)
    );
    return response.data.result;
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.CREATE,
      data
    );
    return response.data.result;
  },

  async updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
    const response = await api.put<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      data
    );
    return response.data.result;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },

  /**
   * Update post status (published, draft, or archived).
   * Requires authentication token (Bearer token from localStorage).
   * Token is automatically added by api interceptor.
   */
  async updatePostStatus(
    id: string,
    status: 'published' | 'draft' | 'archived'
  ): Promise<Post> {
    // Uses 'api' instance which has token interceptor
    // Token is automatically added from localStorage.getItem('access_token')
    const response = await api.put<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.STATUS(id),
      { status }
    );
    return response.data.result;
  },
};
