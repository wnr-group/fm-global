import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Inter } from "next/font/google";
import { SplashProvider } from "@/components/providers/splash-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WGPMRWCJ";

// Brand typography: Poppins for headings (strong, modern, clean)
const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Brand typography: Inter for body text (readable, neat, professional)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.fmcareersglobal.com"
  ),
  title: {
    default: "FM Global Careers | Oil & Gas Training & Global Placement",
    template: "%s | FM Global Careers",
  },
  description:
    "Industry-focused Oil & Gas training and direct Global job placement. 3000+ professionals placed across Gulf, Europe, Israel, Africa, Russia & India.",
  keywords: [
    "oil and gas training",
    "global job placement",
    "FM Institute",
    "FM International",
    "refinery jobs",
    "shutdown projects",
    "piping engineering",
    "safety training",
    "Kuwait jobs",
    "UAE careers",
    "Qatar employment",
    "Saudi Arabia oil jobs",
    "Europe oil gas jobs",
    "Israel placement",
    "Africa oil gas careers",
    "Russia oil gas jobs",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "FM Global Careers | Oil & Gas Training & Global Placement",
    description:
      "Industry-focused Oil & Gas training and direct Global job placement across Gulf, Europe, Israel, Africa, Russia & India.",
    type: "website",
    siteName: "FM Global Careers",
  },
  other: {
    "og:logo": "https://www.fmcareersglobal.com/Brand-Logo.png",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FM Global Careers",
  url: "https://www.fmcareersglobal.com",
  logo: "https://www.fmcareersglobal.com/apple-touch-icon.png",
  description:
    "Industry-focused Oil & Gas training and direct Global job placement.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2/17, Pannaivilai Street",
    addressLocality: "Thovalai",
    addressRegion: "Tamil Nadu",
    postalCode: "629301",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8807026768",
      contactType: "training enquiries",
      email: "fminstitute24@gmail.com",
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-7418912404",
      contactType: "placement enquiries",
      email: "fminternational.jobs@gmail.com",
    },
  ],
  sameAs: [
    "https://www.instagram.com/fminstitute_india/",
    "https://www.linkedin.com/company/fm-institute-%E2%80%93-oil-gas-training-centre/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ServiceWorkerProvider>
          <AnalyticsProvider>
            <SplashProvider>{children}</SplashProvider>
          </AnalyticsProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
