// Global shared API response types

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ContractorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstNumber?: string;
  address?: string;
  city: string;
  state: string;
  preferredCategories: string[];
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  contractor: ContractorProfile;
}

export interface DashboardSummary {
  activeTendersCount: number;
  savedTendersCount: number;
  activeProjectsCount: number;
  paymentDueAmount: number;
  unreadNotificationsCount: number;
  upcomingDeadlines: TenderDeadline[];
  recentActivity: ActivityItem[];
}

export interface TenderDeadline {
  tenderId: string;
  tenderTitle: string;
  deadline: string;
  daysRemaining: number;
}

export interface ActivityItem {
  id: string;
  type: "tender_saved" | "boq_created" | "project_updated" | "invoice_sent";
  description: string;
  timestamp: string;
  entityId: string;
}

export interface Tender {
  id: string;
  title: string;
  referenceNumber: string;
  department: string;
  organization: string;
  state: string;
  district?: string;
  category: string;
  estimatedValue: number;
  emdAmount?: number;
  publishedDate: string;
  submissionDeadline: string;
  openingDate?: string;
  documentFee?: number;
  sourceUrl?: string;
  sourcePortal: string;
  isSaved: boolean;
  hasSummary: boolean;
  tags: string[];
}

export interface TenderSummary {
  tenderId: string;
  scopeOfWork: string;
  keyRequirements: string[];
  eligibilityCriteria: string[];
  estimatedValue: number;
  workDuration?: string;
  keyRisks: string[];
  recommendation: "high" | "medium" | "low";
  recommendationReason: string;
  generatedAt: string;
  isAiGenerated: boolean;
}

export interface BOQ {
  id: string;
  title: string;
  tenderId?: string;
  projectId?: string;
  state: string;
  workCategory: string;
  status: "draft" | "finalized";
  totalEstimatedCost: number;
  contingencyPercent: number;
  overheadPercent: number;
  lineItems: BOQLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BOQLineItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  dsrCode?: string;
  category: string;
  remarks?: string;
}

export interface BOQEstimationSuggestion {
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  dsrCode?: string;
  category: string;
  quantityHint?: string;
  confidence: number;
}

export interface BOQEstimationResponse {
  boqId: string;
  suggestedItems: BOQEstimationSuggestion[];
  totalEstimatedCost: number;
  disclaimer: string;
  isAiGenerated: boolean;
}

/** Estimation Intelligence module API envelope */
export interface EstimationEnvelope<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

export interface IntelligenceEstimateItem {
  id: string;
  itemName: string;
  normalizedName?: string | null;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  sortOrder: number;
}

export interface IntelligenceEstimateWarning {
  id: string;
  level: string;
  message: string;
  code?: string | null;
}

export interface IntelligenceEstimate {
  id: string;
  tenderId?: string | null;
  projectType: string;
  estimateType: string;
  sourceType: string;
  areaSqFt: number;
  location: string;
  floors?: number | null;
  finishType?: string | null;
  totalAmount: number;
  items: IntelligenceEstimateItem[];
  warnings: IntelligenceEstimateWarning[];
  createdAt: string;
  updatedAt: string;
}

export interface IntelligenceEstimateListItem {
  id: string;
  projectType: string;
  estimateType: string;
  sourceType: string;
  areaSqFt: number;
  location: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

export interface DSRRate {
  id: string;
  code: string;
  description: string;
  unit: string;
  rate: number;
  state: string;
  category: string;
  effectiveFrom: string;
  source: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  state: string;
  status: "planning" | "active" | "onhold" | "completed" | "cancelled";
  completionPercent: number;
  contractValue: number;
  startDate?: string;
  expectedCompletionDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  paidAmount: number;
  balanceDue: number;
  status: "draft" | "sent" | "partiallypaid" | "paid" | "overdue" | "cancelled";
  dueDate?: string;
  createdAt: string;
}

export interface MaterialRate {
  id: string;
  materialName: string;
  unit: string;
  rate: number;
  state: string;
  category: string;
  effectiveDate: string;
  source?: string;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  documentType: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}
