// ─── Excel Parser — BOQ Estimate Normalizer ───────────────────────────────────
// Converts raw 2D string rows (from SheetJS) into a structured ParsedEstimate.
// Works dynamically: no hardcoded row numbers. Column positions are detected
// from the header row.

import type {
  BOQItem,
  BOQSubSection,
  DimensionRow,
  ParsedEstimate,
  ParseIssue,
  ParseWarning,
} from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function cell(row: string[], idx: number | undefined): string {
  if (idx === undefined || idx < 0) return "";
  return (row[idx] ?? "").toString().trim();
}

function parseNum(v: string | undefined): number | null {
  if (!v) return null;
  const s = v.toString().replace(/,/g, "").trim();
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function isRowEmpty(row: string[]): boolean {
  return row.every((c) => !c.toString().trim());
}

// Detect if a string looks like "Total=" or "total" keyword
function isTotalMarker(s: string): boolean {
  return /total\s*[=:]?/i.test(s.trim());
}

// ── Column Map Detection ───────────────────────────────────────────────────────

interface ColMap {
  sno: number;
  desc: number;
  count: number;
  l: number;
  b: number;
  h: number;
  calc: number;   // derived: usually h+1
  qty: number;
  unit: number;
  rate: number;
  amount: number;
}

function detectColumns(headerRow: string[]): ColMap | null {
  const map: Partial<ColMap> = {};

  for (let i = 0; i < headerRow.length; i++) {
    const h = headerRow[i].toString().trim().toUpperCase().replace(/\s+/g, " ");
    if (!h) continue;

    if (/^S[\s.]*NO[\s.]*$|^SNO$/.test(h)) map.sno = i;
    else if (/PARTICULARS|DESCRIPTION|DETAILS/.test(h) && !("desc" in map)) map.desc = i;
    else if (/^NO[\s.]*$/.test(h) && !("count" in map)) map.count = i;
    else if (/^L$/.test(h) && !("l" in map)) map.l = i;
    else if (/^B$/.test(h) && !("b" in map)) map.b = i;
    else if (/^H$/.test(h) && !("h" in map)) map.h = i;
    else if (/^QTY$|^QUANTITY$/.test(h) && !("qty" in map)) map.qty = i;
    else if (/^UNIT$/.test(h) && !("unit" in map)) map.unit = i;
    else if (/RATE|F\/RATE|F\.RATE|RATE/.test(h) && !("rate" in map)) map.rate = i;
    else if (/AMOUNT|AMT/.test(h) && !("amount" in map)) map.amount = i;
  }

  // Derived calc column: between H and QTY (or H+1 if gap exists)
  if (map.h !== undefined && map.qty !== undefined && map.qty > map.h + 1) {
    map.calc = map.h + 1;
  } else if (map.h !== undefined) {
    map.calc = map.h + 1;
  }

  // Validate we got the essential columns
  if (
    map.sno === undefined ||
    map.desc === undefined ||
    map.qty === undefined ||
    map.amount === undefined
  ) {
    return null;
  }

  return map as ColMap;
}

// ── Title / Header Extraction ──────────────────────────────────────────────────

function extractTitle(rows: string[][]): {
  projectName: string;
  scheme: string;
  estimatedCostText: string;
  estimatedCost: number | null;
  headerRowIndex: number;
} {
  let projectName = "";
  let scheme = "";
  let estimatedCostText = "";
  let estimatedCost: number | null = null;
  let headerRowIndex = -1;

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    const firstCell = (row[0] ?? "").toString().trim();

    // Header row detection
    const upperFirst = firstCell.toUpperCase().replace(/\s+/g, " ");
    if (/^S[\s.]*NO/.test(upperFirst) || row.some((c) => /PARTICULARS/i.test(c))) {
      headerRowIndex = i;
      break;
    }

    // Title row — usually a long string in col 0
    if (firstCell.length > 30) {
      projectName = firstCell;

      // Extract scheme name
      const schemeMatch = firstCell.match(/under\s+scheme\s+([\w\s()]+?)(?:\s+for\s+the|\s+Est\.|\s+\d{4})/i);
      if (schemeMatch) scheme = schemeMatch[1].trim();

      // Extract estimated cost
      const costMatch = firstCell.match(/est\.?\s*cost\s+([\d.]+\s*(?:lacs?|lakhs?|crore|cr\.?))/i);
      if (costMatch) {
        estimatedCostText = costMatch[1].trim();
        const numMatch = costMatch[1].match(/([\d.]+)/);
        if (numMatch) {
          const num = parseFloat(numMatch[1]);
          estimatedCost = /lacs?|lakhs?/i.test(costMatch[1]) ? num * 100000 : num * 10000000;
        }
      }
    }
  }

  return { projectName, scheme, estimatedCostText, estimatedCost, headerRowIndex };
}

// ── Dimension Unit Detection ───────────────────────────────────────────────────

