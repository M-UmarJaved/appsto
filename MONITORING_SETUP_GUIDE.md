# 🎯 Monitoring Setup Guide - Cost-Free Tools

## ✅ What's Been Configured

All the code is ready! Now you just need to get the free account credentials and add them to your `.env` file.

---

## 📊 **Step 1: Google Analytics 4** (5 minutes)

### Get Your Measurement ID (FREE Forever)

1. **Go to**: https://analytics.google.com/
2. **Sign in** with your Google account
3. **Click "Start measuring"**
4. **Account setup**:
   - Account name: `Appsto`
   - Check all data sharing options (recommended)
   - Click "Next"

5. **Property setup**:
   - Property name: `Appsto Website`
   - Time zone: Your country/timezone
   - Currency: USD (or your preferred currency)
   - Click "Next"

6. **Business information**:
   - Industry: `Software & Technology`
   - Business size: `Small - 1 to 100 employees`
   - How you intend to use: Check `Examine user behavior`
   - Click "Create"

7. **Accept Terms of Service**

8. **Choose platform**: Select **"Web"**

9. **Set up data stream**:
   - Website URL: `https://appsto.software`
   - Stream name: `Appsto Main Site`
   - Click "Create stream"

10. **Copy Your Measurement ID**:
    - You'll see: `G-XXXXXXXXXX` (10 characters after G-)
    - This is your Measurement ID!

### Add to Environment Variables

Open your `.env` file and add:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Test It Works

1. Restart your dev server: `npm run dev`
2. Open browser Dev Tools (F12)
3. Go to Network tab
4. Visit http://localhost:3000
5. Filter by "gtag" - you should see requests to Google Analytics
6. Check the Console - no errors about GA

✅ **Done! Analytics will start tracking visitors immediately.**

---

## 🚨 **Step 2: Sentry Error Monitoring** (10 minutes)

### Create Free Sentry Account (5K errors/month)

1. **Go to**: https://sentry.io/signup/
2. **Sign up** with:
   - Your email (use your support@appsto.software or personal email)
   - Or continue with GitHub/Google

3. **Create your first project**:
   - Platform: Select **"Next.js"**
   - Project name: `appsto-website`
   - Alert frequency: `On every new issue` (recommended)
   - Click "Create Project"

4. **Skip the setup wizard** (we already configured everything!)
   - Click "Take me to my project" or close the modal

5. **Get your DSN (Data Source Name)**:
   - In your project, go to **"Settings"** (gear icon in left sidebar)
   - Click **"Client Keys (DSN)"**
   - Copy the **DSN** - looks like:
     ```
     https://abc123def456@o123456.ingest.sentry.io/7891011
     ```

6. **Optional: Get Auth Token** (for source map uploads):
   - Go to **Settings** → **Auth Tokens**
   - Click **"Create New Token"**
   - Name: `Appsto Upload Token`
   - Scopes: Check `project:releases` and `project:write`
   - Click "Create Token"
   - Copy the token (starts with `sntrys_`)

### Add to Environment Variables

Open your `.env` file and add:

```bash
# Sentry Error Monitoring (FREE tier: 5K errors/month)
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN_HERE
SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN_HERE
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=appsto-website
```

### Test Sentry Works

1. Restart your dev server: `npm run dev`
2. Add to any page temporarily (like homepage):

```tsx
// Test Sentry - REMOVE AFTER TESTING
<button onClick={() => { throw new Error("Sentry test error!"); }}>
  Test Sentry
</button>
```

3. Click the button - you should see the error in Sentry dashboard within seconds!
4. Check your Sentry project: https://sentry.io/ → Your Project → Issues
5. **Remove the test button after confirming it works**

✅ **Done! You'll now be notified of any errors in production.**

---

## ⏰ **Step 3: UptimeRobot** (5 minutes)

### Create Free Monitoring (50 monitors, 5-min checks)

1. **Go to**: https://uptimerobot.com/
2. **Click "Register for FREE"**
   - Email: your email
   - Password: create strong password
   - Verify your email

3. **Add Monitor #1 - Main Website**:
   - Click **"+ Add New Monitor"**
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Appsto Main Website`
   - URL: `https://appsto.software`
   - Monitoring Interval: `Every 5 minutes` (free tier)
   - Click **"Create Monitor"**

4. **Add Monitor #2 - Webhook Endpoint**:
   - Click **"+ Add New Monitor"**
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Appsto Paddle Webhook`
   - URL: `https://appsto.software/api/webhooks/paddle`
   - Monitoring Interval: `Every 5 minutes`
   - Click **"Create Monitor"**

