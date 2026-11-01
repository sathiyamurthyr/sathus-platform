# SATHUS TECHNOLOGY — ENTERPRISE TECHNICAL SEO & ORGANIC GROWTH STRATEGY

**Document:** Comprehensive Technical SEO Architecture, Canonical Rules & Schema Standards  
**Company:** Sathus Technology Private Limited  
**Website:** [https://www.sathus.in](https://www.sathus.in)  
**Version:** 3.0 (Production Architecture)  
**Status:** Approved for Implementation  

---

## 1. Technical SEO Architecture

### 1.1 Canonical & URL Integrity
* **Canonical Domain:** `https://www.sathus.in` (enforced via edge redirects from `http://`, `https://sathus.in`, and preview deployment hosts).
* **Trailing Slashes:** Strictly normalized (no trailing slash on document paths, trailing slash on root `/`).
* **Clean Slugs:** All URLs are lowercase, hyphen-separated, and descriptive (e.g., `/solutions/ai-engineering`, `/products/vmaila`).
* **Self-Referential Canonicals:** Every indexable page must output `<link rel="canonical" href="https://www.sathus.in/path" />` generated dynamically via `@/lib/seo/metadata-builder`.

### 1.2 Sitemap Topology (`/sitemap.xml`)
The sitemap is generated dynamically at build time and on-demand via Next.js `MetadataRoute.Sitemap`:
* **Priority 1.0:** Root Homepage (`/`).
* **Priority 0.95:** Core Solutions (`/solutions/*`), Core Products (`/products/*`), Primary Conversion (`/book-strategy-session`, `/pricing`).
* **Priority 0.90:** Regulated Industry pages (`/industries/*`), Case Studies (`/case-studies/*`), Engineering Hub (`/engineering-hub/*`).
* **Priority 0.85:** Technical Resources & Insights (`/resources/blog/*`, `/resources/insights`, `/resources/documentation`).
* **Priority 0.60:** Legal and compliance policies (`/legal/*`, `/oh-id-privacy-policy`, `/oh-id-account-deletion`).

### 1.3 Robots.txt Directives (`/robots.txt`)
* **Allowed:**
  * All public corporate, solution, product, industry, and resource routes.
  * Legitimate search engine crawlers (`Googlebot`, `Bingbot`, `Applebot`, `DuckDuckBot`, `Baiduspider`, `YandexBot`).
  * Authorized AI retrieval and discovery agents (`GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`).
* **Disallowed:**
  * Private application runtimes: `/workspace/`, `/app/`, `/admin/`, `/auth/`, `/api/`, `/private/`, `/temp/`.
* **Sitemap Reference:** Explicitly points to `https://www.sathus.in/sitemap.xml`.

---

## 2. Page-Level On-Page SEO Framework

Every indexable route must adhere to this structural hierarchy:

```
+--------------------------------------------------------------------------+
| 1. Meta Title (Max 60 chars): [Primary Keyword] — [Value Prop] | Sathus  |
| 2. Meta Description (140-155 chars): Factual, intent-matched with CTA.   |
| 3. Single H1: Exactly one descriptive H1 matching the primary intent.    |
| 4. Definitional AI Summary: 2-3 sentences explaining the topic.          |
| 5. Logical H2/H3 Hierarchy: Structured problem, outcome, capabilities.   |
| 6. Visual Media with Descriptive Alt Text: Formats in WebP/AVIF.         |
| 7. Contextual Internal Linking: 3-5 links to related products & services |
| 8. JSON-LD Structured Data: Breadcrumbs + Schema specific to page type.   |
+--------------------------------------------------------------------------+
```

### 2.1 Standardized Homepage Metadata
* **Title:** `Sathus Technology | Enterprise AI, Data & Cloud Engineering`
* **Description:** `Sathus Technology builds enterprise AI solutions, governed data platforms, cloud-native applications and intelligent software products for businesses operating in complex and regulated industries.`
* **Keywords:** `Enterprise Software Development Company`, `AI Engineering Company`, `Enterprise AI Development`, `Data Lakehouse Engineering`, `Cloud Modernization Services`, `Sathus Technology`, `Sathus.in`.

---

## 3. Structured Data (JSON-LD) Specification

```
+-------------------------------------------------------------------+
| GLOBAL SCHEMAS (Layout)                                           |
| Organization (Official registration, headquarters, branch office) |
| LocalBusiness (GeoCoordinates, PostalAddress, OpeningHours)       |
| WebSite (SearchAction potentialAction)                            |
+-------------------------------------------------------------------+
| PAGE-SPECIFIC SCHEMAS                                             |
| BreadcrumbList (All pages > 1 level deep)                         |
| Service (All /solutions/* pages)                                  |
| SoftwareApplication / Product (All /products/* pages)             |
| Article / BlogPosting (All /resources/blog/* articles)            |
| ContactPage (For /contact and /book-strategy-session)             |
+-------------------------------------------------------------------+
```

### 3.1 Organization Schema Parameters (Verified)
* **`@type`**: `Organization`
* **`name`**: `Sathus Technology Pvt. Ltd.`
* **`legalName`**: `Sathus Technology Private Limited`
* **`foundingDate`**: `2024-08-28`
* **`url`**: `https://www.sathus.in`
* **`logo`**: `https://www.sathus.in/icon.svg`
* **`email`**: `admin@sathus.in`
* **`telephone`**: `+91 90253 81316`
* **`address`**:
  * Registered HQ: Plot No. 8/47, Sri Ambal Nagar Annexe, Ponni Amman Kovil St, Opp. Kedar Hospital, Kovur, Chennai – 600128, Tamil Nadu, India.
  * Branch Office: Bigspace Business Centre, 110, Manickam Lane, Anna Salai, Opp. Guindy Metro Station, Guindy, Chennai – 600032, Tamil Nadu, India.

### 3.2 Product Schemas (Reconciled Portfolio)
For each product (`Sathus AI`, `Memomes Cloud`, `SocialHub MCP`, `OneHealthID`, `Vmaila`, `Vmailachat`):
* Embedded `SoftwareApplication` with `applicationCategory`, `operatingSystem`, `offers`, and feature specifications.

---

## 4. Internal Linking Topology

To distribute PageRank effectively and create clear topic clusters:
1. **Homepage Hub:** Links down to the 6 primary Solutions and 6 core Products.
2. **Solution Pages:** Cross-link to relevant Products (e.g. `AI Engineering` links to `Sathus AI` and `SocialHub MCP`; `Enterprise Applications` links to `Vmaila` and `OneHealthID`).
3. **Product Pages:** Link up to their parent Solutions and to the Strategy Session booking flow.
4. **Engineering Hub & Blog:** Contextually cite Solutions, Products, and Architecture Whitepapers with descriptive anchor text.

---

## 5. Webmaster & Search Console Governance

* **Google Search Console Verification:** Token verified in `src/app/layout.tsx` (`google66399c2d930e86b3`).
* **Bing Webmaster Tools Verification:** Token verified in `src/app/layout.tsx` (`9EFF30B76BF1119CD257D4E864713973`).
* **Sitemap Ping Protocol:** Automated trigger upon production release to notify search engine discovery pipelines.

