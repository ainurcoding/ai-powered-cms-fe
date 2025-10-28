# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project boilerplate setup
- React 19 + TypeScript + Vite configuration
- Tailwind CSS styling system
- React Router v7 for routing
- React Query for server state management
- Zustand for client state management
- Axios HTTP client with interceptors
- Authentication system (Login, JWT token handling)
- Protected route implementation
- API service layer for all endpoints (auth, posts, categories, tags, media, AI)
- Custom hooks for data fetching (usePosts, useCategories, useTags, useMedia, useAuth)
- Basic UI components (Button, Card, Input)
- Dark mode support
- Toast notifications
- Prettier and ESLint configuration
- Testing setup with Vitest
- Environment variables setup
- Project documentation (README, CONTRIBUTING)

### Project Structure

```
src/
├── components/
│   ├── ui/              # Button, Card, Input
│   ├── forms/           # (ready for development)
│   ├── layout/          # ProtectedRoute
│   └── features/        # (ready for development)
├── pages/               # LoginPage, DashboardPage
├── hooks/               # useAuth, usePosts, useCategories, useTags, useMedia
├── services/            # API services (auth, post, category, tag, media, ai)
├── stores/              # authStore, themeStore
├── utils/               # utils functions
├── types/               # TypeScript types
├── constants/           # API endpoints
└── lib/                 # queryClient, utils
```

### Tech Stack

- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- Tailwind CSS 4.1.16
- React Router 7.9.4
- React Query 5.90.5
- Zustand 5.0.8
- Axios 1.13.0
- Radix UI components
- Lucide React icons

## [0.0.0] - 2024-10-28

### Added

- Initial project setup
