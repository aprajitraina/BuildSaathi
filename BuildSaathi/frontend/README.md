# frontend/

Next.js 14 App Router frontend for BuildSaathi.

## Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | SSR/CSR hybrid, routing, layouts |
| TypeScript | Type safety across all modules |
| Tailwind CSS | Utility-first styling |
| ShadCN UI | Component primitives (Radix + Tailwind) |
| React Query (TanStack) | Server state — fetching, caching, mutations |
| Zustand | Client/UI-only state |
| Lucide React | Icon set |
| Recharts | Data visualization (price trends, progress charts) |
| next-intl | i18n scaffolding (Hindi support Phase 3) |
| Zod | Runtime schema validation for forms and API responses |
| React Hook Form | Form state management |

## Structure

```
frontend/
├── app/                    → Next.js App Router pages and layouts
│   ├── (public)/           → Public pages: landing, features, pricing, auth
│   ├── (app)/              → Authenticated app shell and all protected pages
│   └── (admin)/            → Admin panel (Phase 2)
├── components/             → Shared, reusable UI components
│   ├── ui/                 → ShadCN-generated components (do not hand-edit)
│   └── shared/             → Custom shared components built on top of ShadCN
├── modules/                → Domain feature modules (self-contained)
│   ├── auth/               → Login, signup, session management
│   ├── dashboard/          → Contractor home dashboard
│   ├── tenders/            → Tender discovery and AI summary
│   ├── boq/                → BOQ estimator and line items
│   ├── projects/           → Project tracker (Phase 2)
│   ├── materials/          → Material price tracker (Phase 2)
│   ├── billing/            → Billing and invoices (Phase 2)
│   └── documents/          → Document vault (Phase 2)
├── hooks/                  → Global shared hooks
├── services/               → API client and service layer
├── lib/                    → Utilities, helpers, constants
└── types/                  → Global TypeScript type definitions
```

## Development

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000

npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Environment Variables

Copy `../.env.example` to `../.env` — Next.js will pick up `NEXT_PUBLIC_*` variables.

## Module Convention

Each module in `modules/` follows this structure:

```
modules/tenders/
├── README.md           → What this module does
├── components/         → Module-specific React components
├── hooks/              → Module-specific React Query hooks
├── services/           → API calls for this domain
└── types.ts            → Module-specific TypeScript types
```

Never import from another module's internals. Cross-module communication goes through shared services or global state.
