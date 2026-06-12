import { redirect } from "next/navigation";

// Root page: redirect authenticated users to dashboard, others to landing
// This is overridden by middleware in a future phase — for now redirect to landing
export default function RootPage() {
  redirect("/dashboard");
}
