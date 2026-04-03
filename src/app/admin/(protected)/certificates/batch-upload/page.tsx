// batch-upload/page.tsx
// Server Component — auth guard + renders the BatchUploadClient at
// /admin/certificates/batch-upload inside the existing admin layout.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BatchUploadClient from "@/components/admin/BatchUploadClient";

export default async function BatchUploadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <BatchUploadClient />;
}
