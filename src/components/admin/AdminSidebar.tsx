// AdminSidebar.tsx
// Client component that renders the responsive admin sidebar (with mobile hamburger toggle),
// the mobile top bar, and the logout button.
// Used exclusively inside the admin (protected) layout.

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: FileText,
  },
  {
    label: "Verify Certificate",
    href: "/admin/verify",
    icon: ShieldCheck,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* ── Mobile top bar (hidden on lg+) ───────────────────────────── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-background border-b border-border flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-display text-base font-semibold text-foreground">
          FM Global Admin
        </span>
      </header>

      {/* ── Mobile overlay backdrop ──────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          // Desktop: always visible; Mobile: slide in/out
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
            <Image
              src="/logo-fm-global.png"
              alt="FM Global"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary/60 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
