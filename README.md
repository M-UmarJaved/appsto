# appsto.software - SaaS Software Marketplace 🚀

> **Professional Software. One Platform.**  
> Version 2.0.0 - Enhanced UI, Legal Compliance & Premium Design

A production-ready SaaS marketplace for selling desktop applications with secure licensing, instant delivery, and automated token generation.

## 🌟 What's New in v2.0

### ✨ Major Enhancements:
- 🎨 **Premium UI Redesign** - Enhanced animations, trust badges, and visual polish
- 📄 **Complete Legal Compliance** - Privacy Policy, Terms of Service, Refund Policy
- 💎 **Product Type Differentiation** - Clear UI distinction between one-time and subscription
- 🎯 **Trust & Security Section** - Paddle badges, payment methods, compliance info
- 📧 **Email Template Preview** - Visual mockup of license delivery emails
- 📱 **Mobile-First Design** - Fully responsive with enhanced accessibility
- 🔐 **Enhanced Database Schema** - Improved security with better lifecycle tracking

### 📄 New Pages (5):
1. **Privacy Policy** (`/privacy`) - GDPR-compliant, comprehensive data practices
2. **Terms of Service** (`/terms`) - Complete legal terms with license type explanations
3. **Refund Policy** (`/refund-policy`) - 14-day guarantee with clear eligibility criteria
4. **About** (`/about`) - Mission, values, stats, tech stack, roadmap
5. **Contact** (`/contact`) - Interactive form with multiple contact methods

## 🌟 Core Features

- ✅ **One-Time Purchase Products** - Lifetime licenses with secure token generation (APPSTO-XXXX-XXXX-XXXX)
- ✅ **Subscription Products** - Free download with in-app billing (future-ready)
- ✅ **Secure Licensing** - Unique token generation with 256-bit encryption
- ✅ **Paddle Integration** - Professional payment processing (PCI-DSS Level 1)
- ✅ **Email Automation** - Instant delivery of licenses and download links
- ✅ **Offline Activation** - Desktop apps work offline after initial verification
- ✅ **Premium UI/UX** - 12 custom animations, gradient effects, hover states
- ✅ **Supabase Backend** - Scalable PostgreSQL database with Row Level Security
- ✅ **Webhook Handling** - Automated license generation on successful purchase
- ✅ **Legal Compliance** - GDPR-ready policies, refund terms, comprehensive ToS
- ✅ **Trust Elements** - Security badges, payment methods, compliance indicators

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5.3
- **Styling**: Tailwind CSS 3.4 with custom animations
- **Backend**: Next.js API Routes, Supabase
- **Payments**: Paddle (Sandbox + Production)
- **Email**: Nodemailer (SMTP) with HTML templates
- **Database**: PostgreSQL via Supabase
- **Animations**: Framer Motion + Tailwind custom keyframes
- **Icons**: Lucide React
- **Hosting**: Vercel / DigitalOcean ready

## 📁 Project Structure

```
appsto/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with navbar/footer
│   │   ├── page.tsx            # Home page (enhanced with trust section)
│   │   ├── about/              # ✨ NEW: About us page
│   │   ├── contact/            # ✨ NEW: Contact form page
│   │   ├── privacy/            # ✨ NEW: Privacy policy
│   │   ├── terms/              # ✨ NEW: Terms of service
│   │   ├── refund-policy/      # ✨ NEW: Refund policy
│   │   ├── email-preview/      # ✨ NEW: Email template preview
│   │   ├── products/           # Products pages (enhanced)
│   │   │   ├── page.tsx        # Products listing with dynamic badges
│   │   │   └── [slug]/         # Product detail (one-time vs subscription flows)
│   │   ├── purchase/
│   │   │   └── success/        # Post-purchase success page
│   │   ├── support/            # Support page
│   │   └── api/                # API routes
│   │       ├── webhooks/
│   │       │   └── paddle/     # Paddle webhook handler
│   │       └── license/
│   │           └── activate/   # License activation API
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components (Button, Card, Badge)
│   │   ├── layout/             # Layout components (Navbar, Footer - enhanced)
│   │   └── email/              # ✨ NEW: Email preview components
│   ├── lib/                    # Utility libraries
│   │   ├── supabase.ts         # Supabase client & types
│   │   ├── crypto.ts           # Token generation & encryption
│   │   ├── email.ts            # Email sending functions
│   │   └── utils.ts            # Helper functions
│   └── styles/
│       └── globals.css         # Global styles & animations
├── supabase/
│   └── schema.sql              # Database schema (enhanced with used_at field)
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config (12 custom animations)
├── next.config.js              # Next.js config
├── ENHANCEMENT_SUMMARY.md      # ✨ NEW: Technical documentation
└── QUICK_START.md              # ✨ NEW: Quick reference guide
```

