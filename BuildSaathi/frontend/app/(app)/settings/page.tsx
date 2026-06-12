import type { Metadata } from "next";
import { SettingsPage as SettingsModulePage } from "@/modules/settings/components/settings-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsModulePage />;
}
