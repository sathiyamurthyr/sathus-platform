# CONTENT STRATEGY

**Document:** Editorial Direction and Content Operations  
**Owner:** Content Lead + Marketing Lead  
**Last Updated:** 2026-07-11

---

## Purpose

Content Strategy defines what we say, how we say it, and who we say it to. It is the editorial backbone of the Sathus Platform web presence.

This document bridges the gap between product vision and user perception, ensuring that every piece of content — from a 6-word button label to a 5,000-word technical guide — serves a measurable purpose.

---

## Goals

- Define audience personas and content needs for each stage of the user journey
- Establish a consistent brand voice and tone across all channels
- Structure a repeatable editorial workflow from ideation through publication
- Align content with SEO discoverability and conversion objectives
- Create governance for content lifecycle: creation, review, archival

## Table of Contents

1. [Purpose](#purpose)
2. [Goals](#goals)
3. [Audience Personas](#audience-personas)
4. [Brand Voice & Tone](#brand-voice--tone)
5. [Content Pillars](#content-pillars)
6. [Editorial Workflow](#editorial-workflow)
7. [Content Lifecycle](#content-lifecycle)
8. [Distribution Channels](#distribution-channels)
9. [Governance](#governance)

---

## Audience Personas

### Primary: The Engineering Evaluator

**Name:** Alex  
**Role:** Senior Engineer, Series B SaaS  
**Goals:** Evaluate whether Sathus Platform fits their stack. Assess developer experience, extensibility, and long-term viability.  
**Content Needs:** Installation guides, API references, architecture overviews, deployment examples.  
**Frustrations:** Marketing fluff, unclear documentation, outdated examples.

### Secondary: The Technical Founder

**Name:** Mia  
**Role:** Co-founder and CTO, early-stage startup  
**Goals:** Determine if the platform will scale with the company. Assess ROI against building in-house.  
**Content Needs:** Case studies, roadmap transparency, pricing clarity, security posture.  
**Frustrations:** Vague pricing, feature checklists without context, sales-first demos.

### Tertiary: The Content Editor

**Name:** Jordan  
**Role:** Marketing Manager or Technical Writer  
**Goals:** Publish accurate, well-formatted content that ranks in search and converts readers.  
**Content Needs:** Style guidance, reusable components, content model documentation, editorial calendar.  
**Frustrations:** Inconsistent formatting, missing templates, unclear approval workflow.

---

## Brand Voice & Tone

### Voice: The Experienced Colleague

We communicate with the confidence of a senior engineer who also respects the craft of writing. We are precise without being cold, opinionated without being dogmatic.

**Voice attributes:**
- Clear and concise
- Technically accurate
- Empathetic to developer experience
- Confident in recommendations

### Tone Modulation

| Context | Tone | Example |
|---------|------|---------|
| Troubleshooting guide | Direct, actionable | "If the build fails, verify your Node version." |
| Release announcement | Enthusiastic but factual | "Version 2.0 ships with 40% faster builds." |
| Error message | Neutral, helpful | "Your session expired. Please sign in again." |
| Support response | Patient, thorough | "Here are the steps to reproduce the issue." |

### Anti-Patterns

- Avoid jargon where plain language suffices.
- Avoid hype words: "revolutionary," "seamless," "cutting-edge."
- Avoid the passive voice in documentation.
- Avoid apologizing for constraints; explain them.

---

## Content Pillars

### Pillar 1: Platform Capabilities

**Purpose:** Communicate what the platform does and how it works.  
**Formats:** Product pages, feature breakdowns, architecture diagrams, case studies.  
**Channels:** Marketing site, sales collateral, docs overview.

### Pillar 2: Engineering Enablement

**Purpose:** Enable developers to build, deploy, and maintain on the platform.  
**Formats:** Installation guides, API references, tutorials, migration guides, troubleshooting articles.  
**Channels:** Docs site, GitHub repository, developer blog.

### Pillar 3: Thought Leadership

**Purpose:** Establish credibility and attract an audience through insight.  
**Formats:** Blog posts, conference talks, whitepapers, engineering retrospectives.  
**Channels:** Blog, newsletter, social platforms.

### Pillar 4: Organizational Trust

**Purpose:** Reduce friction in procurement and partnership.  
**Formats:** Security white papers, compliance documentation, pricing pages, career postings.  
**Channels:** Marketing site, legal hub, careers page.

---

## Editorial Workflow

### Stage 1: Ideation

**Owner:** Content Lead + Product Lead  
**Activities:**
- Review roadmap for upcoming features requiring content.
- Analyze search trends and competitor gaps.
- Collect customer questions from support channels.

**Exit Criteria:** Prioritized backlog with assigned owners and deadlines.

### Stage 2: Outlining

**Owner:** Assigned Author  
**Activities:**
- Define target persona, content pillar, and conversion goal.
- Draft headline and executive summary.
- Map sections against information architecture.
- Identify required assets (images, diagrams, code samples).

**Exit Criteria:** Approved outline with stakeholder sign-off.

### Stage 3: Drafting

**Owner:** Assigned Author  
**Activities:**
- Write content following brand voice and style guidelines.
- Apply content model metadata (SEO fields, tags, categories).
- Embed or reference all required assets.

**Exit Criteria:** First draft complete and self-reviewed.

### Stage 4: Review

**Reviewers:** Technical Reviewer, Design Reviewer (if applicable)  
**Activities:**
- Factual and technical accuracy verification.
- Style and voice compliance check.
- Accessibility review for published content.
- SEO validation against target keywords.

**Exit Criteria:** Zero blockers; all comments resolved or explicitly accepted.

### Stage 5: Publication

**Owner:** Content Operations  
**Activities:**
- Content modeled and pushed to CMS or repository.
- Preview in staging environment.
- Schedule or publish.
- Notify distribution channels.

**Exit Criteria:** Content is live, indexed, and promoted.

### Stage 6: Maintenance

**Owner:** Assigned Content Owner  
**Activities:**
- Quarterly review for accuracy and freshness.
- Update or archive content based on audit results.
- Retire soft-deleted pages with 301 redirects.

---

## Content Lifecycle

```
Inception → Draft → Review → Published → Maintained → Archived
    ↑                                    |
    └────────────────────────────────────┘
                 (revision loop)
```

### Retention Rules

- Blog posts: reviewed every 12 months; archived if reference is stale.
- API docs: linked to release cycles; updated with every version.
- Legal pages: reviewed by legal counsel upon each regulatory change.

---

## Distribution Channels

| Channel | Cadence | Owner | Responsible Content |
|---------|---------|-------|---------------------|
| Marketing Website | Event-driven | Content Ops | Product, blog, legal |
| Docs Site | Release-tied | Engineering Docs | API, guides, references |
| Developer Blog | Bi-weekly | Content Lead | Engineering, tutorials |
| Newsletter | Weekly | Marketing | Curated platform updates |
| GitHub README | Continuous | Engineering | Onboarding, contribution |

---

## Governance

Content decisions follow the same governance model as engineering decisions:

- **Tier 1:** Author and editor approval for routine updates.
- **Tier 2:** Content Lead approval for new pillars and brand voice changes.
- **Tier 3:** Marketing Lead approval for public-facing policy or positioning statements.