5. **Set Up Alerts**:
   - Go to **"My Settings"** (top right menu)
   - Click **"Alert Contacts"**
   - Add Email: Your email
   - You'll receive alerts when the site goes down!

### Optional: Status Page (Public uptime display)

1. **Click "Add Status Page"** (in left menu)
2. **Create free status page**:
   - Name: `Appsto Status`
   - Select monitors to display
   - Get custom URL: `appsto.statuspage.io` (or similar)
3. **Add link to your footer** (optional for transparency)

✅ **Done! You'll be alerted within 5 minutes if your site goes down.**

---

## 🎯 **Step 4: Quick Verification**

### Checklist After Setup:

- [ ] Google Analytics Measurement ID added to `.env`
- [ ] Sentry DSN added to `.env`
- [ ] UptimeRobot monitoring 2 URLs
- [ ] Restarted dev server (`npm run dev`)
- [ ] Visited localhost and checked browser console (no errors)
- [ ] Tested Sentry error capture
- [ ] Email alerts configured for UptimeRobot

### Expected Results:

**Google Analytics**:
- Visit http://localhost:3000
- Open GA Real-time report: https://analytics.google.com/
- Click "Realtime" in left menu
- Should see 1 active user (you!)

**Sentry**:
- Trigger test error
- Check Sentry dashboard
- Should see error appear within seconds
- Email notification arrives

**UptimeRobot**:
- Both monitors show "Up" status
- Green checkmarks
- Can see uptime percentage (should be 100%)

---

## 🚀 **Production Deployment**

### Add Environment Variables to Digital Ocean

When deploying to production, add these to your **App Platform** environment variables:

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN_HERE
SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN_HERE
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=appsto-website
```

### Update UptimeRobot URLs

After deployment, update your monitors to use production URLs instead of localhost.

---

## 📧 **Email Notifications Setup**

### Configure Sentry Alerts:

1. Go to **Sentry Project** → **Settings** → **Alerts**
2. **Create new alert rule**:
   - Name: `Critical Errors`
   - When: `An issue is first seen`
   - Then: `Send a notification via email`
   - To: Your email

3. **Create another rule**:
   - Name: `Error Spike`
   - When: `The issue count increases by more than 100%`
   - In: `1 hour`
   - Then: `Send a notification`

### Configure UptimeRobot Alerts:

Already done! You get emails when:
- Monitor goes down (site unreachable)
- Monitor comes back up
- Weekly/monthly reports (optional)

---

## 💡 **Tips & Best Practices**

### Google Analytics:
- Set up **Conversion Events** for purchases:
  - GA → Admin → Events → Create Event
  - Event name: `purchase`
  - Mark as conversion
- Create **Custom Reports** for:
  - Traffic sources
  - User demographics
  - Product page views

### Sentry:
- Set **Release Tracking** (auto-configured)
- Use **Source Maps** for better error debugging
- Create **Issues** for frequent errors
- Set up **Slack integration** (optional)

### UptimeRobot:
- Public Status Page builds trust
- Add monitors for:
  - API endpoints
  - Database connections
  - Payment webhooks
- Set SMS alerts for critical monitors (paid feature)

---

## 🎊 **You're All Set!**

### What You Now Have:

✅ **Analytics** - Track every visitor, page view, and conversion  
✅ **Error Monitoring** - Catch bugs before customers complain  
✅ **Uptime Monitoring** - Know immediately if site goes down  

### All for $0/month! 🚀

### Costs at Scale:

- **Google Analytics**: Free forever (unlimited traffic)
- **Sentry**: Free up to 5K errors/month
  - If you exceed: $26/month for 50K errors
  - You'd need ~500+ daily users to hit limit
- **UptimeRobot**: Free forever (5-min checks)
  - Upgrade to 1-min checks: $7/month (optional)

---

## 📞 **Need Help?**

### Common Issues:

**Google Analytics not tracking?**
- Check browser ad-blocker is disabled
- Verify Measurement ID is correct
- Wait 24 hours for data to appear in reports

**Sentry not capturing errors?**
- Check DSN is correct in `.env`
- Restart dev server after adding env vars
- Test with intentional error (throw new Error())

**UptimeRobot false positives?**
- Check if your site requires authentication
- Increase interval to reduce checks
- Whitelist UptimeRobot IPs (if using firewall)

---

**Setup Time**: ~20 minutes total  
**Cost**: $0/month  
**Value**: Priceless 🎯

Good luck! 🚀
