# modules/auth/

Handles all authentication and session management for BuildSaathi.

## Responsibilities

- Login / signup forms with validation
- JWT access token + refresh token management
- Zustand auth store — persisted to localStorage
- AuthGuard component — redirects unauthenticated users
- `useCurrentUser` hook for accessing contractor profile

## Files

| File | Purpose |
|---|---|
| `components/login-form.tsx` | Login form with email + password |
| `components/signup-form.tsx` | Contractor registration form |
| `components/auth-guard.tsx` | Route protection wrapper |
| `hooks/use-auth.ts` | React Query hooks for auth mutations |
| `services/auth-service.ts` | API calls: login, register, refresh, logout |
| `store/auth-store.ts` | Zustand store for auth state |
| `types.ts` | Auth-specific TypeScript types |
| `schemas.ts` | Zod validation schemas for auth forms |

## Auth Flow

1. User submits login form
2. `authService.login()` POST to `/api/v1/auth/login`
3. Tokens stored in localStorage + Zustand store
4. Axios interceptor attaches Bearer token to all requests
5. On 401, interceptor attempts token refresh
6. On refresh failure, user is redirected to `/login`
