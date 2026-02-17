# 🎯 Production Quick Reference

> **Copy-paste ready values for production deployment**

---

## 🆔 Production Paddle IDs

```
Product ID:  pro_01khb6caewhmc5wzgf9mgzc3bc

Price IDs:
  Solo:      pri_01khb858xxexa8chhc45gvdvwk
  Squad:     pri_01khb8e6ez5hm3afq5y39ksx4c
  Studio:    pri_01khb8rm4c5rs6vxw4byzyhhnw
```

---

## 📦 Software Release

```
URL:       https://github.com/M-UmarJaved/DeskSweepSoftware/releases/download/DeskSwepp/DeskSweep_Setup.exe
Size:      56.7 MB
Version:   1.0.0
```

---

## 🔗 Production URLs

```
App:           https://appsto.software
Download API:  https://appsto.software/api/download/desksweep
Webhook:       https://appsto.software/api/webhooks/paddle
```

---

## 💰 Pricing (USD)

```
Solo:    $9.00   (1 device)
Squad:   $29.00  (5 devices)  ⭐ POPULAR
Studio:  $79.00  (20 devices)
```

---

## 🌍 Regional Pricing Template (for Paddle Dashboard)

**Copy-paste into Paddle price overrides:**

### Solo Plan Regional Prices
```
EUR (Eurozone):    €8
GBP (UK):          £7
CAD (Canada):      CA$12
AUD (Australia):   A$13
INR (India):       ₹299
PKR (Pakistan):    Rs 2,500
JPY (Japan):       ¥1,200
BRL (Brazil):      R$45
MXN (Mexico):      MX$159
SGD (Singapore):   S$12
KRW (South Korea): ₩11,000
CHF (Switzerland): CHF 8
SEK (Sweden):      kr 90
PLN (Poland):      zł 35
TRY (Turkey):      ₺250
ZAR (South Africa):R 165
AED (UAE):         AED 33
IDR (Indonesia):   Rp 135,000
```

### Squad Plan Regional Prices
```
EUR (Eurozone):    €27
GBP (UK):          £24
CAD (Canada):      CA$39
AUD (Australia):   A$44
INR (India):       ₹999
PKR (Pakistan):    Rs 8,000
JPY (Japan):       ¥4,200
BRL (Brazil):      R$149
MXN (Mexico):      MX$549
SGD (Singapore):   S$39
KRW (South Korea): ₩38,000
CHF (Switzerland): CHF 27
SEK (Sweden):      kr 299
PLN (Poland):      zł 119
TRY (Turkey):      ₺850
ZAR (South Africa):R 549
AED (UAE):         AED 109
IDR (Indonesia):   Rp 449,000
```

### Studio Plan Regional Prices
```
EUR (Eurozone):    €72
GBP (UK):          £62
CAD (Canada):      CA$109
AUD (Australia):   A$119
INR (India):       ₹2,999
PKR (Pakistan):    Rs 22,000
JPY (Japan):       ¥11,500
BRL (Brazil):      R$399
MXN (Mexico):      MX$1,449
SGD (Singapore):   S$109
KRW (South Korea): ₩99,000
CHF (Switzerland): CHF 72
SEK (Sweden):      kr 799
PLN (Poland):      zł 319
TRY (Turkey):      ₺2,299
ZAR (South Africa):R 1,449
AED (UAE):         AED 289
IDR (Indonesia):   Rp 1,199,000
```

---

## 🔐 Required Environment Variables

Create `.env.production` with these:

```env
# Paddle (get from vendors.paddle.com/authentication)
PADDLE_API_KEY=live_YOUR_KEY_HERE
PADDLE_CLIENT_TOKEN=live_YOUR_TOKEN_HERE
PADDLE_WEBHOOK_SECRET=pdl_whsec_production_YOUR_SECRET_HERE
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production

# Supabase (get from app.supabase.com/project/YOUR_PROJECT/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App URLs
NEXT_PUBLIC_APP_URL=https://appsto.software

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com

# Security (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE
NEXTAUTH_URL=https://appsto.software
```

---

## 🎫 Test Coupons

**For your own testing (100% off):**
```
Code:      LAUNCH100
Type:      Percentage
Value:     100%
Max Uses:  10
Valid:     7 days
```

