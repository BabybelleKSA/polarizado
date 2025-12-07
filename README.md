# Diaz Polarizado – Instant Tint Pricing Demo

Production-ready Next.js 14 + Tailwind project. Customers get instant tint pricing, submit a lead, and the tech is notified (Resend email or console log mock).

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Resend email (falls back to console logging if not configured)

## Quick start (local)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Vercel
1) Ensure the Vercel CLI is logged in (`vercel login`).
2) From the project root:
```bash
vercel
vercel --prod
```
3) Add environment variables in the Vercel dashboard or via CLI:
```bash
vercel env add RESEND_API_KEY
vercel env add EMAIL_TO_CUSTOMER
vercel env add EMAIL_TO_TECHNICIAN
```
Redeploy or run `vercel --prod` after adding envs.

## Environment variables (`.env.local`)
```
RESEND_API_KEY=your_key_here
EMAIL_TO_CUSTOMER=customer@example.com
EMAIL_TO_TECHNICIAN=tech@example.com
```
- If any of these are missing, the API will log mock notifications instead of sending email.
- Update the `from` address in `app/api/submit/route.js` to a verified domain in your Resend account.

## Pricing logic
Shared utility in `lib/pricing.js`:
```js
export function calculatePrice(carType, tint) {
  let basePrice = 120;
  if (carType === "SUV" || carType === "Truck") basePrice += 20;
  if (tint === 5) basePrice += 30;
  return basePrice;
}
```
Used by the Calculator, LeadForm confirmation, and API route for consistency. Adjust here to change pricing everywhere.

## Customizing visuals
- Colors are defined in `tailwind.config.js` (primary red `#E50914`, deep black `#0A0A0A`, white).
- Replace the hero image at `public/car.jpg` with your own photo (same filename or update the import in `app/page.jsx`).
- Global styles live in `styles/globals.css` (gradients, glass cards, animations).

## Future SMS (Twilio) hook
- Add your Twilio client in `app/api/submit/route.js` where emails are sent.
- Use `contactMethod` (Call/Text/Either) from the payload to decide SMS vs. call.
- Keep the current Resend fallback for environments without SMS.

## Project structure
```
my-tint-demo/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   └── api/submit/route.js
├── components/
│   ├── Calculator.jsx
│   └── LeadForm.jsx
├── lib/pricing.js
├── public/car.jpg
├── styles/globals.css
├── package.json
├── jsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .env.local
```

## Notes
- Lead data is kept in-memory on the server instance (no database yet).
- Mobile-first layout with bold CTA, pill toggles, smooth scrolling, and fade-up animations.
