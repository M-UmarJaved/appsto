# 🧪 Testing & Refund Guide for Appsto

## 📊 How to Change Prices for Testing

### Option 1: Paddle Dashboard (Recommended)

**To test with $2 instead of $9 for Pakistan:**

1. **Go to Paddle Dashboard**: https://vendors.paddle.com/
2. **Navigate**: Catalog > Products > DeskSweep Solo
3. **Find PKR price**: Click on the Pakistan price
4. **Edit**: Change from PKR 2,565 (≈$9) to PKR 570 (≈$2)
5. **Save**: Click Update
6. **Wait**: Prices update in ~5 minutes

**After testing, restore to production:**
- Change back: PKR 570 → PKR 2,565
- Or create a NEW price ID with correct amount

### Option 2: Create TEST Discount Code

**Better approach - keeps real prices intact:**

1. **Go to**: Catalog > Discounts
2. **Create discount**:
   - Code: `TEST78` (78% off = $9 becomes ~$2)
   - Type: Percentage
   - Amount: 78%
   - Products: DeskSweep Solo only
   - Valid: Today only
   - Max uses: 5
3. **At checkout**: Apply `TEST78` code
4. **Pay**: Only $2 instead of $9
5. **After testing**: Delete or disable the code

**✅ This is better because:**
- Real prices remain unchanged
- Easy to delete test discount
- Can track test vs real purchases

---

## 🛒 Complete Purchase Flow (As Customer)

### Step 1: Customer Visits Website
```
https://appsto.software
```

### Step 2: Browse Products
```
Click: Products > DeskSweep
View: Features, pricing, screenshots
```

### Step 3: Choose Plan
```
Options:
- Solo Plan: $9 (1 device)
- Squad Plan: $17 (2 devices)  
- Studio Plan: $39 (5 devices)

Click: "Buy Now" button
```

### Step 4: Paddle Checkout Opens
```
Overlay checkout appears with:
✅ Product name + price
✅ Email field (required)
✅ Payment method (Card/PayPal/Apple Pay)
✅ Country selection (auto-detects for tax)
✅ Discount code field (optional)
```

### Step 5: Customer Enters Details
```
Email: customer@example.com
Card: 4242 4242 4242 4242 (test card)
Expiry: 12/28
CVC: 123
Name: Test Customer
```

### Step 6: Customer Completes Payment
```
Click: "Pay $9" button
Processing: 2-5 seconds
Success: Checkout closes automatically
```

### Step 7: Backend Processing (Automatic)
```
🎯 Paddle webhook fires → /api/webhooks/paddle
✅ Creates purchase record in database
✅ Generates 1 license key (e.g., SOLO-AB12-CD34-EF56-GH78)
✅ Sends confirmation email to customer@example.com
✅ Sends Discord notification to you
```

### Step 8: Customer Receives Email
```
Subject: Your DeskSweep Purchase - License Key Inside

Content:
- Thank you message
- License key: SOLO-AB12-CD34-EF56-GH78
- Download link: https://appsto.software/products/desksweep
- Installation instructions
- Activation steps
```

### Step 9: Customer Downloads Software
```
Click: Download link in email
Or: Visit https://appsto.software/products/desksweep
Download: DeskSweep.exe (~25MB)
Install: Run installer
```

### Step 10: Customer Activates License
```
Open: DeskSweep app
Click: "Enter License Key"
Paste: SOLO-AB12-CD34-EF56-GH78
Click: "Activate"
Result: ✅ Software activated and ready to use!
```

---

## 💸 Customer Refund Request Process

### How Customers Can Request Refund

#### Method 1: Direct Email (Primary)
```
Customer sends email to: support@appsto.software

Subject: Refund Request for Order #12345

Body:
"Hi,
I purchased DeskSweep on [date] but [reason].
Please process a refund.

Order details:
- Email: customer@example.com
- Date: Feb 20, 2026
- Amount: $9
- Product: DeskSweep Solo

Thank you!"
```

#### Method 2: Support Page
```
Visit: https://appsto.software/support
Fill form:
- Name
- Email (used for purchase)
- Subject: "Refund Request"
- Message: Order details + reason

Submit → You receive email notification
```

#### Method 3: Reply to Purchase Email
```
Customer replies to: "Your DeskSweep Purchase" email
Clicks: Reply
Types: "I would like a refund because..."
Sends → Goes to support@appsto.software
```

---

## 🏢 Company Refund Processing (Your Side)

### Step 1: Receive Refund Request

**Email arrives at**: `support@appsto.software`

