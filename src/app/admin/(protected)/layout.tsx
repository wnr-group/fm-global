// layout.tsx (admin protected)
// Server component — wraps all /admin/(protected) pages with the persistent
// sidebar navigation. The sidebar itself is a client component (AdminSidebar)
// that handles mobile toggle state, active links, and logout.

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary/20">
      <AdminSidebar />

      {/* Main content — offset on desktop to clear the fixed sidebar */}
      <div className="flex-1 min-w-0 lg:ml-64">
        {/* Top padding on mobile to clear the fixed mobile header bar */}
        <main className="pt-14 lg:pt-0 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
