# API Reference

Live interactive docs available at `http://localhost:5000/swagger` when running locally.

## Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.buildsaathi.in/api/v1
```

## Authentication

All protected endpoints require a Bearer JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via `POST /api/v1/auth/login` and refreshed via `POST /api/v1/auth/refresh`.

## Endpoint Map

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register new contractor account |
| POST | `/auth/login` | Login and receive JWT pair |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |
| GET | `/auth/me` | Get current authenticated user |

### Tenders
| Method | Path | Description |
|---|---|---|
| GET | `/tenders` | Search/list tenders with filters |
| GET | `/tenders/{id}` | Get tender details |
| POST | `/tenders/{id}/save` | Save tender to contractor watchlist |
| DELETE | `/tenders/{id}/save` | Remove tender from watchlist |
| GET | `/tenders/saved` | List contractor's saved tenders |
| POST | `/tenders/{id}/summarize` | Request AI summary for a tender |
| GET | `/tenders/{id}/summary` | Get cached AI summary |

### BOQ (Bill of Quantities)
| Method | Path | Description |
|---|---|---|
| POST | `/boq` | Create new BOQ estimate |
| GET | `/boq/{id}` | Get BOQ details with line items |
| PUT | `/boq/{id}` | Update BOQ metadata |
| DELETE | `/boq/{id}` | Delete a BOQ |
| POST | `/boq/{id}/line-items` | Add line item to BOQ |
| PUT | `/boq/{id}/line-items/{lineItemId}` | Update line item |
| DELETE | `/boq/{id}/line-items/{lineItemId}` | Remove line item |
| GET | `/boq/{id}/summary` | Get total cost summary |
| POST | `/boq/{id}/estimate` | Trigger AI estimation for BOQ |

### DSR Rates
| Method | Path | Description |
|---|---|---|
| GET | `/dsr-rates` | List DSR rates (filterable by state, category) |
| GET | `/dsr-rates/{id}` | Get specific rate |
| GET | `/dsr-rates/states` | List available states |
| GET | `/dsr-rates/categories` | List work categories |

### Projects
| Method | Path | Description |
|---|---|---|
| POST | `/projects` | Create project from won tender |
| GET | `/projects` | List contractor's projects |
| GET | `/projects/{id}` | Get project details |
| PUT | `/projects/{id}` | Update project info |
| POST | `/projects/{id}/milestones` | Add milestone |
| PUT | `/projects/{id}/milestones/{milestoneId}` | Update milestone |
| PATCH | `/projects/{id}/progress` | Update completion % |

### Materials
| Method | Path | Description |
|---|---|---|
| GET | `/materials` | List materials with current rates |
| GET | `/materials/{id}/rates` | Get rate history for a material |
| GET | `/materials/suppliers` | List suppliers |
| POST | `/materials/suppliers` | Add supplier |

### Billing
| Method | Path | Description |
|---|---|---|
| POST | `/billing/invoices` | Create invoice |
| GET | `/billing/invoices` | List invoices |
| GET | `/billing/invoices/{id}` | Get invoice details |
| PATCH | `/billing/invoices/{id}/status` | Update invoice status |
| POST | `/billing/invoices/{id}/payments` | Record a payment |
| GET | `/billing/overdue` | List overdue invoices |

### Documents
| Method | Path | Description |
|---|---|---|
| POST | `/documents/upload` | Upload document (multipart) |
| GET | `/documents` | List documents (filterable) |
| GET | `/documents/{id}` | Get document metadata |
| GET | `/documents/{id}/download` | Get signed download URL |
| DELETE | `/documents/{id}` | Delete document |

### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/summary` | Aggregate stats for dashboard widgets |
| GET | `/dashboard/alerts` | Pending action items and notifications |

### Notifications
| Method | Path | Description |
|---|---|---|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/{id}/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |

## Error Format (RFC 7807 ProblemDetails)

```json
{
  "type": "https://buildsaathi.in/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "errors": {
    "email": ["Email is required."],
    "password": ["Password must be at least 8 characters."]
  },
  "traceId": "00-abc123-def456-00"
}
```
