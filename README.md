# Elite Electric — Utah Solar & Battery Calculator v4

A static, responsive solar + battery planning calculator for Elite Electric. Built for GitHub + Vercel and easy WordPress iframe embedding.

## What's improved in v4
- Logo is embedded directly in `index.html` with a fresh optimized PNG, so the header does not depend on a missing asset path.
- The calculator now posts its real document height to a parent iframe using `postMessage`.
- Included `EMBED-SNIPPET.html` with a WordPress Custom HTML snippet that automatically resizes the calculator iframe as the customer moves through each step.
- Contact-form iframe is much more compact on desktop and mobile.
- Added an **Expand form** control for customers who need more room.
- Reduced mobile spacing, hero height, card padding, and calculator margins for a tighter phone experience.

## Files
- `index.html` — application markup
- `styles.css` — responsive styling
- `app.js` — calculator logic + auto-height messaging
- `assets/` — backup logo assets
- `EMBED-SNIPPET.html` — WordPress iframe embed with automatic height adjustment
- `vercel.json` — basic security headers

## GitHub → Vercel
1. Upload the contents of this folder to your GitHub repository. Keep `index.html` in the repository root.
2. Import that repository into Vercel.
3. Deploy as a static site; no build command or npm install is required.
4. Copy the Vercel production URL.
5. Open `EMBED-SNIPPET.html`, replace `https://YOUR-CALCULATOR.vercel.app/` with the real Vercel URL, and paste the snippet into a WordPress Custom HTML block.

## WordPress embed
The included snippet listens for `elite-electric-calculator-height` messages from the Vercel app. This avoids a fixed 2,900px iframe and removes most empty space on mobile and desktop.

If WordPress strips `<script>` tags from a Custom HTML block, put the iframe HTML in the page and place the small JavaScript listener in an Elementor/WordPress HTML widget or the site's custom footer JavaScript area.

## Contact form
The calculator uses the existing Elite Electric MetForm URL:
https://eliteelectricpro.com/metform-form/contact-form/

Because the form is hosted on a different origin, the calculator cannot inspect its internal height or inject values into its fields unless the WordPress page is explicitly configured to support a cross-origin messaging/prefill integration. The compact height + expand control is therefore intentional.

## Planning disclaimer
This tool is a planning estimator, not an engineering design, utility bill guarantee, quote, or financial/tax advice. Verify current utility incentives, rates, equipment availability, project pricing, and customer-specific eligibility before making commitments.
