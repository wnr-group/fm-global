import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Job Placement — Gulf, Europe, Israel, Africa & More",
  description:
    "Direct Oil & Gas job placement worldwide — Gulf, Europe, Israel, Africa, Russia & India. Browse current openings and apply through FM International.",
  alternates: { canonical: "/placement" },
  openGraph: {
    title: "Global Job Placement — FM International",
    description:
      "Direct Oil & Gas job placement in International markets. Browse openings and apply through FM International.",
  },
};

export default function PlacementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
