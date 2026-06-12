// Public layout — no auth required. Used for landing, features, pricing, auth pages.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
