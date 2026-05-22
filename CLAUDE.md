# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (localhost:5173)
npm run build     # tsc type-check + vite build → dist/
npm run lint      # ESLint all files
npm run preview   # Serve production build locally
```

No test runner configured.

## Architecture

Personal portfolio frontend. React 18 + TypeScript + Vite. Deployed to Vercel.

**Entry**: `src/main.tsx` → `src/App.tsx` (ThemeProvider → QueryClientProvider → RouterProvider)

**Routes** (`src/AppRouter.tsx`):
- `/` → `LandingPage` — hero, about, projects, skills, timeline, contact form
- `/links` → `LinksPage` — Linktree-style social links
- `/project/:projectId` → project detail with carousel + live GitHub stats
- `/redirect/:clickTag` → click-tracking redirect (hits PHP API)
- `/privacy` → privacy policy

**Key directories**:
- `src/components/Landing/` — all homepage sections
- `src/components/ui/` — shadcn/ui Radix primitives
- `src/feature/` — self-contained page features (links, privacy, project, redirect)
- `src/api/github/` — GitHub stats fetch + React Query hook
- `src/lib/` — `ApiSchema.ts` (Zod schemas), `fetchWrapper.ts` (HTTP client with `X-Api-Key`), `projects-data.ts` (hardcoded project metadata)

**Data flow**:
- Projects metadata: hardcoded in `src/lib/projects-data.ts` — edit here to add/update projects
- GitHub stats: fetched on demand via `useGithubStats` hook → GitHub API
- Contact form + link tracking: PHP/Slim API at `VITE_API_URL` with `VITE_API_KEY` auth
- Analytics: Vercel Analytics + opt-in Google Analytics (gated by cookie consent in `src/components/blocks/cookie-consent`)

## Stack

| Layer | Library |
|---|---|
| Routing | React Router v6 |
| Data fetching | TanStack React Query |
| UI components | shadcn/ui (Radix + Tailwind) |
| Animations | Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + React Icons |
| Head management | React Helmet Async |

## Path Alias

`@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Theming

Dark/light mode via `ThemeProvider` (`src/assets/providers/`). Tailwind uses `class` strategy. CSS variables defined in `src/index.css` — edit there for color tokens, not Tailwind config directly.

## Environment

```
VITE_API_URL          # PHP API base URL
VITE_API_KEY          # API key for X-Api-Key header
VITE_MEASUREMENT_ID   # Google Analytics tag
VITE_SITE_ID          # Site ID for analytics
```

Dev values in `.env.development`. Never commit production values.
