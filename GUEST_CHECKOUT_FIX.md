# 🚨 Guest Checkout Fix & Manual Processing Guide

## 🎯 What Happened

**The Issue:**
When customers checkout **without logging in** (guest checkout), the webhook handler was blocking license generation because it expected a logged-in user account.

**Result:**
- ✅ Payment processed successfully in Paddle
- ✅ Purchase record created in database
- ❌ No license keys generated
- ❌ No email sent to customer
- ❌ No Discord notification

**Affected:**
- Any purchase made via guest checkout (email only, no account)
- Recent purchases before the fix

---

## ✅ The Fix (Applied)

**Fixed Files:**
1. `src/lib/license.ts` - Now accepts `userId: string | null`
2. `src/app/api/webhooks/paddle/route.ts` - Removed blocking check

**Changes:**
```typescript
// BEFORE (Broken):
if (!user?.id) {
  console.error('⚠️ No user found - skipping!')
  continue  // ❌ This blocked everything
}

// AFTER (Fixed):
if (!user?.id) {
  console.log('ℹ️ Guest checkout - proceeding with null userId')
}
// ✅ Continues to generate licenses and send email
```

---

## 🔧 How to Process Your Existing Purchase

Your payment went through but you didn't receive the license. Here's how to fix it:

### Option 1: Deploy Fix & Resend Webhook (Easiest)

**Step 1: Deploy the fix**
```bash
# Push updated code to production
git add -A
git commit -m "fix: allow guest checkout purchases"
git push origin master
```

**Step 2: In Paddle Dashboard**
```
1. Go to: Developer tools > Events
2. Find: Your transaction (search by email or amount)
3. Click: The transaction.completed event
4. Click: "Replay webhook" button
5. Confirm: Webhook will fire again to your endpoint
6. Result: ✅ Licenses generated, email sent
```

### Option 2: Manual Processing Script (Recommended)

**Step 1: Find your purchase ID**
```
Option A: In Supabase dashboard (easier)
1. Go to: https://supabase.com/dashboard
2. Open: Your project > Table Editor > purchases table
3. Find: Row with your email
4. Copy: The "id" column (UUID like: abc-123-def-456)

Option B: Query in Supabase SQL Editor
SELECT id, customer_email, amount, currency, status, created_at 
FROM purchases 
WHERE customer_email = 'your-email@example.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Step 2: Update the script**
```typescript
// Open: scripts/process-purchase.ts
// Line 17: Update PURCHASE_ID
const PURCHASE_ID = 'abc-123-def-456'  // Paste your UUID here
```

**Step 3: Run the script**
```bash
# From project root
npx tsx scripts/process-purchase.ts
```

**Expected Output:**
```
🔍 Looking up purchase: abc-123-def-456
✅ Purchase found: {customer: your-email@example.com}
ℹ️  Guest purchase - no user account
🎫 Generating license keys...
✅ Generated 1 license keys:
   1. SOLO-AB12-CD34-EF56-GH78
🔄 Syncing licenses to product database...
✅ Licenses synced
📧 Sending confirmation email...
✅ Email sent to: your-email@example.com
📢 Sending Discord notification...
✅ Discord notification sent
🎉 Purchase processed successfully!
```

**Step 4: Check your email**
```
Subject: Your DeskSweep Purchase - License Key Inside
Content: License key + download link
```

### Option 3: Manual License Generation (Advanced)

If the script doesn't work, manually generate via Supabase:

**Step 1: Generate a license key**
```typescript
// Format: SOLO-XXXX-XXXX-XXXX-XXXX
// Use: https://www.random.org/strings/
// Or: SOLO-TEST-TEST-TEST-TEST (for testing)
```

**Step 2: Insert into licenses table**
```sql
INSERT INTO licenses (
  purchase_id,
  product_id,
  user_id,
  license_key,
  license_type,
  is_active,
  max_activations
) VALUES (
  'YOUR_PURCHASE_ID',
  'YOUR_PRODUCT_ID',
  NULL,  -- Guest checkout
  'SOLO-AB12-CD34-EF56-GH78',
  'standard',
  true,
  1
);
```

**Step 3: Sync to product database (optional)**
```sql
-- In your DeskSweep product database
INSERT INTO license_keys (
  license_key,
  product_name,
  plan_type,
  devices_allowed,
  is_active,
  status
) VALUES (
  'SOLO-AB12-CD34-EF56-GH78',
  'DeskSweep',
  'solo',
  1,
  true,
  'active'
);
```

**Step 4: Send email manually**
```
To: your-email@example.com
Subject: Your DeskSweep Purchase - License Key

Hi there!

Thank you for purchasing DeskSweep! Here's your license key:

License Key: SOLO-AB12-CD34-EF56-GH78

Download: https://appsto.software/products/desksweep

Installation:
1. Download DeskSweep from the link above
2. Install the application
3. Open DeskSweep
4. Click "Enter License Key"
5. Paste: SOLO-AB12-CD34-EF56-GH78
6. Click "Activate"

If you need any help, reply to this email.

Best regards,
Appsto Team
```

---

## 🔍 How to Check if Issue is Fixed

### Check 1: Webhook Logs (Digital Ocean)

```bash
# In Digital Ocean App Platform
1. Go to: Your app > Runtime Logs
2. Filter: "/api/webhooks/paddle"
3. Look for recent webhook calls
4. Check: Should see "transaction.completed" processed

