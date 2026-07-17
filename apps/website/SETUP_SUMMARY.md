# Web Application Config Setup

This document captures the setup choices made for the web package.

## Libraries Installed

| Package | Purpose |
|---------|---------|
| motion | Animation library for smooth UI transitions and entrance effects. |
| lucide-react | Icon set used across the application UI. |
| next-themes | Dark mode management for Next.js App Router. |
| class-variance-authority | Type-safe variant API for component props (e.g. button variants). |
| clsx | Utility to conditionally join CSS class names. |
| tailwind-merge | Utility to resolve Tailwind class conflicts. |
| react-hook-form | Declarative form state management with minimal re-renders. |
| zod | TypeScript-first schema validation. |
| @hookform/resolvers | Bridge between react-hook-form and zod. |

## Key Configuration

- Tailwind uses `darkMode: 'class'` so the `ThemeProvider` manually toggles the `dark` class.
- Absolute imports are enabled via `@/*` mapped to `./src/*` in `apps/web/tsconfig.json`.
- `next.config.ts` enables Turbopack in dev via the `dev` script rather than hardcoding it here.
