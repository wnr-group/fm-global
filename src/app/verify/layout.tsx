import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Certificate — QR-Verified Credentials",
  description:
    "Verify FM Global Careers certificates instantly using the certificate ID. Every certificate features QR-based authentication.",
  alternates: { canonical: "/verify" },
  openGraph: {
    title: "Verify Certificate — FM Global Careers",
    description:
      "Instantly verify FM Global Careers certificates using the certificate ID.",
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