function detectDimensionUnit(rows: string[][], headerRowIndex: number): string {
  for (let i = headerRowIndex + 1; i < Math.min(rows.length, headerRowIndex + 5); i++) {
    const text = rows[i].join(" ");
    if (/metres|meter/i.test(text)) return "Metres";
    if (/feet|foot|ft/i.test(text)) return "Feet";
  }
  return "Feet"; // default for Indian BOQ
}

// ── Sub-section finalizer ──────────────────────────────────────────────────────

function sealSubSection(ss: BOQSubSection, item: BOQItem) {
  item.subSections.push({ ...ss });
}

function sealItem(item: BOQItem, list: BOQItem[]) {
  list.push({ ...item });
}

// ── Main Row Processor ─────────────────────────────────────────────────────────

export function normalizeEstimate(rows: string[][]): ParsedEstimate {
  const { projectName, scheme, estimatedCostText, estimatedCost, headerRowIndex } =
    extractTitle(rows);

  if (headerRowIndex === -1) {
    // Fallback: search deeper
  }

  const headerRow = rows[headerRowIndex] ?? [];
  const cols = detectColumns(headerRow) ?? buildFallbackCols();

  const dimensionUnit = detectDimensionUnit(rows, headerRowIndex);

  const items: BOQItem[] = [];
  const errors: ParseIssue[] = [];
  const warnings: ParseWarning[] = [];
  let contingencies: number | null = null;
  let contingencyNote = "";
  const provisions: Array<{ description: string; amount: number }> = [];
  let netTotal: number | null = null;
  let subtotal = 0;

  let currentItem: BOQItem | null = null;
  let currentSubSection: BOQSubSection | null = null;
  let inMaterialSection = false;
  let inFooterSection = false;

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];

    if (isRowEmpty(row)) continue;

    const s = cell(row, cols.sno);
    const desc = cell(row, cols.desc);
    const hCol = cell(row, cols.h);
    const calc = parseNum(cell(row, cols.calc));
    const qty = parseNum(cell(row, cols.qty));
    const unitVal = cell(row, cols.unit);
    const rate = parseNum(cell(row, cols.rate));
    const amount = parseNum(cell(row, cols.amount));

    // ── Skip material consumption section ──────────────────
    if (/consumption of material/i.test(desc)) {
      inMaterialSection = true;
    }
    if (inMaterialSection) {
      // Exit on empty row after material section
      if (isRowEmpty(row)) inMaterialSection = false;
      continue;
    }

    // ── Detect footer section (after all items) ────────────
    // Grand total marker: rate column has "Total=" with no item number
    const rateCellText = cell(row, cols.rate);
    if (/total\s*=/i.test(rateCellText) && !s && !desc && amount !== null) {
      subtotal = amount;
      inFooterSection = true;
      continue;
    }
    if (/net\s*=/i.test(rateCellText) && !s && !desc && amount !== null) {
      netTotal = amount;
      continue;
    }

    // ── Contingencies / provisions ────────────────────────
    if (/contingenc/i.test(desc) || /contingenc/i.test(s)) {
      if (currentSubSection && currentItem) {
        sealSubSection(currentSubSection, currentItem);
        currentSubSection = null;
      }
      if (currentItem) {
        sealItem(currentItem, items);
        currentItem = null;
      }
      if (amount !== null) {
        contingencies = amount;
        contingencyNote = desc || "Contingencies";
      }
      inFooterSection = true;
      continue;
    }

    if (inFooterSection && /provision|display board|net/i.test(desc) && amount !== null) {
      provisions.push({ description: desc, amount });
      continue;
    }

    // ── Technically checked / signature rows ──────────────
    if (/technically checked|sub division|ae\b|aee\b/i.test(desc)) continue;

    // ── Main item: numeric sno with description ────────────
    if (/^\d+$/.test(s) && desc) {
      // Seal previous
      if (currentSubSection && currentItem) {
        sealSubSection(currentSubSection, currentItem);
        currentSubSection = null;
      }
      if (currentItem) sealItem(currentItem, items);

      currentItem = {
        sno: s,
        description: desc,
        subSections: [],
        dimensionRows: [],
        quantity: null,
        unit: "",
        rate: null,
        amount: null,
      };
      continue;
    }

    // ── Sub-section: single letter sno ────────────────────
    if (/^[a-z]$/i.test(s) && currentItem) {
      if (currentSubSection) sealSubSection(currentSubSection, currentItem);

      currentSubSection = {
        sno: s,
        description: desc,
        dimensionRows: [],
        quantity: null,
        unit: "",
        rate: null,
        amount: null,
      };

      // Sub-section with direct qty/rate/amount (no breakdown rows needed)
      if (qty !== null && amount !== null) {
        currentSubSection.quantity = qty;
        currentSubSection.unit = unitVal;
        currentSubSection.rate = rate;
        currentSubSection.amount = amount;
        sealSubSection(currentSubSection, currentItem);
        currentSubSection = null;
      }
      continue;
    }

    // ── The active target for dimension rows / totals ──────
    const target: BOQItem | BOQSubSection | null = currentSubSection ?? currentItem;

    // ── Total/finalizer row ────────────────────────────────
    // Pattern: H column has "Total=" or calc is large and qty is set
    if (isTotalMarker(hCol) || isTotalMarker(cell(row, cols.calc))) {
      if (target) {
        // Accept quantity from the most specific field
        if (target.quantity === null) {
          target.quantity = qty ?? calc;
        }
        if (!target.unit && unitVal) target.unit = unitVal;
        if (target.rate === null && rate !== null) target.rate = rate;
        if (target.amount === null && amount !== null) target.amount = amount;
      }
      continue;
    }

    // ── Continuation/rate row (no sno, no desc, has qty+rate+amount) ──
    if (!s && !desc && qty !== null && unitVal && rate !== null && amount !== null) {
      if (target) {
        // Overwrite with more specific rate row (handles item 3 edge case)
        target.quantity = qty;
        target.unit = unitVal;
        target.rate = rate;
        target.amount = amount;
      }
      continue;
    }

    // ── Direct quantity row (e.g. "Qty vide Item 9c=") ────
    // The H column may have the calculated value
    if (!s && (desc || qty !== null) && rate !== null && amount !== null) {
      if (target && target.quantity === null) {
        target.quantity = qty ?? parseNum(hCol);
        target.unit = unitVal;
        target.rate = rate;
        target.amount = amount;
      }
      continue;
    }

    // ── Dimension / calculation sub-row ───────────────────
    if (target) {
      const dimRow: DimensionRow = {
        description: desc,
        count: parseNum(cell(row, cols.count)),
        l: parseNum(cell(row, cols.l)),
        b: parseNum(cell(row, cols.b)),
        h: parseNum(hCol),
        calculated: calc,
      };

      // Only add if it has at least one numeric value
      if (
        dimRow.count !== null ||
        dimRow.l !== null ||
        dimRow.b !== null ||
        dimRow.h !== null ||
        dimRow.calculated !== null ||
        dimRow.description
      ) {
        target.dimensionRows.push(dimRow);
      }
    }
  }

  // Seal remaining open items
  if (currentSubSection && currentItem) sealSubSection(currentSubSection, currentItem);
  if (currentItem) sealItem(currentItem, items);

  // ── Compute real subtotal from items if footer didn't give us one ──
  if (subtotal === 0) {
    for (const item of items) {
      if (item.subSections.length > 0) {
        for (const ss of item.subSections) {
          subtotal += ss.amount ?? 0;
        }
      } else {
        subtotal += item.amount ?? 0;
      }
    }
  }

  // ── Compute net total ──────────────────────────────────
  if (netTotal === null) {
    let computed = subtotal;
    if (contingencies !== null) computed += contingencies;
    for (const p of provisions) computed += p.amount;
    if (computed > 0) netTotal = computed;
  }

  // ── Validation ────────────────────────────────────────
  const validItemCount = items.filter((it) => {
    const hasAmt = (it.subSections.length
      ? it.subSections.every((ss) => ss.amount !== null)
      : it.amount !== null);
    return hasAmt;
  }).length;

  for (const item of items) {
    const effective = item.subSections.length > 0 ? item.subSections : [item];
    for (const e of effective) {
      if (e.rate === null && !item.isAddon) {
        errors.push({ itemSno: item.sno, message: `Item ${item.sno}: missing rate`, type: "missing_rate" });
      }
      if (e.quantity === null) {
        warnings.push({ itemSno: item.sno, message: `Item ${item.sno}: quantity not detected` });
      }
      if (!e.unit) {
        warnings.push({ itemSno: item.sno, message: `Item ${item.sno}: unit not detected` });
      }
      if (e.rate !== null && e.quantity !== null && e.amount !== null) {
        const computed = e.rate * e.quantity;
        const diff = Math.abs(computed - e.amount);
        if (diff > 10 && diff / e.amount > 0.05) {
          warnings.push({
            itemSno: item.sno,
            message: `Item ${item.sno}: rate×qty (${computed.toFixed(0)}) differs from stated amount (${e.amount})`,
          });
        }
      }
    }
  }

  return {
    projectName,
    scheme,
    estimatedCostText,
    estimatedCost,
    dimensionUnit,
    items,
    subtotal,
    contingencies,
    contingencyNote,
    provisions,
    netTotal,
    itemCount: items.length,
    validItemCount,
    errors,
    warnings,
    rawRowCount: rows.length,
  };
}

/** Fallback column map assuming the most common Indian BOQ format */
function buildFallbackCols() {
  return { sno: 0, desc: 1, count: 2, l: 3, b: 4, h: 5, calc: 6, qty: 7, unit: 8, rate: 9, amount: 10 };
}
