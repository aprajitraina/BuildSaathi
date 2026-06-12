import type { Metadata } from "next";
import { SignupForm } from "@/modules/auth/components/signup-form";
import { AuthSplitLayout } from "@/modules/auth/components/auth-split-layout";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your BuildSaathi contractor account and start winning tenders.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout
      heading="Create your account"
      subheading="Start your free trial — no credit card required"
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}
