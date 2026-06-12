# modules/boq/

BOQ (Bill of Quantities) Estimator — helps contractors build accurate cost estimates.

## Responsibilities

- Create and manage BOQ estimates (linked to tender or standalone)
- Add/edit/delete line items with DSR code lookup
- Auto-calculate amounts (quantity × unit rate)
- Apply overhead and contingency percentages
- Summary panel with total breakdown
- Export to PDF (Phase 2)

## Files

| File | Purpose |
|---|---|
| `components/boq-list-page.tsx` | List of all BOQ estimates |
| `components/boq-detail-page.tsx` | BOQ editor with line items |
| `components/line-item-table.tsx` | Editable line item grid |
| `components/dsr-rate-selector.tsx` | Search and select DSR rates |
| `components/boq-summary.tsx` | Cost breakdown summary panel |
| `hooks/use-boq.ts` | React Query hooks for BOQ operations |
| `services/boq-service.ts` | API calls for BOQ CRUD |

## DSR Rate Integration

DSR (Delhi Schedule of Rates) rates are fetched from the backend (`GET /dsr-rates`).
Contractors select their state to get appropriate rates.
The system auto-populates unit rate when a DSR item is selected.
