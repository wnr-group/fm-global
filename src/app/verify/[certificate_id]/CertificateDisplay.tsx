"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Check, Download, CheckCircle2, XCircle } from "lucide-react";
import type { Certificate } from "@/types/database";
import { trackCertificateShare } from "@/lib/analytics";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Certificate is designed at 1190 × 842 (A4 landscape at 96 dpi)
  const CERT_W = 1190;
  const CERT_H = 842;

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // Scale the fixed-size certificate to fit the container
  useEffect(() => {
    function updateScale() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / CERT_W);
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
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

  const courseDescription = certificate.course_description
    ? `has successfully completed the prescribed course of study and training in ${certificate.course_name.toUpperCase()}. ${certificate.course_description}`
    : `has successfully completed the prescribed course of study and training in ${certificate.course_name.toUpperCase()}.`;

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Certificate visual ─────────────────────────────────────── */}
      {/* Outer wrapper measures available width; inner content scales to fit */}
      <div
        ref={containerRef}
        className="w-full rounded-xl shadow-xl overflow-hidden bg-white"
        style={{ height: CERT_H * scale }}
      >
        {/* Fixed-size inner certificate, scaled via transform */}
        <div
          className="relative bg-white overflow-hidden"
          style={{
            width: CERT_W,
            height: CERT_H,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {/* ── Decorative border images (bottom layer) ── */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificate-top-border.png"
            alt=""
            aria-hidden="true"
            className="absolute top-0 left-0 w-full pointer-events-none select-none"
            style={{ height: "76%" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificate-bottom-border.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
            style={{ height: "76%" }}
          />

          {/* ── Content layer (above borders) ── */}
          {/* All values are PDF pt values × 1.414 (841×595pt → 1190×842px) */}
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ padding: "28px 85px 28px 85px" }}
          >
            {/* Top row: logo centred, QR top-right */}
            <div
              className="w-full flex justify-center items-start relative"
              style={{ marginTop: 95 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-fm-institute-v1.png"
                alt="FM Institute"
                style={{ width: 110, height: 110, objectFit: "contain" }}
              />

              {/* QR code — top right */}
              {pageUrl && (
                <div className="absolute right-0 top-0 flex flex-col items-center">
                  <QRCodeSVG value={pageUrl} size={95} />
                  <p
                    className="text-center text-gray-500 mt-1"
                    style={{ fontSize: 10, width: 130 }}
                  >
                    certificate no -
                  </p>
                  <p
                    className="text-center text-gray-500"
                    style={{ fontSize: 10, width: 130 }}
                  >
                    {certificate.certificate_id}
                  </p>
                </div>
              )}
            </div>

            {/* CERTIFICATE */}
            <h1
              className="font-bold text-gray-900"
              style={{ fontSize: 65, letterSpacing: "0.25em", marginTop: 12 }}
            >
              CERTIFICATE
            </h1>

            {/* ── OF COMPLETION with red accent lines ── */}
            <div className="flex items-center" style={{ gap: 11, marginTop: 6 }}>
              <div style={{ width: 64, height: 2, backgroundColor: "#c0392b" }} />
              <span
                className="text-gray-700"
                style={{ fontSize: 17, letterSpacing: "0.3em" }}
              >
                OF COMPLETION
              </span>
              <div style={{ width: 64, height: 2, backgroundColor: "#c0392b" }} />
            </div>

            {/* This is to certify that */}
            <p
              className="font-semibold text-gray-800"
              style={{ fontSize: 17, marginTop: 14, marginBottom: 11 }}
            >
              This is to certify that
            </p>

            {/* Student name */}
            <p
              className="text-gray-900 text-center"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 73,
                lineHeight: 1.1,
              }}
            >
              {certificate.student_name}
            </p>

            {/* Red underline below name */}
            <div
              style={{
                width: 480,
                height: 2,
                backgroundColor: "#c0392b",
                marginTop: 8,
                marginBottom: 17,
              }}
            />

            {/* Course description */}
            <p
              className="font-semibold text-gray-800 text-center"
              style={{ fontSize: 17, maxWidth: 840, lineHeight: 1.6 }}
            >
              {courseDescription}
            </p>

            {/* ── Signature block ── */}
            <div
              className="flex flex-col items-center"
              style={{ marginTop: 10 }}
            >
              {certificate.signature_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={certificate.signature_url}
                  alt="Authorised signature"
                  style={{ width: 184, height: 57, objectFit: "contain", marginBottom: 7 }}
                />
              ) : (
                <div style={{ height: 64 }} />
              )}
              <div
                style={{
                  width: 184,
                  height: 2,
                  backgroundColor: "#c0392b",
                  marginBottom: 6,
                }}
              />
              <p
                className="font-bold text-gray-900 text-center"
                style={{ fontSize: 21 }}
              >
                {certificate.instructor_name ?? "Palani . M"}
              </p>
              <p className="text-gray-500 text-center" style={{ fontSize: 18, marginTop: 3 }}>
                Training Head
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Verification details bar ───────────────────────────────── */}
      <div className="bg-background rounded-xl shadow-sm border border-border px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status + metadata */}
          <div className="space-y-1.5">
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
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>
                <span className="font-medium text-foreground">Issued:</span> {issueDate}
              </p>
              <p>
                <span className="font-medium text-foreground">Certificate ID:</span>{" "}
                <span className="font-mono">{certificate.certificate_id}</span>
              </p>
              {certificate.reference_number && (
                <p>
                  <span className="font-medium text-foreground">Reference:</span>{" "}
                  {certificate.reference_number}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
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
      </div>

      {/* Verification note */}
      <p className="text-center text-xs text-muted-foreground">
        Verify this certificate at{" "}
        <span className="font-mono">
          fmglobalcareers.com/verify/{certificate.certificate_id}
        </span>
      </p>
    </div>
  );
}
