"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import CertificatePDF from "./CertificatePDF";
import type { Certificate } from "@/types/database";

interface Props {
  certificate: Certificate;
  /** Override button classes — defaults to the CertificateDisplay style */
  className?: string;
  /** Override icon classes — defaults to w-4 h-4 */
  iconClassName?: string;
}

export default function CertificatePDFDownload({
  certificate,
  className = "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors",
  iconClassName = "w-4 h-4",
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const verificationUrl = `${window.location.origin}/verify/${certificate.certificate_id}`;

      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 1,
      });

      const blob = await pdf(
        <CertificatePDF
          certificate={certificate}
          qrCodeDataUrl={qrCodeDataUrl}
          verificationUrl={verificationUrl}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificate.certificate_id}-certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        "Generating PDF..."
      ) : (
        <>
          <Download className={iconClassName} />
          Download PDF
        </>
      )}
    </button>
  );
}
