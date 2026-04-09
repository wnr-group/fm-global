import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    const { company, contact, email, phone, country, sector, message } = await req.json();

    if (!company || !contact || !email || !country) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Insert into enquiries table first ──────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("enquiries").insert({
      type: "partner",
      name: contact,
      company,
      email,
      phone: phone || null,
      country,
      sector: sector || null,
      message: message || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save enquiry" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ── Send email via Mailgun ─────────────────────────────────────────
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL");

    const emailBody = `
New Partner Inquiry — FM International
=======================================

Company Name:       ${company}
Contact Person:     ${contact}
Email:              ${email}
Phone:              ${phone || "Not provided"}
Country:            ${country}
Industry Sector:    ${sector || "Not specified"}

Hiring Requirements:
${message || "No message provided"}

---
Submitted via fmglobalcareers.com/partners
    `.trim();

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`api:${MAILGUN_API_KEY}`),
        },
        body: new URLSearchParams({
          from: `FM Partners Form <mailgun@${MAILGUN_DOMAIN}>`,
          to: CONTACT_EMAIL!,
          "h:Reply-To": email,
          subject: `Partner Inquiry: ${company} (${country})`,
          text: emailBody,
        }),
      }
    );

    if (!response.ok) {
      // Email failed but DB saved — still return success
      console.error("Mailgun error:", await response.text());
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