## 🎨 Design Features

### 🌈 Custom Animations (12 Total)
- `fade-in`, `fade-in-up`, `fade-in-down`
- `slide-up`, `slide-down`, `slide-left`, `slide-right`
- `scale-in`, `scale-up`
- `glow`, `glow-pulse`, `bounce-slow`
- `shimmer`, `gradient`, `wiggle`, `ping-slow`

### 🎯 Product Type Differentiation
| Feature | One-Time Purchase | Subscription |
|---------|-------------------|--------------|
| Badge | "LIFETIME ACCESS" (golden) | No badge |
| Price Display | $X (was $Y) | FREE (from $X/mo) |
| CTA Button | Gradient "Buy Now" | Outline "Free Download" |
| Card Border | Blue gradient | Purple gradient |
| Indicators | Green/Blue dots | Purple/Orange dots |

### 🛡️ Trust Elements
- Paddle Secure Payment badges
- SSL Encrypted indicators
- 14-Day Money Back Guarantee
- Payment method logos (Visa, Mastercard, Amex, PayPal)
- PCI-DSS Level 1 compliance badge
- GDPR Compliant indicator
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Paddle account
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone or navigate to the project directory**

```bash
cd "d:\University\CS 2024-2028\SP\Appsto"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://appsto.software
NEXT_PUBLIC_SITE_NAME=appsto.software

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paddle
NEXT_PUBLIC_PADDLE_VENDOR_ID=your_paddle_vendor_id
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=your_paddle_api_key
PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@appsto.software

# Security
LICENSE_SECRET_KEY=generate_a_secure_random_string_here
API_SECRET_KEY=another_secure_random_string
```

4. **Set up Supabase database**

Go to your Supabase project SQL editor and run the enhanced schema:

```bash
supabase/schema.sql
```

This creates:
- `products` table (with product_type field for one-time vs subscription)
- `licenses` table (enhanced with used_at timestamp and consistency constraint)
- `purchases` table
- Indexes and triggers

**Database Enhancements**:
- `licenses.used_at` tracks when a license was first activated
- Check constraint ensures `is_used` and `used_at` consistency
- Better lifecycle tracking for security auditing

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Quick Reference

For immediate testing and troubleshooting, see:
- **[QUICK_START.md](./QUICK_START.md)** - Testing scenarios, page map, common issues
- **[ENHANCEMENT_SUMMARY.md](./ENHANCEMENT_SUMMARY.md)** - Technical details of all v2.0 updates


## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings → API
3. Run the SQL schema from `supabase/schema.sql`
4. Add your credentials to `.env`

### Paddle Setup

1. Create account at [paddle.com](https://paddle.com)
2. Set up products in Paddle dashboard
3. Get Vendor ID and API keys
4. Add webhook endpoint: `https://your-domain.com/api/webhooks/paddle`
5. Copy webhook secret to `.env`

**Important**: Match Paddle Product IDs with your database:
- In Supabase, set `paddle_product_id` to match Paddle's product ID
- In Paddle, create products with same IDs

### Email Setup

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASSWORD`

For other providers (SendGrid, Mailgun, etc.):
- Update SMTP settings in `.env`
- Modify email templates in `src/lib/email.ts`

## 📝 Adding Products

### Via Supabase Dashboard

1. Go to your Supabase project → Table Editor → products
2. Click "Insert row"
3. Fill in the fields:

```json
{
  "name": "Your App Name",
  "slug": "your-app-name",
  "description": "Full description",
  "short_description": "Short description",
  "price": 99.99,
  "currency": "USD",
  "product_type": "one_time",
  "paddle_product_id": "pro_xxxxx",
  "features": ["Feature 1", "Feature 2"],
  "system_requirements": {
    "os": ["Windows 10/11", "macOS 11+"],
    "processor": "Intel i5 or equivalent",
    "memory": "8GB RAM",
    "storage": "2GB"
  },
  "is_active": true
}
```

### Via SQL

```sql
INSERT INTO products (
  name, slug, description, short_description,
  price, currency, product_type, paddle_product_id,
  features, system_requirements
) VALUES (
  'My App',
  'my-app',
  'Detailed description...',
  'Short desc',
  149.99,
  'USD',
  'one_time',  -- or 'subscription' for free download products
  'pro_paddle123',
  '["Feature 1", "Feature 2", "Feature 3"]'::jsonb,
  '{"os": ["Windows 10+"], "processor": "Intel i5", "memory": "8GB RAM", "storage": "2GB"}'::jsonb
);
```

**Product Types**:
- `one_time`: Paid download, instant license token, lifetime access (displays "Buy Now" button)
- `subscription`: Free download, in-app billing, recurring payment (displays "Free Download" button)

## 🔐 License System

### How It Works

1. **Purchase**: User buys product via Paddle (one-time products only)
2. **Webhook**: Paddle sends transaction data to `/api/webhooks/paddle`
3. **Token Generation**: System generates unique token (format: `APPSTO-XXXX-XXXX-XXXX`)
4. **Email**: License token + download link sent automatically via HTML template
5. **Activation**: Desktop app calls `/api/license/activate` with token
6. **Verification**: Token marked as used, `used_at` timestamp recorded, app stores license locally
7. **Offline**: App works offline forever after activation

### Important Rules

- ✅ Token generated **ONLY** for `product_type: 'one_time'`
- ✅ Token is **unique** and **single-use**
- ✅ Token encrypted with `LICENSE_SECRET_KEY`
- ✅ Token verified once, then works offline
- ✅ `used_at` timestamp tracks first activation for security auditing

### Email Template Preview

View the complete license delivery email template at:
- **Development**: http://localhost:3000/email-preview
- **Component**: `src/components/email/LicenseEmailPreview.tsx`

The email includes:
- Purchase confirmation with icon
- Secure license token display (APPSTO-XXXX-XXXX-XXXX)
- Download and demo video buttons
- 5-step activation instructions
- Important security notes
- Support contact links


### Desktop App Integration

Your desktop app should:

```javascript
// 1. On first launch, prompt for license token
const token = getUserInput()

// 2. Call activation API
const response = await fetch('https://appsto.software/api/license/activate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: token,
    deviceInfo: {
      os: 'Windows 10',
      hostname: 'USER-PC',
      // ... other device info
    }
  })
})

