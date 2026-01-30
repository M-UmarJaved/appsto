# 💳 Payment & License System - Complete Guide

## 🎯 System Overview

This document outlines the **professional, scalable payment and license delivery system** for Appsto.

### Architecture Flow

```
User Clicks Buy → Auth Check → Paddle Checkout → Payment Success
                                                         ↓
                                        Paddle Webhook → Our API
                                                         ↓
                              Create Purchase Record (Appsto DB)
                                                         ↓
                           Generate License Keys (1/5/20 based on plan)
                                                         ↓
                              Save to Licenses Table (Appsto DB)
                                                         ↓
                              Sync to Tokens Table (My Softwares DB)
                                                         ↓
                           Send Email (Download Link + License Keys)
                                                         ↓
                              User Downloads & Activates ✅
```

---

## 📊 Database Schema (Appsto Database)

### Tables Created:
1. **`products`** - Software catalog
2. **`pricing_plans`** - Solo/Squad/Studio tiers
3. **`purchases`** - Order records with Paddle data
4. **`licenses`** - Individual license keys
5. **`license_activations`** - Device tracking
6. **`download_logs`** - Analytics
7. **`email_logs`** - Email tracking
8. **`coupons`** - Testing & promotions

### Key Features:
- ✅ **Multi-currency support** (USD, INR, PKR)
- ✅ **Multiple licenses per purchase** (1/5/20 keys)
- ✅ **Token syncing** to "My Softwares" database
- ✅ **Device tracking** for activations
- ✅ **Row-Level Security** enabled
- ✅ **Indexes** for performance at scale
- ✅ **Test coupon** included (TEST100 = 100% OFF)

---

## 🔧 Implementation Steps

### Step 1: Run Database Migration ✅
```bash
# In Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of supabase/migrations/20260130_payment_system.sql
3. Execute the SQL
4. Verify tables created successfully
```

### Step 2: Install Required Packages
```bash
npm install @paddle/paddle-node-sdk
npm install stripe  # Alternative if needed
npm install uuid
```

### Step 3: Environment Variables
Add to `.env.local`:
```env
# Paddle Configuration
PADDLE_API_KEY=your_paddle_api_key
PADDLE_ENVIRONMENT=sandbox  # Change to 'production' when live
PADDLE_WEBHOOK_SECRET=your_webhook_secret

# Supabase (Main - Appsto)
NEXT_PUBLIC_SUPABASE_URL=your_appsto_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_appsto_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_appsto_service_key

# Supabase (Product DB - My Softwares)
PRODUCT_DB_SUPABASE_URL=your_my_softwares_url
PRODUCT_DB_SUPABASE_KEY=your_my_softwares_service_key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOWNLOAD_BASE_URL=https://yourdomain.com/downloads

# Email (Already configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=support@appsto.software
```

---

## 🎬 Step 4: Software Delivery Decision

### ❓ Email Attachment vs Direct Download?

#### Option A: Email Attachment (Not Recommended)
**Pros:**
- Simpler to implement
- Users get everything in one place

**Cons:**
- ❌ Email size limits (25MB Gmail, 10MB Outlook)
- ❌ Spam filter issues with .exe/.zip files
- ❌ Not scalable for large software
- ❌ No download analytics
- ❌ Difficult to update files later

#### Option B: Secure Download Link ✅ **RECOMMENDED**
**Pros:**
- ✅ No size limits
- ✅ Signed URLs with expiration (secure)
- ✅ Download tracking & analytics
- ✅ Can update files anytime
- ✅ Professional user experience
- ✅ Scales to millions of users

**Cons:**
- Requires storage setup (AWS S3, Cloudflare R2, or Supabase Storage)

### 🏆 **DECISION: Use Secure Download Links**

#### Storage Options:
1. **Supabase Storage** (Free tier: 1GB, Paid: $0.021/GB)
   - ✅ Already using Supabase
   - ✅ Built-in signed URLs
   - ✅ Easy integration
   
2. **Cloudflare R2** (First 10GB free)
   - ✅ Zero egress fees
   - ✅ S3-compatible
   - ✅ Extremely scalable

3. **AWS S3** (Industry standard)
   - ✅ Most reliable
   - ❌ Egress costs

**Recommendation:** Start with **Supabase Storage**, migrate to **Cloudflare R2** when scaling.

---

## 💰 Paddle Integration

### Webhook Events to Handle:
1. `transaction.completed` - Payment successful
2. `transaction.refunded` - Refund processed
3. `subscription.created` - Subscription started
4. `subscription.canceled` - Subscription ended

### Paddle Checkout Flow:
```javascript
// When user clicks "Buy Now"
const checkout = await paddle.Checkout.create({
  items: [{
    priceId: 'pri_01234...',  // From pricing_plans table
    quantity: 1
  }],
  customData: {
    userId: user.id,
    planSlug: 'solo',
    productSlug: 'desksweep'
  },
  customer: {
    email: user.email
  },
  successUrl: `${APP_URL}/purchase/success?session={checkout_id}`,
  cancelUrl: `${APP_URL}/products/desksweep`
});
```

