"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="h-14 bg-background border-b border-border flex items-center justify-between px-5 sm:px-8 sticky top-0 z-40">
        <span className="font-display text-base text-foreground font-semibold">
          FM Global Admin
        </span>
        <button
          onClick={handleLogout}
          className="h-8 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          Logout
        </button>
      </header>
      <main className="p-5 sm:p-8">{children}</main>
    </div>
  );
}
