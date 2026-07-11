# DESIGN SYSTEM

**Document:** Visual Language and Component Standards  
**Owner:** Design Lead + UX Engineering  
**Last Updated:** 2026-07-11

---

## Purpose

The Design System is the shared visual language of Sathus Platform. It defines the rules for color, typography, spacing, imagery, and motion, and provides the implementation contract for the shared UI package.

Its purpose is to ensure visual consistency across applications, reduce design-to-dev handoff friction, and make accessibility a non-negotiable constraint rather than an afterthought.

---

## Goals

- Define a single source of truth for visual design tokens
- Provide implementation-ready component specifications
- Enforce WCAG 2.1 AA accessibility across all surfaces
- Establish a review process for design system evolution
- Minimize visual inconsistencies between apps and contributors

## Table of Contents

1. [Purpose](#purpose)
2. [Goals](#goals)
3. [Design Principles](#design-principles)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Iconography](#iconography)
8. [Motion & Animation](#motion--animation)
9. [Component Library Specification](#component-library-specification)
10. [Accessibility Standards](#accessibility-standards)
11. [Implementation Workflow](#implementation-workflow)
12. [Governance](#governance)

---

## Design Principles

### Clarity First
Every visual element must communicate intent with zero ambiguity. Decorative elements are permitted only when they reinforce hierarchy.

### Consistency Over Novelty
New patterns are introduced only when an existing pattern demonstrably fails. Innovation is in application, not in reinventing primitives.

### Accessibility Is Required
Contrast ratios, touch targets, and screen reader support are gating criteria, not nice-to-haves.

### Performance Aware
Visual richness must not compromise load time. Heavy assets are lazy-loaded; gradients prefer CSS over images.

---

## Color System

### Palette Architecture

Colors are organized into semantic roles, not hard-coded hex values.

| Role | Description | Usage |
|------|-------------|-------|
| `primary` | Brand identity color | CTAs, active states, brand accents |
| `primary-hover` | Interactive primary variant | Hover/active states |
| `secondary` | Supporting brand color | Secondary CTAs, highlights |
| `success` | Positive action confirmation | Success messages, valid states |
| `warning` | Cautionary state | Warnings, pending states |
| `error` | Failure or destructive action | Errors, delete actions |
| `neutral` | Non-semantic UI elements | Borders, dividers, disabled states |

### Contrast Requirements

- Normal text: minimum 4.5:1 ratio
- Large text (≥18pt or ≥14pt bold): minimum 3:1 ratio
- UI components and graphical objects: minimum 3:1 ratio

### Dark Mode

All colors must have a `-foreground` and `-background` pairing. Dark mode is a first-class theme, not an afterthought.

Tokens:
- Light palette is the default rendering context.
- Dark palette is available via a `dark` class on `<html>` or system preference detection.
- High contrast mode adjustments are supported via `forced-colors` media query.

---

## Typography

### Type Scale

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `xs` | 0.75rem | 1.5 | Captions, overlines, helper text |
| `sm` | 0.875rem | 1.5 | Secondary text, form labels |
| `base` | 1rem | 1.5 | Body copy |
| `lg` | 1.125rem | 1.5 | Lead paragraphs |
| `xl` | 1.25rem | 1.3 | H3 |
| `2xl` | 1.5rem | 1.3 | H2 |
| `3xl` | 1.875rem | 1.2 | H1 |
| `4xl` | 2.25rem | 1.2 | Display text |

### Typeface

- Primary interface font: System font stack (platform-native rendering, zero network cost).
- Headlines and branding: Licensed web font with subset loading.
- Monospace (code): System monospace stack.

### Font Loading Strategy

- Critical text rendered immediately with system font stack.
- Web fonts loaded with `font-display: swap`.
- Font subsets served by character range or Unicode block, not full file.

---

## Spacing & Layout

### Spacing Scale

All spacing is derived from a base unit. Multiples of 4px are used for consistency with standard grid systems.

| Token | Value | Use Case |
|-------|-------|----------|
| `0` | 0px | Reset |
| `1` | 4px | Tight gaps, icon padding |
| `2` | 8px | Default gap in small components |
| `3` | 12px | Medium component padding |
| `4` | 16px | Standard padding |
| `6` | 24px | Section spacing |
| `8` | 32px | Large component gaps |
| `12` | 48px | Page sections |
| `16` | 64px | Major layout breaks |

### Layout Constraints

- Maximum content width: 1280px for marketing, 1440px for admin.
- Responsive breakpoints follow standard device tiers, not arbitrary pixel values.

---

## Iconography

- Icon set: Lucide React (consistent stroke width, open-source, tree-shakeable).
- Icon size must match the type scale of surrounding text.
- Icon-only buttons require an `aria-label`.
- Decorative icons are marked `aria-hidden="true"`.

---

## Motion & Animation

### Principles

- Motion serves function, not decoration.
- Reduced motion preferences are always respected.

### Transitions

| Duration | Use Case |
|----------|----------|
| 100ms | Micro-interactions (hover, focus) |
| 200ms | Component state changes |
| 300ms | Page transitions, modal entrances |
| 500ms | Ambient motion (carousels, skeletons) |

### Easing

- Standard: `cubic-bezier(0.4, 0, 0.2, 1)` (Material-like ease)
- Entrance: `cubic-bezier(0, 0, 0.2, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Library Specification

Components are built in `packages/ui` and consumed by all applications.

### Atomic Structure

```
packages/ui/src/components/
├── atoms/        ← Buttons, Inputs, Labels, Badges
├── molecules/    ← FormField, SearchBar, CardHeader
├── organisms/    ← Navbar, Footer, DataTable, FormStepper
├── templates/    ← PageShell, DashboardLayout
└── primitives/   ← Slot, Separator, VisuallyHidden
```

### Component Contract

Each component must define:
- Props interface with full TypeScript types
- Variant mapping for each appearance state
- Slot support for composition
- Composition with `<Slot>` for headless patterns
- Storybook documentation with interactive examples

### Naming Conventions

- PascalCase for component names: `Button`, `Card`, `DataTable`.
- `kebab-case` for CSS classes and Tailwind utility composition.
- Boolean props: `is*` prefix (`isDisabled`, `isLoading`, `isOpen`).

---

## Accessibility Standards

### Keyboard Navigation

- All interactive elements are focusable.
- Focus order follows visual order.
- No keyboard traps.
- Escape closes modals and dropdowns.
- Enter and Space activate buttons.

### Screen Readers

- Landmark roles on every layout region.
- `aria-live` for dynamic content updates.
- Form fields have visible labels and `aria-describedby` for errors.
- Tables use `<th scope="...">` for header cells.
- Image assets use descriptive `alt` text or empty `alt=""` for decorative images.

### Color Independence

- Information is never conveyed by color alone.
- Charts use patterns or labels in addition to color.
- Error states use iconography plus color.

---

## Implementation Workflow

1. Design assets produced in Figma using the shared design system file.
2. Components drafted as Stories in Storybook.
3. Accessibility audit via automated and manual testing.
4. Pull request reviewed by Design Lead and at least one engineer.
5. Component published to `packages/ui`.
6. Apps consume updated package and verify integration.

---

## Governance

The Design System is maintained by the Design Lead with oversight from the Engineering Council.

Any breaking change to a component API requires:
- Two-week deprecation notice with migration guide
- Co-approval from Design Lead and Engineering Lead
- ADR recorded in the architecture repository
