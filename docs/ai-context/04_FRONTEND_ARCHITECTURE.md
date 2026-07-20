# 04 — Frontend Architecture

**Document:** 04_FRONTEND_ARCHITECTURE.md  
**Owner:** Staff Frontend Engineer & UI/UX Architect  
**Status:** Active  

---

## Executive Summary

The frontend layer of the Sathus Platform is powered by **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **shadcn/ui**. It is designed around modular, feature-based architecture to deliver high-velocity content rendering, interactive client dashboards, and responsive accessibility across all device viewports.

---

## Next.js 15 & React 19 Architecture

### 1. Server Components vs. Client Components

- **React Server Components (RSC) (Default)**: Used for data fetching, static page layouts, SEO metadata generation, and content rendering (`apps/web/src/app/**`). Reduces JavaScript bundle size sent to the client.
- **Client Components (`'use client'`)**: Used exclusively for interactive elements requiring browser APIs, React hooks (`useState`, `useEffect`, `useCallback`), form state, or Framer Motion animations.

### 2. Feature-Based Directory Structure

Frontend applications (`apps/web` and `apps/admin`) follow a strict feature-driven module layout:

```
apps/web/src/
├── app/                      # App Router page routes & layouts
│   ├── (auth)/               # Auth route group
│   ├── case-studies/         # Case studies pages
│   ├── contact/              # Contact form page
│   ├── search/               # Search results page
│   ├── globals.css           # Design tokens & global CSS variables
│   ├── layout.tsx            # Root layout with ThemeProvider & providers
│   └── page.tsx              # Homepage
├── components/               # Shared cross-feature UI components
│   ├── layout/               # Header, Footer, MobileMenu, MegaMenu
│   ├── sections/             # SectionIntro, Reveal, Hero primitives
│   └── ui/                   # Button, Card, Dialog, Toast primitives
├── features/                 # Modular domain features
│   ├── case-studies/         # Components, types, data providers
│   ├── contact/              # ContactForm, validation schemas, lead provider
│   ├── content/              # Content editor, versioning, LCS diff
│   ├── navigation/           # Workspace tree editor, version history
│   └── search/               # SearchDialog, filters, mock & live providers
├── hooks/                    # Custom React hooks (useDebounce, useMediaQuery)
├── lib/                      # Pure libraries (utils, api clients, auth)
├── providers/                # React Context providers
└── types/                    # Shared TypeScript domain contracts
```

---

## Form Handling & Validation Standard

All user input forms MUST use **React Hook Form** combined with **Zod** schema validation for type-safe client-side and server-side verification:

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Submit lead to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
        <input id="fullName" {...register('fullName')} className="mt-1 block w-full rounded-md border p-2" />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Submitting...' : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## State Management Strategy

1. **Local State**: `useState` for component-level ephemeral UI state (toggles, dropdown open/close).
2. **Form State**: `react-hook-form` for form input, dirty states, and field-level validation.
3. **URL State**: Query parameters (`useSearchParams`, Next.js router) for search queries, filters, pagination, and active tabs.
4. **Shared Context**: React Context for global app preferences (`ThemeProvider`, `ToastProvider`, `MotionProvider`).

---

## Performance & Bundle Optimization Guidelines

- **Image Optimization**: Use Next.js `<Image />` component exclusively. WebP and AVIF formats are automatically generated and served.
- **Code Splitting**: Dynamic imports (`next/dynamic`) for heavy interactive widgets (e.g. rich text editor, Monaco tree viewer, search dialog).
- **Icon Optimization**: Import Lucide icons selectively (`import { Search, Menu } from 'lucide-react'`). Never use wildcard barrel imports.
- **Font Optimization**: Use `next/font` for web font loading (`Inter`, `Outfit`) to eliminate layout shifts (CLS).
