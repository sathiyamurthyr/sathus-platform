# Sathus Admin

Enterprise administration console for the Sathus Platform, built on
**Next.js 15 (App Router)**, **React 19** and **TypeScript**.

> Status: **Foundation sprint (v1.0)** — shell, navigation, theming and
> placeholder dashboard widgets. Backend authentication and module
> management (Products, Blog, Users, …) are intentionally out of scope.

## Tech stack

- Next.js 15 · React 19 · TypeScript (strict)
- Tailwind CSS (design tokens from `@sathus-platform/config`)
- `next-themes` for light / dark / system theming
- Radix `Slot`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `lucide-react` icons · `motion` transitions
- `zod` + `react-hook-form` for form validation

## Routes

| Route            | Description                                  |
| ---------------- | -------------------------------------------- |
| `/admin`         | Redirects to `/admin/dashboard`              |
| `/admin/dashboard` | Authenticated dashboard shell + widgets    |
| `/admin/login`   | Authentication screen (placeholder)          |

## Folder structure

```
src/
  app/
    (admin)/            # route group wrapped by the AdminLayout shell
      layout.tsx        # AdminLayout (sidebar + top bar)
      dashboard/page.tsx
      page.tsx          # redirect -> /admin/dashboard
    admin/
      login/page.tsx    # standalone auth screen (no shell)
    layout.tsx          # root html, ThemeProvider, fonts
    globals.css         # design tokens + admin utilities
  components/
    ui/                 # primitives: button, card, badge, avatar, input, skeleton
    admin/              # AdminLayout, Sidebar, TopNavigation, ProfileMenu, …
    dashboard/          # DashboardCard, StatCard, QuickActionCard, …
    shared/             # EmptyState
  config/               # navigation + placeholder dashboard data
  hooks/                # useMediaQuery, useClickOutside
  lib/                  # cn (re-export of @sathus-platform/utils)
  providers/            # ThemeProvider (next-themes wrapper)
  types/                # domain types (NavItem, Stat, …)
```

## Reusable components

All components are documented inline (JSDoc) and exported from barrel files
(`components/admin`, `components/dashboard`, `components/ui`, `components/shared`).

### Layout (`components/admin`)

| Component        | Responsibility                                              |
| ---------------- | ----------------------------------------------------------- |
| `AdminLayout`    | Responsive shell: fixed sidebar (desktop) + slide-in drawer (mobile), sticky top bar. |
| `Sidebar`        | Brand header, primary navigation, status footer.            |
| `SidebarItem`    | Nav row with active state; `comingSoon` renders a disabled, non-navigating control. |
| `TopNavigation`  | Hamburger, breadcrumb, search, notifications, theme + profile. |
| `ProfileMenu`    | Avatar trigger + Profile / Account / Preferences / Sign out. |
| `NotificationMenu` | Bell trigger + placeholder notification panel.            |
| `GlobalSearch`   | Search control placeholder (⌘K affordance).                 |
| `ThemeToggle`    | Light / dark / system switcher.                             |
| `PageHeader`     | Consistent page title + actions slot.                      |

### Dashboard (`components/dashboard`)

| Component          | Responsibility                                |
| ------------------ | --------------------------------------------- |
| `DashboardCard`    | Section container (title + actions + body).   |
| `StatCard`         | Metric tile with icon, value and trend.       |
| `QuickActionCard`  | Keyboard-accessible shortcut tile.            |
| `RecentActivity`   | Timeline feed of platform activity.           |
| `SystemStatus`     | Service health list with status dots.         |

### Primitives (`components/ui`)

`Button` · `Card` (`CardHeader`/`Title`/`Description`/`Content`/`Footer`) ·
`Badge` · `Avatar` · `Input` · `Skeleton` — composed from
`class-variance-authority` and shared design tokens.

## Accessibility

- Keyboard navigable; visible `focus-visible` rings on every control.
- ARIA roles/labels for navigation, breadcrumb, menus, dialog and status.
- Mobile drawer is a focus-trappable `role="dialog"` with Escape-to-close
  and body scroll lock.
- `next-themes` with `suppressHydrationWarning` avoids theme flash.

## Scripts

```bash
npm run dev        # start dev server (turbopack)
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest
```
