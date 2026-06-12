"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useSettingsProfile, useUpdateSettingsProfile } from "../hooks/use-settings";

interface SettingsFormState {
  name: string;
  phone: string;
  companyName: string;
  gstNumber: string;
  panNumber: string;
  city: string;
  state: string;
  address: string;
  preferredCategories: string;
}

export function SettingsPage() {
  const { data, isLoading } = useSettingsProfile();
  const updateProfile = useUpdateSettingsProfile();
  const [form, setForm] = useState<SettingsFormState | null>(null);

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.name,
      phone: data.phone,
      companyName: data.companyName,
      gstNumber: data.gstNumber ?? "",
      panNumber: data.panNumber ?? "",
      city: data.city,
      state: data.state,
      address: data.address ?? "",
      preferredCategories: data.preferredCategories.join(", "),
    });
  }, [data]);

  const canSave = useMemo(() => {
    if (!form) return false;
    return (
      form.name.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      form.companyName.trim().length > 0 &&
      form.city.trim().length > 0 &&
      form.state.trim().length > 0
    );
  }, [form]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your contractor profile and tender preferences."
      />

      {isLoading || !form ? (
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="h-5 w-48 skeleton rounded" />
          <div className="h-10 w-full skeleton rounded" />
          <div className="h-10 w-full skeleton rounded" />
          <div className="h-28 w-full skeleton rounded" />
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Contact name"
              value={form.name}
              onChange={(e) => setForm((prev) => prev ? { ...prev, name: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => prev ? { ...prev, phone: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Company name"
              value={form.companyName}
              onChange={(e) => setForm((prev) => prev ? { ...prev, companyName: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Email"
              value={data?.email ?? ""}
              disabled
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="GST number"
              value={form.gstNumber}
              onChange={(e) => setForm((prev) => prev ? { ...prev, gstNumber: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="PAN number"
              value={form.panNumber}
              onChange={(e) => setForm((prev) => prev ? { ...prev, panNumber: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm((prev) => prev ? { ...prev, city: e.target.value } : prev)}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm((prev) => prev ? { ...prev, state: e.target.value } : prev)}
            />
          </div>

          <textarea
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm((prev) => prev ? { ...prev, address: e.target.value } : prev)}
          />

          <textarea
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Preferred categories (comma-separated)"
            value={form.preferredCategories}
            onChange={(e) => setForm((prev) => prev ? { ...prev, preferredCategories: e.target.value } : prev)}
          />

          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!canSave || updateProfile.isPending}
              onClick={() =>
                updateProfile.mutate({
                  name: form.name.trim(),
                  phone: form.phone.trim(),
                  companyName: form.companyName.trim(),
                  gstNumber: form.gstNumber.trim() || undefined,
                  panNumber: form.panNumber.trim() || undefined,
                  city: form.city.trim(),
                  state: form.state.trim(),
                  address: form.address.trim() || undefined,
                  preferredCategories: form.preferredCategories
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean),
                })
              }
            >
              {updateProfile.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
