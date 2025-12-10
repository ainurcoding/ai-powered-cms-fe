import { api, publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  Post,
  CreatePostData,
  PaginatedResponse,
  BackendResponse,
} from '../types';

export const postService = {
  async getPosts(params?: {
    page?: number;
    size?: number;
    status?: string;
    category_id?: string;
    tag_id?: string;
    search?: string;
  }): Promise<PaginatedResponse<Post>> {
    const response = await publicApi.get<
      BackendResponse<PaginatedResponse<Post>>
    >(API_ENDPOINTS.POSTS.LIST, { params });
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

  async publishPost(id: string): Promise<Post> {
    const response = await api.post<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.PUBLISH(id)
    );
    return response.data.result;
  },

  async unpublishPost(id: string): Promise<Post> {
    const response = await api.post<BackendResponse<Post>>(
      API_ENDPOINTS.POSTS.UNPUBLISH(id)
    );
    return response.data.result;
  },
};
