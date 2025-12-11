import { publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { DashboardStats, Post, BackendResponse } from '../types';
import { categoryService } from './category.service';
import { tagService } from './tag.service';

export const dashboardService = {
  async getDashboardStats(authorId?: string): Promise<DashboardStats> {
    // Fetch all data in parallel
    const [
      allPostsResponse,
      publishedPostsResponse,
      categoriesResponse,
      tagsResponse,
      recentPostsResponse,
    ] = await Promise.all([
      // Get all posts (for total count) - fetch all without pagination
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST, {
        params: authorId ? { author: authorId } : undefined,
      }),
      // Get published posts (for published count) - fetch all without pagination
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST, {
        params: authorId
          ? { status: 'published', author: authorId }
          : { status: 'published' },
      }),
      // Get all categories (categories and tags are global, not filtered by author)
      categoryService.getCategories(),
      // Get all tags
      tagService.getTags(),
      // Get recent posts (last 5) - sort by created_at desc
      publicApi.get<BackendResponse<Post[]>>(API_ENDPOINTS.POSTS.LIST, {
        params: authorId
          ? {
              author: authorId,
              sortBy: 'created_at',
              sortOrder: 'desc',
            }
          : {
              sortBy: 'created_at',
              sortOrder: 'desc',
            },
      }),
    ]);

    const allPosts = allPostsResponse.data.result;
    const publishedPosts = publishedPostsResponse.data.result;
    const allPostsForRecent = recentPostsResponse.data.result;

    // Sort and get recent 5 posts
    const recentPosts = [...allPostsForRecent]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    // Calculate categories and tags from filtered posts
    // If authorId is provided, only count categories/tags from user's posts
    // Otherwise, get all categories/tags
    let totalCategories: number;
    let totalTags: number;

    if (authorId) {
      // Count unique categories and tags from user's posts
      const uniqueCategoryIds = new Set<string>();
      const uniqueTagIds = new Set<string>();

      allPosts.forEach((post) => {
        if (post.category_id) {
          uniqueCategoryIds.add(post.category_id);
        }
        post.tags?.forEach((tag) => {
          uniqueTagIds.add(tag.id);
        });
      });

      totalCategories = uniqueCategoryIds.size;
      totalTags = uniqueTagIds.size;
    } else {
      // Get all categories and tags
      totalCategories = categoriesResponse.length;
      totalTags = tagsResponse.length;
    }

    return {
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      totalCategories,
      totalTags,
      recentPosts: recentPosts,
    };
  },
};
