# modules/projects/

Project Tracker — manage active construction sites.

## Status: Phase 2

This module is scaffolded but not yet implemented. Full implementation begins in Phase 2.

## Planned Responsibilities

- Create projects from won tenders
- Define and track project milestones
- Update completion percentage
- Team/vendor assignment (Phase 3)
- Site progress photo uploads (Phase 4)

## Planned Files

| File | Purpose |
|---|---|
| `components/projects-page.tsx` | Project list (Kanban/list view) |
| `components/project-detail-page.tsx` | Milestone tracker and details |
| `components/milestone-board.tsx` | Visual timeline of milestones |
| `hooks/use-projects.ts` | React Query hooks |
| `services/project-service.ts` | API calls |
