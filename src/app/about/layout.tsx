import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Oil & Gas Training & Placement Experts",
  description:
    "Learn about FM Global Careers — two divisions powering Oil & Gas careers: FM Institute for training and FM International for Gulf placement.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About FM Global Careers",
    description:
      "Two divisions powering Oil & Gas careers: FM Institute for training and FM International for Gulf placement.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
