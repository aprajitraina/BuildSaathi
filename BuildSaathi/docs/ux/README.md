# UX & Design

## Design Principles

1. **Clarity over cleverness** — Contractors are busy. Every screen has one clear purpose.
2. **Mobile-first** — 70%+ of users access via mobile on Android. Design for 375px width first.
3. **Speed** — Under 2 seconds to first meaningful content on 4G.
4. **Hindi-ready** — UI strings externalized for i18n from day 1. Hindi support in Phase 3.
5. **Trust signals** — Show real data, real rates, real tender sources. No fake metrics.

## Design System

- **Component library**: ShadCN UI (Radix primitives + Tailwind)
- **Typography**: Inter (Latin) — prepare for Noto Sans Devanagari (Hindi)
- **Color palette**: Neutral-first with accent blue (consistent with Linear/Stripe aesthetic)
- **Icons**: Lucide React (tree-shakeable)
- **Charts**: Recharts (for material price trends, project progress)

## Style Inspiration

- **Layout patterns**: Linear (clean sidebar, dense data, keyboard-first)
- **Component style**: Stripe (trusted, clear, enterprise-grade)
- **Content hierarchy**: Notion (flexible, information-dense without feeling cluttered)
- **Domain feel**: Procore (contractor-grade, task-focused)

## Page Hierarchy

### Public Pages
- **Landing** (`/`): Hero, problem statement, feature highlights, social proof, CTA
- **Features** (`/features`): Detailed feature breakdown by module
- **Pricing** (`/pricing`): Tier comparison table, FAQ
- **Login / Signup** (`/login`, `/signup`): Minimal auth forms

### App Pages (Authenticated)

#### Dashboard (`/app/dashboard`)
- **Layout**: Sidebar nav (collapsed on mobile) + main content area
- **Widgets**: Active tenders count, Active projects, Payment due amount, Unread alerts
- **Quick Actions**: "Find Tenders", "New Estimate", "Create Invoice"
- **Recent Activity**: Last 5 actions across modules

#### Tender Discovery (`/app/tenders`)
- **Layout**: Filter sidebar (state, category, value range, deadline) + tender card grid
- **Tender Card**: Title, department, location, value, deadline, save button
- **Tender Detail** (`/app/tenders/[id]`): Full info + AI Summary panel + Save/BOQ actions

#### BOQ Estimator (`/app/boq`)
- **Layout**: Two-panel — line item builder (left) + live cost summary (right)
- **Features**: DSR rate search, quantity input, auto-calculated totals, export to PDF

#### Project Tracker (`/app/projects`) — Phase 2
- **Layout**: Kanban or list view of active projects
- **Project Detail**: Milestone timeline, completion %, team, budget vs actual

## Component Hierarchy

```
Layout
├── Sidebar
│   ├── Logo
│   ├── NavItem (Dashboard, Tenders, BOQ, Projects, etc.)
│   └── UserProfile
├── TopBar
│   ├── PageTitle
│   ├── NotificationBell
│   └── UserMenu
└── PageContent
    ├── PageHeader (title + actions)
    └── [Module-specific content]

Shared Components
├── DataTable (sortable, filterable, paginated)
├── StatusBadge (Pill with tone)
├── EmptyState (icon + message + CTA)
├── ConfirmDialog
├── FileUploadZone
└── AIPanel (loading → result animation)
```

## Mobile Considerations

- Sidebar collapses to bottom tab bar on mobile
- Dashboard widgets stack vertically
- Tender cards are full-width on mobile
- BOQ line item builder switches to accordion layout
- All CTAs are min 44px touch targets
