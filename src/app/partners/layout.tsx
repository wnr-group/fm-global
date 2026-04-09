import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with FM International | Workforce Solutions",
  description:
    "Partner with FM International for pre-screened Oil & Gas professionals. Access a verified pipeline of engineers, technicians, and safety officers ready to deploy to your Gulf projects.",
  openGraph: {
    title: "Partner with FM International | Workforce Solutions",
    description:
      "Access pre-screened Oil & Gas talent for your Gulf projects. Rapid deployment, end-to-end logistics, and dedicated account support.",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
