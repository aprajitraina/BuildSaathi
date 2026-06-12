# modules/tenders/

Tender Discovery Portal — the primary entry wedge of BuildSaathi.

## Responsibilities

- Search and filter tenders by state, category, value range, deadline
- Tender detail view with full information
- Save/unsave tenders to watchlist
- Request and display AI-generated tender summaries
- Integrate with BOQ estimator from tender context

## Files

| File | Purpose |
|---|---|
| `components/tenders-page.tsx` | Main tender list with filters |
| `components/tender-card.tsx` | Individual tender card in the grid |
| `components/tender-detail-page.tsx` | Full tender detail view |
| `components/tender-filters.tsx` | Filter sidebar (state, category, value, deadline) |
| `components/ai-summary-panel.tsx` | AI summary request + display panel |
| `hooks/use-tenders.ts` | React Query hooks for tender operations |
| `services/tender-service.ts` | API calls for tenders |
| `types.ts` | Tender module types |

## Key UX Flows

1. Contractor opens /tenders → sees filtered feed
2. Clicks tender card → opens /tenders/[id] detail page
3. Clicks "AI Summary" → AISummaryPanel shows loading → renders structured summary
4. Clicks "Create Estimate" → navigates to /boq/new?tenderId=[id]
5. Clicks save → heart icon toggles, tender added to /tenders/saved
