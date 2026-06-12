"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { useAddMilestone, useProject, useUpdateMilestoneStatus, useUpdateProjectProgress } from "../hooks/use-projects";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  projectId: string;
}

function normalizeMilestoneStatus(status: string): string {
  const value = status.trim().toLowerCase();
  if (value === "notstarted") return "not_started";
  if (value === "inprogress") return "in_progress";
  return value;
}

export function ProjectDetailPage({ projectId }: Props) {
  const { data, isLoading } = useProject(projectId);
  const addMilestone = useAddMilestone(projectId);
  const updateProgress = useUpdateProjectProgress(projectId);
  const updateMilestoneStatus = useUpdateMilestoneStatus(projectId);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestone, setMilestone] = useState({ title: "", description: "", dueDate: "" });

  if (isLoading) {
    return <ListSkeleton rows={1} rowClassName="h-40" />;
  }

  if (!data) {
    return <div className="text-sm text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      <PageHeader
        title={data.title}
        description={`${data.location}, ${data.state} · ${formatCurrency(data.contractValue, "INR", true)}`}
        actions={
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              className="h-8 w-20 rounded-md border border-input bg-background px-2 text-xs"
              defaultValue={data.completionPercent}
              onBlur={(e) => {
                const val = Number(e.target.value);
                if (!Number.isNaN(val)) updateProgress.mutate(val);
              }}
            />
            <Button size="sm" variant="outline" onClick={() => setShowMilestone((v) => !v)}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Milestone
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Completion</span>
          <span className="font-medium">{data.completionPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${data.completionPercent}%` }} />
        </div>
      </div>

      {showMilestone && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Milestone title"
              value={milestone.title}
              onChange={(e) => setMilestone((m) => ({ ...m, title: e.target.value }))}
            />
            <input
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Description"
              value={milestone.description}
              onChange={(e) => setMilestone((m) => ({ ...m, description: e.target.value }))}
            />
            <input
              type="date"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={milestone.dueDate}
              onChange={(e) => setMilestone((m) => ({ ...m, dueDate: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() =>
                addMilestone.mutate(
                  {
                    title: milestone.title,
                    description: milestone.description || undefined,
                    dueDate: milestone.dueDate || undefined,
                  },
                  {
                    onSuccess: () => {
                      setShowMilestone(false);
                      setMilestone({ title: "", description: "", dueDate: "" });
                    },
                  }
                )
              }
              disabled={!milestone.title}
            >
              Save milestone
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowMilestone(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {data.milestones.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No milestones yet.</div>
        ) : (
          data.milestones.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{m.title}</p>
                {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
                {m.dueDate && <p className="text-xs text-muted-foreground">Due {formatDate(m.dueDate)}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.status}
                </span>
                <select
                  value={normalizeMilestoneStatus(m.status)}
                  className="h-7 rounded-md border border-input bg-background px-2 text-[11px]"
                  onChange={(e) => updateMilestoneStatus.mutate({ milestoneId: m.id, status: e.target.value })}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
