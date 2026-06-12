// Application-wide constants

export const APP_NAME = "BuildSaathi";
export const APP_TAGLINE = "The Contractor Operating System for India";

// Indian states for tender filtering
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
] as const;

// Tender work categories
export const TENDER_CATEGORIES = [
  "Civil Works", "Road & Highway", "Building Construction", "Water Supply",
  "Sewerage & Drainage", "Electrical Works", "Mechanical Works", "Bridge & Culvert",
  "Irrigation", "Urban Development", "Renovation & Repair", "Other",
] as const;

// BOQ / DSR work categories
export const BOQ_WORK_CATEGORIES = [
  "Earthwork", "Foundation", "Masonry", "RCC Works", "Steel Works",
  "Flooring", "Roofing", "Plastering", "Painting", "Waterproofing",
  "Plumbing & Sanitation", "Electrical", "External Works",
] as const;

// Milestone status options
export const MILESTONE_STATUSES = [
  "not_started", "in_progress", "completed", "delayed", "cancelled",
] as const;

// Invoice statuses
export const INVOICE_STATUSES = [
  "draft", "sent", "partially_paid", "paid", "overdue", "cancelled",
] as const;

// Project statuses
export const PROJECT_STATUSES = [
  "planning", "active", "on_hold", "completed", "cancelled",
] as const;

// Query keys (React Query)
export const QUERY_KEYS = {
  dashboard: ["dashboard"],
  tenders: {
    all: ["tenders"],
    search: (params: Record<string, unknown>) => ["tenders", "search", params],
    detail: (id: string) => ["tenders", id],
    saved: ["tenders", "saved"],
    summary: (id: string) => ["tenders", id, "summary"],
  },
  boq: {
    all: ["boq"],
    detail: (id: string) => ["boq", id],
  },
  estimation: {
    all: ["estimation"],
    detail: (id: string) => ["estimation", id],
  },
  projects: {
    all: ["projects"],
    detail: (id: string) => ["projects", id],
  },
  materials: {
    all: ["materials"],
    rates: (materialId: string) => ["materials", materialId, "rates"],
  },
  billing: {
    invoices: (params?: Record<string, unknown>) => ["billing", "invoices", params ?? {}],
    invoice: (id: string) => ["billing", "invoices", id],
    overdue: ["billing", "overdue"],
  },
  notifications: ["notifications"],
  documents: {
    all: ["documents"],
    byEntity: (entityType?: string, entityId?: string) => ["documents", entityType ?? "all", entityId ?? "all"],
  },
} as const;
