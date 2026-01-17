# Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply database migrations
- `npx prisma studio` - Open Prisma Studio
- No test framework configured

# Code Style
- Next.js 16 App Router with React 19, TypeScript strict mode
- Use `import type` for type-only imports
- Server components by default, use "use client" for interactivity
- Tailwind CSS v4 for styling with dark mode support
- Path alias: `@/*` maps to `./*`
- Functional components with TypeScript interfaces
- Responsive design with sm: breakpoints
- Geist fonts: --font-geist-sans, --font-geist-mono
- ESLint with next/core-web-vitals and next/typescript
- No comments unless explicitly requested
