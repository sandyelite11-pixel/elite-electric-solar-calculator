# Elite Electric — Utah Solar & Battery Calculator v5

A calculator-only, responsive solar + battery planning application for Elite Electric. Built for GitHub + Vercel and designed to be embedded into a WordPress page with an iframe.

## v5 changes
- Removed the marketing hero section from the application.
- Removed the application footer.
- Kept only a compact Elite Electric logo bar as calculator chrome; no navigation, marketing hero, or footer is included.
- Calculator now sits flush in the page instead of using a large negative-margin card layout.
- Removed the embedded contact-form iframe that caused unavoidable blank space because the form is hosted on a different origin.
- The final calculator step now uses the dedicated Elite Electric assessment page: https://eliteelectricpro.com/lead/
- The assessment button opens the form in a full page, which is substantially better on mobile than a fixed-height cross-origin iframe.
- Kept the calculator-to-parent auto-height `postMessage` system for the main Vercel iframe.
- Tightened mobile spacing and widths to avoid horizontal overflow.
- Logo remains embedded directly in `index.html`.

## Files
- `index.html` — calculator markup
- `styles.css` — responsive styling
- `app.js` — calculator logic + auto-height messaging
- `assets/` — backup logo assets
- `EMBED-SNIPPET.html` — WordPress Custom HTML iframe snippet with automatic height adjustment
- `vercel.json` — basic security headers

## GitHub → Vercel
1. Upload the contents of this folder to your GitHub repository. Keep `index.html` in the repository root.
2. Import the repository into Vercel.
3. Deploy as a static site; no build command or npm install is required.
4. Copy the Vercel production URL.
5. In `EMBED-SNIPPET.html`, replace `https://YOUR-CALCULATOR.vercel.app/` with the real Vercel URL.
6. Paste the snippet into a WordPress Custom HTML block on the dedicated calculator page.

## Recommended WordPress page
For the cleanest experience, the WordPress page should contain only the calculator iframe (plus optional WordPress page-level title/SEO content outside the iframe if desired). Do not add another hero or footer inside the Vercel application.

The included snippet listens for `elite-electric-calculator-height` messages from the Vercel app. This lets the WordPress iframe resize to the actual calculator height instead of using a large fixed 2,900px height.

## Contact / assessment
The final step links directly to Elite Electric's dedicated lead form:
https://eliteelectricpro.com/lead/

This is intentional. A cross-origin form iframe cannot reliably report its internal height to the calculator, so embedding it at a fixed height can create blank space. Opening the dedicated form as a normal page gives the customer the site's native mobile layout and avoids the blank-area problem.

## Planning disclaimer
This tool is a planning estimator, not an engineering design, utility bill guarantee, quote, or financial/tax advice. Verify current utility incentives, rates, equipment availability, project pricing, and customer-specific eligibility before making commitments.


## v7 improvements
- Added a live estimate strip showing solar size, modeled bill offset, battery target, and backup load.
- Fixed a JavaScript event-handler typo that could prevent appliance changes from recalculating.
- Added safer input clamping and initialization handling.
- Increased text contrast throughout the calculator for mobile readability.
