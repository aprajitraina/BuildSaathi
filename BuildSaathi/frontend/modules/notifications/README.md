# modules/notifications/

Notification center — shows system alerts, deadline reminders, and payment due notifications.

## Responsibilities

- List all notifications for the current contractor
- Mark individual or all notifications as read
- Bell icon with unread count in the topbar

## Files

| File | Purpose |
|---|---|
| `components/notifications-page.tsx` | Full notifications list page |
| `hooks/use-notifications.ts` | React Query hooks |
| `services/notifications-service.ts` | API calls |
