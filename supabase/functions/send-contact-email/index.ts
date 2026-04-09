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

    const { name, email, phone, program, message } = await req.json();

    if (!name || !email || !message) {
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
      type: "contact",
      name,
      email,
      phone: phone || null,
      program: program || null,
      message,
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

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`api:${MAILGUN_API_KEY}`),
        },
        body: new URLSearchParams({
          from: `Contact Form <mailgun@${MAILGUN_DOMAIN}>`,
          to: CONTACT_EMAIL!,
          "h:Reply-To": email,
          subject: `New Contact Enquiry: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nProgram: ${program || "Not specified"}\n\nMessage:\n${message}`,
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
