# AGENTS.md - Dahs Food Next.js Project

## Purpose

Guidelines for agentic coding agents working in this repository.

## Project Overview

Dahs Food is a Spanish-language food delivery e-commerce platform built with Next.js 16 (React 19), TypeScript, PostgreSQL, and Prisma. The app uses App Router, Server Actions, React Query, and Zustand.

## Build, Lint, and Test Commands

### Primary commands
- `npm run dev`: Start development server at `http://localhost:3000`
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint across the project

### Prisma / database
- `npx prisma generate`: Generate Prisma client at `@/app/generated/prisma/client`
- `npx prisma db push`: Push schema to database (dev)
- `npx tsx prisma/seed.ts`: Seed database

### Tests
- No test runner scripts are configured in `package.json`.
- No Jest/Vitest/Playwright configs found in repo root.
- Single-test command: **not available yet**. Add a test runner and script before running individual tests.

## Project Structure

```
/home/lain/work/dahs-food-next
├── app/                    # Next.js App Router
│   ├── (landing)/         # Public pages (home, tracking, etc.)
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (limited usage)
│   └── providers.tsx      # React Query provider
├── actions/               # Server Actions
├── components/
│   ├── ui/               # Reusable UI components (Radix + shadcn)
│   ├── common/           # Shared components
│   └── header/           # Header-related components
├── config/                # Environment validation
├── hooks/                 # React Query hooks
├── lib/                   # Utilities (axios, prisma, bcrypt, cloudinary, utils)
├── prisma/                # Database schema and migrations
├── schemas/               # Zod validation schemas
├── services/              # API service layer
├── store/                 # Zustand stores
└── types/                 # Shared TypeScript types
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled in `tsconfig.json`.
- Always declare explicit types for exported function parameters and return types.
- Use `interface` for object shapes and `type` for unions/primitives.
- Prefer `unknown` over `any` and narrow with type guards.
- Avoid non-null assertions (`!`) unless the value is guaranteed.
- Keep shared types in `types/`.

### Imports
1. External libraries (React, Radix, etc.)
2. Framework imports (Next.js, `@tanstack/react-query`)
3. Absolute imports (`@/lib/*`, `@/services/*`, `@/types/*`)
4. Relative imports (`../lib/utils`, `./Button`)

### Components
- Use functional components with TypeScript.
- Server components by default; add `"use client"` only when needed.
- Prefer composition over inheritance.
- Use `class-variance-authority` for variants (see `components/ui/button.tsx`).
- Use `cn()` (clsx + tailwind-merge) for class composition.
- Prefer Radix primitives for accessible UI.
- Keep components small and focused; move logic into hooks when possible.

### State Management
- **Global state**: Zustand (see `store/cartStore.ts`).
- **Server state**: TanStack React Query.
- Use `onMutate`/`onSuccess`/`onError` for optimistic updates.
- Keep server state out of Zustand when React Query is sufficient.

### Data Fetching Pattern
```typescript
// Service layer - api calls with typed responses
export const productsApi = {
  getProducts: async (params: ProductsParams): Promise<ProductsResponse> => {
    const { data } = await axiosInstance.get<ProductsResponse>("/products", { params });
    return data;
  },
};

// Custom hook - React Query integration
export const useProducts = (params: ProductsParams) => {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productsApi.getProducts(params),
  });
};
```

### Validation
- Use Zod for form validation (see `schemas/auth.schema.ts`).
- Use Spanish error messages for UI validation.
- Export inferred types: `type LoginType = z.infer<typeof loginSchema>`.
- Validate environment variables with Zod in `config/envVars.config.ts`.

### Database (Prisma)
- Prisma client import path: `@/app/generated/prisma/client`.
- Use `upsert` for seed/reconciliation operations.
- Prefer adapter pattern for PostgreSQL: `new PrismaPg({ connectionString })`.
- Run `npx prisma generate` after schema changes.

### API Routes & Server Actions
- Prefer Server Actions for mutations over API routes.
- Return `{ success: boolean; message: string }` from actions.
- Handle errors with try/catch and typed responses.
- Keep actions in `actions/` and avoid mixing with UI components.

### Error Handling
- Use `toast.error()` from `sonner` for user-facing errors.
- Use typed error objects and consistent message strings.
- Avoid throwing raw strings; throw `Error` or typed objects.

### UI & Styling
- Tailwind CSS v4 with `@tailwindcss/postcss`.
- Use design tokens via `cn()` utility.
- Follow shadcn/ui patterns and Radix primitives.
- Spanish text in UI, English in code identifiers.

### Naming Conventions
- **Files**: camelCase for utils/services/hooks (`useProducts.ts`).
- **Files**: PascalCase for components (`Button.tsx`).
- **Variables/Functions**: camelCase.
- **Types/Interfaces**: PascalCase.
- **Constants**: SCREAMING_SNAKE_CASE.
- **Database**: snake_case columns, singular model names.

### Formatting & Linting
- ESLint uses `eslint-config-next` (core-web-vitals + TypeScript).
- Prefer explicit return types for exported functions.
- Avoid unused imports and variables.

### Git Workflow
- Commit messages in English.
- Feature branches: `feature/description`.
- Bug fixes: `fix/description`.
- Run `npm run lint` before committing.

## Key Dependencies

- **Framework**: Next.js 16.1.1 with App Router
- **Database**: PostgreSQL + Prisma 7.2.0
- **Auth**: Auth.js v5 (NextAuth)
- **State**: Zustand 5.x, TanStack React Query 5.x
- **UI**: Radix UI primitives, Lucide icons, Tailwind CSS v4
- **Validation**: Zod 4.x
- **Forms**: React Hook Form + Zod resolvers

## Common Tasks

### Add a new API endpoint
1. Create service in `services/` with typed axios calls.
2. Create React Query hook in `hooks/`.
3. Create Server Action in `actions/` if mutation needed.

### Add a new UI component
1. Follow `components/ui/button.tsx` pattern with cva variants.
2. Use a Radix primitive if interactive.
3. Export from `components/ui/index.ts`.

### Database schema change
1. Edit `prisma/schema.prisma`.
2. Run `npx prisma generate`.
3. Run `npx prisma db push` (development) or create migration.

## Cursor/Copilot Rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot instructions found in `.github/copilot-instructions.md`.
