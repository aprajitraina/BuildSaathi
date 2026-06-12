import type { Metadata } from "next";
import { LoginForm } from "@/modules/auth/components/login-form";
import { AuthSplitLayout } from "@/modules/auth/components/auth-split-layout";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your BuildSaathi contractor account.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      heading="Welcome back"
      subheading="Sign in to your BuildSaathi account"
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
