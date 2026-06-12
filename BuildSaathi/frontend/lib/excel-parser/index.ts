// ─── Excel Parser — Public API ────────────────────────────────────────────────

import * as XLSX from "xlsx";
import { normalizeEstimate } from "./normalizer";
import type { ParsedEstimate } from "./types";

export type { ParsedEstimate, BOQItem, BOQSubSection, DimensionRow, ParseIssue, ParseWarning } from "./types";

/**
 * Parse an Excel file (.xlsx / .xls) and extract a structured BOQ estimate.
 * Runs entirely in the browser (no server round-trip needed for parsing).
 */
export async function parseEstimateFile(file: File): Promise<ParsedEstimate> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), {
    type: "array",
    raw: false,
    cellDates: false,
  });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("No sheets found in workbook");

  const worksheet = workbook.Sheets[sheetName];
  const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as string[][];

  return normalizeEstimate(rows);
}

/** Quick check: is this file a supported estimate format? */
export function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsm") ||
    name.endsWith(".xlsb")
  );
}
