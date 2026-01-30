# Testing Guide - appsto.software

Complete testing procedures for your SaaS marketplace.

## 🧪 Testing Overview

### Test Levels
1. **Unit Tests** - Individual functions
2. **Integration Tests** - API endpoints and webhooks
3. **E2E Tests** - Complete purchase flow
4. **Manual Tests** - UI/UX verification

## 🔧 Setup for Testing

### 1. Use Sandbox/Test Mode

Update `.env`:
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

### 2. Create Test Products

In Paddle sandbox:
- Create test products
- Generate 100% discount coupons
- Note product IDs

In Supabase:
- Insert test products matching Paddle IDs

## ✅ Manual Testing Checklist

### Homepage Testing
- [ ] Page loads without errors
- [ ] All animations work smoothly
- [ ] Navigation links functional
- [ ] Responsive on mobile/tablet
- [ ] Hero section displays correctly
- [ ] Feature cards animate on scroll
- [ ] CTA buttons lead to correct pages

### Products Page Testing
- [ ] Products load from database
- [ ] Filter tabs work (All, One-Time, Subscription)
- [ ] Product cards display correctly
- [ ] Hover animations work
- [ ] Click on product navigates to detail page
- [ ] Loading state shows when fetching

### Product Detail Page Testing
- [ ] Product details display correctly
- [ ] Price shows properly formatted
- [ ] Features list renders
- [ ] System requirements visible
- [ ] Buy button triggers Paddle checkout
- [ ] Product type badge correct
- [ ] Back button works

### Purchase Flow Testing (CRITICAL)

#### Test Case 1: One-Time Purchase - Success
**Steps:**
1. Navigate to a one-time purchase product
2. Click "Buy Now"
3. Complete Paddle checkout (use test card or 100% coupon)
4. Wait for redirect to success page

**Expected Results:**
- ✅ Paddle checkout opens
- ✅ Payment processes successfully
- ✅ Redirected to /purchase/success
- ✅ Success message displays
- ✅ Email received within 2 minutes
- ✅ Email contains license token (format: APPSTO-XXXX-XXXX-XXXX)
- ✅ Email contains download link
- ✅ Email contains setup instructions

**Verify in Database:**
```sql
-- Check purchase record
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 1;

-- Check license generated
SELECT * FROM licenses ORDER BY created_at DESC LIMIT 1;

-- Verify token format
SELECT token FROM licenses WHERE user_email = 'test@example.com';
```

#### Test Case 2: Subscription Purchase
**Steps:**
1. Navigate to subscription product
2. Click "Subscribe Now"
3. Complete checkout

**Expected Results:**
- ✅ Checkout completes
- ✅ Purchase recorded
- ❌ NO license token generated (correct behavior)
- ✅ Confirmation email sent (without token)

#### Test Case 3: License Activation

**Prerequisites:** 
- Have a valid license token from Test Case 1

**Test with API:**
```bash
# Activate license
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "APPSTO-XXXX-XXXX-XXXX",
    "deviceInfo": {
      "os": "Windows 10",
      "hostname": "TEST-PC",
      "macAddress": "00:11:22:33:44:55"
    }
  }'
```

**Expected Response:**
```json
{
  "valid": true,
  "activated": true,
  "product": {
    "id": "uuid...",
    "name": "Product Name"
  },
  "activatedAt": "2024-01-15T10:30:00Z",
  "message": "License activated successfully"
}
```

**Verify in Database:**
```sql
SELECT is_used, activated_at, device_info 
FROM licenses 
WHERE token = 'APPSTO-XXXX-XXXX-XXXX';
-- Should show is_used = true
```

#### Test Case 4: Duplicate Activation (Should Fail)

```bash
# Try to activate same token again
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "APPSTO-XXXX-XXXX-XXXX",
    "deviceInfo": {}
  }'
```

**Expected Response:**
```json
{
  "error": "License already activated",
  "valid": false,
  "activatedAt": "2024-01-15T10:30:00Z"
}
```

### Webhook Testing

#### Test Paddle Webhook Locally

