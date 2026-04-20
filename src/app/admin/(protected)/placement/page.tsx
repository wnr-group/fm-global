import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlacementClient from "@/components/admin/placement/PlacementClient";

export default async function AdminPlacementPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Fetch Categories
  const { data: categories, error } = await supabase
    .from("placement_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <PlacementClient 
      initialCategories={categories || []} 
      fetchError={error?.message || null} 
    />
  );
}