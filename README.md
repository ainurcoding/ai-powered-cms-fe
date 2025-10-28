# AI CMS Frontend

Frontend application untuk AI-Powered Content Management System yang terintegrasi dengan backend API.

## 🚀 Tech Stack

- **React 19** dengan TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Radix UI** - Headless UI components
- **Lucide React** - Icons

## 📁 Struktur Project

```
src/
├── components/
│   ├── ui/              # Basic UI components (Button, Card, Input, dll)
│   ├── forms/           # Form components
│   ├── layout/          # Layout components (Navbar, Sidebar, dll)
│   └── features/        # Feature-specific components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API services
├── stores/              # Zustand stores
├── utils/               # Utility functions
├── types/               # TypeScript types
├── constants/           # App constants
└── lib/                 # Library configurations
```

## 🛠️ Setup Development

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan `VITE_API_BASE_URL` dengan URL backend Anda.

3. **Jalankan development server**
```bash
pnpm dev
```

Application akan berjalan di `http://localhost:5173`

## 📝 Available Scripts

- `pnpm dev` - Jalankan development server
- `pnpm build` - Build untuk production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code dengan ESLint
- `pnpm format` - Format code dengan Prettier
- `pnpm test` - Run tests dengan Vitest

## 🔐 Authentication

Project ini menggunakan JWT authentication dengan beberapa fitur:
- Login dengan username/password
- Google OAuth integration (siap digunakan)
- Auto token refresh
- Protected routes

## 🎨 UI Components

Project ini sudah dilengkapi dengan:
- Button component dengan variants
- Card components
- Input components
- Form components (akan dikembangkan)
- Layout components dengan ProtectedRoute

## 📡 API Integration

Semua API services sudah tersedia di folder `src/services/`:
- `auth.service.ts` - Authentication
- `post.service.ts` - Post management
- `category.service.ts` - Category management
- `tag.service.ts` - Tag management
- `media.service.ts` - Media upload
- `ai.service.ts` - AI features

## 🔄 State Management

- **Zustand** untuk client state (auth, theme)
- **React Query** untuk server state (caching, refetching)

## 🎯 Next Steps

Boilerplate sudah siap! Anda bisa mulai mengembangkan fitur:

1. Tambah halaman Register
2. Buat Post Management (List, Create, Edit, Delete)
3. Implementasi Media Library
4. Integrasi AI Features
5. Tambah Category & Tag Management
6. Implementasi Rich Text Editor
7. Dashboard dengan statistics

## 🤝 Contributing

Silakan develop fitur baru dengan:
1. Buat branch baru
2. Commit changes
3. Push dan create PR

## 📄 License

Private project untuk AI CMS.
