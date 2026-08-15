# Sanskriti Mall

Premium men’s fashion ecommerce experience for Badora, Betul, Madhya Pradesh.

## Highlights

- Editorial fashion storefront with responsive shop, collections, product detail and local-store discovery
- Working browser-persistent bag, wishlist, product filtering, search, coupon, checkout and order tracking
- Styling studio and style finder driven by the product catalogue
- Store-team admin area with product editing, archive safety, live stock/order calculations and shared store settings
- Premium social preview image and local SEO metadata

## Local demo data

The project runs without credentials. Store actions are persisted in the browser so the shopping and admin flows can be tested end to end. It deliberately labels this mode in the admin area instead of presenting local data as live production activity.

For a production launch, connect a secure authentication provider, PostgreSQL/Supabase database, media storage and payment gateway using the environment variables in `.env.example`.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Project structure

- `app/` — public storefront, account, checkout and admin routes
- `components/` — visual system and interactive experiences
- `lib/catalog.ts` — initial merchandise and store settings
- `lib/types.ts` — shared commerce data model
- `public/og.png` — social preview card

## Live demo

Deploy the validated project with your preferred Sites environment, then replace `NEXT_PUBLIC_SITE_URL` with the production address.
