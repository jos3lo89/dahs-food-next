# AGENTS.md - Dahs Food Next.js Project

## Overview

Dahs Food is a Spanish-language e-commerce platform for food delivery built with Next.js 16 (React 19), TypeScript, PostgreSQL, and Prisma. The project uses App Router, Server Actions, React Query, and Zustand for state management.

## Build & Lint Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint on entire project |
| `npx prisma generate` | Generate Prisma client (custom path: `@/app/generated/prisma/client`) |
| `npx prisma db push` | Push schema changes to database |
| `npx tsx prisma/seed.ts` | Seed database with initial data |

## Project Structure

```
/home/lain/work/dahs-food-next
├── app/                    # Next.js App Router
│   ├── (landing)/         # Public pages (home, tracking, etc.)
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── providers.tsx      # React Query provider
├── components/
│   ├── ui/               # Reusable UI components (Radix-based)
│   ├── common/           # Shared components
│   └── header/           # Header-related components
├── lib/                  # Utilities (axios, prisma, bcrypt, cloudinary, utils)
├── hooks/                # React Query hooks (useProducts, useOrders, etc.)
├── services/             # API service layer
├── actions/              # Server Actions
├── store/                # Zustand stores (cartStore.ts)
├── types/                # TypeScript type definitions
├── schemas/              # Zod validation schemas
├── prisma/               # Database schema and migrations
└── config/               # Environment validation
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled in `tsconfig.json`
- Always define explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `unknown` over `any` and narrow with type guards
- Avoid non-null assertions (`!`) unless the value is guaranteed
- Keep types in `types/` when shared across modules

### Imports
1. External libraries (React, Radix, etc.)
2. Framework imports (Next.js, @tanstack/react-query)
3. Absolute path imports (`@/lib/*`, `@/services/*`, `@/types/*`)
4. Relative imports (`../lib/utils`, `./Button`)

### Components
- Use functional components with TypeScript
- Prefer composition over inheritance
- Server components by default; use `"use client"` only when needed
- Use `class-variance-authority` for variants (see `components/ui/button.tsx`)
- Use `clsx` + `tailwind-merge` via `cn()` for class composition
- Prefer Radix primitives for accessible UI
- Keep components small and focused; move logic into hooks when possible

### State Management
- **Global state**: Zustand (see `store/cartStore.ts` for patterns)
- **Server state**: TanStack React Query
- Use `onMutate`/`onSuccess`/`onError` for optimistic updates and rollbacks
- Keep server state out of Zustand when React Query is sufficient

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
- Use Zod for form validation (see `schemas/auth.schema.ts`)
- Define schemas with Spanish error messages
- Export inferred types: `type LoginType = z.infer<typeof loginSchema>`
- Validate environment variables with Zod in `config/envVars.config.ts`

### Database (Prisma)
- Custom Prisma client path: import from `@/app/generated/prisma/client`
- Use `upsert` for seed/reconciliation operations
- Use adapter pattern for PostgreSQL: `new PrismaPg({ connectionString })`
- Run `npx prisma generate` after schema changes

### API Routes & Server Actions
- Prefer Server Actions for mutations over API routes
- Return `{ success: boolean; message: string }` from actions
- Handle errors with try/catch and typed responses
- Keep actions in `actions/` and avoid mixing with UI components

### Error Handling
- Use `toast.error()` from `sonner` for user-facing errors
- Use typed error objects and consistent message strings
- Avoid throwing raw strings; throw `Error` or typed objects

### UI & Styling
- Tailwind CSS v4 with `@tailwindcss/postcss`
- Use design tokens via `cn()` utility
- Follow shadcn/ui patterns and Radix primitives
- Spanish text in UI, English in code identifiers

### Naming Conventions
- **Files**: camelCase for utils/services/hooks (e.g., `useProducts.ts`)
- **Files**: PascalCase for components (e.g., `Button.tsx`)
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Database**: snake_case columns, singular model names

### Formatting & Linting
- ESLint uses `eslint-config-next` (core-web-vitals + typescript)
- Prefer explicit return types for exported functions
- Avoid unused imports and variables

### Git Workflow
- Commit messages in English
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Run `npm run lint` before committing

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
1. Create service in `services/` with typed axios calls
2. Create React Query hook in `hooks/`
3. Create Server Action in `actions/` if mutation needed

### Add a new UI component
1. Follow `components/ui/button.tsx` pattern with cva variants
2. Use Radix primitive if interactive
3. Export from `components/ui/index.ts`

### Database schema change
1. Edit `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Run `npx prisma db push` (development) or create migration

## Cursor/Copilot Rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`
- No Copilot instructions found in `.github/copilot-instructions.md`
