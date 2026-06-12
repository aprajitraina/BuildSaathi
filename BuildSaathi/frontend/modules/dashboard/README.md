# modules/dashboard/

The Contractor Dashboard — the home screen every contractor sees after login.

## Responsibilities

- Aggregate KPI widgets: active tenders, active projects, payment due, alerts
- Quick action buttons: Find Tenders, New Estimate, Create Invoice
- Upcoming tender deadlines list
- Recent activity feed

## Files

| File | Purpose |
|---|---|
| `components/dashboard-page.tsx` | Main dashboard page container |
| `components/dashboard-widgets.tsx` | KPI stat card grid |
| `components/upcoming-deadlines.tsx` | Tender deadline countdown list |
| `components/recent-activity.tsx` | Activity feed |
| `hooks/use-dashboard.ts` | React Query hook for dashboard summary |
| `services/dashboard-service.ts` | API call to GET /dashboard/summary |

## Data Source

Single API call to `GET /api/v1/dashboard/summary` returns all widget data to minimize waterfall.
