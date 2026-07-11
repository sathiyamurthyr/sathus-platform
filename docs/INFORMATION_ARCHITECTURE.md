# INFORMATION ARCHITECTURE

**Document:** Site Structure, Navigation, and Content Model  
**Owner:** Product Lead + Design Lead  
**Last Updated:** 2026-07-11

---

## Purpose

Information Architecture (IA) defines how content is organized, labeled, and navigated across the Sathus Platform web properties.

It ensures that users — whether developers reading API docs or executives evaluating the platform — find the right information in the fewest clicks.

---

## Goals

- Map the complete content universe across all applications
- Define URL structures that are predictable and persistent
- Establish content models for repeatable entities
- Create navigation hierarchies that serve distinct user personas
- Ensure every entity has a canonical URL with no orphaned content

## Table of Contents

1. [Purpose](#purpose)
2. [Goals](#goals)
3. [Site Inventory](#site-inventory)
4. [URL Architecture](#url-architecture)
5. [Navigation Structure](#navigation-structure)
6. [Content Model](#content-model)
7. [Taxonomy & Metadata](#taxonomy--metadata)
8. [User Flows](#user-flows)
9. [Accessibility Considerations](#accessibility-considerations)
10. [Change Process](#change-process)

---

## Site Inventory

| Application | URL Root | Purpose |
|-------------|----------|---------|
| Web (Marketing) | `/` | Public-facing company presence, features, pricing |
| Admin | `/admin` | Internal dashboard for content editors and admins |
| Docs | `/docs` | Product documentation, API references, tutorials |

---

## URL Architecture

### Principles

- URLs are permanent. Content moves; URLs do not redirect arbitrarily.
- Lowercase with hyphens. No spaces, no underscores, no camelCase.
- No file extensions (`.html`, `.php`).
- Trailing slashes are consistent per application (Next.js App Router default).

### Marketing Site

```
/                              ← Home
/about                         ← Company
/about/leadership              ← Leadership team
/about/careers                 ← Open positions
/products                      ← Product overview
/products/[slug]               ← Product detail
/pricing                       ← Pricing tables
/pricing/[plan]                ← Plan detail
/blog                          ← Article index
/blog/[slug]                    ← Article detail
/contact                       ← Contact form
/legal/privacy                 ← Privacy policy
/legal/terms                   ← Terms of service
```

### Admin Dashboard

```
/admin                         ← Dashboard overview
/admin/content                 ← Content management
/admin/content/pages           ← Page editor
/admin/content/pages/[id]      ← Page detail
/admin/content/blog            ← Blog editor
/admin/users                   ← User management
/admin/users/[id]              ← User detail
/admin/settings                ← Platform settings
/admin/settings/seo            ← SEO configuration
```

### Documentation Site

```
/docs                          ← Getting started
/docs/overview                 ← Platform overview
/docs/getting-started          ← Quickstart guide
/docs/getting-started/install  ← Installation
/docs/getting-started/config   ← Configuration
/docs/api                      ← API reference
/docs/api/authentication       ← Auth endpoints
/docs/api/users                 ← User endpoints
/docs/api/webhooks             ← Webhooks
/docs/guides                   ← Tutorials and guides
/docs/guides/deployment        ← Deployment guide
/docs/guides/migration         ← Migration guide
/docs/reference                ← Reference material
/docs/reference/glossary       ← Glossary
/docs/reference/changelog      ← Changelog
```

---

## Navigation Structure

### Primary Navigation — Marketing Site

```
Sathus Platform
  ├── Products
  ├── Pricing
  ├── Docs
  ├── Blog
  └── Contact
```

Breadcrumb pattern:
```
Home → Products → [Product Name] → [Feature]
```

### Secondary Navigation — Docs Site

```
Docs
  ├── Getting Started
  ├── API Reference
  ├── Guides
  └── Changelog
```

Sidebar navigation is persistent and reflects the current section.

---

## Content Model

### Page (Marketing)

```yaml
page:
  title: string
  slug: string
  description: string
  body: rich-text
  metadata:
    ogImage: asset-reference
    noIndex: boolean
  seo:
    canonical: url
    robots: enum
  publishedAt: datetime
  author: reference(user)
```

### Article (Blog)

```yaml
article:
  title: string
  slug: string
  excerpt: string
  body: markdown || mdx
  metadata:
    coverImage: asset-reference
    readTime: integer
  taxonomy:
    tags: array(tag)
    category: reference(category)
  seo:
    canonical: url
    focusKeyword: string
  publishedAt: datetime
  featured: boolean
```

### Documentation Page

```yaml
docPage:
  title: string
  slug: string
  navigationTitle: string
  body: markdown || mdx
  order: integer
  previous: reference(docPage)
  next: reference(docPage)
  metadata:
    difficulty: enum (beginner, intermediate, advanced)
    estimatedReadTime: integer
  publishedAt: datetime
  deprecated: boolean
```

### Product (Marketing)

```yaml
product:
  name: string
  slug: string
  tagline: string
  description: string
  features: array(feature)
  pricing: reference(pricingPlan)
  media:
    heroImage: asset-reference
    gallery: array(asset-reference)
  publishedAt: datetime
  deprecated: boolean
```

---

## Taxonomy & Metadata

### Tag Schema

Tags are lowercase, hyphenated, and non-hierarchical.

Examples:
- `engineering`
- `product-updates`
- `security`
- `performance`

### Metadata Standards

Every page must define:
- `title` — Used in `<title>` tag and social previews. Recommended 50–60 characters.
- `description` — Meta description. Recommended 150–160 characters.
- `canonical` — Resolves duplicate content. Required for syndicated content.
- `ogImage` — Open Graph image. Aspect ratio 1200×630px.
- `noIndex` — False by default. Set true for internal-only pages.

---

## User Flows

### First-Time Visitor (Marketing)

1. Land on homepage
2. Scan hero and value proposition
3. Navigate to `/products` or `/pricing`
4. Click CTA to trial or contact
5. Convert or exit to docs for deeper evaluation

### Developer Evaluating the Platform (Docs)

1. Land on `/docs`
2. Complete `/docs/getting-started/install`
3. Review `/docs/api/authentication`
4. Explore `/docs/guides/deployment`
5. Subscribe to changelog

### Internal Content Editor (Admin)

1. Authenticate at `/admin`
2. Navigate to `/admin/content/pages`
3. Create or edit page using CMS interface
4. Preview and publish
5. Content is automatically invalidated from CDN cache

---

## Accessibility Considerations

- Skip-to-content links on every page
- Landmark roles (`<header>`, `<nav>`, `<main>`, `<footer>`) on all templates
- Consistent heading hierarchy (H1 → H2 → H3) without skipping levels
- Breadcrumb lists use `<nav aria-label="breadcrumb">`
- Sidebar navigation is keyboard navigable and announces active state

---

## Change Process

1. Propose changes via an Information Architecture RFC.
2. RFC reviewed by Product Lead and Design Lead.
3. Changes affecting URL structures require a 301 redirect plan.
4. Changes affecting navigation require a usability review.
5. Approved changes are documented and communicated to engineering for implementation.
