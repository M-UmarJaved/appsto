# ✅ PRODUCTION DEPLOYMENT CHECKLIST

**Project:** Appsto SaaS Marketplace  
**Date:** January 30, 2026  
**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT  

---

## 📦 PRE-DEPLOYMENT VERIFICATION

### ✅ Code Quality
- [x] TypeScript compilation: **PASSED**
- [x] Production build: **SUCCESSFUL**
- [x] No critical errors
- [x] All dependencies installed
- [x] Security headers configured
- [x] Input validation implemented
- [x] Rate limiting configured

### ✅ Git Repository
- [x] Git initialized
- [x] `.gitignore` configured
- [x] `.env` properly excluded
- [x] `node_modules/` excluded
- [x] Initial commit created (98 files, 29,650 lines)
- [x] Clean working directory

### ✅ Security
- [x] No hardcoded secrets
- [x] Environment variables templated (`.env.example`)
- [x] Webhook signature verification implemented
- [x] Modern encryption (AES-256-GCM)
- [x] Security headers (HSTS, CSP, X-Frame-Options)
- [x] Rate limiting on all APIs
- [x] Input validation with Zod

### ✅ Configuration Files
- [x] `package.json` - Production scripts configured
- [x] `next.config.js` - Security headers & optimization
- [x] `.gitignore` - Comprehensive exclusions
- [x] `.env.example` - All required variables documented
- [x] Node.js version specified (>=18.17.0)

### ✅ Project Structure
- [x] Unnecessary files removed (Awake template, duplicates)
- [x] Assets organized (`public/` directory)
- [x] Documentation preserved (deployment guides, audits)
- [x] Scripts available (`scripts/` directory)

---

## 🚀 DIGITALOCEAN APP PLATFORM DEPLOYMENT

### Step 1: Create GitHub Repository

```bash
# On GitHub.com:
# 1. Go to https://github.com/new
# 2. Repository name: appsto-software (or your choice)
# 3. Keep it PRIVATE (contains business logic)
# 4. DO NOT initialize with README (we already have one)
# 5. Click "Create repository"
```

### Step 2: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/appsto-software.git

# Push code
git push -u origin master

# Verify on GitHub web interface
```

### Step 3: DigitalOcean App Platform Setup

1. **Go to DigitalOcean Cloud:**
   - Navigate to: https://cloud.digitalocean.com/apps
   - Click: **"Create App"**

2. **Connect GitHub Repository:**
   - Source Provider: **GitHub**
   - Repository: Select your `appsto-software` repo
   - Branch: `master` (or `main`)
   - Auto-deploy: **✅ Enabled** (deploys on every push)

3. **Configure Build Settings:**
   - **Name:** `appsto-software`
   - **Region:** Choose closest to your users (e.g., New York, London)
   - **Plan:** Start with **Basic ($12/mo)** - covered by your $200 credits
   - **Build Command:** `npm run build` ✅ (auto-detected)
   - **Run Command:** `npm start` ✅ (auto-detected)
   - **HTTP Port:** `3000` ✅ (auto-detected)
   - **Environment:** `Node.js` ✅ (auto-detected)

4. **Add Environment Variables:**
   
   Click **"Environment Variables"** and add ALL these:

   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://appsto.software
   NEXT_PUBLIC_SITE_NAME=Appsto
   NEXT_PUBLIC_APP_URL=https://appsto.software

   # Supabase - Main Database (Appsto)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Supabase - Products Database (My Softwares)
   PRODUCT_DB_SUPABASE_URL=your_product_db_url
   PRODUCT_DB_SUPABASE_KEY=your_product_db_key

   # Paddle Payment Gateway
   NEXT_PUBLIC_PADDLE_VENDOR_ID=your_paddle_vendor_id
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox  # Change to 'production' when ready
   PADDLE_API_KEY=your_paddle_api_key
   PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   EMAIL_FROM=noreply@appsto.software

   # License Encryption (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   LICENSE_SECRET_KEY=your_32_byte_hex_key

   # API Keys
   API_SECRET_KEY=your_internal_api_secret_key

   # Security (Keep these false in production)
   # SKIP_WEBHOOK_VERIFICATION=false
   # ALLOW_TEST_PURCHASES=false
   ```

5. **Resource Settings:**
   - **Container Size:** Basic ($12/mo = 512 MB RAM, 1 vCPU)
   - **Instances:** 1 (auto-scales if needed)
   - **HTTP Routes:** Enabled ✅
   - **Health Check:** `/` (checks if app is running)

