import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { SplashProvider } from "@/components/providers/splash-provider";
import "./globals.css";

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
  title: "FM Global Careers | Building Global Oil & Gas Careers",
  description:
    "FM Global Careers - Your pathway to international careers in Oil & Gas. Industry-focused training through FM Institute and global placement through FM International. Trusted by 500+ professionals across India and the Gulf region.",
  keywords: [
    "oil and gas training",
    "gulf job placement",
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
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "FM Global Careers | Building Global Oil & Gas Careers",
    description:
      "Your gateway to international careers in Oil & Gas. Training and placement for Gulf countries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <SplashProvider>{children}</SplashProvider>
      </body>
    </html>
  );
}
