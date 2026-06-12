"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddLineItem, useDeleteLineItem, useUpdateLineItem } from "../hooks/use-boq";
import { formatCurrency } from "@/lib/utils";
import type { BOQ } from "@/types/api";

interface LineItemTableProps {
  boq: BOQ;
}

const EMPTY_ITEM = { description: "", unit: "m3", quantity: 1, unitRate: 0, category: "", dsrCode: "" };

export function LineItemTable({ boq }: LineItemTableProps) {
  const addItem = useAddLineItem(boq.id);
  const deleteItem = useDeleteLineItem(boq.id);
  const updateItem = useUpdateLineItem(boq.id);
  const [draft, setDraft] = useState<typeof EMPTY_ITEM | null>(null);
  const [editing, setEditing] = useState<Record<string, typeof EMPTY_ITEM>>({});

  const startEdit = (item: BOQ["lineItems"][number]) => {
    setEditing((prev) => ({
      ...prev,
      [item.id]: {
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        unitRate: item.unitRate,
        category: item.category,
        dsrCode: item.dsrCode ?? "",
      },
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
        {!draft && (
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...EMPTY_ITEM })}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Item
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Unit</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Qty</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Rate (₹)</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Amount</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {boq.lineItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-3 py-2.5">
                  {editing[item.id] ? (
                    <div className="space-y-1">
                      <input
                        className="w-full rounded border border-input bg-background px-2 py-1 text-sm outline-none"
                        value={editing[item.id].description}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], description: e.target.value },
                          }))
                        }
                      />
                      <input
                        className="w-full rounded border border-input bg-background px-2 py-1 text-xs outline-none"
                        placeholder="DSR code (optional)"
                        value={editing[item.id].dsrCode}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], dsrCode: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-foreground">{item.description}</p>
                      {item.dsrCode && <p className="text-[10px] text-muted-foreground">{item.dsrCode}</p>}
                    </>
                  )}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {editing[item.id] ? (
                    <input
                      className="w-16 rounded border border-input bg-background px-2 py-1 text-sm outline-none"
                      value={editing[item.id].unit}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], unit: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    item.unit
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {editing[item.id] ? (
                    <input
                      type="number"
                      min={0}
                      className="w-20 rounded border border-input bg-background px-2 py-1 text-right text-sm outline-none"
                      value={editing[item.id].quantity}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], quantity: Number(e.target.value) },
                        }))
                      }
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {editing[item.id] ? (
                    <input
                      type="number"
                      min={0}
                      className="w-24 rounded border border-input bg-background px-2 py-1 text-right text-sm outline-none"
                      value={editing[item.id].unitRate}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], unitRate: Number(e.target.value) },
                        }))
                      }
                    />
                  ) : (
                    formatCurrency(item.unitRate)
                  )}
                </td>
                <td className="px-3 py-2.5 text-right font-medium">
                  {formatCurrency(
                    editing[item.id]
                      ? editing[item.id].quantity * editing[item.id].unitRate
                      : item.amount
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1">
                    {editing[item.id] ? (
                      <>
                        <Button
                          size="sm"
                          className="h-6 px-2 text-xs"
                          disabled={!editing[item.id].description || updateItem.isPending}
                          onClick={() => {
                            const row = editing[item.id];
                            updateItem.mutate({
                              lineItemId: item.id,
                              data: {
                                description: row.description,
                                unit: row.unit,
                                quantity: row.quantity,
                                unitRate: row.unitRate,
                                category: row.category || "General",
                                dsrCode: row.dsrCode || undefined,
                              },
                            });
                            setEditing((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() =>
                            setEditing((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(item)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Edit line item"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem.mutate(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Delete line item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Draft row for adding a new item */}
            {draft && (
              <tr className="bg-primary/5">
                <td className="px-3 py-2">
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Item description..."
                    value={draft.description}
                    onChange={(e) => setDraft((d) => d ? { ...d, description: e.target.value } : d)}
                    autoFocus
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-16 bg-transparent text-sm outline-none"
                    value={draft.unit}
                    onChange={(e) => setDraft((d) => d ? { ...d, unit: e.target.value } : d)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" min={0}
                    className="w-16 bg-transparent text-right text-sm outline-none"
                    value={draft.quantity}
                    onChange={(e) => setDraft((d) => d ? { ...d, quantity: Number(e.target.value) } : d)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" min={0}
                    className="w-24 bg-transparent text-right text-sm outline-none"
                    value={draft.unitRate}
                    onChange={(e) => setDraft((d) => d ? { ...d, unitRate: Number(e.target.value) } : d)}
                  />
                </td>
                <td className="px-3 py-2 text-right text-sm font-medium text-muted-foreground">
                  {formatCurrency(draft.quantity * draft.unitRate)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Button size="sm" className="h-6 px-2 text-xs"
                      disabled={!draft.description || addItem.isPending}
                      onClick={() => {
                        addItem.mutate({ ...draft, category: draft.category || "General" });
                        setDraft(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setDraft(null)}>
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {boq.lineItems.length === 0 && !draft && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No line items yet. Click &quot;Add Item&quot; to start building your estimate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