// 3. Store license locally if valid
if (response.ok) {
  const data = await response.json()
  storeLocally(data) // Save to local file/registry
}

// 4. Future launches: check local license, no internet needed
```

## 🎨 Customization

### Branding

Update colors in `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    // Your brand colors
    500: '#YOUR_COLOR',
    600: '#YOUR_COLOR',
    // ...
  }
}
```

### Email Templates

Modify `src/lib/email.ts` → `generateLicenseEmailTemplate()`

**Preview your changes**: Visit http://localhost:3000/email-preview to see the complete email mockup

### Animations

Customize in `tailwind.config.ts` → `animation` and `keyframes`

**Available animations**:
- Entry: fade-in, slide-up/down/left/right, scale-in/up
- Hover: glow, glow-pulse
- Continuous: float, bounce-slow, shimmer, gradient, wiggle, ping-slow

### Legal Pages

Update with your company information:
- [src/app/privacy/page.tsx](src/app/privacy/page.tsx) - Data collection, GDPR rights, contact info
- [src/app/terms/page.tsx](src/app/terms/page.tsx) - License types, prohibited uses, governing law
- [src/app/refund-policy/page.tsx](src/app/refund-policy/page.tsx) - Refund eligibility, processing times

**Important**: Have a lawyer review these pages before production deployment.

## 🧪 Testing

### Quick Testing Guide

See [QUICK_START.md](./QUICK_START.md) for:
- Complete testing scenarios
- Mobile responsiveness checklist
- Common issues & solutions
- Pre-launch checklist

### Test with Free Coupon

1. Create 100% off coupon in Paddle
2. Make test purchase
3. Check email delivery
4. Verify license token generation
5. Test activation API

### Test Endpoints

```bash
# Test license activation
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{"token":"APPSTO-XXXX-XXXX-XXXX","deviceInfo":{}}'

