# Web Application

Next.js 15 frontend for Sathus Platform.

## Structure

```
apps/web/
├── src/
│   ├── app/            ← App Router routes, layouts, and global styles
│   ├── components/     ← Shared and feature components
│   ├── lib/            ← Helpers and internal utilities
│   └── types/          ← App-specific type definitions
├── public/             ← Static assets
├── next.config.ts      ← Next.js configuration
├── tailwind.config.ts  ← Tailwind CSS configuration
├── postcss.config.js   ← PostCSS configuration
└── tsconfig.json       ← TypeScript configuration
```

## Local Development

```bash
npm run dev
```

## Key Features

- **App Router** — Next.js 15 App Router for layouts, streaming, and RSCs.
- **TypeScript** — Strict mode with absolute imports via the `@/*` alias.
- **Tailwind CSS** — Utility-first styling with dark mode and design tokens.
- **Turbopack** — Incremental bundling for fast local dev.
- **SEO Ready** — Metadata API, Open Graph, and canonical URLs in layout.
- **Performance** — Image optimization, compressed responses, and strict React mode enabled.
