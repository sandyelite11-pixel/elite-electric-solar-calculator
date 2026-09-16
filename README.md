# Elite Electric — Utah Solar & Battery Calculator v2

## What is included

A polished, dependency-free static web application for GitHub + Vercel:

- Premium Elite Electric black/white/gold design
- Supplied Elite Electric logo
- Five-stage UX:
  1. Home and bill
  2. Roof and solar profile
  3. Battery backup
  4. Detailed results
  5. Assessment/contact
- Utah ZIP validation
- Monthly bill → modeled annual usage
- Roof orientation, shade and roof-area adjustments
- Heating/load adjustment
- Essential / comfort / whole-home battery goals
- Appliance load selection
- Solar system estimate
- Annual production estimate
- Modeled bill offset
- Battery capacity and runtime
- Planning project range
- Battery product paths reflecting Elite Electric's published equipment pages
- Planning RMP rebate display
- 25-year modeled energy-spend-avoided view
- Contact form iframe:
  https://eliteelectricpro.com/metform-form/contact-form/
- No database
- No API key
- No npm packages

## Deploy

Upload the entire directory to a GitHub repository and import it into Vercel. It is a static site, so Vercel can deploy it directly.

## Embed

After deployment:

```html
<iframe
  src="https://YOUR-PROJECT.vercel.app/"
  title="Elite Electric Utah Solar & Battery Calculator"
  style="width:100%;min-height:2900px;border:0"
  loading="lazy">
</iframe>
```

## Important calculation assumptions

All core assumptions are deliberately in `app.js` so they are easy to edit:

- Utah planning solar baseline: 4.8 equivalent full-sun hours/day
- Electricity planning rate: $0.145/kWh
- Solar installed-price planning range: $2,000–$2,625/kW
- Battery price ranges and RMP planning rebates are based on the values currently published on Elite Electric's website and should be verified before publishing as a quote.
- Battery usable energy is modeled at 90%.
- Appliance wattages are planning values, not nameplate measurements.

This application should be presented as an estimator, not a guaranteed savings calculator or quote.

## Contact form iframe

If the MetForm page refuses to render inside the Vercel iframe, the WordPress security headers may need to allow framing by your Vercel origin. The app includes an "Open separately" fallback.

## Production recommendation

Before advertising exact savings or rebates, replace the editable assumptions with Elite Electric's approved rate tables, utility territory rules, equipment costs, and incentive logic. For a future version, these values can be moved into a small JSON configuration file so marketing staff can update them without touching the calculator UI.
