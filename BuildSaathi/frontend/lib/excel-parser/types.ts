// ─── Excel Parser — Type Definitions ──────────────────────────────────────────

/** A single dimension/calculation row inside a BOQ item */
export interface DimensionRow {
  description: string;
  count: number | null;
  l: number | null;
  b: number | null;
  h: number | null;
  /** Pre-calculated value from the spreadsheet (NO × L × B × H) */
  calculated: number | null;
}

/** A sub-section inside a multi-part BOQ item (e.g. 9a, 9b, 9c) */
export interface BOQSubSection {
  sno: string;
  description: string;
  dimensionRows: DimensionRow[];
  quantity: number | null;
  unit: string;
  rate: number | null;
  amount: number | null;
}

/** A top-level BOQ line item */
export interface BOQItem {
  sno: string;
  description: string;
  /** Sub-sections like 9a, 9b, 9c */
  subSections: BOQSubSection[];
  /** Dimension breakdown rows (for single-section items) */
  dimensionRows: DimensionRow[];
  quantity: number | null;
  unit: string;
  rate: number | null;
  amount: number | null;
  /** True for addon rows like contingencies / provisions */
  isAddon?: boolean;
}

export type IssueType =
  | "missing_rate"
  | "missing_qty"
  | "missing_unit"
  | "total_mismatch"
  | "duplicate_sno"
  | "invalid_qty"
  | "parse_error";

export interface ParseIssue {
  itemSno?: string;
  message: string;
  type: IssueType;
}

export interface ParseWarning {
  itemSno?: string;
  message: string;
}

/** The full structured output of parsing an Excel estimate file */
export interface ParsedEstimate {
  /** Project name / title extracted from the header */
  projectName: string;
  /** Scheme name if present */
  scheme: string;
  /** Estimated cost as mentioned in the title (e.g. "5.0 lacs") */
  estimatedCostText: string;
  /** Numeric value of estimated cost (null if not parseable) */
  estimatedCost: number | null;
  /** Unit system used for dimensions (Feet, Metres, etc.) */
  dimensionUnit: string;
  /** All BOQ items (excluding addon rows) */
  items: BOQItem[];
  /** Calculated sum of all item amounts */
  subtotal: number;
  /** Contingency amount */
  contingencies: number | null;
  /** Description of contingency line */
  contingencyNote: string;
  /** Any other provision rows after the main items */
  provisions: Array<{ description: string; amount: number }>;
  /** Final net total (subtotal + contingencies + provisions) */
  netTotal: number | null;
  /** Count of main BOQ items (excludes sub-sections and addons) */
  itemCount: number;
  /** Items with complete qty + rate + amount */
  validItemCount: number;
  /** Hard errors that affect correctness */
  errors: ParseIssue[];
  /** Soft warnings worth reviewing */
  warnings: ParseWarning[];
  /** Total raw row count processed */
  rawRowCount: number;
}
