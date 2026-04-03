// [id]/page.tsx
// Server Component — fetches a single certificate by UUID from Supabase.
// Renders an inline "not found" page if the UUID doesn't exist, or passes
// the certificate data down to the CertificateEditForm client component.

import { redirect } from "next/navigation";
import Link from "next/link";
import { FileX2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CertificateEditForm from "@/components/admin/CertificateEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificateDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // Auth guard — belt-and-suspenders alongside middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  // ── Inline 404 — keep sidebar visible, don't throw ────────────────
  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center space-y-4 py-20">
        <div className="p-4 rounded-full bg-secondary/40">
          <FileX2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-display text-xl text-foreground">
            Certificate Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The certificate you&apos;re looking for doesn&apos;t exist or has
            been deleted.
          </p>
        </div>
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          ← Back to Certificates
        </Link>
      </div>
    );
  }

  return <CertificateEditForm certificate={certificate} />;
}
