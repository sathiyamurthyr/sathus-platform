# SEO STRATEGY

**Document:** Search Engine Optimization and Organic Growth  
**Owner:** Marketing Lead + SEO Specialist  
**Last Updated:** 2026-07-11

---

## Purpose

SEO Strategy defines how the Sathus Platform achieves and maintains organic visibility. It translates technical architecture decisions into search ranking advantages and establishes the editorial discipline required to win in competitive SERPs.

This document governs both technical SEO (infrastructure and code) and content SEO (keyword strategy and campaign planning).

---

## Goals

- Establish baseline visibility for core brand and product terms
- Define technical SEO requirements integrated into the CI/CD pipeline
- Create a repeatable keyword research and content optimization workflow
- Achieve and maintain Core Web Vitals thresholds
- Build authoritative backlink profiles through earned content

## Table of Contents

1. [Purpose](#purpose)
2. [Goals](#goals)
3. [Keyword Strategy](#keyword-strategy)
4. [Technical SEO](#technical-seo)
5. [Structured Data](#structured-data)
6. [Content Optimization Framework](#content-optimization-framework)
7. [Core Web Vitals](#core-web-vitals)
8. [International SEO](#international-seo)
9. [Monitoring & Reporting](#monitoring--reporting)
10. [Governance](#governance)

---

## Keyword Strategy

### Research Framework

Keyword opportunities are evaluated across three dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Search Volume | 30% | Monthly search volume in target markets |
| Intent Match | 40% | Alignment with product value proposition and content pillars |
| Competition | 30% | Difficulty based on domain authority and SERP features |

### Target Clusters

| Cluster | Seed Keywords | Content Type |
|---------|---------------|--------------|
| Platform | "enterprise web platform", "next.js enterprise", "monorepo web" | Product pages, architecture docs |
| Documentation | "technical documentation site", "API docs next.js", "docs site example" | Doc pages, blog posts |
| Developer Experience | "next.js developer experience", "typescript monorepo", "turborepo tutorial" | Engineering blog, tutorials |
| SEO Performance | "next.js seo", "enterprise seo framework", "core web vitals next.js" | Technical guides |

### Content Gap Analysis

- Quarterly keyword gap analysis against licensed SEO tool.
- Top 20 competitor domains mapped.
- Content produced to close gaps where intent matches our pillars.

---

## Technical SEO

### Crawl and Index

| Requirement | Implementation |
|-------------|----------------|
| robots.txt | Served from `/public/robots.txt`. Crawl-delay: 0 for production, 10 for staging. |
| XML Sitemaps | Auto-generated at `/sitemap.xml` on every deploy. |
| Canonical URLs | `<link rel="canonical">` on every page. Defaults to production origin. |
| NoIndex Rules | Staging, admin routes, search results pages, legal exports. |
| Internal Linking | Minimum 3 contextual internal links per content page. |

### Crawl Budget Management

- `noindex` on low-value pages (tag archives, date-based blog archives).
- Parameter handling in Google Search Console to prevent duplicate indexing.
- Lazy-loaded images use native `loading="lazy"`.

### International Targeting

- hreflang tags on all localized content.
- Default language fallback is `en-US`.
- Future expansion: separate domains or subdirectories per locale.

---

## Structured Data

### Mandatory Schema.org Types

| Content | Schema Type | Properties |
|---------|-------------|------------|
| Organization | `Organization` | name, url, logo, sameAs (social profiles) |
| Products | `Product` | name, description, image, offers (pricing) |
| Blog Posts | `Article` | headline, datePublished, author, publisher |
| Documentation | `TechArticle` | headline, description, proficiencyLevel |
| HowTo Guides | `HowTo` | name, step (array with name, text, url) |
| FAQ Pages | `FAQPage` | mainEntity (Question + Answer) |
| Breadcrumbs | `BreadcrumbList` | itemListElement |

### Implementation Notes

- JSON-LD format only; no microdata.
- Rendered server-side in Next.js metadata export.
- Validated with Google Rich Results Test before deployment.

---

## Content Optimization Framework

### On-Page Checklist

Every content page must satisfy:

1. **Title Tag:** 50–60 characters. Primary keyword in the first half.
2. **Meta Description:** 150–160 characters. Includes value statement and CTA.
3. **H1 Tag:** One per page. Matches or closely aligns with title tag.
4. **Heading Structure:** Logical H2 → H3 hierarchy without skipping levels.
5. **Keyword Density:** Natural usage. No stuffing. Target keyword appears in first 100 words.
6. **Internal Links:** Minimum 3 contextual links to related content.
7. **External Links:** Where appropriate. Links to authoritative sources.
8. **Images:** All images have descriptive `alt` text. Files compressed and served in WebP format.

### E-E-A-T Signals

Established content demonstrates Experience, Expertise, Authoritativeness, and Trust:

- Author bylines with credentials on all informational content.
- Technical articles reviewed by platform maintainers before publication.
- Security and legal content linked to verified policy documents.
- Statistics and claims linked to primary sources.

---

## Core Web Vitals

### Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### Enforcement

- Metrics measured via Vercel Analytics or self-hosted equivalent.
- CI gate fails builds where production deploys exceed "Needs Improvement" thresholds.
- Regression alerts for any metric declining > 10% from baseline.

### Optimization Tactics

- Images: Specified width and height, `loading="lazy"` below the fold, WebP with JPEG fallback.
- Fonts: Preload critical fonts. Use `font-display: swap`.
- Third-Party Scripts: Loaded with `async` or `defer`. A/B tested for impact.
- JavaScript: Code splitting at the route level. No eval.

---

## International SEO

### Architecture Decision

Content localization strategy:
- Phase 1: English-only with hreflang `en-US`.
- Phase 2: Structured content translation pipeline via `next-intl`.
- Phase 3: Dedicated locale subdirectories (`/fr/`, `/de/`, `/ja/`).

### Localization Requirements

- Translated content reviewed for natural language quality.
- Translated keyword research conducted per locale.
- Cultural date, number, and currency formatting applied.
- Local SEO signals (Google Business Profile, local citations) where applicable.

---

## Monitoring & Reporting

### Metrics Tracked

| Metric | Source | Cadence |
|--------|--------|---------|
| Organic Traffic | Analytics + Search Console | Weekly |
| Click-Through Rate (CTR) | Search Console | Weekly |
| Average Position | Search Console | Weekly |
| Index Coverage | Search Console | Weekly |
| Core Web Vitals | Vercel Analytics / CrUX | Daily |
| Backlink Profile | Licensed tool | Monthly |
| SERP Feature Ownership | Manual + tooling | Monthly |

### Reporting

- Weekly snapshot via dashboard.
- Monthly executive summary: organic traffic trends, top-performing content, ranking movements.
- Quarterly strategy review against roadmap milestones.

---

## Governance

SEO decisions are coordinated by the Marketing Lead with engineering input for technical implementation.

Changes affecting URL structures, canonical tags, or structured data require:
1. SEO Specialist review
2. Engineering Lead sign-off
3. 301 redirect plan for any affected URLs
4. Post-deployment verification within 48 hours
