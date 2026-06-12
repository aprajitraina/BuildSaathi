import type { Metadata } from "next";
import { NotificationsPage } from "@/modules/notifications/components/notifications-page";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Notifications() {
  return <NotificationsPage />;
}
