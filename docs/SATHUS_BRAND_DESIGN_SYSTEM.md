# SATHUS TECHNOLOGY — BRAND & CORPORATE DESIGN SYSTEM

**Document:** Strict Corporate Brand Identity, Visual Language & Component Specification  
**Company:** Sathus Technology Private Limited  
**Website:** [https://www.sathus.in](https://www.sathus.in)  
**Version:** 2.0 (International Enterprise Standard)  
**Status:** Approved & Enforced  

---

## 1. Brand Philosophy & Positioning

Sathus Technology is an international enterprise engineering firm delivering production AI agents, governed data lakehouses, and cloud-native software for regulated industries (Healthcare, FinTech, Life Sciences). 

The visual identity embodies **rigorous engineering excellence, quiet corporate confidence, transparency, and human-centred precision**. It rejects generic startup SaaS tropes (dark mode by default, chaotic floating 3D glass shapes, heavy video backgrounds, multi-color rainbow gradients) in favor of **editorial typography, structured white-space, authoritative Burgundy and Vibrant Orange accents, and structured technical substance**.

---

## 2. Approved Corporate Color Palette

```
+-------------------------------------------------------------------------+
| PRIMARY BRAND FOUNDATION                                                |
|                                                                         |
| Pure White        Subtle Surface      Primary Burgundy   Vibrant Orange |
| #FFFFFF           #FAF8F9             #A20A3A            #FF9933        |
| (Page Background) (Cards/Sections)    (Brand Primary)    (Brand Accent) |
+-------------------------------------------------------------------------+
| TYPOGRAPHY & NEUTRAL CONTRAST                                           |
|                                                                         |
| Dark Charcoal     Slate Grey          Border / Divider   Gold Accent    |
| #292329           #635861             #EDE1E6            #EDC11E        |
| (Headings)        (Body Copy)         (Hairlines)        (Highlights)   |
+-------------------------------------------------------------------------+
```

### 2.1 Color Tokens & Hex Specifications

| Token Name | Hex Code | HSL / CSS Variable | Contrast on #FFFFFF | Usage & Semantic Rules |
| :--- | :--- | :--- | :--- | :--- |
| **`background`** | `#FFFFFF` | `0 0% 100%` | 1:1 | **Mandatory base background** for all public corporate web surfaces. |
| **`surface-subtle` / `card`** | `#FAF8F9` | `330 15% 98%` | 1.05:1 | Secondary section alternating background, card containers, and data blocks. |
| **`primary` (Burgundy)** | `#A20A3A` | `341 88% 34%` | **8.1:1 (AAA)** | Primary brand identifier, key display titles, primary action buttons, active navigation markers. |
| **`primary-hover`** | `#8C0832` | `341 89% 29%` | **9.8:1 (AAA)** | Interactive hover state for primary buttons and text links. |
| **`primary-light` / `highlight`** | `#F9EEF2` | `336 45% 96%` | 1.1:1 | Badge backgrounds, icon chip containers, subtle borders. |
| **`orange` (Vibrant Orange)** | `#FF9933` | `30 100% 60%` | 2.1:1 (Accent) | Secondary action indicators, arrow hover transitions, status pills, accent pings. |
| **`orange-alt`** | `#FF9D2E` | `32 100% 59%` | 2.2:1 (Accent) | Alternative orange accent for gradient endpoints and subtle borders. |
| **`orange-pale`** | `#FFF4E8` | `32 100% 96%` | 1.06:1 | Background for warning states and beta product status badges. |
| **`gold` / `accent`** | `#EDC11E` | `47 85% 52%` | 1.7:1 (Accent) | Secondary technical highlights, calendar icons, subtle badges. |
| **`foreground` (Charcoal)** | `#292329` | `300 8% 15%` | **13.5:1 (AAA)** | Display headings, subheadings, and high-emphasis body text. |
| **`muted-foreground`** | `#635861` | `310 3% 38%` | **5.8:1 (AA)** | Standard descriptive body copy, secondary metadata, captions. |
| **`border` / `input`** | `#EDE1E6` | `330 14% 91%` | 1.3:1 | Subtle dividers, component cards, table borders, and input outlines. |

### 2.2 Mandatory Color Restrictions
* **White Backgrounds Only:** All public corporate pages (`/`, `/about`, `/solutions`, `/products`, `/industries`, `/technology`, `/contact`, `/legal`) must rest on a Pure White (`#FFFFFF`) foundation with alternating `#FAF8F9` subtle sections.
* **No Midnight Navy or Dark-Mode-Default:** No public corporate page may be styled with dark navy or black backgrounds.
* **No Blue Branding:** Blue branding (e.g., standard generic SaaS cobalt/cyan) is strictly forbidden for brand elements.
* **No Purple Branding:** No arbitrary violet/purple gradients.
* **No Unrelated Gradients:** All subtle visual gradients must use the strict `[#A20A3A] → [#FF9933]` brand spectrum.

---

## 3. Typography Scale & Hierarchy

The corporate type system pairs the editorial elegance of **Instrument Serif** with the clarity of **Inter** and technical rigor of **JetBrains Mono**.

```
Instrument Serif (Display) + Inter (Interface & Body) + JetBrains Mono (Code/Specs)
```

| Level | Size (Desktop / Mobile) | Line Height | Weight & Font | Typical Application |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1 (Hero)** | `4.5rem` (72px) / `2.5rem` (40px) | `1.08` | SemiBold (600) `Instrument Serif` | Main Hero Heading |
| **Heading 1 (H1)** | `3.25rem` (52px) / `2.25rem` (36px) | `1.12` | SemiBold (600) `Instrument Serif` | Solution / Product Page Headers |
| **Heading 2 (H2)** | `2.25rem` (36px) / `1.75rem` (28px) | `1.20` | SemiBold (600) `Instrument Serif` | Section Titles |
| **Heading 3 (H3)** | `1.375rem` (22px) / `1.25rem` (20px) | `1.30` | SemiBold (600) `Inter` | Feature Card Headings |
| **Heading 4 (H4)** | `1.125rem` (18px) / `1.0rem` (16px) | `1.40` | Medium (500) `Inter` | Sub-features, Table Headers |
| **Body Large** | `1.125rem` (18px) / `1.0rem` (16px) | `1.65` | Regular (400) `Inter` | Section Intros, Lead Paragraphs |
| **Body Regular** | `0.9375rem` (15px) / `0.875rem` (14px) | `1.60` | Regular (400) `Inter` | Standard Body Content |
| **Body Small / Meta** | `0.8125rem` (13px) / `0.75rem` (12px) | `1.50` | Regular (400) `Inter` | Captions, Timestamps, Disclaimers |
| **Eyebrow / Overline** | `0.75rem` (12px) / `0.6875rem` (11px) | `1.40` | SemiBold (600) `Inter` | Uppercase tracking (`tracking-[0.18em]`) |
| **Technical Code** | `0.8125rem` (13px) | `1.50` | Regular (400) `JetBrains Mono` | APIs, Terminal Commands, Identifiers |

---

## 4. Spacing, Grid & Layout Architecture

* **Container Max Width:** `1280px` (`max-w-7xl` or `container mx-auto px-4 sm:px-6 lg:px-8`).
* **Section Padding:**
  * Desktop: `py-20` to `py-24` (80px – 96px).
  * Mobile: `py-12` to `py-16` (48px – 64px).
* **Grid Systems:**
  * 3-Column Standard (`lg:grid-cols-3 gap-6 lg:gap-8`): Solutions, Products, Industry blocks.
  * 2-Column Split (`lg:grid-cols-2 gap-10 lg:gap-12`): Hero split, Overview + Visualization.
  * 4-Column Metric Grid (`grid-cols-2 lg:grid-cols-4 gap-4`): Key statistics and telemetry strips.
* **Corner Radius (`border-radius`):**
  * Outer Cards: `rounded-2xl` (16px) or `rounded-3xl` (24px for large CTA containers).
  * Inner Badges & Buttons: `rounded-lg` (8px) or `rounded-full` for status chips.

---

## 5. Component Library Standards

### 5.1 Buttons
* **Primary Button:**
  * Background: `#A20A3A` (Burgundy) with smooth hover transition to `#8C0832`.
  * Text: `#FFFFFF` (Pure White).
  * Icon: `#EDC11E` (Gold) or `#FFFFFF`.
  * Height: `48px` (`h-12 px-7 text-base font-medium`).
  * Elevation: Subtle shadow (`shadow-xs`), rising 1px on hover (`hover:-translate-y-0.5 hover:shadow-md`).
* **Secondary / Outline Button:**
  * Background: `#FAF8F9` with `#EDE1E6` border.
  * Text: `#292329` (Charcoal).
  * Hover: White background, `#A20A3A` border and text.

### 5.2 Enterprise Cards
* **Container:** `#FAF8F9` background, `1px solid #EDE1E6` border, `rounded-2xl`.
* **Hover State:** Elevates slightly (`hover:-translate-y-1`), background turns pure white (`bg-white`), border transitions to subtle burgundy wash (`hover:border-[#A20A3A]/40`).
* **Header:** Icon chip in `#F9EEF2` with `#A20A3A` icon.
* **Content:** H3 heading in `#292329`, problem statement and outcome in `#635861`.
* **Action:** Subtle interactive text link with arrow transition (`group-hover:translate-x-1 text-[#FF9933]`).

### 5.3 Product Showcase Cards
* Official product logo or designated icon.
* Product name, category tag, and availability status pill (`Generally Available`, `Beta`, `Research`).
* Clear description of the business problem solved.
* 3-4 bulleted core capabilities.
* Direct primary action (`Explore [Product] →`) linking to the canonical product page or live portal.

### 5.4 Navigation Header
* Left: Official Sathus Technology vector logo with proportional responsive sizing.
* Center / Left Navigation: 8 streamlined links:
  * `Home` (`/`)
  * `About` (`/company/about`)
  * `Solutions` (`/solutions` with mega-menu)
  * `Products` (`/products` with mega-menu)
  * `Industries` (`/industries`)
  * `Technology` (`/#technology`)
  * `Insights` (`/resources/insights`)
  * `Contact` (`/contact`)
* Right: Global Search (`⌘K`), Consultation CTA (`Request Consultation` / `Book Strategy Session`), Mobile Menu Drawer trigger.

### 5.5 Section Alternation Cadence
To maintain visual rhythm and prevent monotony without violating the strict white background rule:
* **Section A (White):** Background `#FFFFFF`, border-bottom `#EDE1E6`.
* **Section B (Subtle Surface):** Background `#FAF8F9`, border-bottom `#EDE1E6`.
* **Section C (White):** Background `#FFFFFF`.

---

## 6. Iconography & Imagery Standards

* **Icon Library:** Lucide React icons (`lucide-react`) used with consistent `strokeWidth={1.75}` or `2`.
* **Product Imagery:** High-resolution vector diagrams and realistic UI mockups representing real workflows (e.g. clinical intake for OH-ID, encrypted mail inbox for Vmaila, document intelligence graph for Memomes).
* **3D Usage:** Restrained, purposeful 3D canvases (Three.js) only where they explain data pipelines or agent orchestrations. No gratuitous decorative 3D blobs.

---

## 7. Motion & Core Web Vitals Standards

* **Framer Motion / Motion v12:** Standardized transitions (`duration: 0.3` to `0.5`, `ease: [0.16, 1, 0.3, 1]`).
* **Accessibility:** Native support for `useReducedMotion()`. If reduced motion is preferred by the user, opacity transitions apply immediately with zero spatial displacement.
* **Core Web Vitals Thresholds:**
  * LCP ≤ 2.5s
  * INP ≤ 200ms
  * CLS ≤ 0.1