```
From: customer@example.com
Subject: Refund Request
Content: [customer's message]
```

### Step 2: Verify Purchase

**Check in Paddle Dashboard:**

1. **Go to**: Transactions
2. **Search**: customer@example.com
3. **Find**: Their transaction (txn_01abc123...)
4. **Verify**:
   - ✅ Date matches
   - ✅ Amount matches
   - ✅ Status: completed
   - ✅ Within refund policy (30 days)

### Step 3: Decide on Refund

**Check your refund policy:**
- ✅ Within 30 days? → Full refund
- ✅ Valid reason? → Approve
- ❌ After 30 days? → Partial or deny (your policy)
- ❌ Abuse detected? → Deny

### Step 4: Process Refund in Paddle

**Full refund:**

1. **Go to**: Paddle Dashboard > Transactions
2. **Find**: Transaction ID (txn_01abc123...)
3. **Click**: Transaction row
4. **Click**: "Refund" button (top right)
5. **Select**: Full refund OR Partial refund
6. **Amount**: $9.00 (or partial)
7. **Reason**: Select from dropdown
   - Customer request
   - Product issue
   - Accidental purchase
   - Other
8. **Internal note**: "Customer couldn't activate license" (optional)
9. **Click**: "Process Refund"
10. **Confirm**: "Yes, refund $9.00"

**Processing time:**
- Credit card: 5-10 business days
- PayPal: 1-3 business days

### Step 5: Automatic Backend Processing

**What happens automatically when you click "Process Refund":**

```
🎯 Paddle sends webhook → /api/webhooks/paddle
Event: transaction.refunded

Backend automatically:
1. ✅ Updates purchase status to "refunded" in database
2. ✅ Sets refunded_at timestamp
3. ✅ Deactivates license key (is_active = false)
4. ✅ Revokes license in DeskSweep product database
5. ✅ Adds deactivation_reason = "refund"
6. ❌ Customer can no longer use the license key
```

**Database changes:**
```sql
-- Purchases table
UPDATE purchases 
SET status = 'refunded', 
    refunded_at = NOW()
WHERE paddle_transaction_id = 'txn_01abc123...'

-- Licenses table  
UPDATE licenses
SET is_active = false,
    deactivated_at = NOW(),
    deactivation_reason = 'refund'
WHERE purchase_id = '...'

-- Product DB (DeskSweep)
UPDATE license_keys
SET is_active = false,
    status = 'revoked'
WHERE license_key = 'SOLO-AB12-...'
```

### Step 6: Notify Customer

**Send email confirmation:**

```
Template: support_email_template.html

Subject: Refund Processed - Order #12345

Body:
Hi [Customer Name],

Your refund has been processed successfully.

Refund Details:
- Amount: $9.00 USD
- Transaction ID: txn_01abc123...
- Processing time: 5-10 business days

Your license key has been deactivated and can no longer be used.

If you need any further assistance, feel free to reach out!

Best regards,
Appsto Support Team
support@appsto.software
```

**Manual email from Gmail:**
- To: customer@example.com
- Subject: "Your refund has been processed"
- Body: Friendly message confirming refund

---

## 🧪 Testing Refund Flow

### Complete Test Scenario

**1. Make Test Purchase:**
```
1. Visit: https://appsto.software/products/desksweep
2. Apply: TEST78 discount code (if created)
3. Pay: $2 with test card
4. Receive: Email with license key
5. Verify: License appears in database
```

**2. Test License Activation:**
```
1. Download: DeskSweep app
2. Open: Application
3. Enter: License key from email
4. Click: Activate
5. Verify: ✅ Activation successful
```

**3. Request Refund (As Customer):**
```
1. Send email to: support@appsto.gmail.com
2. Subject: "Test Refund Request"
3. Body: "Please refund my test purchase - Order email: [your email]"
```

**4. Process Refund (As Company):**
```
1. Open: Paddle Dashboard
2. Go to: Transactions
3. Find: Your test transaction
4. Click: Refund button
5. Select: Full refund - $2.00
6. Reason: "Test transaction"
7. Confirm: Process refund
8. Verify: Webhook logs show refund event
```

**5. Verify Automatic Processing:**
```
1. Check: Database - purchase status = "refunded"
2. Check: Database - license is_active = false
3. Check: Console logs - refund handler executed
4. Try: Activate license again in app
5. Expected: ❌ Activation fails (license revoked)
```

**6. Test Re-activation (Should Fail):**
```
1. Open: DeskSweep app
2. Enter: Same license key
3. Click: Activate
4. Expected: "This license has been deactivated" error
5. Result: ✅ Refund system working correctly
```

