import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CertificateDisplay from "./CertificateDisplay";

interface PageProps {
  params: Promise<{ certificate_id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certificate_id } = await params;
  const supabase = await createClient();
  const { data: cert } = await supabase
    .from("certificates")
    .select("student_name, course_name")
    .eq("certificate_id", certificate_id)
    .single();
  if (!cert)
    return {
      title: "Certificate Not Found | FM Global",
      description: "This certificate could not be found.",
    };
  return {
    title: `Certificate Verification - ${cert.student_name} | FM Global`,
    description: `Verify the  certificate awarded to ${cert.student_name} for ${cert.course_name} by FM Global.`,
    openGraph: {
      title: `Certificate Verification - ${cert.student_name} | FM Global`,
      description: `Verify the certificate awarded to ${cert.student_name} for ${cert.course_name} by FM Global.`,
      type: "website",
      url: `/verify/${certificate_id}`,
    },
  };
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certificate_id } = await params;
  const supabase = await createClient();
  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("certificate_id", certificate_id)
    .single();

  if (error || !certificate) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-md mx-auto">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-100">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Certificate Not Found
            </h1>
            <p className="text-sm text-muted-foreground">
              The certificate ID{" "}
              <span className="font-mono font-medium text-foreground">
                &apos;{certificate_id}&apos;
              </span>{" "}
              does not exist or may have been removed.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            &larr; Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 py-10 px-4">
      <CertificateDisplay certificate={certificate} />
    </main>
  );
}