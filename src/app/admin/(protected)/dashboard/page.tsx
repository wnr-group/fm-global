import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground mb-2">
          Welcome to FM Global Admin
        </h1>
        <p className="text-muted-foreground text-sm">
          Signed in as{" "}
          <span className="font-medium text-foreground">{user.email}</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Certificates", value: "—" },
          { label: "Active Students", value: "—" },
          { label: "Pending Enquiries", value: "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-background rounded-xl border border-border p-6"
          >
            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
            <p className="font-display text-3xl text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
