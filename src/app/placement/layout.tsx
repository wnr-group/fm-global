import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gulf Job Placement — UAE, Qatar, Saudi, Kuwait Careers",
  description:
    "Direct Oil & Gas job placement in UAE, Qatar, Saudi Arabia, Kuwait, Bahrain & Oman. Browse current openings and apply through FM International.",
  alternates: { canonical: "/placement" },
  openGraph: {
    title: "Gulf Job Placement — FM International",
    description:
      "Direct Oil & Gas job placement in Gulf countries. Browse openings and apply through FM International.",
  },
};

export default function PlacementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
