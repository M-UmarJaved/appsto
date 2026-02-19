# 🚀 Paddle Go-Live Checklist

## ✅ Code Integration Status

| Task | Status | Notes |
|------|--------|-------|
| Update base URLs to production | ✅ Done | Using `api.paddle.com` |
| Swap API keys | ✅ Done | `pdl_live_apikey_01khbg8bt2ec746zb20yvkkx1j...` |
| Update client-side token | ✅ Done | `live_d7847f9aa083b449ac00ca5849f` |
| Pass pwCustomer for Retain | ✅ Fixed | Now passes `user?.email` |
| Remove sandbox environment | ✅ Done | Conditionally set based on env var |
| Swap price IDs | ✅ Done | Production IDs: `pri_01khb...` |
| Webhook signature verification | ✅ Done | Full crypto validation implemented |
| Webhook secret configured | ✅ Done | `ntfset_01khbfq0c6hp8s2ty8m1wtv11b` |

---

## 📋 Paddle Dashboard Configuration Checklist

**Complete these steps in your Paddle dashboard at https://vendors.paddle.com/**

### 1️⃣ Initial Configuration (10 minutes)

- [ ] **Set default payment link**
  - Go to: **Paddle > Checkout > Checkout settings**
  - Expand: **Default payment link**
  - Add: `https://appsto.software/products/desksweep` (or your checkout page)
  - ⚠️ Must pass domain verification first

- [ ] **Configure payment methods**
  - Go to: **Paddle > Checkout > Checkout settings**
  - Expand: **Payment methods**
  - Check: ✅ Card (always on), ✅ PayPal, ✅ Apple Pay, ✅ Google Pay
  - Note: Bank transfer is always on for invoices

- [ ] **Set sales tax settings**
  - Go to: **Paddle > Checkout > Sales tax settings**
  - Choose: **Prices are tax exclusive** (recommended for B2B/US)
  - Or: **Prices are tax inclusive** (if selling to consumers with VAT)

- [ ] **Set balance currency**
  - Go to: **Paddle > Business account > Currencies**
  - Choose: **USD** (or your preferred payout currency)
  - ⚠️ Should match your bank account currency

- [ ] **Configure Paddle Retain (dunning)**
  - Go to: **Paddle > Retain**
  - Enable: **Automatic payment retries**
  - Configure: Retry schedule (default is fine)
  - Enable: **Email reminders** for failed payments

- [ ] **Add payout details**
  - Go to: **Paddle > Business account > Payouts > Payout settings**
  - Add: Bank account details OR PayPal OR Payoneer
  - Set: Minimum payout threshold (default: $500)

---

### 2️⃣ Product Catalog (15 minutes)