---

## 📊 Refund Tracking & Analytics

### View Refunds in Paddle Dashboard

**Go to**: Reports > Transactions

**Filter**:
- Status: Refunded
- Date range: Last 30 days

**Metrics to track**:
- Refund rate: (Refunds / Total purchases) × 100
- Target: < 5% (industry standard)
- Common reasons: Track in spreadsheet

### View Refunds in Your Database

**Query all refunds:**
```sql
SELECT 
  p.id,
  p.customer_email,
  p.amount,
  p.purchased_at,
  p.refunded_at,
  pr.plan_name,
  COUNT(l.id) as licenses_count
FROM purchases p
JOIN pricing_plans pr ON p.pricing_plan_id = pr.id
LEFT JOIN licenses l ON l.purchase_id = p.id
WHERE p.status = 'refunded'
ORDER BY p.refunded_at DESC;
```

**Query refund statistics:**
```sql
SELECT 
  DATE_TRUNC('month', refunded_at) as month,
  COUNT(*) as refund_count,
  SUM(amount) as refund_amount,
  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM purchases WHERE status = 'completed')) as refund_rate
FROM purchases
WHERE status = 'refunded'
GROUP BY month
ORDER BY month DESC;
```

---

## 🚨 Important Notes

### Refund Policy (Your 30-Day Guarantee)

**From your Refund Policy page:**
```
✅ Full refund within 30 days
✅ No questions asked
✅ License automatically revoked
✅ Money back in 5-10 business days
```

### What Happens After Refund

**Customer side:**
- ✅ Money returned to original payment method
- ❌ License key deactivated immediately
- ❌ Cannot activate on new devices
- ❌ Existing activation stops working (if online check)

**Your side:**
- ✅ Purchase marked as refunded in database
- ✅ Analytics exclude refunded purchases
- ✅ License revoked in main + product databases
- ✅ Paddle fee NOT refunded (you lose ~5% + $0.50)

### Preventing Abuse

**Red flags to watch:**
1. Same customer requesting multiple refunds
2. Refund request after 29 days (pattern)
3. Multiple purchases from same IP → refunds
4. Using stolen credit cards (chargebacks)

**Protection measures:**
1. Track refund rate per customer email
2. Block repeat abusers from future purchases
3. Require proof of issue for second refund
4. Use Paddle's fraud detection

---

## 💡 Pro Tips

### For Testing:
- ✅ **Use discount codes** instead of changing prices
- ✅ **Test $2 purchase** first to save money
- ✅ **Keep test purchases** separate (mark in database)
- ✅ **Refund test purchases** after verification
- ✅ **Document test results** for future reference

### For Production:
- ✅ **Respond to refund requests within 24h**
- ✅ **Be generous** - reputation > $9
- ✅ **Ask for feedback** - why the refund?
- ✅ **Track reasons** - improve product
- ✅ **Automate emails** - customer satisfaction

### For Customer Service:
- ✅ **Apologize first** - even if not your fault
- ✅ **Process fast** - within 1 business day
- ✅ **Offer alternatives** - different plan? support?
- ✅ **Stay professional** - angry customers happen
- ✅ **Learn from feedback** - every refund is a lesson

---

## 📧 Email Templates

### Refund Approved Template
```
Subject: Refund Approved - Order #{{order_id}}

Hi {{customer_name}},

I've processed your refund request for DeskSweep.

Refund Details:
• Amount: ${{amount}} {{currency}}
• Transaction ID: {{transaction_id}}
• Refund date: {{refund_date}}
• Processing time: 5-10 business days

Your license key has been deactivated.

I'm sorry DeskSweep didn't meet your expectations. If you'd like to share what went wrong, I'd love to hear your feedback to improve our product.

Thank you for giving us a try!

Best regards,
{{your_name}}
Appsto Support
support@appsto.software
```

### Refund Denied Template (Rare)
```
Subject: Refund Request - Order #{{order_id}}

Hi {{customer_name}},

Thank you for reaching out about your refund request.

Unfortunately, your purchase on {{purchase_date}} falls outside our 30-day refund window (current date: {{current_date}}).

However, I'd still like to help! Can you share what issue you're experiencing? I may be able to:
• Provide technical support to fix the issue
• Offer a discount on a future purchase
• Reset your license for a different device

Please let me know how I can help make this right!

Best regards,
{{your_name}}
Appsto Support
support@appsto.software
```

---

**Ready to test!** Start with a $2 purchase using a discount code, verify everything works, then process a refund. 🚀
