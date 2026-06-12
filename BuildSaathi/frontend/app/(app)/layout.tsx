import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppTopbar } from "@/components/shared/app-topbar";
import { MobileAppNav } from "@/components/shared/mobile-app-nav";
import { AuthGuard } from "@/modules/auth/components/auth-guard";

// Authenticated app shell — all /app/* routes use this layout.
// AuthGuard redirects unauthenticated users to /login.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[#141620]">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppTopbar />
          <MobileAppNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin bg-[#141620] text-white/80">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
