import { publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { DashboardStats, Post, BackendResponse } from '../types';
import { categoryService } from './category.service';
import { tagService } from './tag.service';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // Fetch all data in parallel
    const [
      allPostsResponse,
      publishedPostsResponse,
      categoriesResponse,
      tagsResponse,
      recentPostsResponse,
    ] = await Promise.all([
      // Get all posts (for total count) - fetch all without pagination
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST),
      // Get published posts (for published count) - fetch all without pagination
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST, {
        params: { status: 'published' },
      }),
      // Get all categories
      categoryService.getCategories(),
      // Get all tags
      tagService.getTags(),
      // Get recent posts (last 5) - sort by created_at desc
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST, {
        params: {
          sortBy: 'created_at',
          sortOrder: 'desc',
        },
      }),
    ]);

    const allPosts = allPostsResponse.data.result;
    const publishedPosts = publishedPostsResponse.data.result;
    const categories = categoriesResponse;
    const tags = tagsResponse;
    const allPostsForRecent = recentPostsResponse.data.result;

    // Sort and get recent 5 posts
    const recentPosts = [...allPostsForRecent]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    return {
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      recentPosts: recentPosts,
    };
  },
};
