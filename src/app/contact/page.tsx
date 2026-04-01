"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/scroll-reveal";
const page = () => {


   const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  program: "",
  message: "",
});

const [loading, setLoading] = useState(false);
const [status, setStatus] = useState<null | "success" | "error">(null);

const handleChange = (e: any) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};


const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
  "https://tqnwevpmcagrbzmelgro.supabase.co/functions/v1/send-contact-email",
  {
    method: "POST",
   headers: {
    "Content-Type": "application/json",
    "apikey": "sb_publishable_3qF7syWLc7HGeqb2wu7pFA_juvVuW7F",
    "Authorization": "Bearer sb_publishable_3qF7syWLc7HGeqb2wu7pFA_juvVuW7F"
  },
    body: JSON.stringify(formData),
  }
);

    const data = await res.json();

    if (data.success) {
  setStatus("success");
  setFormData({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });
    } else {
  setStatus("error");
}
  } catch (error) {
  console.error(error);
  setStatus("error");
} finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (status) {
    const timer = setTimeout(() => setStatus(null), 3000);
    return () => clearTimeout(timer);
  }
}, [status]);
 
  return (
    <main className="min-h-screen">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/contact/contact-banner.png"  
            alt="FM Global Institute"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1b2b]/70" />
        </div>

        {/* NAVBAR */}
        <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
          <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
            <div className="flex items-center justify-between">

              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo-fm-international.png"
                  alt="FM International"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="hidden sm:block">
                  <p className="font-display text-white text-sm tracking-tight">
                    FM International
                  </p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-2 py-1.5 backdrop-blur">
                <Link href="/about" className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full">About</Link>
                <Link href="/training" className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full">Training</Link>
                <Link href="/placement" className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full">Placement</Link>
                <Link href="/verify" className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full">Verify</Link>
                <Link href="/contact" className="text-sm text-white bg-white/20 px-4 py-2 rounded-full font-medium">Contact</Link>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <Link href="/contact">
                  <Button className="rounded-full px-6 py-2.5 bg-white text-black hover:bg-white/90">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              <MobileNav variant="light" />
            </div>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-40 w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%] pt-16 lg:pt-24 pb-20">
          <div className="max-w-4xl">

            <span className="inline-block bg-red-600 text-white text-xs tracking-wider px-4 py-1 mb-6">
              CONTACT OUR INSTITUTE
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] mb-6">
              Advancing Knowledge
              <br />
              Through Global
              <br />
              Inquiry.
            </h1>

            <p className="text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
              Join an elite network of researchers and industry leaders. Our
              administrative team is prepared to facilitate your academic
              transition.
            </p>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="relative z-40 bg-white text-black px-5 sm:px-8 lg:px-[6%] xl:px-[8%] py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <p className="text-xl font-semibold">
               <AnimatedCounter value={24} />/7
             </p>
              <p className="text-xs tracking-wide text-muted-foreground">STUDENT SUPPORT</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
              <AnimatedCounter value={15} />+
             </p>
              <p className="text-xs tracking-wide text-muted-foreground">COUNTRIES SERVED</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
              <AnimatedCounter value={5} suffix="k+" />
              </p>
              <p className="text-xs tracking-wide text-muted-foreground">ALUMNI BASE</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
              <AnimatedCounter value={100} suffix="%" />
              </p>
              <p className="text-xs tracking-wide text-muted-foreground">JOB GUARANTEE</p>
            </div>
          </div>
        </div>

      </section>

      {/* ================= NEXT SECTION ================= */}
      <section className="bg-[#f5f5f7] py-16 sm:py-20 lg:py-24">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* FORM */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 border border-gray-100">
              <h2 className="font-display text-2xl sm:text-3xl mb-8">
                Academic Inquiry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-4">
                  <input
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Full Name"
  className="bg-gray-100 px-4 py-3 text-sm w-full"
/>
                  <input
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Academic Email"
  className="bg-gray-100 px-4 py-3 text-sm w-full"
/>
                </div>

                <div className="space-y-4">
                  <input
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Phone Number"
  className="bg-gray-100 px-4 py-3 text-sm w-full"
