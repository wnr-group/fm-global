import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Programs — Oil & Gas Technical Courses",
  description:
    "Explore 12+ Oil & Gas training courses: Mechanical Technician, Safety, Piping Design, Process Engineering. Globally recognized certification with placement support.",
  alternates: { canonical: "/training" },
  openGraph: {
    title: "Oil & Gas Training Programs — FM Institute",
    description:
      "12+ industry-certified courses in Oil & Gas, Safety, Piping, and Process Engineering with Global placement support.",
  },
};

const coursesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FM Institute Training Programs",
  itemListElement: [
    {
      "@type": "Course",
      position: 1,
      name: "Mechanical Technician",
      description:
        "Heat Exchangers, Vessels, Tanks & Columns with Real Site Methods. 14 modules, Globally recognized certification.",
      provider: { "@type": "Organization", name: "FM Institute" },
    },
    {
      "@type": "Course",
      position: 2,
      name: "Permit Receiver / Safety Watch",
      description:
        "PTW systems, confined space, hot work permits, LOTO procedures. International-standard safety training.",
      provider: { "@type": "Organization", name: "FM Institute" },
    },
  ],
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
      />
      {children}
    </>
  );
}
