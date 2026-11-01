# AI DEVELOPMENT CONTEXT & REPOSITORY CONTINUITY

**Repository:** `d:\sathus-platform\sathus-platform`  
**Parent Brand:** Sathus Technology Private Limited  
**Website:** [https://www.sathus.in](https://www.sathus.in)  
**Last Updated:** November 1, 2026  

---

## 1. System Overview & Monorepo Architecture

* **Turborepo Workspace:**
  * `apps/web`: Next.js 15 (App Router, Turbopack, standalone deployment output) + React 19 + Tailwind CSS.
  * `apps/api`: Python FastAPI backend with Pydantic v2, PostgreSQL, SQLAlchemy, Redis rate limiting, JWT RBAC authentication.
  * `packages/config`: Shared Tailwind and TypeScript configurations.
  * `packages/ui`: Shared design system component primitives.
  * `packages/types`: Core TypeScript shared domain schemas.

---

## 2. Brand Identity & Strict Design Constraints

* **Foundational Background:** Pure White (`#FFFFFF`). No dark-mode default, no midnight navy on corporate pages.
* **Primary Brand Burgundy:** `#A20A3A` (Tailwind `burgundy`, CSS variable `--primary: 341 88% 34%`).
* **Secondary Brand Accent:** Vibrant Orange `#FF9933` / `#FF9D2E`.
* **Golden Highlight:** `#EDC11E`.
* **Subtle Surface:** `#FAF8F9`.
* **Typography:** Display serif is `Instrument Serif`, body sans is `Inter`, code/mono is `JetBrains Mono`.
* **Logo Mark:** Official vector logo preserved at `/public/branding/logo.svg` and `/public/icon.svg`.

---

## 3. Product Ecosystem Architecture

Sathus Technology operates as the **Parent Corporate Brand Authority**. Individual products have dedicated landing pages on `sathus.in/products/[slug]` that link to their live environments:
1. **Sathus AI** (`/products/sathus-ai`): Enterprise agent platform with evaluation harnesses and observability.
2. **OneHealthID / OH-ID** (`/products/onehealthid`): Healthcare operating platform with role-first workspaces, ABDM/ABHA integration, and FHIR interoperability (source at `d:\oh-id`).
3. **Memomes Cloud** (`/products/memomes-cloud`): Zero-knowledge client-side encrypted file sharing and document intelligence (source at `d:\memomes`, live at `memomes.space`).
4. **Vmaila** (`/products/vmaila`): Private, encrypted enterprise business email suite with multi-tenant organization security and scheduled send (source at `d:\vmaila`).
5. **Vmailachat** (`/products/vmailachat`): Real-time enterprise team collaboration and secure messaging with role-based channels (source at `d:\vmaila`).
6. **SocialHub MCP** (`/products/socialhub-mcp`): Model Context Protocol gateway connecting AI agents to business graphs.

---

## 4. Key Configuration Files & Entrypoints

* `apps/web/src/config/company.ts`: Single source of truth for company legal credentials, registered address, phone, email, and Schema.org generators.
* `apps/web/src/constants/index.ts`: Global navigation structure (`navItems`), mega menu configuration (`megaMenuSections`), footer links (`footerSections`), and announcements.
* `apps/web/src/features/products/data/index.ts`: Central registry for all portfolio products (`allProducts`, `productsBySlug`).
* `apps/web/src/app/sitemap.ts`: Dynamic XML sitemap generator covering all static pages, solutions, products, case studies, and engineering hub pillars.
* `apps/web/src/app/robots.ts`: Crawl directives allowing search engines and major AI agents while protecting private workspace and admin paths.

