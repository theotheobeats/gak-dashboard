# Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply database migrations
- `npx prisma studio` - Open Prisma Studio
- No test framework configured

# Code Style
- Next.js 16 App Router with React 19, TypeScript strict mode
- Use `import type` for type-only imports
- Server components by default, use "use client" for interactivity
- Tailwind CSS v4, path alias `@/*` maps to `./*`
- Functional components with TypeScript interfaces, PascalCase for components
- API routes return `{ success: boolean, data: T }` format
- Error handling with try/catch and console.error
- Better Auth for authentication, Prisma for PostgreSQL
- Lucide React icons, React Hot Toast, date-fns
- ESLint with next/core-web-vitals and next/typescript
- No comments unless explicitly requested
