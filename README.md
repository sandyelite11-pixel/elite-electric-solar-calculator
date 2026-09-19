# Elite Electric Solar + Battery Calculator v10

## What v10 does
- Calculator-only customer experience; no marketing hero/footer.
- Captures name, email, phone and ZIP naturally on the first calculator step.
- No “Save my estimate” button and no customer-facing checkbox asking for permission in that section.
- On Continue, the calculator sends the contact details plus the calculator selections/results to the private database.
- Keeps the existing Elite Electric `/lead/` assessment form embedded at the end.
- Private lead portal at `/portal.html`.
- Portal searches/sorts leads and shows the full calculator data.
- Leads older than 60 days are deleted by the API whenever it is used/refreshed.
- Company-logo favicon included.

## Important privacy note
The application should have a privacy notice appropriate to the laws and policies that apply to Elite Electric. This version does not add the checkbox text the customer asked to remove from the calculator UI.

## Supabase setup (free tier can be used for small lead volumes)
1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase-schema.sql`.
4. In Supabase Project Settings / API, copy the project URL and the `service_role` key.
5. Do NOT put the service-role key in GitHub or browser JavaScript.

## Vercel environment variables
Set these in Vercel Project Settings -> Environment Variables for Production (and Preview if desired):

`SUPABASE_URL` = your Supabase project URL
`SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key
`PORTAL_USER` = jake
`PORTAL_PASSWORD` = your chosen portal password
`SESSION_SECRET` = a long random secret string

The requested portal credentials can be entered through these environment variables; the password is intentionally not hard-coded in the public files.

## Deploy
Upload the entire folder to GitHub, then import that repository into Vercel. Do not upload secrets into the repository.

## Portal
After deployment, visit:
`https://YOUR-CALCULATOR.vercel.app/portal.html`

## WordPress iframe
Open `EMBED-SNIPPET.html`, replace the placeholder Vercel URL with your real URL, and paste the snippet into the WordPress HTML/code area where the calculator should appear.

## Existing /lead/ form height
`LEAD-FORM-HEIGHT-SNIPPET.html` can be added to the WordPress `/lead/` page. It lets the nested form report its actual height to the calculator so the calculator can reduce blank iframe space.

## Data retention
The API removes records older than 60 days when the API is called. If you require deletion at an exact scheduled time even when nobody visits the portal, add a Vercel Cron job or another scheduled task later.
