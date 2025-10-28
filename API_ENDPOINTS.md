# 🔌 AI CMS Backend API Endpoints

## 📋 **API Collection Overview**

**Base URL:** `http://localhost:8000`  
**Authentication:** Bearer Token  
**Content-Type:** `application/json`

---

## 🔐 **Authentication Endpoints**

### **Login**

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

### **Logout**

```http
GET /auth/logout
Authorization: Bearer {token}
```

### **Check Token**

```http
GET /auth/check-token
Authorization: Bearer {token}
```

---

## 🔗 **Google OAuth Endpoints**

### **Get Google Auth URL**

```http
GET /auth/google/url
```

**Response:**

```json
{
  "success": true,
  "result": {
    "authUrl": "https://accounts.google.com/oauth/authorize?..."
  }
}
```

### **Google OAuth Callback**

```http
GET /auth/google/callback?code={code}&state={state}
```

### **Test Google OAuth Config**

```http
GET /auth/google/test-config
```

---

## 📝 **Posts Endpoints**

### **List Posts**

```http
GET /posts?page=1&limit=10&status=published&sortBy=created_at&sortOrder=desc
```

**Query Parameters:**

- `page` (int): Page number
- `limit` (int): Items per page (max 100)
- `status` (string): Filter by status (draft, published, archived)
- `category` (string): Filter by category ID
- `tag` (string): Filter by tag ID
- `author` (string): Filter by author ID
- `search` (string): Search in title, content, excerpt
- `sortBy` (string): Sort field (created_at, updated_at, title, published_at)
- `sortOrder` (string): Sort order (asc, desc)

### **Get Single Post**

```http
GET /posts/{id}
```

### **Create Post**

```http
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My New Blog Post",
  "content": "<p>This is the full HTML content...</p>",
  "excerpt": "Short description of the post",
  "status": "draft",
  "featuredImage": "https://example.com/image.jpg",
  "categoryId": "uuid",
  "tagIds": ["uuid1", "uuid2"],
  "metaTitle": "SEO Title",
  "metaDescription": "SEO description",
  "metaKeywords": "blog, tutorial, guide"
}
```

### **Update Post**

```http
PUT /posts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "<p>Updated content...</p>",
  "status": "published"
}
```

### **Delete Post**

```http
DELETE /posts/{id}
Authorization: Bearer {token}
```

### **Update Post Status**

```http
PATCH /posts/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "published"
}
```

---

## 📂 **Categories Endpoints**

### **List Categories**

```http
GET /categories?page=1&limit=50&includeCount=true
```

### **Get Single Category**

```http
GET /categories/{id}
```

### **Create Category**

```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Category",
  "description": "Category description",
  "parentId": "uuid"
}
```

### **Update Category**

```http
PUT /categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

### **Delete Category**

```http
DELETE /categories/{id}
Authorization: Bearer {token}
```

---

## 🏷️ **Tags Endpoints**

### **List Tags**

```http
GET /tags?page=1&limit=50&includeCount=true
```

### **Tag Suggestions (Autocomplete)**

```http
GET /tags/suggestions?q=java&limit=5
```

### **Create Tag**

```http
POST /tags
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Tag"
}
```

### **Update Tag**

```http
PUT /tags/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Tag Name"
}
```

### **Delete Tag**

```http
DELETE /tags/{id}
Authorization: Bearer {token}
```

---

## 📸 **Media Endpoints**

### **Upload File**

```http
POST /media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [file]
folder: "posts"
alt: "Image description"
caption: "Image caption"
```

### **List Media**

```http
GET /media?page=1&limit=20&folder=posts&type=image&search=keyword
```

### **Get Single Media**

```http
GET /media/{id}
```

### **Delete Media**

```http
DELETE /media/{id}
Authorization: Bearer {token}
```

---

## 🤖 **AI Features Endpoints**

### **AI Status**

```http
GET /ai/status
```

### **Generate Content**

```http
POST /ai/generate-content
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Getting Started with React Hooks",
  "topic": "React Development",
  "keywords": ["react", "hooks", "javascript"],
  "contentType": "tutorial",
  "tone": "friendly",
  "length": "medium",
  "language": "en"
}
```

### **Optimize SEO**

```http
POST /ai/optimize-seo
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Blog Post About AI",
  "content": "Artificial intelligence is transforming...",
  "targetKeywords": ["artificial intelligence", "AI technology"]
}
```

### **Generate Image**

```http
POST /ai/generate-image
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Modern office workspace with laptop",
  "style": "photographic",
  "size": "medium",
  "aspectRatio": "16:9"
}
```

### **Auto-tagging**

```http
POST /ai/auto-tagging
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Building Scalable Web Applications",
  "content": "Node.js has become the go-to platform...",
  "existingTags": ["nodejs", "javascript"]
}
```

### **Content Suggestions**

```http
GET /ai/content-suggestions?topic=AI&contentType=blog&language=en
```

---

## 🏥 **Health Check**

### **Health Check**

```http
GET /health
```

---

## 📊 **Response Format**

### **Success Response**

```json
{
  "success": true,
  "result": {
    // Data here
  },
  "message": "Operation successful"
}
```

### **Error Response**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": "Additional error details"
  }
}
```

---

## 🔧 **Frontend Integration Notes**

### **API Service Structure**

```typescript
// Example service structure
export const postsService = {
  list: (params: ListPostsParams) => api.get('/posts', { params }),
  get: (id: string) => api.get(`/posts/${id}`),
  create: (data: CreatePostData) => api.post('/posts', data),
  update: (id: string, data: UpdatePostData) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/posts/${id}/status`, { status }),
};
```

### **Error Handling**

```typescript
// Example error handling
try {
  const response = await postsService.list({ page: 1, limit: 10 });
  return response.data.result;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    logout();
  } else if (error.response?.status === 403) {
    // Handle forbidden
    toast.error('You do not have permission to perform this action');
  } else {
    // Handle other errors
    toast.error(error.response?.data?.error?.message || 'An error occurred');
  }
}
```

---

**Ready for integration! 🚀**