---

## 📧 Email Templates

### 1. Purchase Confirmation Email
- Subject: "Your DeskSweep Purchase is Complete! 🎉"
- Content:
  - Order summary
  - License keys (formatted nicely)
  - **Secure download link** (expires in 7 days)
  - Activation instructions
  - Support contact

### 2. License Delivery Email
- Separate email with just license keys
- Can be resent if needed

### 3. Refund Confirmation
- Subject: "Refund Processed - DeskSweep"

---

## 🧪 Testing Strategy

### Phase 1: Local Testing (Current)
1. ✅ Use `TEST100` coupon for 100% off
2. ✅ Test complete flow without real payments
3. ✅ Verify license generation
4. ✅ Test email delivery
5. ✅ Test download links

### Phase 2: Paddle Sandbox
1. Use Paddle's sandbox mode
2. Test with test credit cards
3. Verify webhook handling

### Phase 3: Live Testing
1. Create real account with $1 payment
2. Test full flow
3. Issue refund to yourself

---

## 🚀 Scaling Considerations

### Database:
- **Free tier:** ~500MB storage, 2GB bandwidth
- **When to upgrade:** 
  - 10,000+ purchases
  - 50,000+ license keys
  - High traffic (100+ req/sec)

### Storage:
- **Supabase Free:** 1GB (good for ~50 software releases)
- **Cloudflare R2:** 10GB free (500+ releases)
- **When to migrate:** Software > 50MB or 1000+ downloads/day

### Email:
- **Current:** SMTP via Gmail (500 emails/day)
- **When to upgrade:** 100+ purchases/day
- **Solutions:** SendGrid, AWS SES, Resend

### Performance Optimizations:
1. Cache product/pricing data in Redis
2. Use Supabase Edge Functions for webhooks
3. Queue system for email sending (BullMQ)
4. CDN for software downloads

---

## 📝 Next Steps

### What I'll Implement (Code):
1. ✅ Database schema (Done)
2. 🔄 Paddle webhook handler API
3. 🔄 License generation utility
4. 🔄 Email templates & sender
5. 🔄 Download link generator
6. 🔄 Purchase confirmation page
7. 🔄 User dashboard (My Licenses)
8. 🔄 Admin panel (Testing)

### What You Need to Do:
1. **Run SQL migration** in Supabase Dashboard
2. **Setup Supabase Storage:**
   - Create bucket named `software-files`
   - Upload DeskSweep installer
   - Set as private
3. **Configure Paddle:**
   - Get API keys (sandbox & production)
   - Create products & prices
   - Add webhook URL
4. **Add environment variables** to `.env.local`
5. **Test with TEST100 coupon**

---

## 🛡️ Security Best Practices

1. ✅ **RLS Enabled** - Users only see their data
2. ✅ **Signed URLs** - Download links expire
3. ✅ **Webhook verification** - Verify Paddle signatures
4. ✅ **License validation** - Server-side checks
5. ✅ **Rate limiting** - Prevent abuse
6. ✅ **Audit logging** - Track all actions

---

## 🆘 Support & Troubleshooting

### Common Issues:

**Q: Webhook not receiving events?**
- Check Paddle webhook URL is correct
- Verify webhook secret matches
- Check firewall/hosting allows POST requests

**Q: License not syncing to My Softwares DB?**
- Verify PRODUCT_DB_SUPABASE_URL is correct
- Check service role key has permissions
- Look at email_logs table for errors

**Q: Download link expired?**
- Default: 7 days expiration
- User can request new link from dashboard
- Links are regenerated on each request

**Q: Email not sending?**
- Check SMTP credentials
- Verify Gmail allows "Less secure app access"
- Check email_logs table for error details

---

## 📊 Analytics & Monitoring

### Metrics to Track:
1. **Purchase Metrics:**
   - Total revenue
   - Purchases by plan (Solo/Squad/Studio)
   - Purchases by currency
   - Conversion rate

2. **License Metrics:**
   - Activation rate (% of licenses activated)
   - Time to first activation
   - Multi-device usage

3. **Download Metrics:**
   - Downloads per purchase
   - Download completion rate
   - Geographic distribution

4. **Email Metrics:**
   - Delivery rate
   - Open rate (if using tracking)
   - Bounce rate

### Dashboard Ideas:
- Real-time purchase feed
- Revenue charts
- Top countries
- License activation status
- Failed payment attempts

---

## 🎓 Learning Resources

- [Paddle Docs](https://developer.paddle.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Next:** I'll start implementing the webhook handler and license generation system. Ready to proceed? 🚀
