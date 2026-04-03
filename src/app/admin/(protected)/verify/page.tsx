// admin/verify/page.tsx
// Redirects admins who click "Verify Certificate" in the sidebar/dashboard
// to the certificates list where they can search and open the public verify page.

import { redirect } from "next/navigation";

export default function AdminVerifyPage() {
  redirect("/admin/certificates");
}