**For launch promotion (20% off):**
```
Code:      LAUNCH20
Type:      Percentage
Value:     20%
Max Uses:  100
Valid:     30 days
```

---

## 💳 Test Cards (Sandbox & Production)

**Success:**
```
Card:   4242 4242 4242 4242
Expiry: Any future date
CVC:    Any 3 digits
ZIP:    Any valid ZIP
```

**Decline:**
```
Card:   4000 0000 0000 0002
```

**Insufficient Funds:**
```
Card:   4000 0000 0000 9995
```

---

## ✅ Deployment Checklist

**Database:**
- [ ] Run `PRODUCTION_CLEAN_SETUP.sql` in Supabase production
- [ ] Verify products table has DeskSweep with production ID
- [ ] Verify pricing_plans has 3 plans with production IDs

**Paddle Dashboard:**
- [ ] Switch to Production mode
- [ ] Create DeskSweep product
- [ ] Create 3 price plans (Solo, Squad, Studio)
- [ ] Add regional pricing (18 countries)
- [ ] Enable saved payment methods
- [ ] Enable checkout recovery (10% discount)
- [ ] Configure webhook: `https://appsto.software/api/webhooks/paddle`
- [ ] Disable Paddle emails (you send custom emails)
- [ ] Add payout method

**Environment:**
- [ ] Create `.env.production` from template
- [ ] Add all variables to Vercel (via dashboard or CLI)
- [ ] Verify `PADDLE_ENVIRONMENT=production`

**Testing:**
- [ ] Create test coupon `LAUNCH100`
- [ ] Complete test purchase with coupon
- [ ] Verify webhook received
- [ ] Verify email sent with license keys
- [ ] Verify download link works
- [ ] Test without coupon (real charge - request refund after)
- [ ] Delete test coupon

**Go Live:**
- [ ] Deploy to Vercel production
- [ ] Monitor logs for first hour
- [ ] Test purchase from different country (VPN)
- [ ] Share launch announcement

---

## 🆘 Quick Troubleshooting

**Webhook not working?**
```
1. Check URL: https://appsto.software/api/webhooks/paddle
2. Verify HTTPS (not HTTP)
3. Test webhook in Paddle Dashboard
4. Check Vercel logs: vercel logs --prod
```

**Email not sending?**
```
1. Check SMTP credentials in Vercel env
2. Verify Gmail App Password (16 chars)
3. Check email_logs table in Supabase
4. Test SMTP: curl -X POST https://appsto.software/api/test-email
```

**Download not working?**
```
1. Test API: curl https://appsto.software/api/download/desksweep
2. Check products table: SELECT download_url FROM products WHERE slug='desksweep'
3. Verify GitHub URL is accessible
```

**Checkout not opening?**
```
1. Check browser console (F12)
2. Verify Paddle.js loaded
3. Check price IDs match database
4. Test in incognito mode
```

---

## 📁 Key Files

**Database:**
- `supabase/migrations/PRODUCTION_CLEAN_SETUP.sql`

**API Routes:**
- `src/app/api/download/[product]/route.ts` (download redirect)
- `src/app/api/paddle/customer-token/route.ts` (saved payments)
- `src/app/api/webhooks/paddle/route.ts` (webhook handler)

**Email:**
- `src/lib/purchase-email.ts` (purchase confirmation)

**Documentation:**
- `PRODUCTION_IMPLEMENTATION_COMPLETE.md` (full guide)
- `PADDLE_PRODUCTION_SETTINGS_GUIDE.md` (Paddle settings)
- `.env.production.example` (environment template)
- `PRODUCTION_QUICK_REFERENCE.md` (this file)

---

## 📊 First Day Monitoring

**Watch these closely:**
- Paddle Transactions dashboard
- Vercel logs (errors)
- Supabase purchases table
- Email inbox (customer questions)
- Discord alerts (if configured)

**Expected metrics:**
- Webhook success rate: 100%
- Email delivery rate: 100%
- Failed payments: <5%
- Checkout abandonment: ~60% (normal)
- Recovery rate: 10-15%

---

## 🎉 You're Ready!

Everything is configured for production. Follow `PRODUCTION_IMPLEMENTATION_COMPLETE.md` for step-by-step deployment.

**Good luck with your launch!** 🚀
