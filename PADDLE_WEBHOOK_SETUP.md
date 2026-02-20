# 🔔 Paddle Webhook Destination Setup Guide

## 📍 Where to Configure

**Paddle Dashboard**: https://vendors.paddle.com/  
**Navigate to**: Developer tools > Notifications

---

## ✅ Required Webhook Configuration

### Step 1: Create Notification Destination

1. **Click**: "Create notification destination"
2. **Destination Type**: Webhook URL
3. **URL**: `https://appsto.software/api/webhooks/paddle`
4. **Description**: `Production webhook endpoint`
5. **Status**: ✅ Active

---

### Step 2: Subscribe to Events

**You MUST enable these event types in your webhook destination:**

#### 🔴 **CRITICAL (Required for basic functionality):**

- ✅ **`transaction.completed`**
  - **Why**: Main purchase event - creates license keys, sends email
  - **Frequency**: Every successful payment
  - **If disabled**: Customers won't receive licenses!

- ✅ **`transaction.updated`**
  - **Why**: Payment status changes, currency updates
  - **Frequency**: When transaction details change
  - **If disabled**: You might miss payment confirmations

#### 🟡 **IMPORTANT (Required for refunds & failures):**

- ✅ **`transaction.refunded`**
  - **Why**: Deactivates licenses when refund processed
  - **Frequency**: When you click "Refund" in dashboard
  - **If disabled**: Licenses won't be deactivated on refund!

- ✅ **`transaction.payment_failed`**
  - **Why**: Track failed payments for analytics
  - **Frequency**: When payment fails
  - **If disabled**: No notification of payment failures

#### 🟢 **OPTIONAL (Useful for future features):**

- ⚪ **`subscription.created`**
  - **Why**: Future subscription products
  - **Frequency**: When subscription starts
  - **Current**: Handler exists but not used (one-time purchases only)

- ⚪ **`subscription.updated`**
  - **Why**: Plan changes, upgrades/downgrades
  - **Frequency**: When subscription modified
  - **Current**: Not implemented yet

- ⚪ **`subscription.canceled`**
  - **Why**: Handle subscription cancellations
  - **Frequency**: When subscription ends
  - **Current**: Not implemented yet

- ⚪ **`customer.created`**
  - **Why**: Track new customers
  - **Frequency**: First purchase by customer
  - **Current**: Not needed (we track via transactions)

- ⚪ **`customer.updated`**
  - **Why**: Customer details changed
  - **Frequency**: Email or address updates
  - **Current**: Not needed

---

## 🎯 **Recommended Configuration for DeskSweep**

### **Minimum Required (For One-Time Purchases):**

```
✅ transaction.completed
✅ transaction.updated  
✅ transaction.refunded
✅ transaction.payment_failed
```

### **Future-Proof (If adding subscriptions later):**

```
✅ transaction.completed
✅ transaction.updated
✅ transaction.refunded
✅ transaction.payment_failed
✅ subscription.created
✅ subscription.updated
✅ subscription.canceled
```

---

## 🔧 **How to Enable Events**

### In Paddle Dashboard:

