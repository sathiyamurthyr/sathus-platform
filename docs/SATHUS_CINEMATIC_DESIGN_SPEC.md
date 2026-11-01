# SATHUS TECHNOLOGY — CINEMATIC 3D WEBSITE DESIGN SPECIFICATION

**Document:** Cinematic 3D Architecture, Visual Storytelling & Motion System  
**Company:** Sathus Technology Private Limited  
**Website:** [https://www.sathus.in](https://www.sathus.in)  
**Creative Direction:** Cinematic 3D Enterprise Experience (Balanced Animation Intensity)  
**Status:** Design Blueprint & Specification  

---

## 1. Executive Vision & Creative Intent

The objective of the **Sathus.in Cinematic Website Transformation** is to establish Sathus Technology as an authoritative, globally competitive enterprise technology company.

Unlike consumer tech landing pages that rely on chaotic dark themes, floating gaming assets, or superficial rainbow gradients, Sathus.in delivers **an editorial-grade corporate experience**:
* **70% Clean Corporate Whitespace & Precision Content:** Structured editorial typography, generous whitespace, clear business value propositions, and accessible contrast.
* **20% Meaningful Motion & Transitions:** Purposeful, scroll-driven storytelling using GSAP timelines and Motion transitions that explain complex enterprise architectures.
* **10% Interactive 3D Technology Sculpture:** Client-side, WebGL-accelerated 3D scene representing interconnected technology layers (AI Intelligence, Governed Data Foundation, Cloud Infrastructure, and Enterprise Applications).

### Core Brand Pillars
* **Primary Brand Colors:**
  * Primary Burgundy: `#A20A3A`
  * Vibrant Orange: `#FF9933` (Accent)
  * Alternative Orange: `#FF9D2E`
  * Pure White: `#FFFFFF` (Base Page Background)
  * Subtle White / Card Surface: `#FAF8F9`
  * Border / Hairlines: `#EDE1E6`
* **Typography:** `Instrument Serif` (Editorial Display) + `Inter` (UI & Body Sans) + `JetBrains Mono` (Technical Specs).
* **Tone of Voice:** Authoritative, engineering-first, disciplined, and credible.

---

## 2. Seven Cinematic Chapters (Homepage Storytelling)

```
+--------------------------------------------------------------------------+
| CHAPTER 01: CINEMATIC OPENING (Hero Section)                             |
| Animated logo reveal, staggered editorial headline, and interactive      |
| 3D connected technology sculpture. 4-6s non-blocking ambient experience. |
+--------------------------------------------------------------------------+
| CHAPTER 02: TECHNOLOGY UNIVERSE (Connected Architectural Network)        |
| 3D interconnected network visually linking AI, Data, Cloud & Enterprise. |
| Pointer-responsive parallax and scroll-controlled perspective changes.   |
+--------------------------------------------------------------------------+
| CHAPTER 03: CORPORATE POSITIONING (Outcome-Focused Credibility)          |
| "Engineering Technology That Delivers Real Business Outcomes."           |
| Staggered typographic reveals and quantified engineering metrics.        |
+--------------------------------------------------------------------------+
| CHAPTER 04: ENGINEERING CAPABILITIES (Interactive Architectural Nodes)   |
| 4 Core Disciplines: AI Engineering, Governed Data, Cloud Modernization,  |
| and Enterprise Applications explained with animated data flow diagrams.  |
+--------------------------------------------------------------------------+
| CHAPTER 05: PRODUCT UNIVERSE (Multi-Product Portfolio Showcase)          |
| 6 Reconciled Products (Sathus AI, OneHealthID, Memomes Cloud, Vmaila,     |
| Vmailachat, SocialHub MCP) with 3D depth, status badges & live links.    |
+--------------------------------------------------------------------------+
| CHAPTER 06: REGULATED INDUSTRY IMPACT (Sector Solutions)                 |
| Healthcare, FinTech, Financial Services, Life Sciences & Manufacturing.  |
| Parallax card reveals and compliance-first architecture specifications.  |
+--------------------------------------------------------------------------+
| CHAPTER 07: CONVERSION & ADVISORY (Corporate Engagement)                 |
| Strategy session scheduling, multi-step inquiry portal, and verified     |
| corporate footer with registered Indian headquarters & branch office.    |
+--------------------------------------------------------------------------+
```

---

## 3. Signature Hero Composition & 3D Sculpture Specification

### 3.1 Layout Architecture (Desktop Split)
* **Left Column (48% Width):**
  * **Overline Chip:** `#F9EEF2` pill badge with `#A20A3A` text and pulsing `#FF9933` ping dot: *"Enterprise AI · Data · Cloud — Built for Regulated Industries"*.
  * **Hero Headline (H1):** `Instrument Serif`, 72px desktop / 40px mobile, line height `1.08`:  
    *"Engineering the Future of <span class="burgundy">AI</span>, <span class="orange">Data</span> & Enterprise Software."*
  * **Supporting Statement:** 18px `Inter`, line height `1.65`:  
    *"We engineer intelligent enterprise platforms, governed data ecosystems and cloud-native applications that turn complex business challenges into meaningful outcomes."*
  * **Dual CTAs:**
    * Primary CTA: `Explore Our Solutions` (Burgundy `#A20A3A` with gold arrow icon).
    * Secondary CTA: `Talk to Our Team` / `Book a Strategy Session` (Subtle card `#FAF8F9` with orange calendar icon).
  * **Key Metrics Strip:** Count-up telemetry for `Zero-Trust`, `99.95% Availability`, and `6 Regulated Industries`.
* **Right Column (52% Width):**
  * **Original 3D Technology Sculpture Canvas:** Client-side Three.js interactive WebGL viewport (`max-w-[580px] aspect-square`).

### 3.2 3D Technology Sculpture Design
The 3D model represents **layered enterprise computing** rather than a generic illustration:
1. **Central Connected Geometric Core:**
   * Glowing inner sphere representing centralized intelligence and deterministic evaluation.
   * Color: `#A20A3A` Burgundy standard material with `#8C0832` emissive intensity.
   * Outer wireframe icosahedron shell in `#FF9933` Vibrant Orange with metallic roughness.
2. **Four Surrounding Technology Nodes:**
   * **Node 1 (AI Intelligence):** Top orbital node with neural synaptic connections.
   * **Node 2 (Governed Data Lakehouse):** Lower-left node with columnar table layer geometries.
   * **Node 3 (Cloud Infrastructure):** Lower-right node with distributed multi-region cluster rings.
   * **Node 4 (Enterprise Applications):** Lateral node with composable API and domain gateways.
3. **Fine Connecting Data Paths & Particles:**
   * Spline bezier curves with floating data packet particles moving cyclically between nodes and core.
   * Particle count: 120 on Desktop, 40 on Mobile (device-adaptive).
4. **Interaction Specifications:**
   * **Pointer Parallax:** Mouse movement applies smooth damped rotational delta (`±15°` tilt on X/Y axes).
   * **Scroll-Controlled Camera:** As user scrolls through Chapter 1 into Chapter 2, camera smoothly pans from perspective angle to an architectural top-down projection.
   * **Node Hover:** Hovering over a specific node highlights its connecting spline in `#FF9933` and reveals its technical specification chip.
   * **Non-WebGL / Mobile Fallback:** Pre-rendered SVG radial vector network ensures zero content delay or layout shift if WebGL is disabled or on low-end devices.

---

## 4. Animation Timing & Motion System

To prevent motion sickness and maintain corporate professionalism, animations use an easing system based on `cubic-bezier(0.16, 1, 0.3, 1)`:

| Interaction / Element | Duration | Easing Function | Visual Behaviour |
| :--- | :--- | :--- | :--- |
| **Header Sticky Transition** | `0.3s` | `easeOut` | Blurs from transparent to `rgba(255,255,255,0.95)` with `#EDE1E6` hairline border. |
| **Headline Staggered Reveal** | `1.0s` | `power3.out` | Words emerge smoothly from `opacity: 0, y: 25px` with a 0.08s stagger. |
| **3D Sculpture Entrance** | `1.5s` | `power2.out` | Scale scales from 0.85 to 1.0 with 30° rotation settle. |
| **Button Hover State** | `0.25s` | `easeOut` | `-1px` vertical lift, subtle drop shadow deepening, arrow icon translate `+4px`. |
| **Card Depth Hover** | `0.35s` | `easeOut` | `-4px` vertical lift, background transitions from `#FAF8F9` to `#FFFFFF`, border shifts to `#A20A3A`/30. |
| **Chapter Section Reveals** | `0.7s` | `power2.out` | Triggered at 15% viewport intersection with soft fade and 20px upward motion. |
| **Data Stream Particles** | Continuous | Linear loop | Smooth 60 FPS orbital motion, automatically paused when section is scrolled out of viewport. |

### Strict Motion Constraints
* **No Scroll Hijacking:** User maintains natural browser wheel and touch velocity at all times.
* **No Flashing or Strobe Effects:** Zero jarring color shifts or aggressive strobing.
* **Zero Loading Screens:** Primary HTML content and headlines render server-side immediately without waiting for WebGL bundles.
* **Respect Reduced Motion:** Native `prefers-reduced-motion: reduce` disables all spatial displacements and particle loops, preserving clean instantaneous fades.

---

## 5. Technical Architecture & Engineering Decisions

```
+--------------------------------------------------------------------------+
| NEXT.JS 15 APP ROUTER + REACT 19 (Server-Rendered Semantic Core)          |
| Fast, static HTML generation with instant First Contentful Paint (<0.8s) |
+--------------------------------------------------------------------------+
| THREE.JS WEBGL RUNTIME (Dynamic Client-Side Import)                      |
| Client-side lazy-loaded component, WebGLRenderer, custom disposal logic  |
+--------------------------------------------------------------------------+
| GSAP SCROLLTRIGGER & TIMELINES (Coordinated Scroll Storytelling)         |
| Isolated GSAP contexts with cleanup hooks to prevent memory leaks        |
+--------------------------------------------------------------------------+
| MOTION / REACT 12 (Micro-Interactions & UI States)                       |
| Handles button states, mobile drawer, modals, and theme transitions      |
+--------------------------------------------------------------------------+
| TAILWIND CSS & DESIGN TOKENS (Strict Corporate Styling)                  |
| White foundation, Burgundy primary, Orange accents, Accessible Neutrals |
+--------------------------------------------------------------------------+
```

### Engineering Guardrails
1. **Zero React 19 Dependency Conflicts:** Direct Three.js integration encapsulates canvas rendering cleanly inside a React `useRef` + `useEffect` container, eliminating peer-dependency mismatches with React 19.
2. **Lifecycle & Garbage Collection:** Every geometry, material, texture, and WebGL context invokes `.dispose()` upon unmounting.
3. **IntersectionObserver Performance:** When the 3D canvas scrolls outside the viewport, `requestAnimationFrame` is paused to conserve GPU and battery resources.
4. **Device Capability Adaptation:** Pixel ratio capped at `min(window.devicePixelRatio, 2)` to protect high-DPI laptop displays from thermal throttling.

---

## 6. Performance & Core Web Vitals Targets

* **Largest Contentful Paint (LCP):** ≤ 2.2 seconds.
* **Interaction to Next Paint (INP):** ≤ 100 milliseconds.
* **Cumulative Layout Shift (CLS):** ≤ 0.02.
* **Animation Target:** Consistent 60 FPS on modern desktop and mobile hardware.