Expected logs:
🎯 Processing transaction.completed event
ℹ️  Guest checkout detected - no user account
✅ Generated 1 licenses
✅ Purchase confirmation email sent
✅ Discord notification sent
```

### Check 2: Database Tables

**Purchases table:**
```sql
SELECT 
  id,
  customer_email,
  amount,
  status,
  created_at
FROM purchases 
WHERE customer_email = 'your-email@example.com'
ORDER BY created_at DESC;

-- Should show: status = 'completed'
```

**Licenses table:**
```sql
SELECT 
  license_key,
  is_active,
  created_at
FROM licenses
WHERE purchase_id = 'YOUR_PURCHASE_ID';

-- Should show: 1 or more license keys
-- If empty = licenses not generated
```

### Check 3: Email Inbox

```
✅ Check: Inbox for "Your DeskSweep Purchase"
✅ Check: Spam/Junk folder
✅ From: support@appsto.software
✅ Contains: License key (SOLO-XXXX-XXXX-...)
✅ Contains: Download link
```

### Check 4: Discord Channel

```
✅ Check: Your Discord channel
✅ Should see: Purchase notification with:
   - Customer email
   - Product name & plan
   - Amount & currency
   - Number of licenses
```

---

## 🧪 Test the Fix (Before More Customers)

**Make another $2 test purchase as GUEST:**

```bash
1. Visit: https://appsto.software/products/desksweep
2. Click: "Buy Solo Plan"
3. Apply: TEST78 discount code (if created)
4. At checkout: Use DIFFERENT email (not logged in)
5. Email: test-guest@example.com (no account)
6. Pay: $2 with card 4242 4242 4242 4242
7. Complete purchase

Expected results within 30 seconds:
✅ Email arrives to test-guest@example.com
✅ Discord notification appears
✅ Database: Purchase + licenses created
✅ Logs: "Guest checkout detected - proceeding"
```

---

## 🚨 Preventing Future Issues

### 1. Monitor First Few Sales

```bash
# For first 10 sales after going live:
- Watch Digital Ocean logs in real-time
- Check email arrives within 1 minute
- Verify Discord notifications
- Confirm licenses in database
```

### 2. Set Up Alerts

```bash
# Sentry: Alert on webhook failures
- Error: "License generation failed"
- Error: "Email sending failed"
- Error: "Webhook signature invalid"

# UptimeRobot: Monitor webhook endpoint
- URL: https://appsto.software/api/webhooks/paddle
- Check: Every 5 minutes
- Alert: If returns 500 error
```

### 3. Test Both Scenarios

**Logged-in purchase:**
```
1. Create account on website
2. Log in
3. Make purchase
4. Verify: Licenses tied to user account
```

**Guest purchase:**
```
1. Don't log in (or use incognito)
2. Enter email at checkout
3. Make purchase
4. Verify: Licenses created with null user_id
```

---

## 📊 Database Schema Verification

**Confirm your database allows null user_id:**

```sql
-- Check licenses table schema
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'licenses'
AND column_name = 'user_id';

-- Should show: is_nullable = 'YES'
```

**If user_id is NOT nullable, run migration:**

```sql
ALTER TABLE licenses 
ALTER COLUMN user_id DROP NOT NULL;
```

---

## ✅ Quick Checklist

**Before going live:**

- [ ] Code fix deployed to production
- [ ] Webhook destination configured in Paddle
- [ ] Events subscribed: transaction.completed, transaction.refunded
- [ ] Process existing failed purchase (your current one)
- [ ] Test guest checkout ($2 test)
- [ ] Test logged-in checkout ($2 test)
- [ ] Verify emails arriving (check spam folder)
- [ ] Verify Discord notifications work
- [ ] Check database: licenses created for both tests
- [ ] Refund test purchases

---

## 🆘 Still Not Working?

### Debug Checklist:

1. **Check webhook is reaching your server:**
   ```bash
   # In Paddle Dashboard:
   Developer tools > Notifications > Your destination > Recent deliveries
   - Status should be: 200 OK (not 401/500)
   ```

2. **Check webhook signature:**
   ```bash
   # In .env file:
   PADDLE_WEBHOOK_SECRET=ntfset_01khbfq0c6hp8s2ty8m1wtv11b
   
   # Should match Paddle dashboard secret
   ```

3. **Check email configuration:**
   ```bash
   # In .env file:
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=helpappsto@gmail.com
   SMTP_PASSWORD=oulq cwis ftkl ceob
   EMAIL_FROM=support@appsto.software
   
   # Test: npm run test:email (if you have test script)
   ```

4. **Check Discord webhook:**
   ```bash
   # In .env file:
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   
   # Test manually: curl to webhook URL
   ```

5. **Check database connection:**
   ```bash
   # In .env file:
   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   
   # Verify: Can query purchases table from Supabase dashboard
   ```

---

## 📞 Need Help?

**Logs to share when asking for help:**

```bash
1. Digital Ocean runtime logs (last 50 lines)
2. Paddle webhook delivery status (from dashboard)
3. Purchase ID from database
4. Transaction ID from Paddle
5. Error messages (screenshot)
```

**Files to check:**
- [webhook handler](src/app/api/webhooks/paddle/route.ts)
- [license generation](src/lib/license.ts)
- [email sending](src/lib/purchase-email.ts)
- [Discord notification](src/lib/discord.ts)

---

**Last updated**: February 20, 2026  
**Issue**: Guest checkout blocking  
**Status**: ✅ Fixed  
**Action required**: Process existing purchase + test