- [ ] **Verify products exist in LIVE** (not just sandbox)
  - Go to: **Paddle > Catalog > Products**
  - Confirm these products exist with LIVE price IDs:
    - ✅ **DeskSweep Solo** - Price ID: `pri_01khb858xxexa8chhc45gvdvwk`
    - ✅ **DeskSweep Squad** - Price ID: `pri_01khb8e6ez5hm3afq5y39ksx4c`
    - ✅ **DeskSweep Studio** - Price ID: `pri_01khb8rm4c5rs6vxw4byzyhhnw`
  - If missing: Recreate them in LIVE (don't copy test products!)

- [ ] **Request taxable category approval** (if needed)
  - Go to: **Paddle > Catalog > Taxable categories**
  - Default: **Standard Digital Goods** (already approved)
  - If needed: Request **Software as a Service (SaaS)** or others

- [ ] **Create discounts** (optional)
  - Go to: **Paddle > Catalog > Discounts**
  - Create launch discount: e.g., `LAUNCH25` for 25% off
  - Set expiry date if time-limited

---

### 3️⃣ Webhooks & Notifications (10 minutes)

- [ ] **Create notification destination**
  - Go to: **Paddle > Developer tools > Notifications**
  - Click: **Create notification destination**
  - URL: `https://appsto.software/api/webhooks/paddle`
  - Description: `Production webhook endpoint`
  - Events: Select:
    - ✅ `transaction.completed`
    - ✅ `transaction.updated`
    - ✅ `subscription.created` (if using subscriptions)
    - ✅ `subscription.updated`
    - ✅ `subscription.canceled`
  - Click: **Save**
  - Copy: **Webhook signing secret** (should match `ntfset_01khbfq0c6hp8s2ty8m1wtv11b`)

- [ ] **Test webhook delivery** (IMPORTANT!)
  - Make a $1 test purchase on your live site
  - Check: Paddle dashboard > Developer tools > Events
  - Confirm: `transaction.completed` event sent to your webhook
  - Check: Your database for purchase record
  - Check: Email received with license key

- [ ] **Optional: Allowlist Paddle IPs** (for security)
  - Production IPs: `34.194.127.46`, `54.234.237.108`
  - Add to: Your firewall/WAF rules on Digital Ocean
  - Reject: All webhook requests from other IPs

---

### 4️⃣ Domain & Checkout Settings (5 minutes)

- [ ] **Verify domain ownership**
  - Go to: **Paddle > Checkout > Checkout settings**
  - Section: **Domain verification**
  - Add: `appsto.software`
  - Follow: DNS verification steps (add TXT record)
  - Wait: Up to 48 hours for verification

- [ ] **Configure checkout branding** (optional)
  - Go to: **Paddle > Checkout > Checkout settings**
  - Upload: Logo (recommended: 200x200px PNG)
  - Set: Brand color (hex code)
  - Preview: How checkout will look

---

### 5️⃣ Post-Launch Monitoring (5 minutes)

- [ ] **Subscribe to Paddle developer changelog**
  - Visit: https://developer.paddle.com/changelog
  - Sign up: Email notifications for API changes
  - Frequency: Weekly or monthly

- [ ] **Subscribe to Paddle status page**
  - Visit: https://status.paddle.com/
  - Subscribe: Email, Slack, or webhook
  - Get: Real-time incident notifications

- [ ] **Set up API key rotation schedule** (security best practice)
  - Frequency: Rotate every 90 days
  - Process: Create new key → swap → revoke old key
  - Calendar: Set reminder for May 20, 2026

---

## 🧪 Final Testing Checklist

**Before accepting real customer payments, test everything:**

- [ ] **Make a test purchase**
  - Product: DeskSweep Solo ($9)
  - Payment: Use real credit card (you'll get refunded)
  - Confirm: Checkout opens, payment processes
  - Verify: Purchase record in database
  - Check: License key generated
  - Test: Email received with license + download link

- [ ] **Test license activation**
  - Copy: License key from email
  - Open: DeskSweep app
  - Activate: Enter license key
  - Confirm: Activation successful

- [ ] **Process refund**
  - Go to: Paddle dashboard > Transactions
  - Find: Your test purchase
  - Click: **Refund**
  - Confirm: Refund processes correctly
  - Check: Email notification sent

- [ ] **Test different pricing tiers**
  - Purchase: Squad plan
  - Verify: 2 license keys generated
  - Purchase: Studio plan
  - Verify: 5 license keys generated

- [ ] **Test discount codes** (if created)
  - Apply: `LAUNCH25` code at checkout
  - Confirm: Price reduced correctly

---

## 🚨 Important Notes

### Security Checklist:
✅ Webhook signature verification enabled  
✅ Production API keys in environment variables  
✅ Secrets not committed to git  
⚠️ Consider IP allowlisting for webhooks  
⚠️ Set up rate limiting if expecting high traffic  

### Compliance Checklist:
✅ Privacy policy mentions Paddle  
✅ Terms of service includes refund policy  
✅ Tax handling configured correctly  
⚠️ GDPR compliance if selling to EU  
⚠️ Sales tax registration if required in your jurisdiction  

### Monitoring Checklist:
✅ Google Analytics tracking purchases  
✅ Sentry monitoring errors  
✅ UptimeRobot checking site availability  
⚠️ Set up Paddle revenue alerts  
⚠️ Monitor failed payment rates in Retain  

---

## 📊 Expected Results After Go-Live

### Immediate (within 5 minutes):
- ✅ Customers can complete purchases
- ✅ Webhooks fire to your endpoint
- ✅ License keys generated automatically
- ✅ Confirmation emails sent

### Within 24 hours:
- ✅ Payouts visible in Paddle dashboard
- ✅ Analytics showing conversions
- ✅ Tax calculations working correctly

### Within 30 days:
- ✅ First payout initiated (if > minimum threshold)
- ✅ Retain handling any failed payments
- ✅ Customer data syncing properly

---

## 🆘 Troubleshooting

### "Checkout not opening"
- Check: Client-side token is correct in env vars
- Check: Browser console for errors
- Check: `NEXT_PUBLIC_PADDLE_ENVIRONMENT=production`

### "Webhook not firing"
- Check: Notification destination created in Paddle dashboard
- Check: URL is `https://appsto.software/api/webhooks/paddle`
- Check: Webhook secret matches `ntfset_01khbfq0c6hp8s2ty8m1wtv11b`
- Test: Send test event from Paddle dashboard

### "License not generated"
- Check: Webhook received and verified
- Check: Database connection working
- Check: User lookup by email successful
- Check: Email SMTP credentials valid

### "Wrong prices showing"
- Check: Price IDs in code match Paddle dashboard
- Check: Products created in LIVE (not sandbox)
- Verify: Currency set correctly

---

## ✅ Final Sign-Off

Once you've completed ALL the checkboxes above:

1. ✅ Make one final test purchase
2. ✅ Verify end-to-end flow works
3. ✅ Process refund successfully
4. ✅ Check all monitoring tools active

**YOU'RE LIVE! 🎉**

Start promoting your product and accepting real payments!

---

**Last updated**: February 20, 2026  
**Next review**: May 20, 2026 (API key rotation)  
**Owner**: Appsto Development Team