6. **Click "Create Resources"**
   - Deployment starts automatically
   - Takes ~5 minutes for first deployment
   - You'll get a temporary URL: `https://appsto-software-xxxxx.ondigitalocean.app`

---

## 🌐 CUSTOM DOMAIN SETUP (appsto.software)

### Step 1: Add Domain in DigitalOcean

1. In App Platform dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `appsto.software`
4. Also add: `www.appsto.software` (redirect to root)
5. DigitalOcean shows you DNS records to add

### Step 2: Configure DNS

**Option A: Use DigitalOcean Nameservers (Recommended)**

Go to your domain registrar and set nameservers to:
```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

**Option B: Add CNAME Records**

At your domain registrar, add:
```
Type: CNAME
Name: @
Value: appsto-software-xxxxx.ondigitalocean.app
TTL: 3600

Type: CNAME
Name: www
Value: appsto-software-xxxxx.ondigitalocean.app
TTL: 3600
```

### Step 3: Wait for SSL Certificate

- DigitalOcean auto-generates free SSL via Let's Encrypt
- Takes 5-15 minutes
- Status shows as **"Active"** when ready
- Your site is now live at: `https://appsto.software` 🎉

### Step 4: Update Environment Variable

Once custom domain is active:
1. Go to App Settings → Environment Variables
2. Update: `NEXT_PUBLIC_APP_URL=https://appsto.software`
3. Update: `NEXT_PUBLIC_SITE_URL=https://appsto.software`
4. Click **"Save"** → App automatically redeploys

---

## 🔧 POST-DEPLOYMENT VERIFICATION

### Test Checklist:

```bash
# 1. Check site is live
curl -I https://appsto.software

# Expected: HTTP/2 200 OK

# 2. Verify security headers
curl -I https://appsto.software | grep -E "(Strict-Transport|X-Frame|X-Content)"

# Expected: 
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff

# 3. Test API health
curl https://appsto.software/api/test/purchase

# Expected: JSON response about test purchases being enabled/disabled

# 4. Verify rate limiting works
for i in {1..15}; do curl -X POST https://appsto.software/api/test/purchase; done

# Expected: 429 (Too Many Requests) after 10 requests
```

### Manual Tests:

- [ ] Visit homepage: https://appsto.software
- [ ] Sign up with test account
- [ ] Sign in successfully
- [ ] Visit products page
- [ ] Test currency switcher (USD/INR/PKR)
- [ ] Access dashboard (protected route)
- [ ] Check test purchase page: https://appsto.software/test-purchase.html
- [ ] Create test purchase with TEST100 coupon
- [ ] Verify email received (check spam folder)
- [ ] Click download link in email
- [ ] Verify auto-download starts

---

## 🎯 PADDLE WEBHOOK CONFIGURATION

### Step 1: Get Webhook URL

Your webhook URL is:
```
https://appsto.software/api/webhooks/paddle
```

### Step 2: Configure in Paddle Dashboard

1. Go to: https://vendors.paddle.com/webhooks
2. Click **"Add Webhook"**
3. URL: `https://appsto.software/api/webhooks/paddle`
4. Select events:
   - ✅ `transaction.completed`
   - ✅ `transaction.updated`
   - ✅ `subscription.created` (if using subscriptions)
5. Copy the **Webhook Secret**
6. Add to DigitalOcean environment variables:
   ```
   PADDLE_WEBHOOK_SECRET=your_actual_webhook_secret
   ```
7. Save → App redeploys automatically

### Step 3: Test Webhook

1. In Paddle dashboard, send test webhook
2. Check DigitalOcean logs (Runtime Logs)
3. Should see: `Paddle webhook received: transaction.completed`
4. If error, check webhook secret matches

---

## 📊 MONITORING & MAINTENANCE

### DigitalOcean App Platform Features:

**Runtime Logs:**
- Real-time application logs
- Search and filter capabilities
- Export logs for analysis

**Metrics:**
- CPU usage
- Memory usage
- Bandwidth
- Request count
- Response times

**Alerts:**
- Set up email alerts for:
  - High CPU usage (>80%)
  - High memory usage (>80%)
  - High error rate (>5%)
  - Deployment failures

### Recommended Monitoring:

1. **Sentry** (Error Tracking):
   ```bash
   npm install @sentry/nextjs
   ```
   - Configure in `next.config.js`
   - Track runtime errors
   - Get stack traces

