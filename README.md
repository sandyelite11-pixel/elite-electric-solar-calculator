# Elite Electric Utah Solar & Battery Calculator v9

Calculator-only responsive app for GitHub + Vercel, with a persistent lead database and a private lead portal.

## What changed in v9
- Natural lead capture is built into the first calculator screen: name, email, phone and ZIP are collected before the visitor continues.
- The visitor can also click **Save my estimate** at any time on the first screen.
- Calculator choices and estimate results are saved to the lead record so the portal contains the information entered in the calculator.
- The existing Elite Electric assessment form remains embedded at the end: `https://eliteelectricpro.com/lead/`.
- Private portal is available at `/portal.html`.
- Portal supports search, sorting, lead counts and expandable full lead details.
- Leads older than 60 days are deleted whenever the portal data is loaded/refreshed.
- Session login uses server-side environment variables; the password is NOT stored in the public GitHub files.
- Same Elite Electric logo + favicon retained.

## Required free backend setup
The calculator needs a small database because browser localStorage cannot reliably store leads for the business across different visitors/devices.

Recommended setup: a free Supabase project.

1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. In Vercel Project Settings → Environment Variables, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key (server-side only; never put this in browser JavaScript)
   - `PORTAL_USER` = your chosen portal username
   - `PORTAL_PASSWORD` = your chosen portal password
   - `SESSION_SECRET` = a long random secret string
4. Redeploy the Vercel project.

For the requested portal credentials, set `PORTAL_USER` to `jake` and `PORTAL_PASSWORD` to the password you supplied in the chat. Do not commit those values into GitHub.

## Lead retention
The API removes records whose `created_at` is more than 60 days old whenever an authenticated portal request loads the lead list. This avoids needing a paid background scheduler. If you later want strict midnight/daily deletion even when nobody opens the portal, a scheduled job can be added.

## Embedded form height
The calculator listens for `elite-lead-height` messages from the embedded `/lead/` page. Add the code in `LEAD-FORM-HEIGHT-SNIPPET.html` to the `/lead/` page if you want the nested iframe to automatically shrink/grow to the exact form height.

## WordPress iframe
Use the existing `EMBED-SNIPPET.html`, replacing the Vercel URL with the deployed calculator URL. The app continues to send `elite-electric-calculator-height` messages so the outer WordPress iframe can resize to the calculator's content.

## Security note
The portal credentials are only checked by the Vercel serverless function. The Supabase service-role key is also only used server-side. Never paste either secret into `index.html`, `portal.html`, or client-side JavaScript.
