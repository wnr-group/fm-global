"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Check, Download, CheckCircle2, XCircle } from "lucide-react";
import type { Certificate } from "@/types/database";
import { trackCertificateShare, trackCertificateDownload } from "@/lib/analytics";

const CertificatePDFDownload = dynamic(
  () => import("@/components/CertificatePDFDownload"),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    ),
  }
);

interface Props {
  certificate: Certificate;
}

export default function CertificateDisplay({ certificate }: Props) {
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageUrl(window.location.href);
  }, []);

  const issueDate = new Date(certificate.issue_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    trackCertificateShare(certificate.certificate_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isActive = certificate.status === "active";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Certificate card */}
      <div className="bg-background rounded-2xl shadow-lg overflow-hidden border border-border">
        {/* Header band */}
        <div className="bg-primary px-8 py-6 text-center">
          <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-medium mb-1">
            FM Global Careers
          </p>
          <p className="text-primary-foreground font-medium text-sm">
            Certificate of Completion
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-center space-y-5">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              This certifies that
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {certificate.student_name}
            </h1>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              has successfully completed
            </p>
            <h2 className="text-xl font-semibold text-primary">
              {certificate.course_name}
            </h2>
          </div>

          {certificate.course_description && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {certificate.course_description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">Instructor:</span>{" "}
              {certificate.instructor_name}
            </span>
            {certificate.duration && (
              <span>
                <span className="font-medium text-foreground">Duration:</span>{" "}
                {certificate.duration}
              </span>
            )}
            {certificate.lectures_count != null && certificate.lectures_count > 0 && (
              <span>
                <span className="font-medium text-foreground">Lectures:</span>{" "}
                {certificate.lectures_count}
              </span>
            )}
          </div>

          {/* Issue date */}
          <p className="text-sm text-muted-foreground">
            Issued on{" "}
            <span className="font-medium text-foreground">{issueDate}</span>
          </p>

          {/* Status badge */}
          <div className="flex justify-center">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid Certificate
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <XCircle className="w-3.5 h-3.5" />
                Revoked
              </span>
            )}
          </div>

          {/* QR Code */}
          {pageUrl && (
            <div className="flex justify-center pt-2">
              <QRCodeSVG value={pageUrl} size={100} />
            </div>
          )}

          {/* Certificate IDs */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium">Certificate ID:</span>{" "}
              <span className="font-mono">{certificate.certificate_id}</span>
            </p>
            {certificate.reference_number && (
              <p>
                <span className="font-medium">Reference:</span>{" "}
                {certificate.reference_number}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-muted/30 border-t border-border flex justify-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Link copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
          <span className="text-border select-none">|</span>
          <CertificatePDFDownload certificate={certificate} />
        </div>
      </div>

      {/* Verification note */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Verify this certificate at{" "}
        <span className="font-mono">
          fmglobalcareers.com/verify/{certificate.certificate_id}
        </span>
      </p>
    </div>
  );
}