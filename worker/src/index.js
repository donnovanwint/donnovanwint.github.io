// Cloudflare Worker: receives the donwint.com contact form submission and
// sends it via Resend. Requires a RESEND_API_KEY secret (wrangler secret put).

const ALLOWED_ORIGINS = new Set([
  "https://donwint.com",
  "https://www.donwint.com",
]);

const TO_ADDRESS = "donnovanwint@gmail.com";
const FROM_ADDRESS = "Donwint Contact Form <contact@donwint.com>";

const MAX_LENGTHS = { name: 120, email: 254, subject: 120, message: 5000 };

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://donwint.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400, origin);
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    // Honeypot: a hidden field real visitors never fill in.
    if (String(body.company || "").trim()) {
      return json({ ok: true }, 200, origin); // silently accept, do nothing
    }

    if (!name || !email || !subject || !message) {
      return json({ ok: false, error: "Missing required fields" }, 400, origin);
    }
    if (!isValidEmail(email)) {
      return json({ ok: false, error: "Invalid email address" }, 400, origin);
    }
    for (const [field, max] of Object.entries(MAX_LENGTHS)) {
      const value = { name, email, subject, message }[field];
      if (value.length > max) {
        return json({ ok: false, error: `${field} is too long` }, 400, origin);
      }
    }

    const safeName = escapeHtml(name);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `${subject} — from ${name}`,
        html: `
          <p><strong>From:</strong> ${safeName} (${escapeHtml(email)})</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
        text: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend error:", resendResponse.status, errorText);
      return json({ ok: false, error: "Failed to send message" }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
