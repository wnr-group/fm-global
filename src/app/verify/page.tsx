"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Footer } from "@/components/Footer";
import { trackCertificateVerify } from "@/lib/analytics";

export default function VerifyPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const trimmed = certificateId.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a Certificate ID");
      return;
    }
    setError("");
    trackCertificateVerify(trimmed);
    router.push(`/verify/${trimmed}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="relative z-50 w-full py-4 bg-[#0f385a]" aria-label="Main navigation">
        <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
            >
              <Image
                src="/apple-touch-icon.png"
                alt="FM Global Careers logo"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                priority
              />
              <div className="hidden sm:block">
                <p className="font-display text-white text-sm tracking-tight">FM Global Careers</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
              <Link href="/about" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">About</Link>
              <Link href="/training" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">Training</Link>
              <Link href="/placement" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">Placement</Link>
              <Link href="/partners" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">Partners</Link>
              <Link href="/verify" className="text-sm text-white bg-white/15 px-4 py-2 rounded-full transition-colors font-medium">Verify</Link>
              <Link href="/contact" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">Contact</Link>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/contact">
                <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 py-2.5 h-auto font-semibold">
                  Enquire Now
                </Button>
              </Link>
            </div>
            <MobileNav variant="dark" />
          </div>
        </div>
      </nav>

      {/* Section A: Hero */}
      <section className="bg-[#0f385a] flex flex-col items-center justify-center text-center px-4 pt-12 pb-24 min-h-[320px] md:pt-16 md:pb-28">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-12 h-12 mb-4 animate-pulse"
          style={{ animationDuration: '3s' }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <h1 className="text-white font-bold text-4xl md:text-5xl mt-4">Certificate Verification</h1>
        <p className="text-white/80 text-base md:text-lg max-w-md mt-4 leading-relaxed">
          Enter your Certificate ID to instantly verify the authenticity of your FM Global certificate.
        </p>
      </section>

      {/* Section B: Search Card */}
      <section className="relative z-10 -mt-12 pb-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md mx-auto p-8 transition-shadow duration-300 hover:shadow-2xl">
          <label htmlFor="certificate-id-input" className="block text-sm font-semibold text-gray-700 mb-2">
            Certificate ID
          </label>
          <input
            id="certificate-id-input"
            type="text"
            value={certificateId}
            onChange={(e) => {
              setCertificateId(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. FMG-2026-00001"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#0f385a] focus:ring-2 focus:ring-[#0f385a]/20 transition-colors"
          />
          {error && (
            <p className="text-red-500 text-xs mt-2" role="alert">
              {error}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">Certificate IDs follow the format FMG-YYYY-XXXXX</p>
          <button
            onClick={handleVerify}
            className="w-full bg-[#0f385a] text-white font-semibold py-3 rounded-lg mt-5 hover:bg-[#1a4f7a] transition-all duration-150 flex items-center justify-center gap-2 active:scale-95"
          >
            Verify Certificate
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Section C: How It Works */}
      <section className="bg-[#f0f4f8] py-20 px-4">
        <h2 className="text-2xl font-bold text-[#0f385a] text-center">How Verification Works</h2>
        <div className="w-10 h-1 bg-[#c9a84c] mx-auto mt-3 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-default group">
            <div className="w-16 h-16 rounded-full bg-[#0f385a]/10 flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#0f385a] group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#0f385a] transition-colors duration-300 group-hover:text-white" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <p className="font-semibold text-[#0f385a] text-lg mb-3 group-hover:text-[#0f385a]">Enter ID</p>
            <p className="text-gray-600 text-sm leading-relaxed">Type the Certificate ID printed on your FM Global certificate document.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 text-center transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-default group">
            <div className="w-16 h-16 rounded-full bg-[#0f385a]/10 flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#0f385a] group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#0f385a] transition-colors duration-300 group-hover:text-white" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="font-semibold text-[#0f385a] text-lg mb-3 group-hover:text-[#0f385a]">We Search</p>
            <p className="text-gray-600 text-sm leading-relaxed">Our system instantly checks your ID against our secure certificate database.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 text-center transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-default group">
            <div className="w-16 h-16 rounded-full bg-[#0f385a]/10 flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#0f385a] group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#0f385a] transition-colors duration-300 group-hover:text-white" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <p className="font-semibold text-[#0f385a] text-lg mb-3 group-hover:text-[#0f385a]">View Result</p>
            <p className="text-gray-600 text-sm leading-relaxed">See the full certificate details and real-time verification status instantly.</p>
          </div>
        </div>
      </section>

      {/* Section D: Need Assistance */}
     {/* Section D: Need Assistance */}
<section className="bg-white py-20 px-4">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    
    {/* Replace placeholder with actual image */}
    <div className="rounded-2xl overflow-hidden aspect-video relative transition-transform duration-300 hover:scale-[1.01]">
      <Image
        src="/computer.webp"
        alt="Certificate verification support"
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>

    <div>
      <p className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase mb-3">Integrity First</p>
      <h2 className="text-2xl font-bold text-[#0f385a] mb-4">Need Assistance with Verification?</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        If you&apos;re having trouble locating your ID or the system isn&apos;t recognizing a valid document, our support team is ready to assist you in maintaining our standards of excellence.
      </p>
      <button
        onClick={() => { window.location.href = "mailto:fminstitute24@gmail.com"; }}
        className="inline-flex items-center gap-2 bg-[#0f385a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a4f7a] transition-all duration-150 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        Contact Support
      </button>
    </div>
  </div>
</section>

      <Footer />
    </main>
  );
}
