// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  is_active: boolean;
  role?: 'ADMIN' | 'EDITOR' | 'USER';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// Post Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: 'draft' | 'published';
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  author_id: string;
  category_id: string | null;
  view_count: number;
  is_ai_generated: boolean;
  ai_prompt: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  category: Category | null;
  tags: Tag[];
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  category_ids?: string[];
  tag_ids?: string[];
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  post_count?: string;
  children?: Category[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagData {
  name: string;
}

// Media Types
export interface Media {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

// AI Types
export interface AIGenerateContentRequest {
  prompt: string;
  max_length?: number;
  temperature?: number;
}

export interface AIGenerateContentResponse {
  content: string;
  tokens_used: number;
}

export interface AISuggestTagsRequest {
  content: string;
  max_tags?: number;
}

export interface AISuggestTagsResponse {
  tags: string[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Backend Response Wrapper
export interface BackendResponse<T> {
  message?: string;
  result: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: Post[];
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// Google OAuth Types
export interface GoogleAuthUrlResponse {
  message?: string;
  success?: boolean;
  result: {
    authUrl: string;
    message?: string;
  };
}

export interface GoogleOAuthCallbackResponse {
  message?: string;
  success?: boolean;
  result: {
    token: string;
    user: User;
    isNewUser: boolean;
    message?: string;
  };
}