2. **Uptime Monitoring**:
   - Use UptimeRobot (free tier)
   - Monitor: https://appsto.software
   - Alert via email if down

3. **Performance Monitoring**:
   - Use DigitalOcean built-in metrics
   - Monitor response times
   - Check for slow API routes

---

## 🔄 CONTINUOUS DEPLOYMENT

### Auto-Deploy is Enabled ✅

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin master
```

DigitalOcean automatically:
1. Detects the push
2. Runs `npm install`
3. Runs `npm run build`
4. Runs `npm start`
5. Performs health check
6. Routes traffic to new version
7. Takes ~3-5 minutes

### Rollback if Needed:

1. Go to App Platform dashboard
2. Click **"Deployments"** tab
3. Find previous successful deployment
4. Click **"Rollback"** button
5. Instant rollback to previous version

---

## 💰 COST BREAKDOWN

| Service | Plan | Monthly Cost | Credits Coverage |
|---------|------|--------------|------------------|
| **DigitalOcean App Platform** | Basic | $12/mo | 16 months free |
| **Supabase** | Free | $0 | Unlimited |
| **GitHub** | Free (Private) | $0 | Unlimited |
| **Domain** | appsto.software | ~$12/year | N/A |
| **SSL Certificate** | Let's Encrypt | $0 | Unlimited |
| **Bandwidth** | Unlimited | $0 | Included |

**Total First Year:** ~$12 (domain only) - Hosting free via credits! 🎉

---

## 📝 IMPORTANT NOTES

### Security Reminders:

- ✅ Never commit `.env` files
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Keep webhook secret secure
- ✅ Use strong database passwords
- ✅ Enable Supabase RLS policies
- ✅ Monitor failed authentication attempts

### Performance Tips:

- Start with Basic plan ($12/mo)
- Monitor metrics for 2-4 weeks
- Upgrade to Professional ($24/mo) if needed:
  - CPU usage consistently >70%
  - Memory usage consistently >80%
  - Response times >500ms

### Scaling Path:

**0-1,000 users:** Basic plan ✅  
**1,000-10,000 users:** Professional plan  
**10,000+ users:** Multiple containers + CDN

---

## ✅ FINAL CHECKLIST

Before going live to customers:

- [ ] ✅ Code pushed to GitHub
- [ ] ✅ DigitalOcean app created
- [ ] ✅ All environment variables set
- [ ] ✅ Custom domain configured (appsto.software)
- [ ] ✅ SSL certificate active (HTTPS)
- [ ] ✅ Paddle webhook configured
- [ ] ✅ Test purchase flow working
- [ ] ✅ Emails being sent
- [ ] ✅ Downloads working from GitHub Releases
- [ ] ✅ Rate limiting tested
- [ ] ✅ Security headers verified
- [ ] Switch Paddle to production mode
- [ ] Update `PADDLE_ENVIRONMENT=production`
- [ ] Disable test purchase API in production
- [ ] Set up Sentry error tracking
- [ ] Configure uptime monitoring
- [ ] Enable Supabase database backups
- [ ] Test payment flow with real card (small amount)
- [ ] Verify license generation & sync
- [ ] Announce launch! 🚀

---

## 🆘 TROUBLESHOOTING

### Build Fails:

```bash
# Check logs in DigitalOcean
# Common issues:
# 1. Missing environment variable
# 2. TypeScript error
# 3. Dependency version conflict

# Fix and push:
git add .
git commit -m "Fix build issue"
git push origin master
```

### App Won't Start:

```bash
# Check Runtime Logs
# Common issues:
# 1. Missing NEXT_PUBLIC_* variables
# 2. Database connection failure
# 3. Port binding issue (should be 3000)
```

### Emails Not Sending:

```bash
# Check Gmail App Password:
# 1. Must be 16 characters (no spaces)
# 2. 2-Step Verification enabled
# 3. App Password generated from Google Account settings

# Regenerate if needed:
# https://myaccount.google.com/apppasswords
```

### Webhook Failures:

```bash
# Verify webhook secret matches Paddle
# Check Runtime Logs for signature verification errors
# Test webhook from Paddle dashboard
```

---

## 📞 SUPPORT RESOURCES

- **DigitalOcean Docs:** https://docs.digitalocean.com/products/app-platform/
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Paddle Integration:** https://developer.paddle.com/
- **Supabase Docs:** https://supabase.com/docs

---

**🎉 CONGRATULATIONS! Your production-ready SaaS application is ready to deploy!**

**Next Action:** Create GitHub repository and push code (Step 2 above)