# Test license verification
curl "http://localhost:3000/api/license/activate?token=APPSTO-XXXX-XXXX-XXXX"
```

### UI Testing Checklist

- [ ] Home page trust badges display correctly
- [ ] Product cards show correct badges (golden "LIFETIME ACCESS" for one-time)
- [ ] Product detail pages show different flows (one-time vs subscription)
- [ ] All legal pages render with proper formatting
- [ ] Contact form submits successfully
- [ ] Email preview page displays template correctly
- [ ] Footer shows all 5 columns with legal links
- [ ] Animations work smoothly (fade-in, slide effects, hover states)
- [ ] Mobile responsive on all breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px)

## 🚀 Deployment

### DigitalOcean App Platform

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Create App on DigitalOcean**
   - Go to App Platform
   - Connect your GitHub repo
   - Choose branch: `main`
   - Environment: Node.js

3. **Configure Environment Variables**
   - Add all variables from `.env`
   - Set `NODE_ENV=production`
   - Set `NEXT_PUBLIC_PADDLE_ENVIRONMENT=production`

4. **Set Domain**
   - Add custom domain: `appsto.software`
   - Configure DNS:
     - A record: `@` → DigitalOcean IP
     - CNAME: `www` → DigitalOcean domain

5. **Deploy**
   - Click "Create Resources"
   - Wait for build and deployment

### Other Hosts

**Vercel** (easiest):
```bash
npm install -g vercel
vercel
```

**AWS/Azure/Google Cloud**:
- Build: `npm run build`
- Start: `npm start`
- Use PM2 for process management

## 🔒 Security Checklist

- [ ] Environment variables secured (never commit `.env`)
- [ ] Paddle webhook signature verification enabled (production)
- [ ] Supabase Row Level Security (RLS) policies configured
- [ ] HTTPS/SSL certificate installed
- [ ] License secret key is strong and random (min 32 characters)
- [ ] Email credentials secured (use app passwords, not main password)
- [ ] API rate limiting enabled (consider adding middleware)
- [ ] CORS configured properly
- [ ] Database backups automated (Supabase auto-backups)
- [ ] Legal pages reviewed by lawyer (Privacy, Terms, Refund)
- [ ] `used_at` timestamp constraint active for license security
- [ ] Paddle production keys separate from sandbox keys

## 📊 Monitoring

### What to Monitor

- Webhook failures (check logs at `/api/webhooks/paddle`)
- License activation errors (check Supabase logs)
- Email delivery issues (SMTP logs)
- Database performance (Supabase dashboard)
- Page load times (aim for FCP < 1.8s, LCP < 2.5s)
- User behavior (consider adding analytics: Plausible, Fathom, or Umami)

### Performance Targets

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.8s

See [QUICK_START.md](./QUICK_START.md) for detailed performance monitoring guide.

- Email delivery rate
- License activation success rate
- Product sales
- User contact form submissions

### Logging

Check server logs for:
```bash
# Webhook events
"Paddle webhook received"
"License generated and email sent"

# Errors
"Failed to create license"
"Email sending failed"
```

## 🐛 Troubleshooting

### License not generated after purchase

1. Check Paddle webhook is configured (https://your-domain.com/api/webhooks/paddle)
2. Verify webhook endpoint is accessible (test with Paddle dashboard)
3. Check server logs for errors
4. Ensure `product_type` is `one_time` in database
5. Verify `LICENSE_SECRET_KEY` is set correctly

### Email not received

1. Check spam folder
2. Verify SMTP credentials in `.env`
3. Check email service logs (Gmail blocked login attempts?)
4. Test with `sendTestEmail()` function in `src/lib/email.ts`
5. Verify `EMAIL_FROM` matches SMTP account

### Paddle checkout not working

1. Verify Paddle vendor ID is correct
2. Check environment (sandbox vs production)
3. Ensure Paddle.js script loaded in browser
4. Check browser console for errors
5. Verify product exists in Paddle dashboard with matching `paddle_product_id`

### Product page shows wrong type

1. Check `product_type` field in database ('one_time' or 'subscription')
2. Clear browser cache
3. Restart dev server (npm run dev)
4. Verify product query in [slug]/page.tsx

### Animations not working

1. Clear Tailwind cache: `npm run dev` (stop and restart)
2. Check `tailwind.config.ts` has all 12 animations
3. Verify classes are not purged (check inspect element)
4. Test in different browser

### Legal pages formatting issues

1. Check responsive breakpoints (sm:, md:, lg:)
2. Verify Tailwind classes are applied
3. Test in mobile view (DevTools)
4. Ensure dark mode classes are present (dark:)

For more troubleshooting tips, see [QUICK_START.md](./QUICK_START.md) → Common Issues & Solutions.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Quick reference, testing scenarios, troubleshooting
- **[ENHANCEMENT_SUMMARY.md](./ENHANCEMENT_SUMMARY.md)** - Technical details of v2.0 updates
- **Email Preview**: http://localhost:3000/email-preview

## 📞 Support

For questions or issues:
- General: hello@appsto.software
- Technical Support: support@appsto.software
- Refunds: refunds@appsto.software
- Business Inquiries: business@appsto.software

## 🎯 Next Steps

1. **Review Legal Pages**: Have a lawyer review [Privacy](src/app/privacy/page.tsx), [Terms](src/app/terms/page.tsx), [Refund Policy](src/app/refund-policy/page.tsx)
2. **Configure Services**: Set up Supabase, Paddle, SMTP (follow setup sections above)
3. **Add Products**: Insert real products into database with correct `product_type`
4. **Test Flows**: Complete all testing scenarios in [QUICK_START.md](./QUICK_START.md)
5. **Customize Content**: Update About page with your story, Contact page with your info
6. **Deploy**: Follow deployment guide for your hosting platform
7. **Monitor**: Set up logging and analytics for production monitoring

## 📄 License

This project is proprietary. All rights reserved.

---

**Built with ❤️ for professional software distribution**

Version 2.0.0 | Enhanced UI • Legal Compliance • Premium Design
