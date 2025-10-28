# 🚀 Quick Start Guide - AI CMS Frontend

## Prerequisites

- Node.js 20.19+ atau 22.12+
- pnpm (package manager)
- Backend API running di `http://localhost:8000`

## Installation

### 1. Clone & Setup

```bash
# Navigate ke project directory
cd ai-cms-fe

# Install dependencies
pnpm install
```

### 2. Environment Configuration

```bash
# Copy .env.example to .env
cp .env.example .env
```

Edit file `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
pnpm dev
```

Application akan berjalan di: **http://localhost:5173**

## 📱 Testing Application

### Test Login

1. Buka browser dan akses `http://localhost:5173`
2. Anda akan di-redirect ke halaman login
3. Masukkan credentials (sesuai dengan user di backend):
   - Username: `admin` (atau username yang sudah dibuat di backend)
   - Password: `password` (sesuai dengan yang di backend)
4. Klik "Login"
5. Jika berhasil, akan redirect ke Dashboard

### Features yang Sudah Bisa Digunakan

✅ **Login Page**

- Login form dengan validation
- Error handling
- Loading states
- Toast notifications

✅ **Dashboard Page**

- Basic dashboard layout
- User info display
- Logout functionality
- Statistics cards (placeholder)

✅ **Authentication**

- JWT token management
- Auto token refresh
- Protected routes
- Persistent authentication

## 🛠️ Available Commands

```bash
# Development
pnpm dev              # Run development server

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint code
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run tests
```

## 📁 Important Files

```
src/
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
├── pages/
│   ├── LoginPage.tsx       # Login page
│   └── DashboardPage.tsx   # Dashboard page
├── services/
│   └── api.ts              # Axios configuration
└── stores/
    └── authStore.ts        # Auth state management
```

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.prettierrc` - Prettier configuration
- `eslint.config.js` - ESLint configuration

## 🎯 Next Steps

Sekarang Anda bisa mulai develop fitur:

### Priority 1 - Core Features

1. **Register Page**
   - Create `src/pages/RegisterPage.tsx`
   - Add route di `App.tsx`
   - Gunakan `useAuth` hook

2. **Post Management**
   - Create `src/pages/posts/PostListPage.tsx`
   - Create `src/pages/posts/CreatePostPage.tsx`
   - Create `src/pages/posts/EditPostPage.tsx`
   - Gunakan `usePosts` hook

3. **Rich Text Editor**
   - Integrate React Quill
   - Create editor component

### Priority 2 - UI Components

4. **Layout Components**
   - Create Navbar component
   - Create Sidebar component
   - Create main layout wrapper

5. **Form Components**
   - Create form input components
   - Create select components
   - Add validation

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
pnpm dev -- --port 3000
```

### Backend Connection Error

- Pastikan backend running di `http://localhost:8000`
- Check `.env` file
- Check CORS configuration di backend

### Build Errors

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear cache
pnpm store prune
```

### TypeScript Errors

```bash
# Regenerate types
pnpm exec tsc --noEmit
```

## 📚 Documentation

- [README.md](./README.md) - Complete project documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [BOILERPLATE_SUMMARY.md](./BOILERPLATE_SUMMARY.md) - Boilerplate features
- [FRONTEND_TECH_STACK.md](./FRONTEND_TECH_STACK.md) - Tech stack details

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)

## 💡 Tips

1. **Hot Module Replacement**
   - Changes will auto-reload in browser
   - No need to restart dev server

2. **TypeScript IntelliSense**
   - Use VSCode for best experience
   - All types are already defined

3. **React Query DevTools**
   - Add React Query DevTools untuk debugging
   - Install: `pnpm add @tanstack/react-query-devtools`

4. **Path Aliases**
   - Use `@/` instead of `../../`
   - Example: `import { api } from '@/services/api'`

## ✅ Checklist

- [x] Project setup
- [x] Dependencies installed
- [x] Environment configured
- [x] Development server running
- [x] Login tested
- [ ] Register page
- [ ] Post management
- [ ] Media library
- [ ] AI features

---

**Happy Coding! 🎉**

Jika ada pertanyaan atau issue, silakan check dokumentasi atau contact team.
