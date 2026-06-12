# Product Requirements

## Vision Statement

BuildSaathi is the operating system for Indian contractors — helping them discover more work, estimate accurately, execute efficiently, and get paid on time.

## Target Market

- **Primary**: Small-town and mid-sized contractors (₹50L – ₹50 Cr annual revenue)
- **Geography**: India (Tier 2 and Tier 3 cities — UP, MP, Rajasthan, Bihar, Maharashtra)
- **Verticals**: Civil, road, building, electrical, plumbing contractors working on government tenders

## Core Problem Areas

| Problem | Current Pain | BuildSaathi Solution |
|---|---|---|
| Tender discovery | Manual browsing of multiple government portals | Unified, filtered tender feed |
| Tender understanding | Hours reading 30-page PDFs | AI summary in 60 seconds |
| Cost estimation | Excel spreadsheets, guesswork, outdated rates | DSR-based BOQ estimator |
| Project tracking | WhatsApp groups, paper notes | Milestone and progress tracker |
| Material procurement | Phone calls, unknown market rates | Price tracker + supplier comparison |
| Billing / collections | Delayed invoicing, poor follow-up | Invoice tracker with due alerts |
| Document compliance | Lost files, compliance gaps | Organized document vault |

## User Personas

### Persona 1: Ramesh — The Contractor (Primary)
- Age 38, runs a ₹2 Cr/year civil contracting firm in Lucknow
- Bids on 8–10 government tenders per month, wins 2–3
- Pain: spends 3 hours/day on tender portals and 2 hours on Excel for estimates
- Goal: Win more tenders, reduce estimation time, avoid payment delays

### Persona 2: Sunil — The Site Supervisor
- Age 28, manages day-to-day on active construction sites
- Reports to Ramesh, coordinates labor and materials
- Pain: communication gaps, unclear milestone tracking
- Goal: Clear task list, easy progress reporting

### Persona 3: Priya — The Accountant
- Age 32, handles billing and compliance for the contractor firm
- Pain: chasing invoices, keeping track of GST documents
- Goal: Organized invoice pipeline, document compliance

## MVP Feature Set (Phase 1)

1. **Auth & Onboarding**: Registration, login, contractor profile setup
2. **Contractor Dashboard**: Widgets — active tenders, projects, payment due, alerts
3. **Tender Discovery Portal**: Search, filter by state/category/value, save tenders
4. **AI Tender Summary**: 60-second AI briefing on any tender document
5. **BOQ Estimator**: Build cost estimates using DSR rate tables

## Monetization

| Tier | Price | Features |
|---|---|---|
| Free | ₹0/month | 5 tender alerts/month, basic discovery |
| Pro | ₹999/month | Unlimited tenders, AI summary (20/month), BOQ estimator |
| Business | ₹2,999/month | Everything + Project tracking, Billing, Document vault |
| Enterprise | Custom | Multi-user, API access, custom DSR rates, SLA |

## Success Metrics (Phase 1)

- 100 contractor signups in first 30 days
- D7 retention > 40%
- AI summary used on > 60% of viewed tenders
- BOQ created for > 30% of summarized tenders

## Sitemap

```
/ (Landing page)
├── /features
├── /pricing
├── /contact
├── /login
├── /signup
└── /app (authenticated)
    ├── /app/dashboard
    ├── /app/tenders
    │   ├── /app/tenders/[id]
    │   └── /app/tenders/saved
    ├── /app/boq
    │   ├── /app/boq/new
    │   └── /app/boq/[id]
    ├── /app/projects (Phase 2)
    ├── /app/materials (Phase 2)
    ├── /app/billing (Phase 2)
    ├── /app/documents (Phase 2)
    ├── /app/notifications
    └── /app/settings
```