1. **Go to**: Developer tools > Notifications
2. **Find**: Your webhook destination (https://appsto.software/api/webhooks/paddle)
3. **Click**: Edit (pencil icon)
4. **Section**: "Event types"
5. **Check/Select**:
   - ✅ transaction.completed
   - ✅ transaction.updated
   - ✅ transaction.refunded
   - ✅ transaction.payment_failed
6. **Optional**: Add subscription events if planning subscriptions
7. **Click**: "Save" or "Update destination"

---

## 🧪 **Testing Webhook Events**

### Test Each Event Type:

#### 1. Test `transaction.completed`
```bash
Action: Make a test purchase ($2 with TEST78 code)
Expected: 
- ✅ Purchase created in database
- ✅ License key generated
- ✅ Email sent to customer
- ✅ Discord notification sent
Check logs: Console should show "transaction.completed"
```

#### 2. Test `transaction.updated`
```bash
Action: Purchase completes asynchronously
Expected: 
- ✅ Webhook fires when payment confirms
- ✅ Status updates to "completed"
Check logs: Console should show "transaction.updated"
```

#### 3. Test `transaction.refunded`
```bash
Action: Process refund in Paddle dashboard
Expected:
- ✅ Purchase status = "refunded"
- ✅ License deactivated (is_active = false)
- ✅ Revoked in product database
Check logs: Console should show "transaction.refunded"
```

#### 4. Test `transaction.payment_failed`
```bash
Action: Use declined test card (4000 0000 0000 0002)
Expected:
- ✅ Payment fails
- ✅ Webhook logs the failure
- ⚠️ No purchase created (correct behavior)
Check logs: Console should show "transaction.payment_failed"
```

---

## 🔒 **Security Settings**

### Also Configure in Webhook Destination:

#### 1. **Webhook Signature Verification**
```
✅ Enabled (always)
Key: ntfset_01khbfq0c6hp8s2ty8m1wtv11b
```
**Your code already verifies signatures** in route.ts ✅

#### 2. **IP Allowlisting** (Optional but recommended)
```
Production IPs:
- 34.194.127.46
- 54.234.237.108

Add to: Digital Ocean firewall rules
Effect: Only Paddle can send webhooks
```

#### 3. **Rate Limiting** (Optional)
```
Your webhook should handle:
- 10-100 events/second during sales
- Idempotent processing (same event twice = no duplicate)
- Retry logic for failed deliveries
```

---

## 🔍 **Webhook Destination Settings Checklist**

**Before going live, verify:**

- [ ] Destination URL: `https://appsto.software/api/webhooks/paddle`
- [ ] Status: ✅ Active (not paused)
- [ ] Events subscribed:
  - [ ] ✅ transaction.completed
  - [ ] ✅ transaction.updated
  - [ ] ✅ transaction.refunded
  - [ ] ✅ transaction.payment_failed
- [ ] Signature verification: ✅ Enabled
- [ ] Secret key: Matches `PADDLE_WEBHOOK_SECRET` in .env
- [ ] Test event sent: ✅ Success (200 OK)
- [ ] Recent deliveries: No failures in logs

---

## 🚨 **Common Issues**

### Issue 1: "Webhook not firing"
**Check:**
- [ ] Destination URL correct (https, not http)
- [ ] Status is "Active" (not paused)
- [ ] Events are checked/subscribed
- [ ] SSL certificate valid on domain
- [ ] No firewall blocking Paddle IPs

**Solution:**
1. Send test event from Paddle dashboard
2. Check webhook logs in Paddle
3. Check server logs for incoming requests
4. Verify signature verification isn't blocking

### Issue 2: "Signature verification failed"
**Check:**
- [ ] `PADDLE_WEBHOOK_SECRET` matches dashboard
- [ ] Secret not wrapped in quotes incorrectly
- [ ] Using correct environment (production vs sandbox)

**Solution:**
1. Go to Paddle > Notifications > Your destination
2. Copy webhook signing secret
3. Update `.env`: `PADDLE_WEBHOOK_SECRET=ntfset_...`
4. Restart application
5. Send test event

### Issue 3: "Events not processing"
**Check:**
- [ ] Webhook returns 200 OK (not 500 error)
- [ ] Database connection working
- [ ] No TypeScript errors in logs
- [ ] Event type is handled in route.ts

**Solution:**
1. Check Digital Ocean logs
2. Check browser console (if testing locally)
3. Enable debug logging in webhook handler
4. Test with curl/Postman first

---

## 📊 **Monitoring Webhooks**

### In Paddle Dashboard:

**View webhook delivery status:**
1. **Go to**: Developer tools > Notifications
2. **Click**: Your destination
3. **Tab**: "Recent deliveries"
4. **See**:
   - ✅ Success (200 OK)
   - ❌ Failed (4xx, 5xx errors)
   - ⏳ Pending retry

**Set up alerts:**
1. **Go to**: Settings > Notifications
2. **Enable**: Email alerts for webhook failures
3. **Receive**: Notification when deliveries fail
4. **Fix**: Check logs and resolve issue

### In Your Application:

**Monitor webhook performance:**
```typescript
// Add to webhook handler
console.log('⏱️ Webhook processing time:', Date.now() - startTime, 'ms');
console.log('📊 Event type:', event.event_type);
console.log('✅ Status:', 'success');
```

**Track webhook metrics:**
- Total events received (by type)
- Processing time (should be < 5 seconds)
- Success rate (should be > 99%)
- Retry attempts (Paddle retries failed webhooks)

---

## 🔄 **Webhook Retry Logic**

### Paddle's Automatic Retries:

**If your webhook returns error (5xx):**
- Retry 1: After 5 minutes
- Retry 2: After 15 minutes  
- Retry 3: After 1 hour
- Retry 4: After 6 hours
- Retry 5: After 24 hours

**Total**: Up to 5 retry attempts over 31 hours

**Your responsibility:**
- Return 200 OK quickly (< 30 seconds)
- Process in background if needed
- Handle duplicate events (idempotency)
- Log all webhook events for debugging

---

## ✅ **Final Verification**

**Before launching:**

1. **Test all events:**
   ```bash
   ✅ Make test purchase → transaction.completed fires
   ✅ Process refund → transaction.refunded fires
   ✅ Check Paddle logs → All show "Success"
   ✅ Check database → Data correct
   ✅ Check email → Received correctly
   ```

2. **Verify settings:**
   ```bash
   ✅ URL: https://appsto.software/api/webhooks/paddle
   ✅ Status: Active
   ✅ Events: 4 minimum subscribed
   ✅ Secret: Matches environment variable
   ✅ Recent deliveries: All successful
   ```

3. **Monitor first few sales:**
   ```bash
   ✅ Watch Paddle "Recent deliveries" tab
   ✅ Check Digital Ocean logs in real-time
   ✅ Verify license emails arrive
   ✅ Test license activation works
   ```

---

## 📝 **Quick Reference**

### Current Webhook Implementation Status:

| Event Type | Subscribed? | Implemented? | Tested? |
|------------|-------------|--------------|---------|
| `transaction.completed` | ✅ Required | ✅ Yes | ⏳ TODO |
| `transaction.updated` | ✅ Required | ✅ Yes | ⏳ TODO |
| `transaction.refunded` | ✅ Required | ✅ Yes | ⏳ TODO |
| `transaction.payment_failed` | ✅ Required | ✅ Yes | ⏳ TODO |
| `subscription.created` | ⚪ Optional | ⚪ Placeholder | ❌ N/A |
| `subscription.updated` | ⚪ Optional | ❌ No | ❌ N/A |
| `subscription.canceled` | ⚪ Optional | ❌ No | ❌ N/A |

### Action Required:

1. ✅ **Subscribe** to 4 required events in Paddle dashboard
2. ⏳ **Test** each event with real transactions
3. ✅ **Monitor** webhook deliveries for first 24 hours
4. ✅ **Set up** email alerts for webhook failures

---

**Need help?** Check Paddle docs: https://developer.paddle.com/webhooks/overview

**Last updated**: February 20, 2026
