export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    GOOGLE_URL: '/auth/google/url',
    GOOGLE_CALLBACK: '/auth/google/callback',
    REFRESH: '/auth/refresh',
  },
  // Posts
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    PUBLISH: (id: string) => `/posts/${id}/publish`,
    UNPUBLISH: (id: string) => `/posts/${id}/unpublish`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  // Tags
  TAGS: {
    LIST: '/tags',
    CREATE: '/tags',
    DETAIL: (id: string) => `/tags/${id}`,
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
  },
  // Media
  MEDIA: {
    UPLOAD: '/media/upload',
    LIST: '/media',
    DELETE: (id: string) => `/media/${id}`,
  },
  // AI
  AI: {
    GENERATE_CONTENT: '/ai/generate-content',
    GENERATE_IMAGE: '/ai/generate-image',
    OPTIMIZE_SEO: '/ai/optimize-seo',
    SUGGEST_TAGS: '/ai/suggest-tags',
  },
  // Health
  HEALTH: '/health',
};

