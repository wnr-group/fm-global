import AdminSidebarClient from "./AdminSidebarClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSidebar() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return <AdminSidebarClient unreadEnquiries={count ?? 0} />;
}
