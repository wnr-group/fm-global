import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Training & Placement Enquiries",
  description:
    "Get in touch with FM Institute for training enquiries or FM International for Global placement. Visit us in Thovalai, Tamil Nadu.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact FM Global Careers",
    description:
      "Reach FM Institute for training or FM International for Global job placement enquiries.",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FM Global Careers",
  description:
    "Oil & Gas training institute and international job placement services.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2/17, Pannaivilai Street",
    addressLocality: "Thovalai",
    addressRegion: "Tamil Nadu",
    postalCode: "629301",
    addressCountry: "IN",
  },
  telephone: "+91-8807026768",
  email: "fminstitute24@gmail.com",
  openingHours: "Mo-Sa 10:00-17:00",
  url: "https://fmglobalcareers.com/contact",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {children}
    </>
  );
}
