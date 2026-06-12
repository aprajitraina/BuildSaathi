"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotifications, useMarkRead, useMarkAllRead } from "../hooks/use-notifications";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !notifications?.length ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You'll see tender deadlines, payment reminders, and system alerts here."
        />
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4 transition-colors hover:bg-muted/30",
                !n.isRead && "bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  n.isRead ? "bg-muted" : "bg-primary"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm", !n.isRead && "font-medium")}>{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead.mutate(n.id)}
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