/>
                  <select
  name="program"
  value={formData.program}
  onChange={handleChange}
  className="bg-gray-100 px-4 py-3 text-sm w-full"
>
  <option value="">Program of Interest</option>
  <option value="Oil & Gas">Oil & Gas</option>
  <option value="Safety">Safety</option>
</select>
                </div>

               <textarea
  name="message"
  value={formData.message}
  onChange={handleChange}
  rows={4}
  placeholder="Inquiry details..."
  className="bg-gray-100 px-4 py-3 text-sm w-full"
/>
                <button
  type="submit"
  disabled={loading}
  className="bg-red-600 text-white px-6 py-3 text-sm"
>
  {loading ? "Sending..." : "SEND MESSAGE"}
</button>
{status === "success" && (
  <p className="text-green-600 text-sm mt-2">
    ✅ Message sent successfully!
  </p>
)}

{status === "error" && (
  <p className="text-red-600 text-sm mt-2">
    ❌ Failed to send message. Try again.
  </p>
)}

              </form>
            </div>

            {/* RIGHT CONTENT */}
            {/* RIGHT CONTENT - IMPROVED */}
<div className="relative">

  {/* Heading */}
  <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-10">
    Institutional Standards
  </h2>

  <div className="space-y-6">

    {/* ITEM */}
    <div className="group flex gap-5 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">

      <span className="font-display text-3xl text-red-400/80 group-hover:text-red-500 transition">
        01
      </span>

      <div>
        <h3 className="font-semibold text-foreground mb-1">
          Global Credentials
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our certification and degrees are recognized by over 200 international regulatory bodies, ensuring your prestige is portable across borders.
        </p>
      </div>
    </div>

    {/* ITEM */}
    <div className="group flex gap-5 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">

      <span className="font-display text-3xl text-red-400/80 group-hover:text-red-500 transition">
        02
      </span>

      <div>
        <h3 className="font-semibold text-foreground mb-1">
          Industry Faculty
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Instruction is led by active practitioners and world-renowned researchers from Fortune 100 industrial firms.
        </p>
      </div>
    </div>

    {/* ITEM */}
    <div className="group flex gap-5 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">

      <span className="font-display text-3xl text-red-400/80 group-hover:text-red-500 transition">
        03
      </span>

      <div>
        <h3 className="font-semibold text-foreground mb-1">
          Career Pipelines
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Access the Global Career Nexus, an exclusive placement platform connecting graduates with high-impact leadership roles.
        </p>
      </div>
    </div>

  </div>

  {/* CTA BOX */}
  <div className="mt-10 p-6 sm:p-8 rounded-xl bg-[#0b1b2b] text-white shadow-lg">

    <h3 className="font-display text-lg mb-3">
      Direct Registrar Access
    </h3>

    <p className="text-sm text-white/70 mb-4">
      Connect directly with our academic office for priority processing.
    </p>

    <a
      href="mailto:registrar@fmglobal.edu"
      className="inline-block text-red-400 text-sm tracking-wide hover:underline"
    >
      REGISTRAR@FMGLOBAL.EDU →
    </a>

  </div>

</div>

          </div>

        </div>
      </section>

      {/* ================= GLOBAL REGISTRY SECTION ================= */}
