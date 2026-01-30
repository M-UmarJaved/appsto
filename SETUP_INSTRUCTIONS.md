# 🚀 Complete Setup Guide - Payment & License System

## ✅ **What Has Been Created**

### 1. Database Schema (`supabase/migrations/20260130_payment_system.sql`)
- ✅ 8 tables: products, pricing_plans, purchases, licenses, license_activations, download_logs, email_logs, coupons
- ✅ Row-Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ DeskSweep product with 3 pricing plans pre-loaded
- ✅ TEST100 coupon (100% off) for testing

### 2. Core Libraries
- ✅ `src/lib/license.ts` - License generation, validation, activation
- ✅ `src/lib/purchase-email.ts` - Purchase & refund email templates

### 3. API Endpoints
- ✅ `/api/test/purchase` - Test purchase creation (uses TEST100 coupon)
- ✅ `/api/download` - Secure download with purchase verification
- ✅ `/api/user/purchases` - Get user's purchases and licenses
- ✅ `/api/webhooks/paddle` - (Already exists) Paddle webhook handler

### 4. Frontend Pages
- ✅ `/dashboard` - (Already exists) User license management

---

## 📝 **Step-by-Step Setup Instructions**

### **Step 1: Run Database Migration** ⚡ CRITICAL

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your **"Appsto"** project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Copy the ENTIRE contents of `supabase/migrations/20260130_payment_system.sql`
6. Paste into the SQL editor
7. Click **"Run"** button
8. ✅ Verify success message appears

**Verify tables created:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'pricing_plans', 'purchases', 'licenses');
```

Should return 4 rows.

---

### **Step 2: Install Required NPM Packages**

```bash
npm install nanoid @supabase/auth-helpers-nextjs
```

**What these do:**
- `nanoid` - Generates unique license keys
- `@supabase/auth-helpers-nextjs` - Supabase authentication for API routes

---

### **Step 3: Update Environment Variables**

Add to `.env.local`:

```env
# ===== Supabase Configuration =====
# Main database (Appsto) - Already configured
NEXT_PUBLIC_SUPABASE_URL=your_appsto_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_appsto_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_appsto_service_role_key

# Product Database (My Softwares)
PRODUCT_DB_SUPABASE_URL=your_my_softwares_url
PRODUCT_DB_SUPABASE_KEY=your_my_softwares_service_role_key

# ===== Paddle Configuration =====
PADDLE_API_KEY=your_paddle_api_key
PADDLE_ENVIRONMENT=sandbox  # Change to 'production' when live
PADDLE_WEBHOOK_SECRET=your_webhook_secret

# ===== Application URLs =====
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain when live

# ===== Email Configuration (Already configured) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=support@appsto.software

# ===== Testing =====
# Set to 'true' to enable test purchases in production (NOT RECOMMENDED)
ALLOW_TEST_PURCHASES=false
```

**How to get these values:**

1. **Appsto Supabase** (Main):
   - Go to: Settings → API
   - Copy: `URL`, `anon public`, `service_role secret`

2. **My Softwares Supabase**:
   - Switch to "My Softwares" project
   - Go to: Settings → API
   - Copy: `URL`, `service_role secret`

3. **Paddle** (when ready):
   - Login to Paddle Dashboard
   - Go to: Developer Tools → API Keys
   - Create new API key
   - Go to: Developer Tools → Webhooks
   - Create webhook pointing to: `https://yourdomain.com/api/webhooks/paddle`
   - Copy the webhook secret

---

### **Step 4: Setup Supabase Storage for Downloads** (Optional but Recommended)

**Option A: Supabase Storage (Recommended for now)**

1. Go to Supabase Dashboard → Storage
2. Click **"Create new bucket"**
   - Name: `software-files`
   - Public: **NO** (keep private)
   - File size limit: 500MB (or more)
3. Click **"Create bucket"**
4. Upload your DeskSweep installer:
   - Click on `software-files` bucket
   - Click **"Upload file"**
   - Upload: `DeskSweep-Setup.exe` (or your installer)
   - Note the path: e.g., `DeskSweep-Setup.exe`
5. Update product in database:

```sql
UPDATE products
SET download_url = 'DeskSweep-Setup.exe',
    file_size_mb = 50  -- Actual file size
WHERE slug = 'desksweep';
```

**Option B: Cloudflare R2 (For scaling later)**
- More cost-effective at scale
- Setup guide: https://developers.cloudflare.com/r2/

---

### **Step 5: Test the Complete Flow** 🧪

**A. Create Test Purchase (With TEST100 Coupon)**

1. Make sure you're logged in to your website
2. Get your user ID:
   - Open browser console (F12)
   - Run: 
   ```javascript
   fetch('/api/user/purchases', {credentials: 'include'})
     .then(r => r.json())
     .then(console.log)
   ```
   - Or check Supabase → Authentication → Users

