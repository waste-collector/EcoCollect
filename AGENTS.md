# Agent Guidelines for ibtihelnext

## Build & Commands
- **Dev**: `npm run dev` - Start development server
- **Build**: `npm run build` - Production build
- **Lint**: `npm run lint` - Run ESLint
- **No test suite** configured (add if needed)

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript (strict mode)
- Tailwind CSS v4, shadcn/ui components, Radix UI primitives
- Path alias: `@/*` maps to project root

## Code Style
- **Client components**: Add `"use client"` directive at top when using hooks/browser APIs
- **Imports**: Group external, then internal with `@/` prefix (e.g., `@/components/ui/button`)
- **Types**: Use TypeScript interfaces for props/data structures, explicit types over `any`
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for files
- **Error handling**: Try-catch in API routes, return `NextResponse.json({ success, error })` format
- **Formatting**: 2-space indent, double quotes for strings, no semicolons (inferred from codebase)

## Patterns
- Use `cn()` utility from `@/lib/utils` for conditional className merging
- API routes: Export async `GET`, `POST`, etc. from `route.ts` files
- Form validation: Use zod + react-hook-form with `@hookform/resolvers`
- No backend/database yet - uses in-memory storage (plan for migration)