<section className="bg-white py-16 sm:py-20 lg:py-24">
  <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">

    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

      {/* LEFT CARD */}
      <div className="bg-[#f5f5f7] p-6 sm:p-8 lg:p-10 rounded-xl border border-gray-100">

        <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-6">
          Global Registry Office
        </h2>

        {/* LOCATION */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Thovalai Headquarters
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              2/17, Panavilai Street, Thovalai,<br />
              India 629301
            </p>
          </div>
        </div>

        {/* HOURS */}
        <div className="flex items-start gap-3 mb-8">
          <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Office Hours
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monday – Friday: 10:00 AM to 5:00 PM (IST)<br />
              Closed on Institutional Holidays
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <button className="inline-flex items-center gap-2 bg-[#0b1b2b] text-white px-6 py-3 text-sm tracking-wide rounded-md hover:bg-[#0b1b2b]/90 transition">
          OPEN IN GOOGLE MAPS →
        </button>

      </div>

      {/* RIGHT MAP */}
      {/* RIGHT MAP - USING SAME STRUCTURE AS ABOUT PAGE */}
<div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-xl overflow-hidden border border-gray-100">

  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.726730546175!2d77.5056149!3d8.230211299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f5b5cf279349%3A0xdc18a12aea2f216f!2sFM%20Institute!5e0!3m2!1sen!2sin!4v1774579264206!5m2!1sen!2sin"
    className="absolute inset-0 w-full h-full"
    style={{ border: 0 }}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="FM Institute Location"
  />

</div>

    </div>

  </div>
</section>

{/* ================= FOOTER ================= */}
<footer className="bg-foreground text-background py-16 lg:py-20">
  <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

      {/* LOGO + INFO */}
      <div className="sm:col-span-2 lg:col-span-1">
        <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
          <Image
            src="/Brand-Logo.png"
            alt="FM Global Careers"
            width={56}
            height={56}
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <p className="font-display text-background text-sm">
              FM Global Careers
            </p>
            <p className="text-xs text-background/60">
              Global Careers Start Here
            </p>
          </div>
        </Link>

        <p className="text-background/70 text-sm leading-relaxed">
          Leading the way in global education and placement services.
        </p>
      </div>

      {/* QUICK LINKS */}
      <div>
        <h3 className="font-display text-background text-sm mb-4">
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li><Link href="/about" className="text-sm text-background/70 hover:text-background">About</Link></li>
          <li><Link href="/training" className="text-sm text-background/70 hover:text-background">Training</Link></li>
          <li><Link href="/placement" className="text-sm text-background/70 hover:text-background">Placement</Link></li>
          <li><Link href="/contact" className="text-sm text-background/70 hover:text-background">Contact</Link></li>
        </ul>
      </div>

      {/* INSTITUTE */}
      <div>
        <h3 className="font-display text-background text-sm mb-4">
          Institute
        </h3>
        <ul className="space-y-3">
          <li className="text-sm text-background/70">Research</li>
          <li className="text-sm text-background/70">Sustainability</li>
          <li className="text-sm text-background/70">Global Offices</li>
        </ul>
      </div>

      {/* SOCIAL MEDIA (YOUR IMAGE CONTENT) */}
      <div>
  <h3 className="font-display text-background text-sm mb-4">
    Social Media
  </h3>

  <div className="space-y-3 text-sm text-background/70">

    {/* Instagram */}
    <a
      href="https://www.instagram.com/fminstitute_india/"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-background transition"
    >
      <span className="text-background font-medium">Instagram - </span>
      FM Institute (@fminstitute_india)
    </a>

    {/* Facebook */}
    <a
      href="https://www.facebook.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-background transition"
    >
      <span className="text-background font-medium">Facebook - </span>
      FM Institute | Thovalai
    </a>

    {/* LinkedIn */}
    <a
      href="https://www.linkedin.com/company/fm-institute-%E2%80%93-oil-gas-training-centre/"
      target="_blank"
      rel="noopener noreferrer"
      className="block text-blue-400 hover:underline"
    >
      <span className="text-background font-medium">LinkedIn - </span>
      View Profile
    </a>

    {/* App Link */}
    <a
      href="https://play.google.com/store"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-background transition"
    >
      <span className="text-background font-medium">App Link - </span>
      FM Institute - Play Store
    </a>

    {/* YouTube */}
    <a
      href="https://www.youtube.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-background transition"
    >
      <span className="text-background font-medium">YouTube - </span>
      FM Global Career
    </a>

  </div>
</div>

    </div>

    {/* BOTTOM */}
    <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-background/60">
        © {new Date().getFullYear()} FM Global Careers. All rights reserved.
      </p>
      <p className="text-xs text-background/40">
        Building Global Careers
      </p>
    </div>

  </div>
</footer>

    </main>
  );
};

export default page;