3. Create test purchase:

```bash
# Using curl
curl -X POST http://localhost:3000/api/test/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id-here",
    "productSlug": "desksweep",
    "planSlug": "solo",
    "email": "your-email@gmail.com",
    "name": "Test User"
  }'
```

**Or use this HTML test page** (create `test-purchase.html` in `public/` folder):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Purchase</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    input, select, button { width: 100%; padding: 10px; margin: 10px 0; }
    button { background: #6366f1; color: white; border: none; cursor: pointer; }
    .result { background: #f3f4f6; padding: 15px; margin-top: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>🧪 Test Purchase</h1>
  <form id="testForm">
    <input type="text" id="userId" placeholder="User ID" required>
    <input type="email" id="email" placeholder="Email" required>
    <input type="text" id="name" placeholder="Name" value="Test User">
    <select id="planSlug">
      <option value="solo">Solo (1 license)</option>
      <option value="squad">Squad (5 licenses)</option>
      <option value="studio">Studio (20 licenses)</option>
    </select>
    <button type="submit">Create Test Purchase (FREE)</button>
  </form>
  <div id="result" class="result" style="display:none;"></div>

  <script>
    document.getElementById('testForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const data = {
        userId: document.getElementById('userId').value,
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        productSlug: 'desksweep',
        planSlug: document.getElementById('planSlug').value,
      };

      try {
        const response = await fetch('/api/test/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';

        if (response.ok) {
          resultDiv.innerHTML = `
            <h3>✅ Success!</h3>
            <p><strong>Purchase ID:</strong> ${result.data.purchaseId}</p>
            <p><strong>License Keys:</strong></p>
            <ul>
              ${result.data.licenseKeys.map(key => `<li><code>${key}</code></li>`).join('')}
            </ul>
            <p><strong>Download URL:</strong></p>
            <a href="${result.data.downloadUrl}" target="_blank">${result.data.downloadUrl}</a>
            <p><strong>Email sent to:</strong> ${data.email}</p>
            <p><a href="/dashboard">View in Dashboard</a></p>
          `;
        } else {
          resultDiv.innerHTML = `<h3>❌ Error</h3><p>${result.error}</p>`;
        }
      } catch (error) {
        document.getElementById('result').innerHTML = 
          `<h3>❌ Error</h3><p>${error.message}</p>`;
      }
    });
  </script>
</body>
</html>
```

4. Access: http://localhost:3000/test-purchase.html

**B. Verify Test Results**

1. ✅ Check email inbox - Should receive purchase confirmation
2. ✅ Check database:
   ```sql
   -- View purchases
   SELECT * FROM purchases ORDER BY created_at DESC LIMIT 1;
   
   -- View licenses
   SELECT * FROM licenses ORDER BY created_at DESC LIMIT 5;
   
   -- Check sync to My Softwares
   SELECT * FROM tokens ORDER BY created_at DESC LIMIT 5;
   ```
3. ✅ Check dashboard: http://localhost:3000/dashboard
4. ✅ Test download link from email or dashboard
5. ✅ Test license key in DeskSweep software

---

### **Step 6: Configure Paddle** (When Ready to Go Live)

**A. Create Paddle Account**
1. Sign up: https://paddle.com
2. Complete business verification
3. Add bank account for payouts

**B. Create Products in Paddle**

1. Go to: Catalog → Products
2. Create product: "DeskSweep"
3. Create prices for each plan:

   **Solo Plan:**
   - USD: $9.00
   - INR: ₹299.00
   - PKR: Rs.2500.00

   **Squad Plan:**
   - USD: $29.00
   - INR: ₹999.00
   - PKR: Rs.8000.00

   **Studio Plan:**
   - USD: $79.00
   - INR: ₹2999.00
   - PKR: Rs.22000.00

4. Note the Price IDs (e.g., `pri_01234...`)

**C. Update Database with Paddle IDs**

```sql
-- Update pricing plans with Paddle price IDs
UPDATE pricing_plans
SET paddle_price_id_usd = 'pri_solo_usd_id_here',
    paddle_price_id_inr = 'pri_solo_inr_id_here',
    paddle_price_id_pkr = 'pri_solo_pkr_id_here'
WHERE plan_slug = 'solo';

-- Repeat for squad and studio
```

**D. Setup Webhook**

1. Go to: Developer Tools → Notifications → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/paddle`
3. Select events:
   - ✅ `transaction.completed`
   - ✅ `transaction.refunded`
   - ✅ `subscription.created` (if using subscriptions)
4. Copy webhook secret → Add to `.env.local` as `PADDLE_WEBHOOK_SECRET`

---

### **Step 7: Update Buy Button** (Integrate Paddle Checkout)

Update `src/app/products/[slug]/page.tsx`:

```typescript
async function handlePurchase() {
  if (!user) {
    router.push(`/auth/login?redirect=/products/${params.slug}`);
    return;
  }

  try {
    // Initialize Paddle
    const Paddle = (window as any).Paddle;
    
    // Get price ID based on currency
    const priceId = currency === 'INR' 
      ? 'pri_solo_inr_id_here'
      : currency === 'PKR'
      ? 'pri_solo_pkr_id_here'
      : 'pri_solo_usd_id_here';

    // Open Paddle checkout
    Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: {
        userId: user.id,
        productSlug: 'desksweep',
        planSlug: 'solo',
      },
      customer: {
        email: user.email,
      },
      successUrl: `${window.location.origin}/purchase/success?session={checkout_id}`,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to open checkout. Please try again.');
  }
}
```

Add Paddle script to `src/app/layout.tsx`:

```typescript
<Script
  src="https://cdn.paddle.com/paddle/v2/paddle.js"
  onLoad={() => {
    (window as any).Paddle?.Initialize({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox',
    });
  }}
/>
```

---

## 🎯 **Testing Checklist**

- [ ] Database tables created
- [ ] Test purchase with TEST100 coupon works
- [ ] Licenses generated (1/5/20 based on plan)
- [ ] Licenses synced to "My Softwares" database
- [ ] Purchase confirmation email received
- [ ] License keys displayed correctly
- [ ] Download link works
- [ ] Dashboard shows purchases
- [ ] DeskSweep validates license key
- [ ] DeskSweep activation increments count
- [ ] Paddle webhook receives events (when live)

---

## 🔧 **Troubleshooting**

### "License generation failed"
- Check `nanoid` package is installed
- Verify Supabase service role key has permissions

### "Email not sent"
- Check SMTP credentials in `.env.local`
- Verify Gmail app password (not regular password)
- Check `email_logs` table for error details

### "Download link not working"
- Upload software to Supabase Storage
- Update `download_url` in products table
- Check storage bucket is private (signed URLs)

### "Paddle webhook not receiving"
- Verify webhook URL is publicly accessible (use ngrok for local testing)
- Check webhook secret matches `.env.local`
- Look at Paddle dashboard → Webhooks → Attempts for errors

### "License not syncing to My Softwares DB"
- Check `PRODUCT_DB_SUPABASE_URL` and `PRODUCT_DB_SUPABASE_KEY` are correct
- Verify service role key has INSERT permissions on `tokens` table
- Check logs for errors

---

## 🚀 **Going to Production**

1. **Environment Variables:**
   - [ ] Update `NEXT_PUBLIC_APP_URL` to your domain
   - [ ] Change `PADDLE_ENVIRONMENT` to `production`
   - [ ] Set `ALLOW_TEST_PURCHASES=false`

2. **Paddle:**
   - [ ] Complete business verification
   - [ ] Submit Terms, Privacy Policy, Refund Policy pages
   - [ ] Switch from sandbox to production mode
   - [ ] Update webhook URL to production domain

3. **Storage:**
   - [ ] Upload final software build to storage
   - [ ] Test download link
   - [ ] Consider migrating to Cloudflare R2 if scaling

4. **Security:**
   - [ ] Verify RLS policies are enabled
   - [ ] Test with different user accounts
   - [ ] Ensure service role keys are never exposed to frontend

5. **Monitoring:**
   - [ ] Set up error tracking (Sentry)
   - [ ] Monitor webhook logs
   - [ ] Check email delivery rates
   - [ ] Track purchase funnel

---

## 📊 **Database Scaling Plan**

**Current (Free Tier):**
- ~500MB storage
- ~2GB bandwidth
- Good for: 1,000-5,000 purchases

**When to Upgrade:**
- 10,000+ purchases → Pro Plan ($25/mo)
- 50,000+ purchases → Team Plan
- Consider: Read replicas, Connection pooling

**Storage Migration:**
- Start: Supabase Storage (1GB free)
- Scale: Cloudflare R2 (10GB free, no egress fees)
- Enterprise: AWS S3 with CloudFront CDN

---

## ✅ **Next Steps**

**Immediate (Today):**
1. Run database migration
2. Install npm packages
3. Update `.env.local`
4. Test purchase with TEST100 coupon
5. Verify email delivery
6. Check dashboard displays purchases

**Before Going Live:**
1. Setup Paddle account & verification
2. Upload software to Supabase Storage
3. Create products and prices in Paddle
4. Configure webhook
5. Test with sandbox mode
6. Update buy button with Paddle checkout

**After Launch:**
1. Monitor purchases and errors
2. Collect user feedback
3. Optimize email delivery
4. Scale storage as needed
5. Add analytics tracking

---

**Questions? Check the code comments or contact support!** 🚀
