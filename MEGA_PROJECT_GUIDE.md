# Appsto Software - Mega Document for AI Agents

## Overview
This document contains the complete context, architecture, and instructions for understanding and continuing development on the **Appsto Software Marketplace** (v2.0.0+). If you are an AI assistant tasked with modifying or debugging this project, **read this first**.

### What is Appsto?
Appsto is a Next.js (App Router) based SaaS marketplace designed for selling desktop applications (such as "DeskSweep"). It handles product listings, secure purchases via Paddle, token-based license generation, email delivery of downloads/keys, and a database to track licenses and activations.

## Core Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router), React 18, TypeScript 5.3
- **Styling**: Tailwind CSS 3.4 with custom animations (e.g., `fade-in`, `slide-up`, `glow`), Framer Motion, Lucide React
- **Backend / APIs**: Next.js API Routes (Serverless)
- **Database / Auth**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Payment Processor**: Paddle (Sandbox & Production, via API and Webhooks)
- **Emails / Delivery**: Nodemailer via SMTP (Gmail)
- **Observability / Errors**: Sentry configured per environments (`sentry.*.config.ts`)

## System Architecture & Data Flow
1. **User Browses App**: The user navigates `https://appsto.software`, views products like DeskSweep, and chooses a plan (Solo, Squad, Studio).
2. **Checkout Engine**: Paddle handles the checkout natively on the storefront (one-page overlay). Supports regional pricing natively.
3. **Webhook Processing (`/api/webhooks/paddle`)**: 
   - Receives transaction data (secured with `PADDLE_WEBHOOK_SECRET`).
   - Inserts `purchases` record into Supabase.
   - For `one_time` products, generates unique cryptographically strong license tokens (`APPSTO-XXXX-XXXX-XXXX`).
4. **License Delivery (`src/lib/purchase-email.ts`)**: 
   - An HTML template is generated rendering the tokens and download instructions.
   - Dispatched via Nodemailer.
5. **Download Routing (`/api/download/[product]`)**: 
   - Masks real file origins (like GitHub Releases) with an API route that tracks analytics/logs.
6. **Desktop App Activation (`/api/license/activate`)**:
   - Desktop apps call this endpoint with the user's token.
   - Marks token as `is_used = true` and updates `used_at`. App saves activation state locally.

## Project Structure Highlights
```text
appsto/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── api/
│   │   │   ├── webhooks/paddle # Paddle webhook entry point
│   │   │   ├── license/activate# Hardware/software token verification
│   │   │   └── download/       # Masked software download redirects
│   │   ├── products/[slug]/    # Dynamic product pages with Paddle integration
│   │   ├── privacy, terms, etc.# Legal/Compliance pages
│   ├── components/             # Reusable UI, Framer Motion wrap, and Layouts
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client instantiation
│   │   ├── crypto.ts           # Token generation logic
│   │   └── email.ts / purchase-email # SMTP configurations
│   ├── hooks/usePaddlePrices   # Fetches/caches localized prices from Paddle
├── supabase/
│   └── migrations/             # Database schemas (e.g., PRODUCTION_CLEAN_SETUP.sql)
├── scripts/                    # Maintenance & config sync scripts (js/ts)
├── .env.production.example     # Golden reference for needed environment variables
```

## Key Environment Variables
Your standard `.env` requires configuration for:
- **Paddle**: `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_PADDLE_ENVIRONMENT`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **SMTP**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`
- **Internal Crypto**: `LICENSE_SECRET_KEY` (MUST MATCH BETWEEN ENVIRONMENT AND ANY OFFLINE APP)
- **Analytics/Extras**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics tracking)

*(Note: Test features require `API_SECRET_KEY` and `ALLOW_TEST_PURCHASES` enabled in specific environments).*

## Common Development Workflows
- **Running Locally**: `npm run dev`. Expects local `.env` with Sandbox paddle keys and Supabase keys.
- **Product Seeding**: Add products directly into the `products` table in Supabase. Map `paddle_product_id` to actual Paddle IDs. 
- **Testing Purchasess**: To test locally without charges, use Paddle Sandbox (`test_...` credentials) or 100% OFF coupons in Paddle Production.
- **Testing Emails**: You can preview email HTML templates visually by visiting `/email-preview` locally.
- **Adding New Apps**: Create the product in Paddle -> Create in Supabase -> Drop the file URL into `download_url` -> Done.

## Things to Note for AI Agents
1. **Never expose the GitHub/AWS s3 direct download links** in the frontend components; always route through `/api/download/`.
2. **License Secrets**: Use standard Node.js crypto when generating or validating licenses via `lib/crypto.ts`. Do not modify cryptographic assumptions lightly.
3. **Type Consistency**: Ensure that Paddle product IDs align perfectly with the `products` table in Supabase. Mismatches will break webhooks.
4. **Environment Constraints**: We distinguish Sandbox from Production via `NEXT_PUBLIC_PADDLE_ENVIRONMENT`. Conditional branches often check if it's "sandbox" vs "production".

---
*(Created by Antigravity for future AI Agents to have a zero-to-hero onboarding)*
