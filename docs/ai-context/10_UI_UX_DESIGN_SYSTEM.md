# 10 — UI/UX Design System (Sathus Design Language)

**Document:** 10_UI_UX_DESIGN_SYSTEM.md  
**Owner:** Design Lead & Senior UI/UX Architect  
**Status:** Active  

---

## Executive Summary

The **Sathus Design Language (SDL)** is the official visual and interaction design system governing all user interfaces across the Sathus Platform. SDL projects a visual identity described as: **Premium, Elegant, Minimal, Modern, Professional, Calm, Trustworthy, and Confident**.

SDL is built on top of **Tailwind CSS**, HSL-tailored CSS custom properties, **shadcn/ui** primitives, **Lucide React** iconography, and subtle **Framer Motion** micro-interactions.

---

## Design System Tokens & Color Palette

The color system relies on HSL CSS variables defined in `apps/web/src/app/globals.css` and `apps/admin/src/app/globals.css`, supporting seamless dark and light mode rendering via `next-themes`.

### Color Palette Matrix

| Semantic Token | Light Mode (HSL) | Dark Mode (HSL) | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `0 0% 100%` (White) | `224 71% 4%` (Deep Obsidian) | Page canvas background |
| `--foreground` | `224 71% 4%` (Dark Slate) | `213 31% 91%` (Crisp Silver) | Primary body & heading text |
| `--primary` | `221.2 83.2% 53.3%` (Royal Sapphire) | `217.2 91.2% 59.8%` (Electric Blue) | Primary CTAs, key focus states |
| `--primary-foreground` | `210 40% 98%` | `222.2 47.4% 11.2%` | Text inside primary buttons |
| `--secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Secondary buttons, subtle badges |
| `--muted` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Card backgrounds, subtle fills |
| `--muted-foreground` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` | Secondary text, captions, metadata |
| `--border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Card borders, dividers |
| `--ring` | `221.2 83.2% 53.3%` | `224.3 76.3% 48%` | Accessibility focus indicator ring |

---

## Typography & Spacing System

- **Primary Font**: `Inter` (sans-serif) — used for all body text, inputs, tables, and UI labels.
- **Display Font**: `Outfit` / `Inter` — used for `h1`, `h2`, `h3` hero titles and marketing headers.
- **Monospace Font**: `JetBrains Mono` / `Fira Code` — used for inline code, JSON previews, and diff viewers.

### Spacing Scale

SDL enforces Tailwind's standard 4px baseline grid (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-12` = 48px).

---

## Motion & Micro-Interaction Guidelines

Framer Motion animations MUST be subtle and functional, never decorative or distracting.

```tsx
import React from 'react';
import { motion } from 'framer-motion';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### Motion Rules
1. **Allowed Motions**: Fade-in, subtle vertical slide (10–15px), smooth scale (0.98 to 1.0), hover border transitions.
2. **Forbidden Motions**: Excessive bounce, aggressive rotation, unconstrained parallax, or infinite looping animations (except loading spinners).
3. **Reduced Motion**: Respect `prefers-reduced-motion` media queries automatically via Framer Motion settings.

---

## WCAG 2.1 AA Accessibility Standards

All UI components MUST pass WCAG 2.1 AA accessibility guidelines:

1. **Keyboard Navigation**: Every interactive element (buttons, links, form inputs, modal closes) MUST be reachable and operable using `Tab` and `Enter` / `Space`.
2. **Focus Indicators**: Focus rings (`ring-2 ring-primary`) MUST remain visible when navigating via keyboard.
3. **ARIA Roles & Landmarks**:
   - Wrap header in `<header>`, main content in `<main>`, navigation in `<nav>`, footer in `<footer>`.
   - Modals and dialogs MUST include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
4. **Color Contrast**: Text-to-background contrast ratio MUST meet or exceed **4.5:1** for standard text and **3:1** for large text.
