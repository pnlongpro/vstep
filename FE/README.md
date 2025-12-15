# VSTEP Frontend

Nền tảng luyện thi VSTEP với AI - Frontend Application

## Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query (TanStack Query)
- **API Client**: Axios
- **Real-time**: Socket.io Client
- **Authentication**: NextAuth.js + JWT
- **Form Handling**: React Hook Form + Zod

## Cấu trúc Project

```
FE/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes
│   │   ├── (auth)/            # Auth routes
│   │   └── (dashboard)/       # Protected dashboard routes
│   ├── components/            # React components
│   ├── features/              # Feature modules (auth, exam, chat, payment)
│   ├── lib/                   # Core utilities (axios, socket, auth)
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Helper functions
│   ├── types/                 # TypeScript types
│   └── constants/             # App constants
├── public/                    # Static assets
└── package.json
```

## Bắt đầu

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3001](http://localhost:3001) để xem ứng dụng.

### Build production

```bash
npm run build
npm run start
```

## Biến môi trường

Tạo file `.env.local` và cấu hình các biến sau:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

Xem file `.env.local` để biết thêm chi tiết.

## Features

- ✅ Authentication (Login, Register, JWT)
- ✅ Exam System (Mock tests, Practice)
- ✅ AI Scoring (Writing & Speaking)
- ✅ Real-time Chat
- ✅ Payment Integration (VNPay, Momo)
- ✅ Progress Tracking & Analytics
- ✅ Gamification (Badges, Leaderboard)

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra lỗi code

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

