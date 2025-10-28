// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  is_active: boolean;
  is_superuser: boolean;
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
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: User;
  categories: Category[];
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
  category_ids?: string[];
  tag_ids?: string[];
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

