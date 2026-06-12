import { apiClient } from "@/lib/api-client";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export const notificationsService = {
  async getAll(): Promise<NotificationItem[]> {
    const response = await apiClient.get<NotificationItem[]>("/notifications");
    return response.data;
  },

  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },
};
