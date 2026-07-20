# Sathus Technology — Enterprise SEO & Discoverability Guide

## Overview

This guide outlines the technical implementation standards for Search Engine Optimization (SEO), AI Search Engine Discoverability (LLMs), Structured Data (JSON-LD), and Analytics Integration for the Sathus Technology platform (`apps/web`).

---

## 1. Domain & Meta Directives

- **Canonical Origin:** `https://sathus.technology`
- **Metadata Base:** Initialized via `siteConfig.url` inside [`apps/web/src/app/layout.tsx`](file:///d:/sathus-platform/sathus-platform/apps/web/src/app/layout.tsx).
- **Indexability Defaults:** `index: true, follow: true` with Googlebot image preview max setting `large` across all public-facing pages.

---

## 2. Dynamic XML Sitemap & Robots Configuration

### `robots.txt` ([`robots.ts`](file:///d:/sathus-platform/sathus-platform/apps/web/src/app/robots.ts))
Disallows non-public routes (`/api/`, `/admin/`, `/_next/`, `/auth/`) while allowing indexers to crawl all public routes. Explicitly points to the sitemap XML URL:
```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /auth/

Sitemap: https://sathus.technology/sitemap.xml
```

### Dynamic XML Sitemap ([`sitemap.ts`](file:///d:/sathus-platform/sathus-platform/apps/web/src/app/sitemap.ts))
Prerenders entries for all static routes and dynamically registered items:
- `1.0` Priority: Homepage (`/`)
- `0.9` Priority: Products (`/products/*`), Solutions (`/solutions/*`), Strategy Booking (`/book-strategy-session`)
- `0.8` Priority: Resources, Industries, Case Studies, Contact (`/contact`)
- `0.7` Priority: Trust Center (`/trust/*`), Corporate (`/company/*`)
- `0.5` Priority: Legal terms & policies (`/legal/*`)

---

## 3. Schema.org Structured Data (JSON-LD)

All structured data is generated with zero-runtime client penalty using inline `<script type="application/ld+json">` components located in [`apps/web/src/components/seo/json-ld.tsx`](file:///d:/sathus-platform/sathus-platform/apps/web/src/components/seo/json-ld.tsx):

- **`Organization` & `WebSite`:** Included in root `layout.tsx` with logo, social links (`sameAs`), and search potential actions.
- **`BreadcrumbList`:** Automatically emitted on every subpage using the `<Breadcrumb />` component (`apps/web/src/components/common/breadcrumb.tsx`).
- **`SoftwareApplication`:** Emitted on Product detail pages (`/products/[slug]`).
- **`Service`:** Emitted on Solutions overview and detail pages (`/solutions/[slug]`).
- **`FAQPage`:** Emitted on all pages containing technical Q&A accordions.
- **`ContactPage`:** Emitted on `/contact`.

---

## 4. Analytics & Site Verification Environment Variables

The application contains built-in environment variable hooks for analytics tools and search engine webmaster consoles.

Add the following to `.env.local` or production deployment parameters:

```bash
# Search Console & Webmaster Verifications
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your_google_verification_code"
NEXT_PUBLIC_BING_SITE_VERIFICATION="your_bing_verification_code"

# Analytics Integration Points
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"          # Google Analytics 4 Measurement ID
NEXT_PUBLIC_CLARITY_ID="xxxxxxxxxx"       # Microsoft Clarity Project ID
```

---

## 5. Header & Heading Hierarchy Standards

- Every page MUST contain exactly **one `<h1>`** inside its Hero section.
- Section headings MUST follow strict sequential hierarchy (`<h2>` for major sections, `<h3>` for cards/features).
- All interactive images, icons, and buttons MUST include explicit `alt` text or `aria-label` tags for screen readers and search crawlers.
