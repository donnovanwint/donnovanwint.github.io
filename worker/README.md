# donwint-contact-api

Cloudflare Worker that receives the donwint.com contact form submission and
sends it via [Resend](https://resend.com). Keeps the Resend API key off the
static site entirely — the browser only ever talks to this Worker.

## One-time setup

```bash
cd worker
npm install
npx wrangler login
```

Set the Resend API key as a secret (this prompts you to paste it — it is
never written to a file or committed):

```bash
npx wrangler secret put RESEND_API_KEY
```

## Deploy

```bash
npx wrangler deploy
```

This prints the Worker's URL, something like:

```
https://donwint-contact-api.<your-subdomain>.workers.dev
```

Copy that URL into `assets/js/main.js` in the site root — look for the
`CONTACT_API_URL` constant near the top of the file — then redeploy the
site.

## Before it'll actually send mail

- `src/index.js` sends `from: "Donwint Contact Form <contact@donwint.com>"`.
  That address must be on a domain verified in your Resend account — if
  `donwint.com` isn't the exact verified domain/sender, update `FROM_ADDRESS`
  in `src/index.js` to match what Resend has verified.
- `TO_ADDRESS` is hardcoded to `donnovanwint@gmail.com`.
- CORS is locked to `https://donwint.com` / `https://www.donwint.com` in
  `ALLOWED_ORIGINS` — add `http://localhost:xxxx` there temporarily if you
  want to test from a local dev server.

## Local testing

```bash
npm run dev
```

Then point `CONTACT_API_URL` at the printed `http://localhost:8787` URL
while testing, and change it back to the deployed `workers.dev` URL before
shipping.