**Using ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose local server
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Add webhook in Paddle: https://abc123.ngrok.io/api/webhooks/paddle
```

**Test Webhook:**
1. Make a test purchase in Paddle sandbox
2. Watch server logs for webhook event
3. Verify license generated

**Expected Logs:**
```
Paddle webhook received: transaction.completed
License generated and email sent for [Product] to test@example.com
```

#### Test Webhook Signature Verification

In production, this MUST work:
```typescript
// src/app/api/webhooks/paddle/route.ts
if (process.env.NODE_ENV === 'production') {
  if (!verifyPaddleWebhook(signature, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
}
```

### Email Testing

#### Test Email Configuration

Create test script (`scripts/test-email.ts`):
```typescript
import { sendTestEmail } from '@/lib/email'

async function test() {
  try {
    await sendTestEmail('your-email@example.com')
    console.log('✅ Test email sent successfully')
  } catch (error) {
    console.error('❌ Email failed:', error)
  }
}

test()
```

Run:
```bash
npx ts-node scripts/test-email.ts
```

#### Verify Email Deliverability

Checklist:
- [ ] Email arrives in inbox (not spam)
- [ ] Professional appearance
- [ ] All links work
- [ ] License token visible
- [ ] Download button functional
- [ ] Formatting correct on mobile
- [ ] Images load (if any)

### Support Page Testing
- [ ] FAQ displays correctly
- [ ] Contact email link works
- [ ] Responsive layout
- [ ] Navigation functional

## 🤖 Automated Tests (Optional)

### Unit Tests

Create `__tests__/crypto.test.ts`:
```typescript
import { generateLicenseToken } from '@/lib/crypto'

describe('License Token Generation', () => {
  it('should generate token in correct format', () => {
    const token = generateLicenseToken()
    expect(token).toMatch(/^APPSTO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  })

  it('should generate unique tokens', () => {
    const token1 = generateLicenseToken()
    const token2 = generateLicenseToken()
    expect(token1).not.toBe(token2)
  })
})
```

### API Tests

Create `__tests__/api/license.test.ts`:
```typescript
import { POST } from '@/app/api/license/activate/route'
import { NextRequest } from 'next/server'

describe('License Activation API', () => {
  it('should reject missing token', async () => {
    const req = new NextRequest('http://localhost/api/license/activate', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    
    const response = await POST(req)
    expect(response.status).toBe(400)
  })
})
```

Run tests:
```bash
npm test
```

## 🐛 Common Issues & Solutions

### Issue: License Not Generated

**Symptoms:**
- Email not received
- No license in database
- Webhook not triggered

**Debug Steps:**
1. Check webhook endpoint is accessible
2. Verify Paddle product ID matches database
3. Check `product_type` is `one_time`
4. Review server logs
5. Test webhook URL with curl

**Solution:**
```bash
# Check webhook logs
# Look for: "Paddle webhook received"

# Manual trigger:
curl -X POST http://localhost:3000/api/webhooks/paddle \
  -H "Content-Type: application/json" \
  -d @test-webhook.json
```

### Issue: Email Not Sent

**Symptoms:**
- License generated but email not received
- SMTP errors in logs

**Debug Steps:**
1. Verify SMTP credentials
2. Check spam folder
3. Test with simple test email
4. Review email service logs

**Solution:**
```typescript
// Test SMTP directly
import { sendTestEmail } from '@/lib/email'
await sendTestEmail('your-email@example.com')
```

### Issue: Paddle Checkout Not Opening

**Symptoms:**
- Button click does nothing
- Console errors

**Debug Steps:**
1. Check Paddle.js script loaded
2. Verify vendor ID correct
3. Check environment setting
4. Review browser console

**Solution:**
```html
<!-- Verify script loaded -->
<script src="https://cdn.paddle.com/paddle/paddle.js"></script>

<!-- Check in console -->
console.log(window.Paddle)
```

## 📊 Performance Testing

### Load Testing

Test with Apache Bench:
```bash
# Test homepage
ab -n 1000 -c 10 http://localhost:3000/

# Test products API
ab -n 500 -c 5 http://localhost:3000/products
```

**Acceptable Results:**
- Response time < 500ms
- No errors
- Consistent performance

### Database Performance

```sql
-- Check slow queries
EXPLAIN ANALYZE 
SELECT * FROM products WHERE is_active = true;

-- Verify indexes used
SELECT * FROM pg_indexes WHERE tablename = 'products';
```

## ✅ Pre-Production Checklist

Before going live:
- [ ] All manual tests pass
- [ ] Webhook tested with real Paddle sandbox
- [ ] Email delivery confirmed
- [ ] License activation works
- [ ] Database performance acceptable
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links functional
- [ ] Analytics integrated (if required)
- [ ] Error tracking set up (Sentry, etc.)

## 📝 Test Report Template

```markdown
## Test Report - [Date]

### Environment
- Branch: main
- Paddle: sandbox
- Supabase: development

### Test Results

#### Purchase Flow
- ✅ One-time purchase successful
- ✅ License generated
- ✅ Email delivered
- ✅ Activation works

#### Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Status: Fixed/In Progress

### Recommendations
- [Any improvements needed]
```

## 🎯 Continuous Testing

### Daily
- [ ] Check webhook logs
- [ ] Monitor email delivery rate
- [ ] Review error logs

### Weekly  
- [ ] Test purchase flow
- [ ] Verify license activation
- [ ] Check database performance

### Monthly
- [ ] Full regression test
- [ ] Performance audit
- [ ] Security review

---

**Remember:** Test thoroughly before production! A working license system is critical for user trust.
