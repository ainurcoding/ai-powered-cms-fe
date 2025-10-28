# Contributing Guide

## 📝 Panduan Pengembangan

### Setup Development Environment

1. Clone repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` ke `.env` dan sesuaikan konfigurasi
4. Run development server: `pnpm dev`

### Code Style

- Gunakan TypeScript untuk type safety
- Format code dengan Prettier: `pnpm format`
- Lint code dengan ESLint: `pnpm lint`
- Ikuti konvensi penamaan yang sudah ada

### Struktur Folder

#### `src/components/`

- `ui/` - Basic reusable UI components (Button, Card, Input, dll)
- `forms/` - Form-specific components
- `layout/` - Layout components (Navbar, Sidebar, Footer, dll)
- `features/` - Feature-specific components

#### `src/pages/`

- Page-level components yang di-route oleh React Router
- Gunakan suffix `Page` (contoh: `DashboardPage.tsx`)

#### `src/hooks/`

- Custom React hooks
- Hook untuk data fetching gunakan React Query
- Prefix dengan `use` (contoh: `usePosts.ts`)

#### `src/services/`

- API service layer
- Semua API calls harus melalui service layer
- Suffix dengan `.service.ts`

#### `src/stores/`

- Zustand stores untuk client state
- Suffix dengan `Store` (contoh: `authStore.ts`)

#### `src/types/`

- TypeScript type definitions
- Interface dan Type declarations

#### `src/utils/`

- Utility functions
- Helper functions yang reusable

#### `src/constants/`

- App constants
- API endpoints
- Configuration values

### Naming Conventions

- **Components**: PascalCase (`DashboardPage.tsx`)
- **Hooks**: camelCase dengan prefix `use` (`usePosts.ts`)
- **Services**: camelCase dengan suffix `.service` (`auth.service.ts`)
- **Stores**: camelCase dengan suffix `Store` (`authStore.ts`)
- **Utils**: camelCase (`formatDate`, `slugify`)
- **Types**: PascalCase untuk interfaces dan types

### Git Workflow

1. Create branch dari `main`
2. Branch naming: `feature/nama-fitur`, `fix/nama-bug`, `refactor/nama-refactor`
3. Commit dengan pesan yang jelas dan deskriptif
4. Push dan create Pull Request
5. Review dan merge

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**

```
feat(posts): add post creation feature

- Add CreatePostPage component
- Implement post form with validation
- Integrate with post API service

Closes #123
```

### Testing

- Write tests untuk critical functionality
- Run tests: `pnpm test`
- Test files suffix: `.test.ts` atau `.test.tsx`

### Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use composition over inheritance
   - Extract reusable logic to custom hooks

2. **State Management**
   - Use Zustand for client state (UI state, auth, theme)
   - Use React Query for server state (API data)
   - Keep state as local as possible

3. **API Integration**
   - Always use service layer
   - Handle errors properly
   - Show loading states
   - Display user feedback (toast notifications)

4. **Type Safety**
   - Define proper TypeScript types
   - Avoid using `any`
   - Use type inference when possible

5. **Performance**
   - Lazy load components when needed
   - Memoize expensive computations
   - Optimize re-renders
   - Use React Query caching

6. **Accessibility**
   - Use semantic HTML
   - Add proper ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers

7. **Code Organization**
   - Group related code together
   - Keep files focused and small
   - Use barrel exports (`index.ts`)
   - Avoid deep nesting

### UI Development

- Use Tailwind CSS for styling
- Follow design system (colors, spacing, typography)
- Use Radix UI for complex components
- Ensure responsive design (mobile-first)
- Support dark mode

### Error Handling

- Catch and handle errors gracefully
- Show user-friendly error messages
- Log errors for debugging
- Use error boundaries for React errors

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Code is properly typed
- [ ] No linter errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Changes tested locally
- [ ] PR description is clear

## 🚀 Deployment

Deployment akan dilakukan melalui CI/CD pipeline. Pastikan semua tests pass sebelum merge ke `main`.

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## ❓ Questions?

Jika ada pertanyaan, silakan:

- Create issue di repository
- Diskusi di team chat
- Contact maintainer
